// Followers/actors document-id encoding (paul-kinlan-me-001q).
//
// je6t moved the interaction records (likes/announces/replies) to the injective
// encodeURIComponent doc-id encoding and left the followers/actors collections
// on the non-injective slash->underscore one, because their migration semantics
// differ: saveFollow dedupes by document id, so switching encodings without a
// dual-check would register an existing follower twice and sendNote would
// deliver every note to them twice. This suite pins the completed fix:
//   - saveFollow writes the injective id and treats a legacy row as already
//     following (no duplicate delivery);
//   - removeFollow deletes both ids, so an unfollow removes whichever copy exists;
//   - saveActor writes the injective id.
// The handler is bundled with esbuild and its Firestore/inbox/signing boundaries
// are stubbed through globalThis, the same way tests/handler-input-hardening.test.mjs
// drives it. No network, no DNS, no browser. Fast tier.
// Run with: node --test tests/activitypub-follow-docid.test.mjs
import { strict as assert } from 'node:assert';
import { createHash, generateKeyPairSync } from 'node:crypto';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { test } from 'node:test';

import { build } from 'esbuild';

import { Sha256Signer } from '../lib/http-signature/index.js';

const FIRESTORE_STUB = `
export default {
  apps: [true],
  firestore: () => ({
    collection: (name) => ({
      doc: (id) => {
        const base = name + '/' + id;
        return {
          id: base,
          get: async () => {
            globalThis.__followDoc.reads.push(base);
            return globalThis.__followDoc.existing.has(base)
              ? { exists: true, data: () => globalThis.__followDoc.existing.get(base) }
              : { exists: false, data: () => ({}) };
          },
          set: async (value) => { globalThis.__followDoc.writes.push(base); },
          delete: async () => {
            globalThis.__followDoc.deletes.push(base);
            return { path: base };
          },
          collection: () => ({
            get: async () => ({ size: 0, docs: [] }),
            doc: (subId) => ({
              get: async () => ({ exists: false, data: () => ({}) }),
              set: async () => {},
              delete: async () => ({ path: base + '/messages/' + subId })
            })
          })
        };
      }
    })
  })
};
`;

const STUBS = {
  '@vercel/node': 'export {};',
  // The Follow is accepted only after validateFollowerInbox() passes; the real
  // one resolves DNS, so it is stubbed here and the case under test is the
  // document id, not inbox safety (that is tests/activitypub-ssrf.test.mjs).
  'guardedFetch.js': 'export const validateFollowerInbox = async (value) => ({ ok: true, url: new URL(value) });'
    + 'export function isPublicIpAddress() { return true; }'
    + 'export function isSafeFederationUrl() { return true; }'
    + 'export class BlockedRequestError extends Error {}',
  // The Accept delivery is a network call; record it instead of making it.
  'sendSignedRequest.js': 'export async function sendSignedRequest(inbox, activity) {'
    + ' globalThis.__followDoc.sent.push(String(inbox));'
    + ' return { status: 202, statusText: "Accepted", text: async () => "" }; }',
  'firebase-admin': FIRESTORE_STUB,
  uuid: 'export const v4 = () => "test-uuid";',
  fetchActorInformation: 'export const fetchActorInformation = async () => globalThis.__followDoc.actor;'
};

const buildHandler = async () => {
  const dir = mkdtempSync(join(tmpdir(), 'follow-docid-'));
  const built = await build({
    entryPoints: [new URL('../api/activitypub/inbox.ts', import.meta.url).pathname],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
    logLevel: 'silent',
    plugins: [{
      name: 'follow-docid-stubs',
      setup(plugin) {
        plugin.onResolve({ filter: /.*/ }, (args) => {
          const key = STUBS[args.path] !== undefined ? args.path
            : /guardedFetch\.js$/.test(args.path) ? 'guardedFetch.js'
              : /sendSignedRequest\.js$/.test(args.path) ? 'sendSignedRequest.js'
                : /fetchActorInformation\.js$/.test(args.path) ? 'fetchActorInformation' : null;
          return key ? { path: key, namespace: 'stub' } : undefined;
        });
        plugin.onLoad({ filter: /.*/, namespace: 'stub' },
          ({ path }) => ({ loader: 'js', contents: STUBS[path] }));
      }
    }]
  });
  const file = join(dir, 'handler.mjs');
  writeFileSync(file, built.outputFiles[0].contents);
  const { default: handler } = await import(`file://${file}`);
  return { handler, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
};

const actorId = 'https://remote.example/users/alex';
const keyId = `${actorId}#main-key`;
const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' }
});
const actor = {
  id: actorId,
  inbox: 'https://remote.example/users/alex/inbox',
  publicKey: { id: keyId, owner: actorId, publicKeyPem: publicKey }
};

