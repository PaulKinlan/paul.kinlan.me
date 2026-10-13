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
const { default: handler } = await import(pathToFileURL(bundle).href);
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
