// The /ask-paul upstream request is built from visitor input, and it used to be
// built by string interpolation: the scheme came from the `x-forwarded-proto`
// request header and the raw query was pasted after `?query=`. A visitor could
// therefore pick the scheme, and a value containing `&`/`=` reached polymath as
// a second query parameter. This suite pins both halves of the contract - the
// URL builder (lib/ask-paul-request.js) and the target the real handler actually
// fetches (api/ask-paul.ts) - with the upstream stubbed, so nothing here touches
// the network and no paid polymath call is made.
//
// Run with: node --test tests/ask-paul-request.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { polymathUrl } from '../lib/ask-paul-request.js';

// ---------------------------------------------------------------------------
// The URL builder on its own: origin fixed, query one parameter.
// ---------------------------------------------------------------------------

test('keeps everything the visitor sent inside the query value', () => {
  const url = polymathUrl('x&extra=1');

  assert.equal(url.href, 'https://paul.kinlan.me/api/polymath.js?query=x%26extra%3D1');
  assert.deepEqual([...url.searchParams.keys()], ['query'], 'no parameter the visitor sent is added');
  assert.equal(url.searchParams.get('extra'), null, 'the injected parameter does not exist');
});

test('pins the origin to https on paul.kinlan.me whatever the query says', () => {
  for (const query of [
    'https://evil.example/#',
    '//evil.example/api/polymath.js',
    'http://paul.kinlan.me/api/polymath.js',
    '../../polymath'
  ]) {
    const url = polymathUrl(query);

    assert.equal(url.protocol, 'https:', `scheme pinned for ${query}`);
    assert.equal(url.host, 'paul.kinlan.me', `host pinned for ${query}`);
    assert.equal(url.pathname, '/api/polymath.js', `path pinned for ${query}`);
    assert.equal(url.searchParams.get('query'), query, `the query survives verbatim: ${query}`);
  }
});

test('round-trips hostile and non-ASCII queries unchanged', () => {
  for (const query of ['<script>alert(1)</script>', 'a b+c', 'a?b#c', 'ünïcode', '?query=x', '']) {
    assert.equal(polymathUrl(query).searchParams.get('query'), query, `round-trip: ${query}`);
  }
});

// ---------------------------------------------------------------------------
// The real handler, driven through the export the edge runtime gets.
// ---------------------------------------------------------------------------

const dir = mkdtempSync(join(tmpdir(), 'ask-paul-request-'));
const bundle = join(dir, 'handler.mjs');
execFileSync('node_modules/.bin/esbuild', [
  'api/ask-paul.ts', '--bundle', '--format=esm', '--platform=neutral', `--outfile=${bundle}`,
]);
const {
  default: handler,
  MAX_QUERY_CHARS,
  MAX_RESPONSE_BYTES,
  PolymathTooLargeError,
  boundQuery,
  readJsonCapped,
} = await import(pathToFileURL(bundle).href);
process.on('exit', () => rmSync(dir, { recursive: true, force: true }));

// The edge runtime hands the handler a Request and expects a Response back; the
// only observable of the outbound call that matters here is its target, so the
// upstream is stubbed and captured.
async function upstreamTargetFor({ query, proto }) {
  const originalFetch = globalThis.fetch;
  let called = null;
  const targets = [];
  globalThis.fetch = async (url) => {
    called = url;
    targets.push(String(url));
    return Response.json({ completion: 'Answer', infos: [] });
  };
  try {
    const search = query === undefined ? '' : `?${new URLSearchParams({ query })}`;
    const request = new Request(`https://example.com/ask-paul${search}`, {
      headers: proto === undefined ? {} : { 'x-forwarded-proto': proto },
    });
    const response = await handler(request);
    const html = await response.text();
    return { target: called, targets, response, html };
  } finally {
    globalThis.fetch = originalFetch;
  }
}

const parseTarget = (target) => {
  assert.ok(target, 'the handler made no upstream request');
  return new URL(String(target));
};

for (const [name, { query, proto }] of [
  // A visitor cannot send this header through a browser, but a browser is not
  // the only client: anything reaching the edge function can, and the old code
  // interpolated whatever arrived into the URL.
  ['a http proto header does not downgrade the scheme', { query: 'web intents', proto: 'http' }],
  ['a javascript proto header does not become the scheme', { query: 'web intents', proto: 'javascript' }],
  ['a hostile host in the proto header is ignored', { query: 'web intents', proto: 'https://evil.example' }],
]) {
  test(name, async () => {
    const { target, response, html } = await upstreamTargetFor({ query, proto });
    const url = parseTarget(target);

    assert.equal(url.protocol, 'https:');
    assert.equal(url.host, 'paul.kinlan.me');
    assert.equal(url.pathname, '/api/polymath.js');
    assert.equal(url.searchParams.get('query'), query);
    assert.equal(response.status, 200, 'a valid query still renders the page');
    assert.match(html, /<article class="completion">Answer<\/article>/);
  });
}

