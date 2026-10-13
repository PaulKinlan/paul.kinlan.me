// The federation surface writes to Vercel's function log, which is kept and read
// during an incident. Nothing a remote peer controls may reach it raw:
// paul-kinlan-me-0yz found the outbound signed request logging its own Signature
// header, its covered headers and its body on every send, and actor/inbox URLs
// (which a peer controls the whole of) logged verbatim throughout the inbox and
// fan-out handlers.
//
// Two properties are pinned here. The bead's Acceptance - "function logs contain
// no Signature/Authorization header values" - is checked by running the sender
// for real and reading what it wrote, never by grepping the source for
// `console.log`. And the peer identifier is checked to be opaque: the current
// position (coord, 2026-10-13) is that a sanitized URL still republishes the
// peer's own identifier, so only a digest of it may be logged.
//
// No assertion message in this file may echo captured log content: a failing
// security test must report which class leaked, never the leaked value. That is
// also why the assertions below report counts and class names, not lines.
import { strict as assert } from 'node:assert';
import { createHash, generateKeyPairSync } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

import { BlockedRequestError } from '../lib/activitypub/utils/guardedFetch.js';
import { logSafePeerId, logSafeText } from '../lib/activitypub/utils/logSafe.js';
import { sendSignedRequest } from '../lib/activitypub/utils/sendSignedRequest.ts';

/**
 * Collect every line the code under test writes to the console, then hand it
 * back. The console is restored in a `finally`, so a failing assertion cannot
 * leave the rest of the file logging into a dead buffer.
 * @param {() => Promise<unknown>} run
 * @returns {Promise<string[]>}
 */
async function captureConsole(run) {
  const lines = [];
  const original = { log: console.log, error: console.error, warn: console.warn };
  const record = (...args) => {
    lines.push(args.map((arg) => (typeof arg === 'string' ? arg : String(arg))).join(' '));
  };
  console.log = record;
  console.error = record;
  console.warn = record;
  try {
    await run();
  } finally {
    console.log = original.log;
    console.error = original.error;
    console.warn = original.warn;
  }
  return lines;
}

