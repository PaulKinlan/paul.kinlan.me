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

function signedRequest(message = activity, headerNames = ['(request-target)', 'host', 'date', 'digest'], digestHeader = value => value, options = {}) {
  const raw = Buffer.from(JSON.stringify(message));
  const url = options.url || 'https://paul.kinlan.me/inbox';
  const method = options.method || 'POST';
  const parsedUrl = options.parsedUrl || '/inbox';
  const parsedMethod = options.parsedMethod || 'POST';
  const date = options.date || new Date().toUTCString();
  const host = options.host || 'paul.kinlan.me';
  const headers = { host, date,
    digest: digestHeader(`SHA-256=${createHash('sha256').update(raw).digest('base64')}`) };
  if (options.extraHeaders) Object.assign(headers, options.extraHeaders);
  const signature = new Sha256Signer({ publicKeyId: keyId, privateKey, headerNames });
  headers.signature = signature.sign({ url, method, headers });
  return { raw, headers, parsed: parser.parse({ url: parsedUrl, method: parsedMethod, headers }) };
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
  const unsigned = signedRequest(activity, ['(request-target)', 'host', 'date']);
  assert.equal(verifyInboxActivity(unsigned.raw, unsigned.headers.digest, activity, unsigned.parsed, actor), false);
  const wrongKey = { ...actor, publicKey: { ...actor.publicKey, publicKeyPem: generateKeyPairSync('rsa', {
    modulusLength: 2048, publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  }).publicKey } };
  assert.equal(verifyInboxActivity(raw, headers.digest, activity, parsed, wrongKey), false);
});

test('covers the digest VALUE whatever the case the signature spells the name in', () => {
  // getSignString used to look a header up by the name as written, so a signature
  // that named "Digest" covered the literal text "digest: undefined" while
  // signedHeaders still claimed the digest was signed - the body and the digest
  // could then be swapped after signing, reusing the unchanged Signature header.
  for (const spelling of ['digest', 'Digest', 'DIGEST', 'dIgEsT']) {
    const { raw, headers, parsed } = signedRequest(activity, ['(request-target)', 'host', 'date', spelling]);
    assert.deepEqual(parsed.signedHeaders, ['(request-target)', 'host', 'date', 'digest'], spelling);
    assert.equal(verifyInboxActivity(raw, headers.digest, activity, parsed, actor), true, spelling);
    const swapped = { ...activity, object: 'https://paul.kinlan.me/EVIL' };
    const swappedRaw = Buffer.from(JSON.stringify(swapped));
    const swappedDigest = `SHA-256=${createHash('sha256').update(swappedRaw).digest('base64')}`;
    assert.equal(verifyInboxActivity(swappedRaw, swappedDigest, swapped, parsed, actor), false, spelling);
  }
});

test('accepts a signed SHA-256 digest with a case-variant token or other algorithms', () => {
  for (const digestHeader of [
    value => value.replace('SHA-256=', 'sha-256='),
    value => `SHA-512=unrelated, ${value}`,
    value => `${value}, SHA-512=unrelated`,
    value => `SHA-512=unrelated,  ${value.replace('SHA-256=', 'sHa-256=')}  `
  ]) {
    const { raw, headers, parsed } = signedRequest(activity, undefined, digestHeader);
    assert.equal(parsed.verify(publicKey), true);
    assert.equal(verifyInboxActivity(raw, headers.digest, activity, parsed, actor), true, headers.digest);
    const changed = Buffer.from(JSON.stringify({ ...activity, object: 'https://paul.kinlan.me/other' }));
    assert.equal(verifyInboxActivity(changed, headers.digest, activity, parsed, actor), false);
  }
});

test('rejects missing, duplicate, or malformed SHA-256 entries even when signed', () => {
  for (const digestHeader of [
    () => 'SHA-512=unrelated',
    value => `${value}, ${value}`,
    value => `${value}, sha-256=bad`,
    value => value.replace('SHA-256=', 'sha-256=bad')
  ]) {
    const { raw, headers, parsed } = signedRequest(activity, undefined, digestHeader);
    assert.equal(parsed.verify(publicKey), true);
    assert.equal(verifyInboxActivity(raw, headers.digest, activity, parsed, actor), false, headers.digest);
  }
});

