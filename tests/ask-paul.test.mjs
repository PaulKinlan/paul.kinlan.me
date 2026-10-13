// Regression tests for the /ask-paul answer renderer (lib/ask-paul-answer.js,
// rendered by api/ask-paul.ts).
//
// The completion comes from a language model and the links come from a vector
// store, so neither is trusted: whatever they return must reach the browser as
// inert text, never as markup or as an executable URL.
// Run with: node --test tests/ask-paul.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';

import { renderAnswer } from '../lib/ask-paul-answer.js';
import { escapeHtml, safeUrl } from '../lib/escape.js';

// An answer carrying payloads in every field the renderer interpolates.
const hostileAnswer = {
  completion: '<script>window.__xss=1</script><img src=x onerror=window.__xss=2>',
  infos: [
    { url: 'javascript:window.__xss=3', title: '"><img src=x onerror=window.__xss=4>' },
    { url: 'data:text/html,<svg onload=window.__xss=5></svg>', title: '<svg onload=window.__xss=6></svg>' },
  ],
};

// Everything emitted as real markup belongs to the renderer; a payload that
// escaped its attribute would show up here as a new tag or an on* attribute.
// Quoted values are blanked first, because anything *inside* a quoted value
// (e.g. `" onerror=...` in a link title) is inert text, not an attribute.
const tagsOf = (out) => (out.match(/<[a-z][^>]*>/gi) || []).map((tag) => tag.replace(/"[^"]*"/g, '""'));

test('escapes the model completion instead of emitting markup', () => {
  const out = renderAnswer(hostileAnswer);

  assert.ok(!/<script/i.test(out), 'no raw <script tag in the output');
  assert.ok(!/<img/i.test(out), 'no raw <img element in the output');
  assert.ok(
    out.includes('&lt;script&gt;window.__xss=1&lt;/script&gt;'),
    'the completion renders as inert text'
  );
  assert.ok(out.includes('<article class="completion">'), 'the completion keeps its element');
});

test('escapes link titles and drops non-http(s) URLs', () => {
  const out = renderAnswer(hostileAnswer);

  assert.ok(!/<svg/i.test(out), 'no raw <svg element in the output');
  for (const tag of tagsOf(out)) {
    assert.ok(!/\son[a-z]+\s*=/i.test(tag), `no event handler injected into ${tag}`);
  }
  assert.ok(!/(?:href|src)="\s*(?:javascript|data|vbscript|blob):/i.test(out), 'no executable URL survives');
  assert.ok(out.includes('&lt;svg onload=window.__xss=6&gt;'), 'the hostile title renders as inert text');
  assert.ok(!out.includes('<a href='), 'a rejected URL leaves nothing to link to, so no anchor at all');
});

test('keeps well-formed http(s) links and escapes their attributes', () => {
  const out = renderAnswer({
    completion: 'A && B',
    infos: [{ url: 'https://example.com/a?x=1&y=2', title: 'A & B "quoted"' }],
  });

  assert.ok(out.includes('href="https://example.com/a?x=1&amp;y=2"'), 'http(s) link preserved and escaped');
  assert.ok(out.includes('>A &amp; B &quot;quoted&quot;</a>'), 'title escaped and used as link text');
  assert.ok(out.includes('A &amp;&amp; B'), 'completion ampersands escaped');
});

test('falls back to the escaped URL when a link has no title', () => {
  const out = renderAnswer({ infos: [{ url: 'https://example.com/a?x=1&y=2' }] });

  assert.ok(out.includes('href="https://example.com/a?x=1&amp;y=2"'), 'link kept');
  assert.ok(out.includes('>https://example.com/a?x=1&amp;y=2</a>'), 'URL is the link text, escaped');
});

test('keeps the page shape the stylesheet depends on', () => {
  const out = renderAnswer({ completion: 'hello', infos: [] });

  assert.ok(out.includes('<div class="results"><h2>Links</h2>'), 'results block kept');
  assert.ok(!out.includes('<style>'), 'the page settles the loader for both success and failure');
});

test('tolerates missing and malformed payloads without throwing', () => {
  const payloads = [
    undefined,
    null,
    {},
    'nope',
    { completion: null, infos: null },
    { infos: 'nope' },
    { infos: [{}] },
    { infos: [null, { url: 'https://example.com/ok' }] },
    { completion: 42, infos: [{ url: 7, title: { toString: () => '<b>x</b>' } }] },
  ];

  for (const payload of payloads) {
    const out = renderAnswer(payload);
    assert.ok(out.includes('Links'), `renderAnswer survived ${JSON.stringify(payload)}`);
    for (const tag of tagsOf(out)) {
      assert.ok(!/\son[a-z]+\s*=/i.test(tag), `no event handler injected into ${tag}`);
    }
  }
});

test('the shared primitives behave as this renderer depends on them', () => {
  assert.equal(escapeHtml('"><img src=x onerror=alert(1)>'), '&quot;&gt;&lt;img src=x onerror=alert(1)&gt;');
  assert.equal(safeUrl('javascript:alert(1)'), '');
  assert.equal(safeUrl('JaVaScRiPt:alert(1)'), '');
  assert.equal(safeUrl('data:text/html,<b>x</b>'), '');
  assert.equal(safeUrl('  https://example.com/a b '), 'https://example.com/a%20b');
  assert.equal(safeUrl(undefined), '');
});
