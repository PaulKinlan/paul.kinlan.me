// Regression tests for the WebMention endpoint (api/mentions.js).
//
// webmention.io content is attacker-influenceable, so the renderer must never
// emit executable markup or a non-http(s) URL, however hostile the input is. And
// the query the endpoint builds for webmention.io comes from the request, so a
// crafted `url`/`count` must not be able to move that request somewhere else.
// Run with: node --test tests/mentions.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PassThrough } from 'node:stream';
import { once } from 'node:events';

import { render, escapeHtml, safeUrl, createMentionsHandler } from '../api/mentions.js';

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

// ---------------------------------------------------------------------------
// The handler: what it sends upstream, and what it answers when it cannot.
// The upstream transport is a parameter, so none of these tests touch the
// network.

// A PassThrough stands in for the Vercel response: the handler both res.end()s
// and pipes a stream into it, and both have to be observable.
const mockResponse = () => {
  const res = new PassThrough();
  const chunks = [];
  res.statusCode = 0;
  res.headers = {};
  res.setHeader = (name, value) => { res.headers[name.toLowerCase()] = value; };
  res.on('data', (chunk) => chunks.push(chunk));
  res.text = () => Buffer.concat(chunks).toString('utf8');
  return res;
};

const mentionsBody = (children = []) => new Response(JSON.stringify({ children }), {
  status: 200,
  headers: { 'content-type': 'application/json' }
});

// Records every URL the handler asks the transport for.
const stubTransport = (respond) => {
  const calls = [];
  return {
    calls,
    fetch: async (url, init) => { calls.push({ url: String(url), init }); return respond(url); }
  };
};

const runHandler = async (transport, req = {}) => {
  const res = mockResponse();
  // Attached before the handler runs: a fast handler can finish before a later
  // await would get to listen.
  const finished = once(res, 'finish');
  await createMentionsHandler(transport.fetch)(req, res);
  await finished;
  return res;
};

test('asks upstream for an encoded query under the fixed path', async () => {
  const transport = stubTransport(() => mentionsBody());
  const res = await runHandler(transport, {
    query: { url: 'https://paul.kinlan.me/a post?x=1&per-page=100000&target=evil#frag', count: '50' },
    headers: {}
  });

  assert.equal(res.statusCode, 200);
  const sent = new URL(transport.calls[0].url);
  assert.equal(sent.origin + sent.pathname, 'https://webmention.io/api/mentions.jf2');
  // Exactly two parameters, whatever was in the values: `&`, `?` and `#` in a
  // crafted target are percent-encoded, so they cannot add a parameter or
  // truncate the query.
  assert.deepEqual([...sent.searchParams.keys()], ['per-page', 'target']);
  assert.equal(sent.searchParams.get('per-page'), '50');
  // The value arrives decoded, and the parsed form (a%20post) is what was sent.
  assert.equal(sent.searchParams.get('target'),
    'https://paul.kinlan.me/a%20post?x=1&per-page=100000&target=evil#frag');
});

test('prefers a valid Referer, but keeps it inside the target parameter', async () => {
  const transport = stubTransport(() => mentionsBody());
  await runHandler(transport, {
    query: { url: 'https://paul.kinlan.me/post/' },
    headers: { referer: 'https://example.com/embed?per-page=999&target=x' }
  });

  const sent = new URL(transport.calls[0].url);
  assert.deepEqual([...sent.searchParams.keys()], ['per-page', 'target']);
  assert.equal(sent.searchParams.get('target'), 'https://example.com/embed?per-page=999&target=x');
  assert.equal(sent.searchParams.get('per-page'), '200', 'the Referer must not set the page size');
});

test('drops a Referer it cannot parse instead of forwarding it', async () => {
  for (const referer of ['not a url', 'javascript:alert(1)', '', '//evil.example/']) {
    const transport = stubTransport(() => mentionsBody());
    await runHandler(transport, { query: { url: 'https://paul.kinlan.me/post/' }, headers: { referer } });
    assert.equal(new URL(transport.calls[0].url).searchParams.get('target'),
      'https://paul.kinlan.me/post/', referer);
  }
});