test('refuses to sign or verify a signature that names a header the request lacks', () => {
  // "digest: undefined" must never be signable: a covered header that is absent
  // cannot be authenticated, and the sender could add or replace it afterwards.
  const signer = new Sha256Signer({ publicKeyId: keyId, privateKey, headerNames: ['(request-target)', 'host', 'date', 'digest'] });
  const raw = Buffer.from(JSON.stringify(activity));
  const complete = { host: 'paul.kinlan.me', date: new Date().toUTCString(),
    digest: `SHA-256=${createHash('sha256').update(raw).digest('base64')}` };
  assert.equal(typeof signer.sign({ url: 'https://paul.kinlan.me/inbox', method: 'POST', headers: complete }), 'string');
  const { digest, ...withoutDigest } = complete;
  assert.throws(() => signer.sign({ url: 'https://paul.kinlan.me/inbox', method: 'POST', headers: withoutDigest }),
    /absent: digest/);
  const { headers } = signedRequest();
  delete headers.digest;
  assert.throws(() => parser.parse({ url: '/inbox', method: 'POST', headers }), /absent: digest/);
});

test('rejects signatures omitting (request-target) or date from signedHeaders', () => {
  const noTarget = signedRequest(activity, ['host', 'date', 'digest']);
  assert.equal(verifyInboxActivity(noTarget.raw, noTarget.headers.digest, activity, noTarget.parsed, actor), false);

  const noDate = signedRequest(activity, ['(request-target)', 'host', 'digest']);
  assert.equal(verifyInboxActivity(noDate.raw, noDate.headers.digest, activity, noDate.parsed, actor), false);
});

test('rejects signatures with mismatched (request-target) method or path', () => {
  const wrongPath = signedRequest(activity, undefined, undefined, {
    url: 'https://paul.kinlan.me/outbox',
    parsedUrl: '/outbox'
  });
  assert.equal(verifyInboxActivity(wrongPath.raw, wrongPath.headers.digest, activity, wrongPath.parsed, actor), false);

  const wrongMethod = signedRequest(activity, undefined, undefined, {
    method: 'GET',
    parsedMethod: 'GET'
  });
  assert.equal(verifyInboxActivity(wrongMethod.raw, wrongMethod.headers.digest, activity, wrongMethod.parsed, actor), false);

  const { raw, headers, parsed } = signedRequest();
  assert.equal(verifyInboxActivity(raw, headers.digest, activity, parsed, actor, { expectedPath: '/other-endpoint' }), false);
  assert.equal(verifyInboxActivity(raw, headers.digest, activity, parsed, actor, { expectedMethod: 'DELETE' }), false);
});

test('rejects replayed requests with expired, future, or malformed date', () => {
  const now = Date.now();
  // 10 minutes in the past: expired replay
  const oldDate = new Date(now - 10 * 60 * 1000).toUTCString();
  const expired = signedRequest(activity, undefined, undefined, { date: oldDate });
  assert.equal(verifyInboxActivity(expired.raw, expired.headers.digest, activity, expired.parsed, actor, { now }), false);

  // 10 minutes in the future: clock skew exceeded
  const futureDate = new Date(now + 10 * 60 * 1000).toUTCString();
  const future = signedRequest(activity, undefined, undefined, { date: futureDate });
  assert.equal(verifyInboxActivity(future.raw, future.headers.digest, activity, future.parsed, actor, { now }), false);

  // Malformed date header
  const malformed = signedRequest(activity, undefined, undefined, { date: 'not-a-valid-date' });
  assert.equal(verifyInboxActivity(malformed.raw, malformed.headers.digest, activity, malformed.parsed, actor, { now }), false);

  // Fresh date (2 minutes in the past): accepted
  const freshDate = new Date(now - 2 * 60 * 1000).toUTCString();
  const fresh = signedRequest(activity, undefined, undefined, { date: freshDate });
  assert.equal(verifyInboxActivity(fresh.raw, fresh.headers.digest, activity, fresh.parsed, actor, { now }), true);
});

test('binds and verifies the host header against expectedHost', () => {
  const { raw, headers, parsed } = signedRequest();
  assert.equal(verifyInboxActivity(raw, headers.digest, activity, parsed, actor, { expectedHost: 'paul.kinlan.me' }), true);
  assert.equal(verifyInboxActivity(raw, headers.digest, activity, parsed, actor, { expectedHost: 'evil.example' }), false);

  const noHost = signedRequest(activity, ['(request-target)', 'date', 'digest']);
  assert.equal(verifyInboxActivity(noHost.raw, noHost.headers.digest, activity, noHost.parsed, actor, { expectedHost: 'paul.kinlan.me' }), false);
});

