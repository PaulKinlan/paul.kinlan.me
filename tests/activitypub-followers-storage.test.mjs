// Exercise the inbox write and followers read against one in-memory Firestore
// stub. This is a handler behavior test, not a live/emulator Firestore I/O test.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, generateKeyPairSync } from 'node:crypto';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { build } from 'esbuild';
import { Sha256Signer } from '../lib/http-signature/index.js';

const actorId = 'https://remote.example/users/alex';
const keyId = `${actorId}#main-key`;

function response() {
  return { statusCode: 200, headers: {}, setHeader(key, value) { this.headers[key.toLowerCase()] = value; },
    json(value) { this.body = value; return this; }, end(value) { this.body = value; return this; } };
}

test('a signed Follow stores a follower that the followers endpoint returns', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'activitypub-followers-storage-'));
  const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048,
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    publicKeyEncoding: { type: 'spki', format: 'pem' } });
  const actor = { id: actorId, inbox: 'https://remote.example/inbox',
    publicKey: { id: keyId, owner: actorId, publicKeyPem: publicKey } };
  const records = new Map();
  globalThis.__followersStorageTest = { actor, records };
  const deps = { name: 'offline-followers-dependencies', setup(plugin) {
    plugin.onResolve({ filter: /^firebase-admin$/ }, () => ({ path: 'firebase', namespace: 'offline' }));
    plugin.onResolve({ filter: /^uuid$/ }, () => ({ path: 'uuid', namespace: 'offline' }));
    plugin.onResolve({ filter: /fetchActorInformation\.js$/ }, () => ({ path: 'actor', namespace: 'offline' }));
    plugin.onResolve({ filter: /guardedFetch\.js$/ }, () => ({ path: 'guard', namespace: 'offline' }));
    plugin.onResolve({ filter: /sendSignedRequest\.js$/ }, () => ({ path: 'send', namespace: 'offline' }));
    plugin.onLoad({ filter: /.*/, namespace: 'offline' }, ({ path }) => ({ loader: 'js', contents: ({
      firebase: `export default { apps: [true], firestore: () => ({ collection: name => ({
        doc: id => ({
          get: async () => ({ exists: globalThis.__followersStorageTest.records.has(name + '/' + id) }),
          set: async value => { globalThis.__followersStorageTest.records.set(name + '/' + id, value); },
          delete: async () => { globalThis.__followersStorageTest.records.delete(name + '/' + id); }
        }),
        select: field => ({ get: async () => ({ docs: [...globalThis.__followersStorageTest.records]
          .filter(([key]) => key.startsWith(name + '/'))
          .map(([, value]) => ({ get: key => key === field ? value[key] : undefined })) }) })
      }) }) };`,
      uuid: 'export const v4 = () => "offline-follow-id";',
      actor: 'export const fetchActorInformation = async () => globalThis.__followersStorageTest.actor;',
      guard: `export const validateFollowerInbox = async value => ({ ok: true, url: new URL(value) });`,
      send: 'export const sendSignedRequest = async () => new Response(null, { status: 202 });',
    })[path] }));
  } };
  try {
    for (const name of ['inbox', 'followers']) {
      const built = await build({ entryPoints: [new URL(`../api/activitypub/${name}.ts`, import.meta.url).pathname],
        bundle: true, platform: 'node', format: 'esm', write: false, logLevel: 'silent', plugins: [deps] });
      writeFileSync(join(dir, `${name}.mjs`), built.outputFiles[0].contents);
    }
    const { default: inbox } = await import(`file://${join(dir, 'inbox.mjs')}`);
    const { default: followers } = await import(`file://${join(dir, 'followers.mjs')}`);
    const follow = { id: 'https://remote.example/follows/1', type: 'Follow', actor: actorId,
      object: 'https://paul.kinlan.me/paul' };
    const raw = Buffer.from(JSON.stringify(follow));
    const headers = { host: 'paul.kinlan.me', date: new Date().toUTCString(),
      digest: `SHA-256=${createHash('sha256').update(raw).digest('base64')}` };
    headers.signature = new Sha256Signer({ publicKeyId: keyId, privateKey,
      headerNames: ['host', 'date', 'digest'] }).sign({ url: 'https://paul.kinlan.me/inbox', method: 'POST', headers });
    const req = Object.assign(Readable.from([raw]), { headers, method: 'POST', url: '/inbox' });
    const inboxResponse = response();
    await inbox(req, inboxResponse);
    assert.equal(inboxResponse.body, 'ok');
    const followerResponse = response();
    await followers({}, followerResponse);
    assert.equal(followerResponse.statusCode, 200);
    assert.equal(followerResponse.headers['content-type'], 'application/activity+json');
    assert.equal(followerResponse.body.totalItems, 1);
    assert.deepEqual(followerResponse.body.orderedItems, [actor]);
    assert.ok(records.has('followers/https:__remote.example_users_alex'));
  } finally {
    delete globalThis.__followersStorageTest;
    rmSync(dir, { recursive: true, force: true });
  }
});