test('an injected separator stays one decoded query value', async () => {
  // `x&extra=1` arrives encoded, is decoded by URLSearchParams, and must be
  // re-encoded rather than pasted raw: the old interpolation turned this into
  // two upstream parameters, the second of which the visitor chose.
  const { target, targets, html } = await upstreamTargetFor({ query: 'x&extra=1', proto: 'http' });
  const url = parseTarget(target);

  assert.equal(String(target), 'https://paul.kinlan.me/api/polymath.js?query=x%26extra%3D1');
  assert.deepEqual([...url.searchParams.keys()], ['query'], 'exactly one upstream parameter');
  assert.equal(url.searchParams.get('query'), 'x&extra=1', 'the value is preserved, decoded');
  assert.equal(url.searchParams.get('extra'), null);
  assert.equal(targets.length, 1, 'one upstream request, not one per parameter');
  assert.match(html, /<article class="completion">Answer<\/article>/);
});

test('?, # and Unicode in the query never leave the query value', async () => {
  const query = 'a?b#c & ünïcode';

  for (const proto of ['http', 'https']) {
    const { target } = await upstreamTargetFor({ query, proto });
    const url = parseTarget(target);

    assert.equal(url.hash, '', 'no fragment on the upstream URL');
    assert.deepEqual([...url.searchParams.keys()], ['query']);
    assert.equal(url.searchParams.get('query'), query);
    assert.equal(String(target).split('#').length, 1, 'the raw target carries no fragment');
  }
});

test('a missing query keeps the documented default', async () => {
  const { target, html } = await upstreamTargetFor({});
  const url = parseTarget(target);

  assert.equal(String(target), 'https://paul.kinlan.me/api/polymath.js?query=What+are+Web+Intents%3F');
  assert.equal(url.searchParams.get('query'), 'What are Web Intents?');
  assert.match(html, /<title>Ask Paul: What are Web Intents\?<\/title>/);
});

test('a plain query keeps working end to end', async () => {
  const { target, response, html } = await upstreamTargetFor({ query: 'what are web intents', proto: 'https' });

  assert.equal(String(target), 'https://paul.kinlan.me/api/polymath.js?query=what+are+web+intents');
  assert.equal(response.headers.get('content-type'), 'text/html');
  assert.match(html, /value="what are web intents"/);
  assert.match(html, /<article class="completion">Answer<\/article>/);
});

// ---------------------------------------------------------------------------
// One request, two bounds (paul-kinlan-me-8qew): the query is truncated to a
// search box's length, and the upstream body is read under a hard byte cap.
// Both are asserted against the real handler with the upstream stubbed - the
// body cap in particular is only true if the transfer is actually cut short,
// so these tests observe the stream being cancelled rather than just the error.
// ---------------------------------------------------------------------------

const askRequest = (query) => new Request(
  query === undefined ? 'https://example.com/ask-paul'
    : `https://example.com/ask-paul?${new URLSearchParams({ query })}`
);

// Drive the handler with an arbitrary stubbed upstream response, capturing the
// target and letting a test hold a reference to the stream it supplied.
async function withUpstream({ response, query }, run) {
  const originalFetch = globalThis.fetch;
  const targets = [];
  globalThis.fetch = async (url) => {
    targets.push(String(url));
    return typeof response === 'function' ? response() : response;
  };
  try {
    const res = await handler(askRequest(query));
    return await run({ targets, response: res, html: await res.text() });
  } finally {
    globalThis.fetch = originalFetch;
  }
}

// A streaming upstream body whose pulls and cancellation are observable, so a
// cap that only post-checks a fully buffered body cannot pass these tests.
const streamedBody = (chunks, headers = {}) => {
  const state = { pulls: 0, cancelled: false };
  const stream = new ReadableStream({
    pull(controller) {
      if (state.pulls >= chunks.length) return controller.close();
      controller.enqueue(chunks[state.pulls++]);
    },
    cancel() { state.cancelled = true; },
  });
  return { state, response: new Response(stream, { headers }) };
};

const bytes = (text) => new TextEncoder().encode(text);