test('accepts valid legacy signatures without host while enforcing target and freshness', () => {
  // Legacy peers that sign (request-target), date, and digest without host are accepted
  const legacy = signedRequest(activity, ['(request-target)', 'date', 'digest']);
  assert.equal(verifyInboxActivity(legacy.raw, legacy.headers.digest, activity, legacy.parsed, actor), true);

  // But legacy signatures with stale date (>5m) are still rejected
  const oldDate = new Date(Date.now() - 10 * 60 * 1000).toUTCString();
  const legacyExpired = signedRequest(activity, ['(request-target)', 'date', 'digest'], undefined, { date: oldDate });
  assert.equal(verifyInboxActivity(legacyExpired.raw, legacyExpired.headers.digest, activity, legacyExpired.parsed, actor), false);

  // And legacy signatures with wrong path are still rejected
  const legacyWrongPath = signedRequest(activity, ['(request-target)', 'date', 'digest'], undefined, {
    url: 'https://paul.kinlan.me/outbox',
    parsedUrl: '/outbox'
  });
  assert.equal(verifyInboxActivity(legacyWrongPath.raw, legacyWrongPath.headers.digest, activity, legacyWrongPath.parsed, actor), false);
});

test('rejects localhost:1234 signature even when no options are passed', () => {
  const localhostSig = signedRequest(activity, undefined, undefined, { host: 'localhost:1234' });
  assert.equal(verifyInboxActivity(localhostSig.raw, localhostSig.headers.digest, activity, localhostSig.parsed, actor), false);
});

