// Unit tests for lib/activitypub/utils/docId.ts (paul-kinlan-me-je6t,
// paul-kinlan-me-g5bp).
//
// The Firestore document id for a URL-keyed record used to be the URL with
// every '/' swapped for '_', which is NOT injective: 'https://host/a/b' and
// 'https://host/a_b' collided onto one document, so two distinct pages (or two
// distinct peer activity ids) shared one interaction record. New writes use
// the injective encodeURIComponent encoding; the legacy one is retained for
// dual-reads only. The injective encoding expands bytes, so the guards also
// bound the id to what Firestore accepts. Structural - no I/O, no Firestore.
// Run with: node --test tests/activitypub-doc-id.test.mjs
import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import {
  docIdForUrl,
  docIdsForUrl,
  isStorableDocIdUrl,
  legacyDocIdForUrl,
  MAX_DOC_ID_BYTES,
} from '../lib/activitypub/utils/docId.ts';

const bytes = (value) => new TextEncoder().encode(value).length;

test('the new encoding is injective on the pairs the legacy one collapsed', () => {
  const collisions = [
    ['https://paul.kinlan.me/a/b', 'https://paul.kinlan.me/a_b'],
    ['https://paul.kinlan.me/a_b', 'https://paul.kinlan.me/a/b'],
    ['https://remote.example/likes/1_2', 'https://remote.example/likes/1/2'],
  ];
  for (const [a, b] of collisions) {
    assert.equal(legacyDocIdForUrl(a), legacyDocIdForUrl(b),
      `precondition: ${a} and ${b} really did collide under the legacy encoding`);
    assert.notEqual(docIdForUrl(a), docIdForUrl(b),
      `${a} and ${b} must map to distinct document ids`);
  }
});

test('the new encoding is Firestore-safe and reversible', () => {
  for (const url of [
    'https://paul.kinlan.me/a-post',
    'https://paul.kinlan.me/2026/11/12/some-post/?utm=x#frag',
    'https://remote.example/users/al ey/likes/1',
  ]) {
    const id = docIdForUrl(url);
    assert.ok(typeof id === 'string' && id.length > 0);
    assert.ok(!id.includes('/'), `a document id must not contain '/' (got ${id})`);
    assert.ok(bytes(id) <= MAX_DOC_ID_BYTES, 'the id is inside the store limit');
    assert.equal(decodeURIComponent(id), url, 'the encoding is reversible');
  }
});

test('legacyDocIdForUrl reproduces the pre-je6t encoding exactly', () => {
  assert.equal(legacyDocIdForUrl('https://paul.kinlan.me/a-post'), 'https:__paul.kinlan.me_a-post');
  assert.equal(legacyDocIdForUrl('https://remote.example/likes/1'), 'https:__remote.example_likes_1');
});

// g5bp: the injective encoding triples the bytes of non-ASCII and reserved
// characters, so a peer-chosen id that the legacy encoding stored cleanly can
// exceed Firestore's 1500-byte id limit. The guards use this predicate to
// ignore such a value (200, nothing written) instead of 500ing on the write.
test('isStorableDocIdUrl refuses an id the store would reject, and accepts a normal one', () => {
  assert.equal(isStorableDocIdUrl('https://paul.kinlan.me/a-post'), true);
  assert.equal(isStorableDocIdUrl('https://remote.example/likes/1'), true);

  const longNonAscii = `https://remote.example/likes/${'\u00e9'.repeat(400)}`;
  assert.equal(bytes(legacyDocIdForUrl(longNonAscii)) <= MAX_DOC_ID_BYTES, true,
    'precondition: the legacy id fitted the store, which is why this used to store cleanly');
  assert.equal(bytes(docIdForUrl(longNonAscii)) > MAX_DOC_ID_BYTES, true,
    'precondition: the injective id does not fit');
  assert.equal(isStorableDocIdUrl(longNonAscii), false, 'so the guard must refuse it');

  // A plain ASCII page URL of the same length stays storable.
  const longAscii = `https://paul.kinlan.me/${'a'.repeat(600)}`;
  assert.equal(isStorableDocIdUrl(longAscii), true);
});

// The helpers are total: a lone surrogate (reachable by JSON.parse of a body
// containing "\ud800") makes encodeURIComponent throw URIError, and a value
// with no storable id must be reported, never raised at a peer.
test('both helpers are total on any string, including a lone surrogate', () => {
  assert.equal(docIdForUrl(''), '');
  assert.equal(legacyDocIdForUrl(''), '');
  assert.equal(docIdForUrl('https://x/\ud800'), null);
  assert.equal(legacyDocIdForUrl('https://x/\ud800'), null);
  assert.equal(isStorableDocIdUrl('https://x/\ud800'), false);
  assert.deepEqual(docIdsForUrl('https://x/\ud800'), { injective: null, legacy: null });
  assert.deepEqual(docIdsForUrl('https://paul.kinlan.me/a-post'), {
    injective: 'https%3A%2F%2Fpaul.kinlan.me%2Fa-post',
    legacy: 'https:__paul.kinlan.me_a-post',
  });
});