test('the query is truncated to the bound before it is displayed or forwarded', async () => {
  const long = 'a'.repeat(10_000);
  await withUpstream({ response: Response.json({ completion: 'Answer', infos: [] }), query: long }, async ({ targets, response, html }) => {
    const url = parseTarget(targets[0]);
    assert.equal(url.searchParams.get('query').length, MAX_QUERY_CHARS, 'the upstream query is bounded');
    assert.equal(url.searchParams.get('query'), 'a'.repeat(MAX_QUERY_CHARS));
    assert.equal(targets.length, 1);
    assert.equal(response.status, 200, 'an over-long query still answers instead of erroring');
    assert.ok(html.includes(`value="${'a'.repeat(MAX_QUERY_CHARS)}"`), 'the form shows what was actually asked');
    assert.ok(!html.includes('a'.repeat(MAX_QUERY_CHARS + 1)), 'nothing longer than the bound reaches the page');
  });
});

test('the bound is exactly the query length: 512 passes, 513 truncates', async () => {
  assert.equal(MAX_QUERY_CHARS, 512);
  assert.equal(boundQuery('b'.repeat(512)).length, 512);
  assert.equal(boundQuery('b'.repeat(513)).length, 512);
  assert.equal(boundQuery('short'), 'short');
  assert.equal(boundQuery(''), '');
});

test('truncation never splits a surrogate pair', async () => {
  // 511 code points, then one astral character straddling the 512th boundary.
  const query = 'a'.repeat(511) + '\u{1D306}' + 'b'.repeat(10);
  await withUpstream({ response: Response.json({ completion: 'Answer', infos: [] }), query }, async ({ targets, html }) => {
    const forwarded = parseTarget(targets[0]).searchParams.get('query');
    assert.equal([...forwarded].length, MAX_QUERY_CHARS, 'the bound counts code points');
    assert.ok(forwarded.endsWith('\u{1D306}'), 'the astral character survives whole');
    const last = forwarded.charCodeAt(forwarded.length - 1);
    assert.ok(!(last >= 0xD800 && last <= 0xDBFF), 'no lone high surrogate is left behind');
    assert.ok(html.includes('\u{1D306}'), 'the page carries the same well-formed value');
  });
});

test('an upstream body over the byte cap is cut short and reported, not buffered', async () => {
  const chunk = bytes('x'.repeat(64 * 1024));
  const chunks = Array.from({ length: 20 }, () => chunk); // 1.25 MB, over the 1 MB cap
  const { state, response } = streamedBody(chunks);
  await withUpstream({ response, query: 'web intents' }, async ({ response: res, html }) => {
    assert.equal(res.status, 200, 'the page itself still renders');
    assert.match(html, /<div class="error" role="alert">/);
    assert.match(html, /too large to display/, 'the visitor gets the too-large message');
    assert.ok(state.pulls < chunks.length, `the transfer stopped early (pulled ${state.pulls}/${chunks.length})`);
    assert.ok(state.cancelled, 'the upstream stream was cancelled after the cap');
  });
});

test('a declared Content-Length over the cap is refused before the body is read', async () => {
  // 20 chunks well over the cap: if the declared length were ignored, the reader
  // would stream them all. (`new Response(stream)` primes the source with one
  // pull of its own, so `pulls` starts at 1 rather than 0 - the assertion is
  // that the handler read nothing beyond that.)
  const chunk = bytes('x'.repeat(64 * 1024));
  const chunks = Array.from({ length: 20 }, () => chunk);
  const { state, response } = streamedBody(chunks, {
    'content-length': String(MAX_RESPONSE_BYTES + 1),
  });
  await withUpstream({ response, query: 'web intents' }, async ({ html }) => {
    assert.match(html, /too large to display/);
    assert.ok(state.pulls <= 1, `an over-cap declared length was not streamed (pulled ${state.pulls}/${chunks.length})`);
    assert.ok(state.cancelled, 'the stream was released');
  });
});

test('a body under the cap still parses, including when it arrives in pieces', async () => {
  const payload = JSON.stringify({ completion: 'Answer', infos: [] });
  const half = Math.floor(payload.length / 2);
  const { state, response } = streamedBody([bytes(payload.slice(0, half)), bytes(payload.slice(half))]);
  await withUpstream({ response, query: 'web intents' }, async ({ response: res, html }) => {
    assert.equal(state.cancelled, false, 'a body inside the cap is read to the end');
    assert.equal(res.status, 200);
    assert.match(html, /<article class="completion">Answer<\/article>/);
  });
});

test('readJsonCapped is the unit contract behind those two paths', async () => {
  const over = streamedBody([bytes('y'.repeat(MAX_RESPONSE_BYTES + 1))]);
  await assert.rejects(() => readJsonCapped(over.response), (error) => {
    assert.ok(error instanceof PolymathTooLargeError);
    assert.equal(error.message, 'Polymath response too large');
    return true;
  });
  assert.ok(over.state.cancelled, 'the over-cap stream is cancelled by the reader itself');
});
