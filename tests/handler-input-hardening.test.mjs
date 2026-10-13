// Regression tests for request-input hardening in the two federation handlers
// whose entry points are TypeScript and initialise firebase-admin at import time:
// api/activitypub-html/render.ts and api/activitypub/inbox.ts.
//
// A handler that throws is a 500 with an empty body, which is why every case
// here drives the real handler and asserts the status the caller gets: 4xx for a
// request that can never be served, never a 500.
//
// Both entry points are bundled with esbuild and their admin/Firestore client is
// stubbed through globalThis, the same way tests/activitypub-inbox-signature.test.mjs
// and tests/activitypub-ssrf.test.mjs drive them. Nothing here touches the network.
// Run with: node --test tests/handler-input-hardening.test.mjs
import { strict as assert } from 'node:assert';
import { createHash, generateKeyPairSync } from 'node:crypto';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { test } from 'node:test';

import { build } from 'esbuild';

import { Sha256Signer, default as parser } from '../lib/http-signature/index.js';
import { verifyInboxActivity } from '../lib/activitypub/utils/verifyInboxActivity.ts';

// The Firestore client the handlers see. Every value it returns is read from
// globalThis at call time, so one bundle can serve tests with different data.
const FIRESTORE_STUB = `
export default {
  apps: [true],
  firestore: () => ({
    collection: (name) => ({
      doc: (id) => {
        const base = name + '/' + id;
        return {
          id: base,
          get: async () => globalThis.__handlerInput.snapshot(),
          set: async (value) => { globalThis.__handlerInput.writes.push({ path: base, value }); },
          collection: () => ({
            get: async () => globalThis.__handlerInput.snapshot(),
            doc: (subId) => ({
              id: base + '/messages/' + subId,
              get: async () => ({ exists: false, data: () => ({}) }),
              set: async (value) => {
                globalThis.__handlerInput.writes.push({ path: base + '/messages/' + subId, value });
              }
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
  'firebase-admin': FIRESTORE_STUB,
  uuid: 'export const v4 = () => "test-uuid";',
  fetchActorInformation: 'export const fetchActorInformation = async () => globalThis.__handlerInput.actor;'
};

const buildHandler = async (entry) => {
  const dir = mkdtempSync(join(tmpdir(), 'handler-input-'));
  const built = await build({
    entryPoints: [new URL(entry, import.meta.url).pathname],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
    logLevel: 'silent',
    plugins: [{
      name: 'handler-input-stubs',
      setup(plugin) {
        plugin.onResolve({ filter: /.*/ }, (args) => {
          const key = args.path === '@vercel/node' ? '@vercel/node'
            : args.path === 'firebase-admin' ? 'firebase-admin'
              : args.path === 'uuid' ? 'uuid'
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

// A Vercel response stand-in that records every end(), including the ones the
// Vercel helper `res.status(code).end(body)` makes.
const mockResponse = () => ({
  statusCode: 0,
  headers: {},
  ends: 0,
  setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
  status(code) { this.statusCode = code; return { end: (body) => this.end(body) }; },
  end(body) { this.ends += 1; this.body = body; return this; }
});

const useHandlerInput = (overrides = {}) => {
  globalThis.__handlerInput = {
    writes: [],
    snapshot: () => ({ exists: false, size: 0, docs: [] }),
    actor: null,
    ...overrides
  };
  return globalThis.__handlerInput;
};

test('activitypub-html answers 4xx for a missing or unusable ?url=, and ends once for a non-GET', async () => {
  const input = useHandlerInput();
  const { handler, cleanup } = await buildHandler('../api/activitypub-html/render.ts');
  try {
    // `?url=` is required for this route, and the handler used to `.replace()` it
    // two lines before its own null check: every one of these was a 500.
    for (const query of [{}, { url: '' }, { url: '   ' }, { url: [] }, { url: {} }, { url: 42 }]) {
      const res = mockResponse();
      await handler({ query, method: 'GET' }, res);
      assert.equal(res.statusCode, 404, `?url=${JSON.stringify(query.url)}`);
      assert.equal(res.ends, 1, 'exactly one response');
    }

    // A non-GET used to send a 404 and then keep going into the Firestore reads
    // and a second res.end().
    const res = mockResponse();
    await handler({ query: { url: 'https://paul.kinlan.me/post/' }, method: 'POST' }, res);
    assert.equal(res.statusCode, 404);
    assert.equal(res.ends, 1, 'a non-GET request must not end the response twice');

    // Control: a valid request still renders.
    input.snapshot = () => ({ size: 1, docs: [{ data: () => ({ actor: {} }) }] });
    const ok = mockResponse();
    await handler({ query: { url: 'https://paul.kinlan.me/post/' }, method: 'GET' }, ok);
    assert.equal(ok.statusCode, 200);
    assert.ok(String(ok.body).includes('Interactions from around the fediverse'));

    // ...including when a stored actor is missing every field it renders. That
    // was a 500 from `actor.icon.url`, not from the request.
    input.snapshot = () => ({ size: 1, docs: [{ data: () => ({ actor: { name: 'A' }, object: {} }) }] });
    const partial = mockResponse();
    await handler({ query: { url: 'https://paul.kinlan.me/post/' }, method: 'GET' }, partial);
    assert.equal(partial.statusCode, 200, 'a stored record with missing fields must not be a 500');
    assert.ok(String(partial.body).includes('Replies (1)'));
  } finally {
    cleanup();
    delete globalThis.__handlerInput;
  }
});

// --- the inbox ---------------------------------------------------------------

const actorId = 'https://remote.example/users/alex';
const keyId = `${actorId}#main-key`;
const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' }
});
const actor = { id: actorId, publicKey: { id: keyId, owner: actorId, publicKeyPem: publicKey } };
// NOTE: the actor deliberately carries no `inbox`. A Follow is accepted by this
// handler only after validateFollowerInbox() structurally refuses it - testing
// a resolvable inbox here would mean a real DNS lookup.