test('a request with no query at all still answers, using the documented default', async () => {
  const transport = stubTransport(() => mentionsBody([
    { 'wm-property': 'like-of', url: 'https://example.com/p', author: { name: 'A', url: 'https://example.com/@a', photo: 'https://example.com/a.png' } }
  ]));
  const res = await runHandler(transport, {});

  assert.equal(res.statusCode, 200);
  assert.equal(new URL(transport.calls[0].url).searchParams.get('target'), 'https://paul.kinlan.me/');
  assert.ok(res.text().includes('Likes and bookmarks'), 'the page still renders mentions');
});

// The body of this endpoint is a function of the target and the page size. `url`
// and `count` are in the URL, but the target can also come from the Referer
// header, so the same URL can need two different bodies. A shared cache keyed on
// the URL served the first caller's block to everyone after it (paul-kinlan-me-cz8),
// which is what these two tests pin: the header never claims a body is publicly
// cacheable when it was built from a header.
test('one embed cannot pin the block another visitor of the same URL receives', async () => {
  const pageURL = 'https://paul.kinlan.me/post/';
  const cacheURL = `https://paul.kinlan.me/api/mentions?url=${encodeURIComponent(pageURL)}`;
  // The renderer names the target it rendered, so which body a visitor received
  // is visible in the HTML. Each target gets its own upstream answer.
  const transport = stubTransport((url) => {
    const target = new URL(url).searchParams.get('target');
    const host = new URL(target).host;
    return mentionsBody([{ 'wm-property': 'mention-of', url: `https://${host}/reply`,
      author: { name: `author-of-${host}` } }]);
  });

  // A shared cache that keys on the URL alone - the worst case, and what any edge
  // cache does when it ignores Vary. It stores what the handler says is publicly
  // cacheable, which is the only thing the handler controls.
  const sharedCache = new Map();
  const visit = async (referer) => {
    if (sharedCache.has(cacheURL)) return sharedCache.get(cacheURL);
    const res = await runHandler(transport, { query: { url: pageURL }, headers: { referer } });
    const body = res.text();
    if (String(res.headers['cache-control']).includes('s-maxage=')) sharedCache.set(cacheURL, body);
    return body;
  };

  const alice = await visit('https://alice.example/her-page');
  const bob = await visit('https://bob.example/his-page');

  assert.ok(alice.includes('author-of-alice.example'), 'alice sees the block for her own page');
  assert.ok(bob.includes('author-of-bob.example'),
    `bob must see the block for his own page, not alice's (got: ${bob})`);
  assert.ok(!bob.includes('author-of-alice.example'), 'bob must not receive the block alice made cached');
  assert.equal(transport.calls.length, 2, 'a header-dependent answer is not served from a URL-keyed cache');
});

test('only a body the URL fully determines is publicly cacheable', async () => {
  const pageURL = 'https://paul.kinlan.me/post/';
  const cases = [
    ['url only', { query: { url: pageURL }, headers: {} }, 'public'],
    ['url and an agreeing referer', { query: { url: pageURL }, headers: { referer: pageURL } }, 'public'],
    ['url and a different referer', { query: { url: pageURL }, headers: { referer: 'https://alice.example/her-page' } }, 'private'],
    ['referer only', { headers: { referer: 'https://alice.example/her-page' } }, 'private'],
    ['default target only', {}, 'public']
  ];

  for (const [label, req, expected] of cases) {
    const transport = stubTransport(() => mentionsBody());
    const res = await runHandler(transport, req);
    const cacheControl = String(res.headers['cache-control']);
    assert.equal(res.statusCode, 200, label);
    assert.ok(cacheControl.startsWith(expected), `${label}: ${cacheControl}`);
    if (expected === 'private') {
      // A body built from a header must not be storable by ANY cache, whatever it
      // does with Vary, and `Vary: Referer` alone is not a repair: Referer is
      // unbounded caller input, so keying on it lets an embedder mint entries.
      assert.ok(cacheControl.includes('no-store'), `${label} must not be stored: ${cacheControl}`);
      assert.equal(res.headers.vary, 'Referer', label);
    } else {
      assert.ok(cacheControl.includes('s-maxage=43200'), `${label} keeps the 12-hour cache: ${cacheControl}`);
      assert.equal(res.headers.vary, undefined, `${label} must not split the cache on a header it ignores`);
    }
  }
});

test('answers 400 for a url that cannot be a webmention target, and contacts nothing', async () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,x', '//evil.example/', 'not a url', '', '   ', '/relative']) {
    const transport = stubTransport(() => mentionsBody());
    const res = await runHandler(transport, { query: { url }, headers: {} });
    assert.equal(res.statusCode, 400, `?url=${JSON.stringify(url)}`);
    assert.deepEqual(transport.calls, [], `?url=${JSON.stringify(url)} must not reach webmention.io`);
  }
});