// `<host>#<12 hex>` - the host is published, nothing after it is.
const PEER_ID = /^[^\s#]+#[0-9a-f]{12}$/;

test('logSafeText keeps untrusted text on one bounded line', () => {
  // A newline reads as a second log entry and CR can rewrite the line a terminal
  // just printed, so both are escaped rather than emitted. U+2028/U+2029 are the
  // Unicode line separators, which a JavaScript log sink would also break on.
  assert.equal(logSafeText('a\nb\rc\u0000d'), 'a\\u000ab\\u000dc\\u0000d');
  assert.equal(logSafeText('tail\u2028'), 'tail\\u2028');
  assert.equal(logSafeText('tail\u2029'), 'tail\\u2029');
  assert.equal(logSafeText('bell\u0007'), 'bell\\u0007');
  assert.equal(logSafeText('c1\u0085'), 'c1\\u0085');

  // The bound is the caller's contract, and the marker is counted inside it: a
  // caller asking for a bounded line must not get a line three characters longer.
  assert.equal(logSafeText('x'.repeat(500), 10), 'xxxxxxx...');
  assert.equal(logSafeText('x'.repeat(500), 10).length, 10);
  assert.equal(logSafeText('x'.repeat(500), 3), '...');
  assert.equal(logSafeText('short', 10), 'short');

  // A value whose own string conversion throws must not take the log call down.
  assert.equal(logSafeText({ toString() { throw new Error('hostile'); } }), '<unloggable-value>');
});

test('logSafePeerId publishes the host but never the path, query or fragment', () => {
  const id = logSafePeerId('https://mastodon.social/users/paul');
  assert.match(id, PEER_ID);
  assert.ok(id.startsWith('mastodon.social#'), 'the host is the one readable part and must be there');

  // The path is the peer's own identifier - on a federation instance it names the
  // user - and the query and fragment can carry payloads or personal data, so
  // none of the three may appear.
  const pathSentinel = 'path-sentinel-4c1f';
  const querySentinel = 'query-sentinel-9ab2';
  const fragmentSentinel = 'fragment-sentinel-77de';
  const hostileId = logSafePeerId(
    `https://mastodon.social/${pathSentinel}?${querySentinel}=1#${fragmentSentinel}`
  );
  assert.ok(hostileId.startsWith('mastodon.social#'), 'the host must survive the sentinel path');
  for (const sentinel of [pathSentinel, querySentinel, fragmentSentinel]) {
    assert.ok(!hostileId.includes(sentinel), `the peer id must not carry ${sentinel}`);
  }
  assert.ok(!id.includes('users') && !id.includes('paul'), 'the user path must not be published');
  assert.ok(!id.includes('/'), 'no path separator may survive into the peer id');

  // Deterministic and computed from origin+pathname only, so an operator can
  // confirm a candidate URL by hashing it the same way, and a payload in the
  // query cannot change which peer an id refers to.
  const digest = createHash('sha256').update('https://mastodon.social/users/paul').digest('hex').slice(0, 12);
  assert.equal(id, `mastodon.social#${digest}`);
  assert.equal(logSafePeerId(new URL('https://mastodon.social/users/paul')), id);
  assert.equal(logSafePeerId('https://mastodon.social/users/paul?token=SECRET#frag'), id);
  assert.equal(logSafePeerId('https://mastodon.social/users/paul?other=1'), id);

  // Credentials in the URL are dropped with the rest of it.
  assert.equal(logSafePeerId('https://user:pass@mastodon.social/users/paul'), id);

  // A URL that is not a peer gets a fixed marker, never a rendering of itself.
  for (const hostless of ['file:///etc/passwd', 'javascript:alert(1)', 'data:text/html,<h1>x']) {
    assert.equal(logSafePeerId(hostless), '<url-without-host>', hostless);
  }
  for (const broken of ['not a url', '', null, undefined, 42, {}]) {
    assert.equal(logSafePeerId(broken), '<unparseable-url>', String(broken));
  }

  // Anything built from URL.prototype without a URL's internal slots - a
  // subclass, Object.create(URL.prototype), a proxy - passes `instanceof URL`
  // and then throws on `.host`. A log helper must never be the thing that takes
  // a request down, so this must come back as a marker, not a throw.
  for (const incompatible of [
    Object.create(URL.prototype),
    new Proxy(new URL('https://mastodon.social/users/paul'), {
      get() { throw new Error('hostile getter'); }
    })
  ]) {
    assert.equal(logSafePeerId(incompatible), '<unparseable-url>');
  }

  // A hostile URL cannot smuggle a control character in, however it is spelled:
  // the host is parser-normalised and the digest is hex, so this holds by shape.
  for (const hostile of ['https://evil.com/a\nINFO forged', 'https://evil.com/a%0Aforged', 'https://evil.com/\u2028x']) {
    assert.match(logSafePeerId(hostile), PEER_ID, hostile);
  }
});

// The acceptance test. `https://localhost` is structurally a safe federation URL
// (a hostname, not an IP literal), so it gets as far as signing and logging
// before guardedFetch refuses it on the DNS answer - which is exactly the run in
// which the old code wrote object, endpoint, requestHeaders and signature.
test('a signed request never writes its signature, covered headers or body to the log', async () => {
  const previousKey = process.env.ACTIVITYPUB_PRIVATE_KEY;
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  process.env.ACTIVITYPUB_PRIVATE_KEY = privateKey.export({ type: 'pkcs1', format: 'pem' }).toString();

  try {
    // Synthetic sentinels stand in for the credential and for the parts of the
    // peer URL that must never be published: the body travels in the activity
    // (and the digest covers that exact body), and each of the path, query and
    // fragment carries its own marker.
    const bodySentinel = 'body-sentinel-8f3a1c';
    const pathSentinel = 'path-sentinel-4c1f';
    const querySentinel = 'query-sentinel-9ab2';
    const fragmentSentinel = 'fragment-sentinel-77de';
    const activity = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      id: `https://example.com/${bodySentinel}`,
      type: 'Create',
      object: { type: 'Note', content: bodySentinel }
    };
    // sendSignedRequest() digests `JSON.stringify(object)` over the same object,
    // so this is the exact base64 value that used to appear as the digest header.
    const digest = createHash('sha256').update(JSON.stringify(activity)).digest('base64');
    const endpoint = new URL(`https://localhost/${pathSentinel}?${querySentinel}=1#${fragmentSentinel}`);

    const lines = await captureConsole(async () => {
      await assert.rejects(
        sendSignedRequest(endpoint, activity),
        BlockedRequestError,
        'the sender must refuse a host that resolves private'
      );
    });

    // Normal diagnostic retained: the send still says what it is doing and which
    // peer host it is doing it to, so removing the leak did not make the log blind.
    assert.ok(
      lines.some((line) => line.includes('signed POST') && line.includes('localhost#')),
      'the send must still log the event and the peer host'
    );

    // One call must be one line: no control character may split or forge an entry.
    assert.equal(
      lines.filter((line) => /[\u0000-\u001f\u007f]/.test(line)).length,
      0,
      'no captured log line may carry a control character'
    );

    // Report the class that leaked, never the value: this assertion is expected
    // to be red on the old code, and it must stay safe to read when it is.
    const leaked = [];
    if (lines.some((line) => line.includes(bodySentinel))) leaked.push('the activity body sentinel');
    if (lines.some((line) => line.includes(pathSentinel))) leaked.push('the endpoint path sentinel');
    if (lines.some((line) => line.includes(querySentinel))) leaked.push('the endpoint query sentinel');
    if (lines.some((line) => line.includes(fragmentSentinel))) leaked.push('the endpoint fragment sentinel');
    if (lines.some((line) => line.includes(digest))) leaked.push('the digest value covering the body');
    if (lines.some((line) => /signature\s*[:=]/i.test(line))) leaked.push('the Signature header');
    if (lines.some((line) => /keyid/i.test(line))) leaked.push('the signature keyId');
    if (lines.some((line) => /sha-256=/i.test(line))) leaked.push('the digest header');
    if (lines.some((line) => line.includes('BEGIN RSA PRIVATE KEY'))) leaked.push('the private key');
    assert.deepEqual(leaked, [], `these must never reach the log: ${leaked.join(', ')}`);
  } finally {
    if (previousKey === undefined) delete process.env.ACTIVITYPUB_PRIVATE_KEY;
    else process.env.ACTIVITYPUB_PRIVATE_KEY = previousKey;
  }
});