const useDoc = (existing = new Map()) => {
  globalThis.__followDoc = { reads: [], writes: [], deletes: [], sent: [], existing, actor };
  return globalThis.__followDoc;
};

const signedRequest = (activity) => {
  const raw = Buffer.from(JSON.stringify(activity));
  const headers = {
    host: 'paul.kinlan.me',
    date: new Date().toUTCString(),
    digest: `SHA-256=${createHash('sha256').update(raw).digest('base64')}`
  };
  headers.signature = new Sha256Signer({ publicKeyId: keyId, privateKey,
    headerNames: ['(request-target)', 'host', 'date', 'digest'] })
    .sign({ url: 'https://paul.kinlan.me/inbox', method: 'POST', headers });
  return { raw, headers };
};

const deliver = async (handler, activity) => {
  const { raw, headers } = signedRequest(activity);
  const req = Object.assign(Readable.from([raw]), { headers, method: 'POST', url: '/inbox' });
  const res = {
    statusCode: 0,
    ends: 0,
    setHeader() {},
    status(code) { this.statusCode = code; return { end: (body) => this.end(body) }; },
    end(body) { this.ends += 1; this.body = body; return this; }
  };
  await handler(req, res);
  return res;
};

const follow = () => ({
  '@context': 'https://www.w3.org/ns/activitystreams',
  type: 'Follow', actor: actorId, id: 'https://remote.example/follows/1', object: 'https://paul.kinlan.me/paul'
});

test('a Follow registers the follower and the actor under the injective doc-id encoding', async () => {
  const doc = useDoc();
  const { handler, cleanup } = await buildHandler();
  try {
    const res = await deliver(handler, follow());
    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'ok');
    assert.deepEqual(doc.writes.sort(), [
      `actors/${encodeURIComponent(actorId)}`,
      `followers/${encodeURIComponent(actorId)}`
    ], `writes were ${JSON.stringify(doc.writes)}`);
    assert.deepEqual(doc.sent, [actor.inbox], 'the Accept is still delivered to the follower inbox');
  } finally {
    cleanup();
    delete globalThis.__followDoc;
  }
});

test('a follower already registered under the legacy encoding is not registered twice', async () => {
  const legacyId = actorId.replace(/\//g, '_');
  const doc = useDoc(new Map([[`followers/${legacyId}`, { id: 'follows/pre-fix' }]]));
  const { handler, cleanup } = await buildHandler();
  try {
    const res = await deliver(handler, follow());
    assert.equal(res.statusCode, 200);
    assert.deepEqual(doc.writes.filter((path) => path.startsWith('followers/')), [],
      `a second follower row would double every delivery (wrote ${JSON.stringify(doc.writes)})`);
    assert.deepEqual(doc.sent, [], 'and no second Accept is sent');
    assert.ok(doc.reads.includes(`followers/${encodeURIComponent(actorId)}`), 'the injective id is checked first');
    assert.ok(doc.reads.includes(`followers/${legacyId}`), 'the legacy id is checked before declaring a new follow');
  } finally {
    cleanup();
    delete globalThis.__followDoc;
  }
});

test('an Undo of a Follow removes the follower under both encodings', async () => {
  const doc = useDoc();
  const { handler, cleanup } = await buildHandler();
  try {
    const res = await deliver(handler, {
      '@context': 'https://www.w3.org/ns/activitystreams',
      type: 'Undo', actor: actorId, id: 'https://remote.example/undos/follow',
      object: follow()
    });
    assert.equal(res.statusCode, 200);
    assert.deepEqual(doc.deletes.sort(), [
      `followers/${actorId.replace(/\//g, '_')}`,
      `followers/${encodeURIComponent(actorId)}`
    ].sort(), `an unfollow must not leave the legacy copy behind (deleted ${JSON.stringify(doc.deletes)})`);
  } finally {
    cleanup();
    delete globalThis.__followDoc;
  }
});
