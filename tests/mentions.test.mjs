// Regression tests for the WebMention renderer (api/mentions.js).
//
// webmention.io content is attacker-influenceable, so the renderer must never
// emit executable markup or a non-http(s) URL, however hostile the input is.
// Run with: node --test tests/mentions.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';

import { render, escapeHtml, safeUrl } from '../api/mentions.js';

const renderToText = async (items, pageUrl = 'https://paul.kinlan.me/') =>
  new Response(await render(items, pageUrl)).text();

// A mention carrying payloads in every field the template interpolates.
const hostileMention = {
  'wm-property': 'in-reply-to',
  url: 'javascript:window.__xss=1',
  author: {
    name: '"><img src=x onerror=window.__xss=2>',
    url: 'javascript:window.__xss=3',
    photo: 'data:image/svg+xml,<svg onload=window.__xss=4></svg>',
  },
  content: { text: '<script>window.__xss=5</script><img src=x onerror=window.__xss=6>' },
};

test('escapes HTML in mention text, names and the page url', async () => {
  const out = await renderToText([hostileMention], 'https://example.com/"><script>window.__xss=0</script>');

  // Everything emitted as real markup belongs to the template; a payload that
  // escaped its attribute would show up here as a new tag or an on* attribute.
  // Quoted values are blanked first, because anything *inside* a quoted value
  // (e.g. " onerror=..." in an alt text) is inert text, not an attribute.
  const tags = (out.match(/<[a-z][^>]*>/gi) || []).map((tag) => tag.replace(/"[^"]*"/g, '""'));
  for (const tag of tags) assert.ok(!/\son[a-z]+\s*=/i.test(tag), `no event handler injected into ${tag}`);

  assert.ok(!/<script/i.test(out), 'no raw <script tag in the response');
  assert.ok(!/<svg/i.test(out), 'no raw <svg element in the response');
  for (const attr of out.match(/(?:href|src)="[^"]*"/gi) || []) {
    assert.ok(!/(?:href|src)="\s*(?:javascript|data|vbscript|blob):/i.test(attr), `inert URL in ${attr}`);
  }
  assert.ok(out.includes('&lt;script&gt;window.__xss=5&lt;/script&gt;'), 'payload renders as inert text');
  assert.ok(out.includes('&quot;&gt;&lt;img'), 'author name is escaped inside its attribute');
  assert.ok(out.includes('Interactions with https://example.com/&quot;&gt;&lt;script&gt;'), 'page url is escaped in the title');
});

test('drops javascript: and data: URLs from href and src', async () => {
  const out = await renderToText([hostileMention]);

  assert.ok(!out.includes('javascript:'), 'no javascript: URL survives');
  assert.ok(!out.includes('data:image/svg'), 'no data: URL survives in src');
  assert.ok(out.includes('href=""'), 'rejected URLs render as an empty (inert) href');
});

test('keeps well-formed http(s) links and escapes their attributes', async () => {
  const out = await renderToText([{
    'wm-property': 'like-of',
    url: 'https://example.com/post',
    author: {
      name: 'A & B "quoted"',
      url: 'https://example.com/@a?x=1&y=2',
      photo: 'https://example.com/a.png?w=32&h=32',
    },
  }]);

  assert.ok(out.includes('href="https://example.com/@a?x=1&amp;y=2"'), 'http(s) author URL preserved and escaped');
  assert.ok(out.includes('src="https://example.com/a.png?w=32&amp;h=32"'), 'http(s) photo URL preserved and escaped');
  assert.ok(out.includes('alt="A &amp; B &quot;quoted&quot;"'), 'name escaped inside the attribute');
});

test('uses the mention url, not the author url, for comment links', async () => {
  const out = await renderToText([{
    'wm-property': 'mention-of',
    url: 'https://example.com/reply',
    author: { name: 'Someone', url: 'https://example.com/@someone', photo: 'https://example.com/s.png' },
    content: { text: 'hello' },
  }]);

  assert.ok(out.includes('href="https://example.com/reply"'), 'comment link points at the mention url');
});

test('tolerates missing and malformed items without throwing', async () => {
  for (const items of [undefined, null, [], 'nope', [{}], [{ 'wm-property': 'in-reply-to' }]]) {
    const out = await renderToText(items);
    assert.ok(out.includes('Comments and Replies'), `render survived ${JSON.stringify(items)}`);
  }
});

test('escapeHtml and safeUrl behave as the renderer depends on them', () => {
  assert.equal(escapeHtml(null), '');
  assert.equal(escapeHtml('<a href="x">&\'</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;');
  assert.equal(safeUrl('  https://example.com/a b '), 'https://example.com/a%20b');
  assert.equal(safeUrl('HTTPS://example.com/'), 'https://example.com/');
  assert.equal(safeUrl('javascript:alert(1)'), '');
  assert.equal(safeUrl('\njavascript:alert(1)'), '');
  assert.equal(safeUrl('JaVaScRiPt:alert(1)'), '');
  assert.equal(safeUrl('vbscript:msgbox(1)'), '');
  assert.equal(safeUrl('//example.com/x'), '');
  assert.equal(safeUrl('not a url'), '');
  assert.equal(safeUrl(''), '');
});