test('handles standard default ports :80 and :443 symmetrically in host binding', () => {
  // Covered host has :443, expected host has no port
  const sigPort443 = signedRequest(activity, undefined, undefined, { host: 'paul.kinlan.me:443' });
  assert.equal(verifyInboxActivity(sigPort443.raw, sigPort443.headers.digest, activity, sigPort443.parsed, actor, {
    expectedHost: 'paul.kinlan.me'
  }), true);

  // Covered host has no port, expected host has :443
  const sigNoPort = signedRequest(activity, undefined, undefined, { host: 'paul.kinlan.me' });
  assert.equal(verifyInboxActivity(sigNoPort.raw, sigNoPort.headers.digest, activity, sigNoPort.parsed, actor, {
    expectedHost: 'paul.kinlan.me:443'
  }), true);

  // Covered host has :80, expected host has no port
  const sigPort80 = signedRequest(activity, undefined, undefined, { host: 'paul.kinlan.me:80' });
  assert.equal(verifyInboxActivity(sigPort80.raw, sigPort80.headers.digest, activity, sigPort80.parsed, actor, {
    expectedHost: 'paul.kinlan.me'
  }), true);

  // Covered host has no port, expected host has :80
  assert.equal(verifyInboxActivity(sigNoPort.raw, sigNoPort.headers.digest, activity, sigNoPort.parsed, actor, {
    expectedHost: 'paul.kinlan.me:80'
  }), true);

  // Non-standard port does not match canonical host
  const sigPort8443 = signedRequest(activity, undefined, undefined, { host: 'paul.kinlan.me:8443' });
  assert.equal(verifyInboxActivity(sigPort8443.raw, sigPort8443.headers.digest, activity, sigPort8443.parsed, actor, {
    expectedHost: 'paul.kinlan.me'
  }), false);
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

    // Same trick through the real handler, but signed by the actor's OWN key with a
    // "Digest" (capital D) covered-header list: swapping the body and its digest must
    // not be accepted just because the signature claimed to cover the digest.
    const intact = { ...activity, type: 'Update' };
    const swapped = { ...intact, object: 'https://paul.kinlan.me/EVIL' };
    const swappedRaw = Buffer.from(JSON.stringify(swapped));
    const { headers: swappedHeaders } = signedRequest(intact, ['(request-target)', 'host', 'date', 'Digest']);
    swappedHeaders.digest = `SHA-256=${createHash('sha256').update(swappedRaw).digest('base64')}`;
    const swapReq = Object.assign(Readable.from([swappedRaw]),
      { headers: swappedHeaders, method: 'POST', url: '/inbox' });
    const swapRes = { statusCode: 200, setHeader() {}, end(value) { this.body = value; return this; } };
    await inbox(swapReq, swapRes);
    assert.equal(swapRes.statusCode, 401);
    assert.deepEqual(writes, []);

    // A signature that claims to cover the digest, over a request that carries no
    // digest header at all: unverifiable, not "digest: undefined".
    const { raw: intactRaw, headers: noDigest } = signedRequest(intact, ['(request-target)', 'host', 'date', 'digest']);
    delete noDigest.digest;
    const noDigestReq = Object.assign(Readable.from([intactRaw]),
      { headers: noDigest, method: 'POST', url: '/inbox' });
    const noDigestRes = { statusCode: 200, setHeader() {}, end(value) { this.body = value; return this; } };
    await inbox(noDigestReq, noDigestRes);
    assert.equal(noDigestRes.statusCode, 401);
    assert.deepEqual(writes, []);

    // Drive the wire path: the handler must accept a signed multi-value Digest
    // with a lower-case SHA-256 token, not just the verifier in isolation.
    const deletion = { ...activity, type: 'Delete' };
    const { raw: deleteRaw, headers: deleteHeaders } = signedRequest(deletion,
      undefined, value => `SHA-512=unrelated, sha-256=${value.slice('SHA-256='.length)}`);
    const deleteReq = Object.assign(Readable.from([deleteRaw]),
      { headers: deleteHeaders, method: 'POST', url: '/inbox' });
    const deleteRes = { statusCode: 200, setHeader() {}, end(value) { this.body = value; return this; } };
    await inbox(deleteReq, deleteRes);
    assert.equal(deleteRes.statusCode, 200);
    assert.equal(deleteRes.body, 'delete');
    assert.deepEqual(writes, []);

    // A captured request replayed 10 minutes later must be rejected with 401.
    const replayedDate = new Date(Date.now() - 10 * 60 * 1000).toUTCString();
    const { raw: replayRaw, headers: replayHeaders } = signedRequest(deletion, undefined, undefined, { date: replayedDate });
    const replayReq = Object.assign(Readable.from([replayRaw]),
      { headers: replayHeaders, method: 'POST', url: '/inbox' });
    const replayRes = { statusCode: 200, setHeader() {}, end(value) { this.body = value; return this; } };
    await inbox(replayReq, replayRes);
    assert.equal(replayRes.statusCode, 401);
    assert.deepEqual(writes, []);

    // A request signed for another endpoint (/outbox) presented at /inbox must be rejected with 401.
    const { raw: wrongEndpointRaw, headers: wrongEndpointHeaders } = signedRequest(deletion, undefined, undefined, {
      url: 'https://paul.kinlan.me/outbox',
      parsedUrl: '/outbox'
    });
    const wrongEndpointReq = Object.assign(Readable.from([wrongEndpointRaw]),
      { headers: wrongEndpointHeaders, method: 'POST', url: '/inbox' });
    const wrongEndpointRes = { statusCode: 200, setHeader() {}, end(value) { this.body = value; return this; } };
    await inbox(wrongEndpointReq, wrongEndpointRes);
    assert.equal(wrongEndpointRes.statusCode, 401);
    assert.deepEqual(writes, []);

    // A signature with mismatched host presented to the inbox must be rejected with 401.
    const { raw: wrongHostRaw, headers: wrongHostHeaders } = signedRequest(deletion, undefined, undefined, {
      host: 'attacker.example',
      url: 'https://attacker.example/inbox'
    });
    const wrongHostReq = Object.assign(Readable.from([wrongHostRaw]),
      { headers: wrongHostHeaders, method: 'POST', url: '/inbox' });
    const wrongHostRes = { statusCode: 200, setHeader() {}, end(value) { this.body = value; return this; } };
    await inbox(wrongHostReq, wrongHostRes);
    assert.equal(wrongHostRes.statusCode, 401);
    assert.deepEqual(writes, []);

    // A signature omitting host header must be rejected by the actual inbox (preventing cross-host replay).
    const { raw: noHostRaw, headers: noHostHeaders } = signedRequest(deletion, ['(request-target)', 'date', 'digest']);
    const noHostReq = Object.assign(Readable.from([noHostRaw]),
      { headers: noHostHeaders, method: 'POST', url: '/inbox' });
    const noHostRes = { statusCode: 200, setHeader() {}, end(value) { this.body = value; return this; } };
    await inbox(noHostReq, noHostRes);
    assert.equal(noHostRes.statusCode, 401);
    assert.deepEqual(writes, []);

    // A request signed with host: 'localhost:1234' presented to the inbox must be rejected with 401.
    const { raw: localhostRaw, headers: localhostHeaders } = signedRequest(deletion, undefined, undefined, {
      host: 'localhost:1234',
      url: 'http://localhost:1234/inbox'
    });
    const localhostReq = Object.assign(Readable.from([localhostRaw]),
      { headers: localhostHeaders, method: 'POST', url: '/inbox' });
    const localhostRes = { statusCode: 200, setHeader() {}, end(value) { this.body = value; return this; } };
    await inbox(localhostReq, localhostRes);
    assert.equal(localhostRes.statusCode, 401);
    assert.deepEqual(writes, []);

    // Signature covers host: 'paul.kinlan.me:443' and presented with host: 'paul.kinlan.me:443'.
    const { raw: host443Raw, headers: host443Headers } = signedRequest(deletion, undefined, undefined, {
      host: 'paul.kinlan.me:443',
      url: 'https://paul.kinlan.me:443/inbox'
    });
    const host443Req = Object.assign(Readable.from([host443Raw]),
      { headers: host443Headers, method: 'POST', url: '/inbox' });
    const host443Res = { statusCode: 200, setHeader() {}, end(value) { this.body = value; return this; } };
    await inbox(host443Req, host443Res);
    assert.equal(host443Res.statusCode, 200);
    assert.equal(host443Res.body, 'delete');

    // x-forwarded-host carries explicit :443 while wire host and signature cover canonical host without port (paul-kinlan-me-1ja).
    const { raw: xfh443Raw, headers: xfh443Headers } = signedRequest(deletion, undefined, undefined, {
      host: 'paul.kinlan.me'
    });
    xfh443Headers['x-forwarded-host'] = 'paul.kinlan.me:443';
    const xfh443Req = Object.assign(Readable.from([xfh443Raw]),
      { headers: xfh443Headers, method: 'POST', url: '/inbox' });
    const xfh443Res = { statusCode: 200, setHeader() {}, end(value) { this.body = value; return this; } };
    await inbox(xfh443Req, xfh443Res);
    assert.equal(xfh443Res.statusCode, 200);
    assert.equal(xfh443Res.body, 'delete');

    // Trusted host via process.env.PUBLIC_ORIGIN is accepted.
    const prevOrigin = process.env.PUBLIC_ORIGIN;
    try {
      process.env.PUBLIC_ORIGIN = 'https://custom.example';
      const { raw: customRaw, headers: customHeaders } = signedRequest(deletion, undefined, undefined, {
        host: 'custom.example',
        url: 'https://custom.example/inbox'
      });
      const customReq = Object.assign(Readable.from([customRaw]),
        { headers: customHeaders, method: 'POST', url: '/inbox' });
      const customRes = { statusCode: 200, setHeader() {}, end(value) { this.body = value; return this; } };
      await inbox(customReq, customRes);
      assert.equal(customRes.statusCode, 200);
      assert.equal(customRes.body, 'delete');
    } finally {
      if (prevOrigin !== undefined) process.env.PUBLIC_ORIGIN = prevOrigin;
      else delete process.env.PUBLIC_ORIGIN;
    }

    // Trusted host via process.env.VERCEL_URL is accepted.
    const prevVercel = process.env.VERCEL_URL;
    try {
      process.env.VERCEL_URL = 'preview-branch.vercel.app';
      const { raw: vercelRaw, headers: vercelHeaders } = signedRequest(deletion, undefined, undefined, {
        host: 'preview-branch.vercel.app',
        url: 'https://preview-branch.vercel.app/inbox'
      });
      const vercelReq = Object.assign(Readable.from([vercelRaw]),
        { headers: vercelHeaders, method: 'POST', url: '/inbox' });
      const vercelRes = { statusCode: 200, setHeader() {}, end(value) { this.body = value; return this; } };
      await inbox(vercelReq, vercelRes);
      assert.equal(vercelRes.statusCode, 200);
      assert.equal(vercelRes.body, 'delete');
    } finally {
      if (prevVercel !== undefined) process.env.VERCEL_URL = prevVercel;
      else delete process.env.VERCEL_URL;
    }

    // Untrusted x-forwarded-host fails closed with 401 even if host header matches.
    const { raw: badXfhRaw, headers: badXfhHeaders } = signedRequest(deletion, undefined, undefined, {
      host: 'paul.kinlan.me'
    });
    badXfhHeaders['x-forwarded-host'] = 'untrusted.example';
    const badXfhReq = Object.assign(Readable.from([badXfhRaw]),
      { headers: badXfhHeaders, method: 'POST', url: '/inbox' });
    const badXfhRes = { statusCode: 200, setHeader() {}, end(value) { this.body = value; return this; } };
    await inbox(badXfhReq, badXfhRes);
    assert.equal(badXfhRes.statusCode, 401);
    assert.deepEqual(writes, []);
  } finally {
    delete globalThis.__inboxTest;
    rmSync(dir, { recursive: true, force: true });
  }
});