// A capture test only covers the log sites that actually run. The sender emits
// its one line before the transport, so a single refused send exercises the same
// statement a delivered send would - provided there is exactly one log site to
// cover, which this pins. The four lines the bead was filed for are named so a
// re-introduction is a test failure rather than a grep someone has to remember.
test('every log site in the sender is covered by the capture above', async () => {
  const source = await readFile(new URL('../lib/activitypub/utils/sendSignedRequest.ts', import.meta.url), 'utf8');
  const sites = source.match(/console\.(?:log|error|warn|info|debug)\(/g) ?? [];
  assert.equal(
    sites.length,
    1,
    `the sender must have exactly one log site for the capture to cover every outcome, found ${sites.length}`
  );
  for (const reverted of [
    'console.log("object"',
    'console.log("endpoint"',
    'console.log("requestHeaders"',
    'console.log("signature"'
  ]) {
    assert.ok(!source.includes(reverted), `the sender must not log ${reverted.slice(13)}`);
  }
});

// Redaction must not cost the operator the diagnostics they need. The event and
// the peer id are peer-independent (an event code, a host, a hex digest), and the
// request status is a number, so none of them is a leak - and each must survive.
test('the event, the peer and the request status all survive the redaction', async () => {
  for (const file of ['../api/activitypub/sendNote.ts', '../api/activitypub/inbox.ts']) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    const carriesStatus = source
      .split('\n')
      .filter((line) => line.includes('console.log') && line.includes('response.status'));
    assert.ok(
      carriesStatus.length > 0,
      `${file} must keep a log line that carries the peer's response status`
    );
    assert.ok(
      carriesStatus.some((line) => line.includes('logSafePeerId(')),
      `${file} must report that status against a peer id, not against a raw URL`
    );
  }
});
