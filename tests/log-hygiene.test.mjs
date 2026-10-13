// The federation surface writes to Vercel's function log, which is kept and read
// during an incident. Nothing a remote peer controls may reach it raw:
// paul-kinlan-me-0yz found the outbound signed request logging its own Signature
// header, its covered headers and its body on every send, and actor/inbox URLs
// (which a peer controls the whole of) logged verbatim throughout the inbox and
// fan-out handlers.
//
// The Acceptance on that bead - "function logs contain no Signature/Authorization
// header values" - is pinned here by running the sender for real and reading what
// it wrote, not by grepping the source for `console.log`.
import { strict as assert } from 'node:assert';
import { generateKeyPairSync, createHash } from 'node:crypto';
import { test } from 'node:test';

import { BlockedRequestError } from '../lib/activitypub/utils/guardedFetch.js';
import { logSafeText, logSafeUrl } from '../lib/activitypub/utils/logSafeUrl.js';
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

test('logSafeText keeps untrusted text on one bounded line', () => {
  // A newline reads as a second log entry, CR can rewrite the line a terminal
  // just printed: both are escaped rather than emitted.
  assert.equal(logSafeText('a\nb\rc\u0000d'), 'a\\u000ab\\u000dc\\u0000d');
  assert.equal(logSafeText('tail\u2028'), 'tail\\u2028');

  const capped = logSafeText('x'.repeat(500), 10);
  assert.equal(capped, 'xxxxxxxxxx...');

  // A value whose own string conversion throws must not take the log call down.
  assert.equal(logSafeText({ toString() { throw new Error('hostile'); } }), '<unloggable-value>');
});

test('logSafeUrl drops the parts of a peer URL that carry payloads', () => {
  assert.equal(logSafeUrl('https://mastodon.social/users/paul'), 'mastodon.social/users/paul');
  assert.equal(logSafeUrl(new URL('https://mastodon.social/users/paul?token=SECRET#frag')), 'mastodon.social/users/paul');
  assert.equal(logSafeUrl('https://user:pass@evil.com/steal'), 'evil.com/steal');

  // WHATWG parsing removes the tab/newline characters, so a path cannot split
  // the log line even before the escaping below runs.
  assert.ok(!logSafeUrl('https://evil.com/a\nINFO forged log line').includes('\n'));

  for (const hostless of ['file:///etc/passwd', 'javascript:alert(1)', 'data:text/html,<h1>x']) {
    assert.equal(logSafeUrl(hostless), '<url-without-host>', hostless);
  }
  for (const broken of ['not a url', '', null, undefined, 42, {}]) {
    assert.equal(logSafeUrl(broken), '<unparseable-url>', String(broken));
  }

  const long = logSafeUrl(`https://${'a'.repeat(500)}.example/${'b'.repeat(500)}`, 20);
  assert.equal(long.length, 23, `a peer must not be able to fill the log: ${long}`);
  assert.ok(long.endsWith('...'));
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
    // A synthetic sentinel stands in for a credential: it travels in the activity
    // body, the digest that covers the body is computed from it, and the
    // signature covers the digest. Every one of those was logged by the old code.
    const sentinel = 'sentinel-do-not-log-8f3a1c';
    const activity = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      id: `https://example.com/${sentinel}`,
      type: 'Create',
      object: { type: 'Note', content: sentinel }
    };
    // sendSignedRequest() digests `JSON.stringify(object)` over the same object,
    // so this is the exact base64 value that used to appear as the digest header.
    const digest = createHash('sha256').update(JSON.stringify(activity)).digest('base64');

    const lines = await captureConsole(async () => {
      await assert.rejects(
        sendSignedRequest(new URL('https://localhost/inbox'), activity),
        BlockedRequestError,
        'the sender must refuse a host that resolves private'
      );
    });

    // Normal diagnostic retained: the send still says what it is doing and to
    // which peer, so removing the leak did not make the log blind.
    assert.ok(lines.length > 0, 'the send must log the peer it is talking to');
    assert.ok(
      lines.some((line) => line.includes('signed POST') && line.includes('localhost')),
      `the event and the peer host must be logged: ${lines.join(' | ')}`
    );

    // One call must be one line: no control character may split or forge an entry.
    for (const line of lines) {
      assert.ok(
        !/[\u0000-\u001f\u007f]/.test(line),
        `a log line must not carry a control character: ${JSON.stringify(line)}`
      );
    }

    const leaked = lines.filter((line) =>
      line.includes(sentinel) || line.includes(digest) ||
      /signature\s*[:=]/i.test(line) || /keyid/i.test(line) || /sha-256=/i.test(line) ||
      line.includes('BEGIN RSA PRIVATE KEY')
    );
    assert.deepEqual(
      leaked,
      [],
      'the body sentinel, its digest, the Signature header, its keyId and the private key must all stay out of the log: ' +
      leaked.join(' | ')
    );
  } finally {
    if (previousKey === undefined) delete process.env.ACTIVITYPUB_PRIVATE_KEY;
    else process.env.ACTIVITYPUB_PRIVATE_KEY = previousKey;
  }
});
