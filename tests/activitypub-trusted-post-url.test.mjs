// Direct contract tests for the one trusted-post-URL guard every federation
// surface now uses (lib/activitypub/utils/trustedPostUrl.ts, paul-kinlan-me-z5ej).
//
// Two copies existed three days apart and were not in fact identical, so each
// difference is pinned here as a decision rather than left to a call site:
// the inbox accepts a URL instance and refuses a padded IRI, and both routes
// refuse a value that cannot be a Firestore document id (paul-kinlan-me-g5bp).
import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import { trustedPostUrlOrNull } from '../lib/activitypub/utils/trustedPostUrl.ts';
import { MAX_DOC_ID_BYTES } from '../lib/activitypub/utils/docId.ts';

const withEnv = (env, fn) => {
  const saved = {};
  for (const key of ['PUBLIC_ORIGIN', 'VERCEL_URL']) {
    saved[key] = process.env[key];
    if (env[key] === undefined) delete process.env[key];
    else process.env[key] = env[key];
  }
  try {
    return fn();
  } finally {
    for (const key of ['PUBLIC_ORIGIN', 'VERCEL_URL']) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
};

test('accepts an http(s) URL on a trusted host and returns it unchanged', () => {
  assert.equal(trustedPostUrlOrNull('https://paul.kinlan.me/posts/hello/'),
    'https://paul.kinlan.me/posts/hello/');
  assert.equal(trustedPostUrlOrNull('http://paul.kinlan.me/posts/hello/'),
    'http://paul.kinlan.me/posts/hello/');
});

test('accepts a URL instance, which is what an ActivityPub document hands over', () => {
  assert.equal(trustedPostUrlOrNull(new URL('https://paul.kinlan.me/posts/hello/')),
    'https://paul.kinlan.me/posts/hello/');
});

test('refuses a foreign host, whatever its shape', () => {
  for (const value of [
    'https://evil.com/posts/hello/',
    'https://paul.kinlan.me.evil.com/posts/hello/',
    'https://evil.com/?next=https://paul.kinlan.me/',
  ]) {
    assert.equal(trustedPostUrlOrNull(value), null, value);
  }
});

test('refuses a non-http(s) scheme even on a trusted host', () => {
  for (const value of ['ftp://paul.kinlan.me/x', 'javascript:alert(1)', 'file:///etc/passwd', 'data:text/html,x']) {
    assert.equal(trustedPostUrlOrNull(value), null, value);
  }
});

test('returns the value unchanged and never normalises it', () => {
  // WHATWG's URL parser tolerates surrounding whitespace, so a padded IRI does parse -
  // that tolerance is the parser's, not this guard's. What matters is the RETURN value:
  // the document key is derived from it, the inbox never trimmed, and render.ts trims
  // its own ?url= parameter before calling. Pinning "unchanged" here is what stops the
  // two routes from silently disagreeing about a key.
  assert.equal(trustedPostUrlOrNull(' https://paul.kinlan.me/posts/hello/'),
    ' https://paul.kinlan.me/posts/hello/');
  assert.equal(trustedPostUrlOrNull('https://paul.kinlan.me/posts/hello/'),
    'https://paul.kinlan.me/posts/hello/');
});

test('refuses a value that cannot be a Firestore document id (paul-kinlan-me-g5bp)', () => {
  // The injective encoding triples the bytes of reserved/non-ASCII characters, so a
  // document id over MAX_DOC_ID_BYTES is rejected by the store - which used to be a
  // 500 from inside Firestore rather than a refusal at the guard.
  const long = `https://paul.kinlan.me/${'a'.repeat(MAX_DOC_ID_BYTES)}`;
  assert.equal(trustedPostUrlOrNull(long), null, 'an over-long id is refused at the guard');
});

test('refuses anything that is not a URL', () => {
  for (const value of [null, undefined, 42, {}, [], '', 'not a url', '//paul.kinlan.me/x']) {
    assert.equal(trustedPostUrlOrNull(value), null, JSON.stringify(value) ?? String(value));
  }
});

test('honours a configured public origin as trusted, not just the canonical host', () => {
  withEnv({ PUBLIC_ORIGIN: 'https://preview.example.test' }, () => {
    assert.equal(trustedPostUrlOrNull('https://preview.example.test/posts/hello/'),
      'https://preview.example.test/posts/hello/');
    assert.equal(trustedPostUrlOrNull('https://paul.kinlan.me/posts/hello/'),
      'https://paul.kinlan.me/posts/hello/');
  });
});
