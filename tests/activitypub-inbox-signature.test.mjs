import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { build } from 'esbuild';
import { generateKeyPairSync, createHash } from 'node:crypto';
import { test } from 'node:test';
import { Sha256Signer, default as parser } from '../lib/http-signature/index.js';
import { verifyInboxActivity } from '../lib/activitypub/utils/verifyInboxActivity.ts';

const actorId = 'https://remote.example/users/alex';
const keyId = `${actorId}#main-key`;
const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048,
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' }
});
const actor = { id: actorId, publicKey: { id: keyId, owner: actorId, publicKeyPem: publicKey } };
const activity = { type: 'Like', actor: actorId, object: 'https://paul.kinlan.me/a-post' };

function signedRequest(message = activity, headerNames = ['host', 'date', 'digest']) {
  const raw = Buffer.from(JSON.stringify(message));
  const headers = { host: 'paul.kinlan.me', date: new Date().toUTCString(),
    digest: `SHA-256=${createHash('sha256').update(raw).digest('base64')}` };
  const signature = new Sha256Signer({ publicKeyId: keyId, privateKey, headerNames });
  headers.signature = signature.sign({ url: 'https://paul.kinlan.me/inbox', method: 'POST', headers });
  return { raw, headers, parsed: parser.parse({ url: '/inbox', method: 'POST', headers }) };
}

test('accepts an intact signed activity from its own actor and key', () => {
  const { raw, headers, parsed } = signedRequest();
  assert.equal(verifyInboxActivity(raw, headers.digest, activity, parsed, actor), true);
});

test('rejects a valid signature when the key belongs to a different activity actor', () => {
  const forged = { ...activity, actor: 'https://victim.example/users/victim' };
  const { raw, headers, parsed } = signedRequest(forged);
  assert.equal(parsed.verify(publicKey), true, 'the attacker owns the signing key');
  assert.equal(verifyInboxActivity(raw, headers.digest, forged, parsed, actor), false);
});

test('rejects forged key owner, key ID, and off-origin key ID', () => {
  const { raw, headers, parsed } = signedRequest();
  for (const changed of [
    { ...actor, publicKey: { ...actor.publicKey, owner: 'https://victim.example/users/victim' } },
    { ...actor, publicKey: { ...actor.publicKey, id: `${actorId}#other-key` } },
    { ...actor, id: 'https://victim.example/users/victim' }
  ]) assert.equal(verifyInboxActivity(raw, headers.digest, activity, parsed, changed), false);
  const offOrigin = signedRequest();
  Object.defineProperty(offOrigin.parsed, 'keyId', { value: 'https://victim.example/keys/alex' });
  assert.equal(verifyInboxActivity(offOrigin.raw, offOrigin.headers.digest, activity, offOrigin.parsed,
    { ...actor, publicKey: { ...actor.publicKey, id: offOrigin.parsed.keyId } }), false);
});

test('rejects body tampering, missing/unsigned/malformed digest, and invalid signature', () => {
  const { raw, headers, parsed } = signedRequest();
  const changed = Buffer.from(JSON.stringify({ ...activity, object: 'https://paul.kinlan.me/other' }));
  assert.equal(verifyInboxActivity(changed, headers.digest, activity, parsed, actor), false);
  assert.equal(verifyInboxActivity(raw, undefined, activity, parsed, actor), false);
  assert.equal(verifyInboxActivity(raw, 'SHA-256=bad', activity, parsed, actor), false);
  const unsigned = signedRequest(activity, ['host', 'date']);
  assert.equal(verifyInboxActivity(unsigned.raw, unsigned.headers.digest, activity, unsigned.parsed, actor), false);
  const wrongKey = { ...actor, publicKey: { ...actor.publicKey, publicKeyPem: generateKeyPairSync('rsa', {
    modulusLength: 2048, publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  }).publicKey } };
  assert.equal(verifyInboxActivity(raw, headers.digest, activity, parsed, wrongKey), false);
});

test('the actual inbox rejects a forged actor with 401 and makes no Firestore writes', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'activitypub-inbox-'));
  const writes = [];
  globalThis.__inboxTest = { actor, writes };
  try {
    const built = await build({
      entryPoints: [new URL('../api/activitypub/inbox.ts', import.meta.url).pathname],
      bundle: true, platform: 'node', format: 'esm', write: false, logLevel: 'silent',
      plugins: [{ name: 'inbox-test-dependencies', setup(plugin) {
        plugin.onResolve({ filter: /^firebase-admin$/ }, () => ({ path: 'firebase', namespace: 'test' }));
        plugin.onResolve({ filter: /^uuid$/ }, () => ({ path: 'uuid', namespace: 'test' }));
        plugin.onResolve({ filter: /fetchActorInformation\.js$/ }, () => ({ path: 'actor-fetch', namespace: 'test' }));
        plugin.onLoad({ filter: /.*/, namespace: 'test' }, ({ path }) => ({ loader: 'js', contents: path === 'firebase' ?
          `export default { apps: [true], firestore: () => ({ collection: () => ({
            doc: () => ({ set: async (...args) => globalThis.__inboxTest.writes.push(args) })
          }) }) };` : path === 'uuid' ? 'export const v4 = () => "test-id";' :
          'export const fetchActorInformation = async () => globalThis.__inboxTest.actor;'
        }));
      } }]
    });
    const file = join(dir, 'handler.mjs');
    writeFileSync(file, built.outputFiles[0].contents);
    const { default: inbox } = await import(`file://${file}`);
    const forged = { ...activity, actor: 'https://victim.example/users/victim' };
    const { raw, headers } = signedRequest(forged);
    const req = Object.assign(Readable.from([raw]), { headers, method: 'POST', url: '/inbox' });
    const res = { statusCode: 200, setHeader() {}, end(value) { this.body = value; return this; } };
    await inbox(req, res);
    assert.equal(res.statusCode, 401);
    assert.deepEqual(writes, []);
  } finally {
    delete globalThis.__inboxTest;
    rmSync(dir, { recursive: true, force: true });
  }
});
