import { strict as assert } from 'node:assert';
import { generateKeyPairSync } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { test } from 'node:test';

import { BlockedRequestError, guardedFetch, isSafeFederationUrl, validateFollowerInbox } from '../lib/activitypub/utils/guardedFetch.js';
import { sendSignedRequest } from '../lib/activitypub/utils/sendSignedRequest.ts';

// The federation surface takes inbox URLs from remote actors. A signed POST to a
// private address is the SSRF this file guards (api/activitypub/sendNote.ts used
// to fan out to whatever inbox a follower had registered). Every test here is
// offline: the "attacker" is a server on 127.0.0.1, and it must receive nothing.

// Structural only, no DNS: a name like `localhost` passes here and is refused
// by resolvePublicAddress()/guardedFetch() below, once it is resolved.
test('isSafeFederationUrl accepts only structurally safe HTTPS endpoints', () => {
  for (const safe of [
    'https://mastodon.social/users/paul',
    'https://paul.kinlan.me/inbox',
    'https://[2606:4700::1111]/inbox'
  ]) assert.equal(isSafeFederationUrl(safe), true, safe);

  for (const unsafe of [
    'http://mastodon.social/users/paul', // plaintext
    'https://user:pass@mastodon.social/inbox', // credentials in the URL
    'https://127.0.0.1/inbox',
    'https://[::1]/inbox', 'https://[::ffff:127.0.0.1]/inbox',
    'https://10.0.0.1/inbox', 'https://192.168.1.1/inbox',
    'https://169.254.169.254/latest/meta-data/', // cloud metadata
    'https://100.64.0.1/inbox', 'https://0.0.0.0/inbox',
    'https://2130706433/inbox', // decimal 127.0.0.1
    'https://[2002::1]/inbox', // 6to4 can tunnel to a private address
    'https://[2001:db8::1]/inbox',
    'file:///etc/passwd', 'not a url', ''
  ]) assert.equal(isSafeFederationUrl(unsafe), false, unsafe);
});

test('signing a request to a blocked inbox connects to nothing', async () => {
  let requests = 0;
  const server = createServer((_req, res) => { requests++; res.end('{}'); });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  // Signing must not be the thing that fails first: give it a throwaway key so
  // each rejection below is provably the address check.
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  process.env.ACTIVITYPUB_PRIVATE_KEY = privateKey.export({ type: 'pkcs1', format: 'pem' }).toString();

  try {
    const address = server.address();
    assert(address && typeof address !== 'string');
    const note = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      id: 'https://paul.kinlan.me/1',
      type: 'Create'
    };

    for (const inbox of [
      `http://127.0.0.1:${address.port}/inbox`,
      `https://127.0.0.1:${address.port}/inbox`,
      `https://localhost:${address.port}/inbox`,
      `https://[::1]:${address.port}/inbox`,
      'https://169.254.169.254/latest/meta-data/',
      'https://10.0.0.1/inbox',
      'https://2130706433/inbox'
    ]) {
      await assert.rejects(sendSignedRequest(new URL(inbox), note), BlockedRequestError, inbox);
      await assert.rejects(guardedFetch(inbox), BlockedRequestError, inbox);
    }

    assert.equal(requests, 0, 'a blocked target must not receive a request');

    // sendNote.ts prunes a follower on exactly this reason at send time, so pin
    // it: a DNS answer that is private is the case that refuses the record too.
    await assert.rejects(
      guardedFetch(`https://localhost:${address.port}/inbox`),
      (error) => error instanceof BlockedRequestError && error.reason === 'private-address',
      'a private-resolving name must refused as private-address'
    );
  } finally {
    server.close();
  }
});

// paul-kinlan-me-lno: acceptance is where the follower record is created, so it
// is where a private-resolving inbox has to be refused. The structural check
// alone passes https://localhost/inbox (it is a hostname, not an IP literal) and
// the DNS check is what refuses it.
test('a follow whose inbox resolves to a private address is refused at acceptance', async () => {
  let requests = 0;
  const server = createServer((_req, res) => { requests++; res.end('{}'); });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  try {
    const address = server.address();
    assert(address && typeof address !== 'string');

    const refused = {
      [`https://localhost:${address.port}/inbox`]: 'private-address', // resolves via DNS
      'https://localhost/inbox': 'private-address',
      'https://127.0.0.1/inbox': 'unsafe-url',
      'https://[::1]/inbox': 'unsafe-url',
      'https://169.254.169.254/latest/meta-data/': 'unsafe-url',
      'https://10.0.0.1/inbox': 'unsafe-url',
      'http://example.com/inbox': 'unsafe-url',
      'https://user:pass@example.com/inbox': 'unsafe-url',
      'not a url': 'not-a-url'
    };
    for (const [inbox, reason] of Object.entries(refused)) {
      const decision = await validateFollowerInbox(inbox);
      assert.equal(decision.ok, false, inbox);
      assert.equal(decision.reason, reason, inbox);
    }

    // A publicly addressed inbox is still accepted - no false refusal.
    const accepted = await validateFollowerInbox('https://1.1.1.1/inbox');
    assert.equal(accepted.ok, true);
    assert.equal(accepted.url.hostname, '1.1.1.1');

    // Deciding must not contact anything, and least of all the local server.
    assert.equal(requests, 0, 'acceptance must not contact the inbox');
  } finally {
    server.close();
  }
});

// "No Firestore save" cannot be asserted by running the handler (firebase-admin
// needs credentials and a network), so assert the ordering that guarantees it:
// saveFollow must reach the inbox decision before it writes the follower document.
test('inbox.ts decides on the inbox before it writes the follower', async () => {
  const source = await readFile(new URL('../api/activitypub/inbox.ts', import.meta.url), 'utf8');
  const decision = source.indexOf('await validateFollowerInbox(');
  const write = source.indexOf('followDocRef.set(');
  assert.notEqual(decision, -1, 'saveFollow must validate the inbox');
  assert.notEqual(write, -1, 'saveFollow must write the follower somewhere');
  assert.ok(decision < write, 'the inbox decision must precede the follower write');
});