test('considers only the first value of a repeated url', async () => {
  const transport = stubTransport(() => mentionsBody());
  const res = await runHandler(transport, { query: { url: ['https://a.example/', 'https://b.example/'] }, headers: {} });
  assert.equal(res.statusCode, 200);
  assert.equal(new URL(transport.calls[0].url).searchParams.get('target'), 'https://a.example/');
});

test('answers 400 for a count that is not a page size upstream accepts', async () => {
  for (const count of ['0', '1001', '-1', '2e3', '0x10', '200.5', 'abc', '', { toString: () => '5' }]) {
    const transport = stubTransport(() => mentionsBody());
    const res = await runHandler(transport, { query: { url: 'https://paul.kinlan.me/post/', count }, headers: {} });
    assert.equal(res.statusCode, 400, `?count=${JSON.stringify(count)}`);
    assert.deepEqual(transport.calls, []);
  }
});

test('considers only the first value of a repeated count', async () => {
  const transport = stubTransport(() => mentionsBody());
  const res = await runHandler(transport, { query: { url: 'https://paul.kinlan.me/post/', count: ['5', '1000000'] }, headers: {} });
  assert.equal(res.statusCode, 200);
  assert.equal(new URL(transport.calls[0].url).searchParams.get('per-page'), '5');
});

test('answers 502, never 500, when upstream does not answer with a mentions document', async () => {
  for (const respond of [
    () => new Response('<html>upstream error</html>', { status: 200 }),
    () => new Response('', { status: 502 }),
    () => new Response(JSON.stringify({ children: 'not an array' }), { status: 200 }),
    () => new Response(JSON.stringify(null), { status: 200 }),
    () => { throw new Error('ECONNRESET'); }
  ]) {
    const transport = stubTransport(respond);
    const res = await runHandler(transport, { query: { url: 'https://paul.kinlan.me/post/' }, headers: {} });
    assert.equal(res.statusCode, 502);
    // Failing closed means a body, and it must not carry the upstream error text.
    assert.ok(!res.text().includes('upstream error'));
  }
});

test('the upstream request goes through the one guarded transport', async () => {
  // ADR paul-kinlan-me-9oi bans a raw fetch() on this surface. webmention.io is a
  // fixed public host, so guardedFetch accepts it; a direct fetch() would skip
  // the address checks the next fix lands in.
  const source = await readFile(new URL('../api/mentions.js', import.meta.url), 'utf8');
  assert.ok(source.includes("import { guardedFetch } from '../lib/activitypub/utils/guardedFetch.js'"),
    'api/mentions.js must import guardedFetch');
  assert.ok(!source.includes("from 'node-fetch'"), 'no raw node-fetch import');
  assert.ok(!/[^\w.]fetch\(/.test(source),
    'no direct fetch() call: the only call is the injected fetchImpl()');
});

test('the escaping helpers are the shared implementation, not a second copy', async () => {
  // paul-kinlan-me-dmo: this file carried a byte-identical copy of ESCAPES,
  // escapeHtml and safeUrl, so a fix to one renderer's rules could silently miss
  // the other. Pin both halves of the dedupe: the exported helpers are the very
  // same function objects as lib/escape.js's, and this module imports them rather
  // than defining them. The hostile-input tests above then exercise the shared
  // code path through the real renderer, not a copy of it.
  const shared = await import('../lib/escape.js');
  assert.equal(escapeHtml, shared.escapeHtml, 'escapeHtml must be lib/escape.js');
  assert.equal(safeUrl, shared.safeUrl, 'safeUrl must be lib/escape.js');

  const source = await readFile(new URL('../api/mentions.js', import.meta.url), 'utf8');
  assert.ok(source.includes("import { escapeHtml, safeUrl } from '../lib/escape.js'"),
    'api/mentions.js must import the shared helpers');
  assert.ok(!/const ESCAPES\s*=/.test(source), 'no second copy of the escape table');
  // The scheme check that builds the upstream webmention.io request returns null on a
  // rejection (`parsed.protocol` at mentions.js:138) rather than '', which is a different
  // contract from safeUrl's, so it is deliberately left alone.
});
