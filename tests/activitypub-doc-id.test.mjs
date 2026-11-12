// Unit tests for lib/activitypub/utils/docId.ts (paul-kinlan-me-je6t).
//
// The Firestore document id for a URL-keyed record used to be the URL with
// every '/' swapped for '_', which is NOT injective: 'https://host/a/b' and
// 'https://host/a_b' collided onto one document, so two distinct pages (or two
// distinct peer activity ids) shared one interaction record. New writes use
// the injective encodeURIComponent encoding; the legacy one is retained for
// dual-reads only. Structural - no I/O, no Firestore.
// Run with: node --test tests/activitypub-doc-id.test.mjs
import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import { docIdForUrl, legacyDocIdForUrl } from '../lib/activitypub/utils/docId.ts';

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
    assert.ok(!id.includes('/'), `a document id must not contain '/' (got ${id})`);
    assert.ok(Buffer.byteLength(id) < 1500, 'Firestore document ids are limited to 1500 bytes');
    assert.equal(decodeURIComponent(id), url, 'the encoding is reversible');
  }
});

test('legacyDocIdForUrl reproduces the pre-je6t encoding exactly', () => {
  assert.equal(legacyDocIdForUrl('https://paul.kinlan.me/a-post'), 'https:__paul.kinlan.me_a-post');
  assert.equal(legacyDocIdForUrl('https://remote.example/likes/1'), 'https:__remote.example_likes_1');
});

test('both helpers are total on any string', () => {
  // The routes only pass absolute http(s) URLs, but the helpers must still be
  // total functions of their input.
  assert.equal(typeof docIdForUrl(''), 'string');
  assert.equal(typeof legacyDocIdForUrl(''), 'string');
});