// A correctly signed POST: the signature covers the body digest, the host, the
// date and the key, so the handler gets past authentication and on to the code
// that stores the activity.
const signedRequest = (activity) => {
  const raw = Buffer.from(JSON.stringify(activity));
  const headers = {
    host: 'paul.kinlan.me',
    date: new Date().toUTCString(),
    digest: `SHA-256=${createHash('sha256').update(raw).digest('base64')}`
  };
  headers.signature = new Sha256Signer({ publicKeyId: keyId, privateKey, headerNames: ['host', 'date', 'digest'] })
    .sign({ url: 'https://paul.kinlan.me/inbox', method: 'POST', headers });
  return { raw, headers };
};

const inboxRequest = (body, headers = {}) => Object.assign(
  Readable.from([body]),
  { headers, method: 'POST', url: '/inbox' }
);

// A body stream that fails mid-read, as an aborted upload does.
const failingInboxRequest = (error) => Object.assign(
  new Readable({ read() { this.destroy(error); } }),
  { headers: {}, method: 'POST', url: '/inbox' }
);

test('the inbox answers 400, never 500, for a body that is not a JSON activity', async () => {
  useHandlerInput({ actor });
  const { handler, cleanup } = await buildHandler('../api/activitypub/inbox.ts');
  try {
    for (const body of [Buffer.from(''), Buffer.from('<html>not json</html>'), Buffer.from('null'),
      Buffer.from('"just a string"'), Buffer.from('{'), Buffer.from('{"type":"Delete",oops')]) {
      const res = mockResponse();
      await handler(inboxRequest(body), res);
      assert.equal(res.statusCode, 400, JSON.stringify(body.toString()));
      assert.equal(res.body, 'invalid activity');
    }

    // The body stream itself is untrusted input: a read that fails is the same 400.
    const res = mockResponse();
    await handler(failingInboxRequest(new Error('aborted upload')), res);
    assert.equal(res.statusCode, 400);
    assert.equal(res.body, 'invalid activity');
  } finally {
    cleanup();
    delete globalThis.__handlerInput;
  }
});

