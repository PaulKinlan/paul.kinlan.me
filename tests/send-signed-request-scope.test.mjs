// Regression test for the outbound federation signature scope
// (paul-kinlan-me-jzm5, from the Nov 4 factory audit delta).
//
// sendSignedRequest.ts signed only host/date/digest: a captured signed POST
// could be replayed to any other path on the peer host, because nothing in the
// signature bound the method+path. The signer now covers the (request-target)
// pseudo-header, which lib/http-signature synthesises from the URL and method.
//
// This suite bundles sendSignedRequest.ts with guardedFetch stubbed at the
// module boundary (the real one resolves DNS, which a test must not do), and
// verifies the signature CRYPTOGRAPHICALLY with the matching public key:
//   - the covered-header list includes (request-target), and
//   - the signature verifies against the signed string built from the actual
//     request target, and
//   - the same signature does NOT verify against a different path - the
//     replay the finding described is now cryptographically refused.
// Run with: node --test tests/send-signed-request-scope.test.mjs
import { strict as assert } from 'node:assert';
import { generateKeyPairSync, createHash, verify as cryptoVerify, createPublicKey } from 'node:crypto';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

import { build } from 'esbuild';

const GUARDED_FETCH_STUB = `
export class BlockedRequestError extends Error {}
export const isSafeFederationUrl = () => true;
export const validateFollowerInbox = async () => true;
export async function guardedFetch(url, init) {
  globalThis.__sigScope.calls.push({ url: String(url), init });
  return new Response('{}', { status: 200, headers: { 'content-type': 'application/activity+json' } });
}
`;

const buildSendSignedRequest = async () => {
  const dir = mkdtempSync(join(tmpdir(), 'sig-scope-'));
  const built = await build({
    entryPoints: [new URL('../lib/activitypub/utils/sendSignedRequest.ts', import.meta.url).pathname],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
    logLevel: 'silent',
    plugins: [{
      name: 'sig-scope-stubs',
      setup(plugin) {
        plugin.onResolve({ filter: /guardedFetch\.js$/ }, () => ({ path: 'guardedFetch', namespace: 'stub' }));
        plugin.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ loader: 'js', contents: GUARDED_FETCH_STUB }));
      }
    }]
  });
  const file = join(dir, 'sender.mjs');
  writeFileSync(file, built.outputFiles[0].contents);
  const { sendSignedRequest } = await import(`file://${file}`);
  return { sendSignedRequest, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
};

// Rebuilds the exact string-to-sign for a covered-header list, the way the
// HTTP Signatures draft defines it: "name: value" lines joined by newlines.
const signedString = (coveredValues) =>
  coveredValues.map(([name, value]) => `${name}: ${value}`).join('\n');

test('outbound signatures cover (request-target) and cryptographically refuse a path replay', async () => {
  const { privateKeyPem, publicKeyPem } = (() => {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    return {
      privateKeyPem: privateKey.export({ type: 'pkcs1', format: 'pem' }).toString(),
      publicKeyPem: publicKey.export({ type: 'spki', format: 'pem' }).toString()
    };
  })();

  globalThis.__sigScope = { calls: [] };
  const previousKey = process.env.ACTIVITYPUB_PRIVATE_KEY;
  process.env.ACTIVITYPUB_PRIVATE_KEY = privateKeyPem;
  const { sendSignedRequest, cleanup } = await buildSendSignedRequest();
  try {
    const note = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      id: 'https://paul.kinlan.me/notes/1',
      type: 'Create',
      object: { type: 'Note', content: 'hello federation' }
    };
    await sendSignedRequest(new URL('https://peer.example/inbox?year=2026'), note);

    assert.equal(globalThis.__sigScope.calls.length, 1, 'exactly one outbound request');
    const { url, init } = globalThis.__sigScope.calls[0];
    assert.equal(url, 'https://peer.example/inbox?year=2026');

    const signatureHeader = init.headers?.Signature ?? init.headers?.signature;
    assert.ok(signatureHeader, 'the request carries a Signature header');
    const headerList = /headers="([^"]+)"/.exec(signatureHeader)?.[1] ?? '';
    assert.equal(headerList, '(request-target) host date digest',
      'the signature must cover the request target, not just host/date/digest');

    // Cryptographic check: the signature verifies over the string built from
    // the request's ACTUAL target and covered header values.
    const actualTarget = [
      ['(request-target)', 'post /inbox?year=2026'],
      ['host', 'peer.example'],
      ['date', init.headers.date],
      ['digest', init.headers.digest]
    ];
    const good = signedString(actualTarget);
    const signature = /signature="([^"]+)"/.exec(signatureHeader)[1];
    assert.equal(
      cryptoVerify('sha256', Buffer.from(good), createPublicKey(publicKeyPem), Buffer.from(signature, 'base64')),
      true,
      'the signature verifies over the real request target'
    );

    // The digest is bound too, so the same capture cannot carry a new body.
    const bodyDigest = `SHA-256=${createHash('sha256').update(JSON.stringify(note)).digest('base64')}`;
    assert.equal(init.headers.digest, bodyDigest, 'the Digest header covers the sent body');

    // THE REPLAY: the same signature over a DIFFERENT path must not verify.
    assert.equal(
      cryptoVerify('sha256', Buffer.from(signedString([
        ['(request-target)', 'post /followers'],
        ['host', 'peer.example'],
        ['date', init.headers.date],
        ['digest', init.headers.digest]
      ])), createPublicKey(publicKeyPem), Buffer.from(signature, 'base64')),
      false,
      'the signature must not verify against another path on the peer host'
    );
    const swappedBody = { ...note, object: { type: 'Note', content: 'tampered' } };
    const swappedDigest = `SHA-256=${createHash('sha256').update(JSON.stringify(swappedBody)).digest('base64')}`;
    const tampered = signedString([
      ['(request-target)', 'post /inbox?year=2026'],
      ['host', 'peer.example'],
      ['date', init.headers.date],
      ['digest', swappedDigest]
    ]);
    assert.equal(
      cryptoVerify('sha256', Buffer.from(tampered), createPublicKey(publicKeyPem), Buffer.from(signature, 'base64')),
      false,
      'the signature must not verify against a swapped body digest either'
    );
  } finally {
    if (previousKey === undefined) delete process.env.ACTIVITYPUB_PRIVATE_KEY;
    else process.env.ACTIVITYPUB_PRIVATE_KEY = previousKey;
    delete globalThis.__sigScope;
    cleanup();
  }
});