test('a signed but malformed activity is ignored with 200, not a 500', async () => {
  const input = useHandlerInput({ actor });
  const { handler, cleanup } = await buildHandler('../api/activitypub/inbox.ts');
  try {
    const malformed = [
      ['Like without an id', { type: 'Like', actor: actorId, object: 'https://paul.kinlan.me/a-post' }],
      ['Like without an object', { type: 'Like', actor: actorId, id: 'https://remote.example/likes/1' }],
      ['Like with a non-URL object', { type: 'Like', actor: actorId, id: 'https://remote.example/likes/2', object: {} }],
      ['Like with a javascript: id', { type: 'Like', actor: actorId, id: 'javascript:alert(1)', object: 'https://paul.kinlan.me/a-post' }],
      ['Like with an object URL array', { type: 'Like', actor: actorId, id: 'https://remote.example/likes/3', object: ['https://paul.kinlan.me/a-post'] }],
      ['Announce without an id', { type: 'Announce', actor: actorId, object: 'https://paul.kinlan.me/a-post' }],
      ['Announce with a number id', { type: 'Announce', actor: actorId, id: 42, object: 'https://paul.kinlan.me/a-post' }],
      ['Create with an unusable inReplyTo', { type: 'Create', id: 'https://remote.example/notes/1', actor: actorId,
        object: { type: 'Note', inReplyTo: 'not a url' } }],
      ['Create with a non-URL id', { type: 'Create', id: {}, actor: actorId,
        object: { type: 'Note', inReplyTo: 'https://paul.kinlan.me/a-post' } }],
      ['Follow whose actor has no inbox', { type: 'Follow', actor: actorId, id: 'https://remote.example/follows/1' }]
    ];

    for (const [label, activity] of malformed) {
      input.writes.length = 0;
      const { raw, headers } = signedRequest(activity);
      const req = inboxRequest(raw, headers);
      const res = mockResponse();
      await handler(req, res);
      assert.notEqual(res.statusCode, 500, label);
      assert.equal(res.statusCode, 200, `${label} (401 would mean the signature, not the shape, was rejected)`);
      assert.equal(res.body, 'ok', label);
    }

    // Control: the guard must not swallow a well-formed Like. It is stored, and
    // the Firestore key is derived from its two URLs.
    input.writes.length = 0;
    const valid = { '@context': 'https://www.w3.org/ns/activitystreams', type: 'Like', actor: actorId,
      id: 'https://remote.example/likes/99', object: 'https://paul.kinlan.me/a-post' };
    const { raw, headers } = signedRequest(valid);
    const res = mockResponse();
    await handler(inboxRequest(raw, headers), res);
    assert.equal(res.statusCode, 200);
    assert.ok(input.writes.some(({ path }) => path.startsWith('likes/')),
      `a well-formed Like is still stored (writes: ${JSON.stringify(input.writes.map(({ path }) => path))})`);
  } finally {
    cleanup();
    delete globalThis.__handlerInput;
  }
});

// The malformed cases above only mean anything if the request really was
// authenticated, so assert that the signing helper used here satisfies the
// production verifier: a 401 (rejected signature) must not be mistakable for the
// 200 the assertions expect.
test('the signed requests used above are accepted by the production verifier', () => {
  const activity = { type: 'Update', actor: actorId, id: 'https://remote.example/updates/1' };
  const { raw, headers } = signedRequest(activity);
  const parsed = parser.parse({ url: '/inbox', method: 'POST', headers });
  assert.equal(parsed.keyId, keyId);
  assert.equal(verifyInboxActivity(raw, headers.digest, activity, parsed, actor), true,
    'the test key really authenticates these requests');
});
