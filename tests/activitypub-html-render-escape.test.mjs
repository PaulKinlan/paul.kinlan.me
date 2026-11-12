// The federation interactions renderer (api/activitypub-html/render.ts) draws
// stored likes/announces/replies whose actor names, profile URLs and icons a
// remote server controls, so it follows the same two security rules as
// lib/escape.js and api/mentions.js:
//   1. escapeHtml every interpolated text value - all five HTML-significant
//      characters (a local copy of the helper used to miss &, so ampersands
//      went into the HTML unescaped);
//   2. safeUrl anything that becomes an href or src, dropping every scheme
//      except http(s), so a federated `javascript:` or `data:` URL renders
//      inert instead of becoming an executable anchor on this domain.
// The handler is TypeScript and initialises firebase-admin at import time, so
// it is bundled with esbuild and stubbed through globalThis, the same way
// tests/handler-input-hardening.test.mjs drives it. Nothing here touches the
// network or a browser. Run with: node --test tests/activitypub-html-render-escape.test.mjs
import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

import { build } from 'esbuild';

const FIRESTORE_STUB = `
export default {
  apps: [true],
  firestore: () => ({
    collection: (name) => ({
      doc: () => ({
        collection: () => ({
          get: async () => {
            globalThis.__renderEscape?.events?.push('enter:' + name);
            if (globalThis.__renderEscape?.failCollection === name) {
              throw new Error('transient firestore failure');
            }
            await new Promise((resolve) => setTimeout(resolve, 5));
            globalThis.__renderEscape?.events?.push('exit:' + name);
            return globalThis.__renderEscape.snapshot(name);
          }
        })
      })
    })
  })
};
`;

const STUBS = {
  '@vercel/node': 'export {};',
  // The admission budget (paul-kinlan-me-stn4) is exercised with a real fake in
  // tests/activitypub-html-render-admission.test.mjs; these tests are about the
  // markup, so the stub admits every request.
  '@vercel/kv': 'export const kv = { eval: async () => [1] };',
  'firebase-admin': FIRESTORE_STUB
};

const buildHandler = async () => {
  const dir = mkdtempSync(join(tmpdir(), 'render-escape-'));
  const built = await build({
    entryPoints: [new URL('../api/activitypub-html/render.ts', import.meta.url).pathname],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
    logLevel: 'silent',
    plugins: [{
      name: 'render-escape-stubs',
      setup(plugin) {
        plugin.onResolve({ filter: /^(@vercel\/node|@vercel\/kv|firebase-admin)$/ }, (args) => (
          { path: args.path, namespace: 'stub' }
        ));
        plugin.onLoad({ filter: /.*/, namespace: 'stub' },
          ({ path }) => ({ loader: 'js', contents: STUBS[path] }));
      }
    }]
  });
  const file = join(dir, 'handler.mjs');
  writeFileSync(file, built.outputFiles[0].contents);
  const { default: handler } = await import(`file://${file}`);
  return { handler, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
};

const mockResponse = () => ({
  statusCode: 0,
  headers: {},
  ends: 0,
  setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
  status(code) { this.statusCode = code; return { end: (body) => this.end(body) }; },
  end(body) { this.ends += 1; this.body = body; return this; }
});

// One snapshot for every collection: likes / announces / replies all render the
// same hostile actor, so a single render exercises all three sections.
const useDocs = (docs) => {
  globalThis.__renderEscape = { snapshot: () => ({ size: docs.length, docs: docs.map((data) => ({ data: () => data })) }) };
};

const renderPage = async (handler, url = 'https://paul.kinlan.me/post/') => {
  const res = mockResponse();
  await handler({ query: { url }, method: 'GET' }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.ends, 1, 'exactly one response');
  return String(res.body);
};

test('federated actor URLs never become javascript:/data: href or src', async () => {
  const { handler, cleanup } = await buildHandler();
  try {
    useDocs([
      // Object actor: every URL field carries an executing payload.
      { actor: { name: 'x"><img src=x onerror=__xss=1>', url: 'javascript:__xss=2', icon: { url: 'data:image/svg+xml,<svg onload=__xss=3></svg>' } } },
      // String actor: a bare javascript: URL used to be both the href and the text.
      { actor: 'javascript:__xss=4' },
      // Control: a real actor on a real https profile still renders a link.
      { actor: { name: 'Alex', url: 'https://remote.example/users/alex', icon: { url: 'https://remote.example/alex.png' } } }
    ]);
    const page = await renderPage(handler);

    // No href/src in the markup carries a non-http(s) scheme. The payloads do
    // appear on the page, but only as inert visible text (asserted below).
    const attrs = [...page.matchAll(/\b(?:href|src)="([^"]*)"/g)].map((m) => m[1]);
    assert.ok(attrs.length >= 4, `expected the actors to render links (found ${attrs.length})`);
    for (const u of attrs) {
      assert.ok(u === '' || /^https?:\/\//i.test(u), `non-http(s) URL emitted: ${u}`);
    }

    // They render inert: empty href/src, and the string actor keeps its text.
    assert.ok(page.includes('href=""'), 'unsafe actor.url must drop to an empty href');
    assert.ok(page.includes('src=""'), 'unsafe icon.url must drop to an empty src');
    assert.ok(page.includes('javascript:__xss=4</a>'), 'a string actor is still rendered as visible text');

    // The control actor keeps working links and a working image - internal
    // (same-origin) and external https profiles are both allowed; only the
    // scheme is restricted, never the host.
    assert.ok(page.includes('href="https://remote.example/users/alex"'), 'a valid https profile URL must survive');
    assert.ok(page.includes('src="https://remote.example/alex.png"'), 'a valid https icon URL must survive');
  } finally {
    cleanup();
    delete globalThis.__renderEscape;
  }
});

test('safeUrl rejects control chars, embedded newlines, protocol-relative and relative URLs; internal https is allowed', async () => {
  const { handler, cleanup } = await buildHandler();
  try {
    useDocs([
      { actor: { name: 'tab', url: 'java\tscript:__xss=1' } },
      { actor: { name: 'newline', url: 'java\nscript:__xss=2' } },
      { actor: { name: 'nul', url: '\u0000javascript:__xss=3' } },
      { actor: { name: 'c1', url: 'jav\u0001ascript:__xss=4' } },
      { actor: { name: 'cased', url: 'JaVaScRiPt:__xss=5' } },
      { actor: { name: 'vbs', url: 'vbscript:__xss=6' } },
      { actor: { name: 'protrel', url: '//evil.example/x' } },
      { actor: { name: 'rel', url: '/relative/path' } },
      { actor: { name: 'internal', url: 'https://paul.kinlan.me/about' } }
    ]);
    const page = await renderPage(handler);

    const attrs = [...page.matchAll(/\b(?:href|src)="([^"]*)"/g)].map((m) => m[1]);
    for (const u of attrs) {
      assert.ok(u === '' || /^https?:\/\//i.test(u), `non-http(s) URL emitted: ${u}`);
    }
    // Eight hostile URLs dropped per section, the internal https one survived.
    // (Object actors without an icon also contribute legitimate src="" - the
    // exact count is not the contract; the scheme loop above is.)
    assert.ok(attrs.includes(''), 'hostile URLs must drop to empty attributes');
    assert.ok(!/[\s]="(?:javascript|vbscript|data):/.test(page), 'no hostile scheme in any attribute');
    assert.ok(page.includes('href="https://paul.kinlan.me/about"'), 'an internal https href is allowed like any other http(s) URL');
    assert.ok(!/[<]script/i.test(page), 'no raw script tag may appear anywhere in the markup');
  } finally {
    cleanup();
    delete globalThis.__renderEscape;
  }
});

// Edge-cache + admission contract (paul-kinlan-me-n4x7, with findings av9o/
// x216/stn4): the 200 page is a pure function of the validated ?url=, so it
// carries a public s-maxage that lets the CDN absorb repeated requests; the
// header and the 200 status are committed only AFTER the reads succeed, so a
// storage failure leaves nothing storable behind; 4xx answers stay uncached;
// ?url= is restricted to this site's hosts so the namespace is pages that can
// exist; and a KV admission budget bounds the cold renders that remain
// (stn4 - exercised for real in tests/activitypub-html-render-admission.test.mjs).
// The reads are concurrent, and the assertion
// below instruments enter/exit so a serial reversion actually fails.
test('200 responses are edge-cacheable with concurrent reads; 4xx, non-GET and storage errors are not storable', async () => {
  const { handler, cleanup } = await buildHandler();
  try {
    useDocs([]);
    globalThis.__renderEscape.events = [];

    // 200: the public edge-cache header, keyed by full request URL (no Vary),
    // committed only after the reads succeeded.
    const res = mockResponse();
    await handler({ query: { url: 'https://paul.kinlan.me/post/' }, method: 'GET' }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['cache-control'], 'public, s-maxage=300, stale-while-revalidate=600',
      'a 200 render must be edge-cacheable so repeat requests never reach Firestore');

    // Concurrency, observed for real: every read is ENTERED before any of them
    // exits. Serial awaits produce enter,exit,enter,exit,... and fail this;
    // Promise.all produces all the enters before all the exits. Each collection
    // is read TWICE: the injective doc-id encoding and the legacy one, dual-read
    // for documents written before paul-kinlan-me-je6t.
    const events = globalThis.__renderEscape.events;
    const firstExit = events.findIndex((e) => e.startsWith('exit:'));
    assert.notEqual(firstExit, -1, 'all reads must resolve');
    const enteredBeforeFirstExit = events.slice(0, firstExit).filter((e) => e.startsWith('enter:'));
    assert.equal(enteredBeforeFirstExit.length, 6,
      `all six collection reads must be in flight before any resolves, got ${JSON.stringify(events)}`);
    assert.deepEqual(enteredBeforeFirstExit.map((e) => e.slice(6)).sort(),
      ['announces', 'announces', 'likes', 'likes', 'replies', 'replies'],
      'the in-flight reads are likes, announces and replies under both doc-id encodings');

    // A deployment host named by VERCEL_URL is this project too (a preview
    // deployment's own pages must not 400 - the finding tvqu repro), and the
    // trusted-host set is exactly the inbox's assembly: paul.kinlan.me plus
    // PUBLIC_ORIGIN/VERCEL_URL. www.paul.kinlan.me is not in the inbox's set,
    // so it 400s like any other host - the inbox defines what pages exist.
    const previousVercelUrl = process.env.VERCEL_URL;
    const previousPublicOrigin = process.env.PUBLIC_ORIGIN;
    try {
      process.env.VERCEL_URL = 'preview-branch.vercel.app';
      delete process.env.PUBLIC_ORIGIN;
      const preview = mockResponse();
      await handler({ query: { url: 'https://preview-branch.vercel.app/post/' }, method: 'GET' }, preview);
      assert.equal(preview.statusCode, 200, 'the deployment host VERCEL_URL names is trusted');

      const www = mockResponse();
      await handler({ query: { url: 'https://www.paul.kinlan.me/post/' }, method: 'GET' }, www);
      assert.equal(www.statusCode, 400, 'www is not in the inbox-host assembly, so it is not a page here');

      delete process.env.VERCEL_URL;
      const withoutPreview = mockResponse();
      await handler({ query: { url: 'https://preview-branch.vercel.app/post/' }, method: 'GET' }, withoutPreview);
      assert.equal(withoutPreview.statusCode, 400, 'without VERCEL_URL the preview host is a foreign host');

      const beforeForeign = globalThis.__renderEscape.events.length;
      const foreign = mockResponse();
      await handler({ query: { url: 'https://evil.example/post/' }, method: 'GET' }, foreign);
      assert.equal(foreign.statusCode, 400, 'a foreign host is rejected before any read');
      assert.equal(globalThis.__renderEscape.events.length, beforeForeign,
        'a foreign host must not reach Firestore');
    } finally {
      if (previousVercelUrl === undefined) delete process.env.VERCEL_URL;
      else process.env.VERCEL_URL = previousVercelUrl;
      if (previousPublicOrigin === undefined) delete process.env.PUBLIC_ORIGIN;
      else process.env.PUBLIC_ORIGIN = previousPublicOrigin;
    }

    // Absent / unusable / foreign ?url=: 4xx answers, and NOT cacheable - a
    // cached negative would 404/400 a page that exists for other callers.
    for (const [query, expected] of [
      [{}, 404],
      [{ url: '' }, 404],
      [{ url: 'not-a-url' }, 400],
      [{ url: 'javascript:alert(1)' }, 400],
      [{ url: 'https://evil.example/post/' }, 400]
    ]) {
      const rejection = mockResponse();
      await handler({ query, method: 'GET' }, rejection);
      assert.equal(rejection.statusCode, expected);
      assert.equal(rejection.headers['cache-control'], undefined,
        `the ${expected} path must not be edge-cached (query: ${JSON.stringify(query)})`);
    }

    // Non-GET never reaches the reads, and is not cached either.
    const beforePost = globalThis.__renderEscape.events.length;
    const post = mockResponse();
    await handler({ query: { url: 'https://paul.kinlan.me/post/' }, method: 'POST' }, post);
    assert.equal(post.statusCode, 404);
    assert.equal(globalThis.__renderEscape.events.length, beforePost, 'a non-GET must not read Firestore');
    assert.equal(post.headers['cache-control'], undefined, 'the non-GET path must not be edge-cached');
  } finally {
    cleanup();
    delete globalThis.__renderEscape;
  }
});

// The storage-error path (paul-kinlan-me-x216): the handler must throw with
// NO status or header committed, so nothing error-shaped can be cached - the
// same fail-closed contract as user-agents.ts ('transient KV errors never
// cache empty results in CDN').
test('a Firestore failure escapes before any 200/cacheability is committed', async () => {
  const { handler, cleanup } = await buildHandler();
  try {
    useDocs([]);
    globalThis.__renderEscape.failCollection = 'announces';
    const res = mockResponse();
    await assert.rejects(
      handler({ query: { url: 'https://paul.kinlan.me/post/' }, method: 'GET' }, res),
      /transient firestore failure/
    );
    assert.notEqual(res.statusCode, 200, 'no 200 may be committed when the reads fail');
    assert.deepEqual(res.headers, {}, 'no cacheability may be committed when the reads fail');
    assert.equal(res.ends, 0, 'no body may be written when the reads fail');
  } finally {
    cleanup();
    delete globalThis.__renderEscape;
  }
});

test('escapeHtml replaces all five HTML-significant characters, including &', async () => {
  const { handler, cleanup } = await buildHandler();
  try {
    useDocs([{ actor: { name: 'Pe & Paul "<3>"', url: 'https://remote.example/u?a=1&b=2' } },
      { actor: { name: '&amp;lt;script&amp;gt;' } }]);
    const page = await renderPage(handler, 'https://paul.kinlan.me/post/?utm=social&x=1');

    // Text and title context: ampersands are entity-encoded, angle brackets and
    // quotes cannot break out of the attribute or the text node.
    assert.ok(page.includes('Pe &amp; Paul &quot;&lt;3&gt;&quot;'), 'name must render with all five characters escaped');
    assert.ok(!page.includes('Pe & Paul'), 'a raw ampersand leaked into the markup');

    // The page URL in <title> carries the same rule.
    assert.ok(page.includes('<title>Interactions from around the fediverse with https://paul.kinlan.me/post/?utm=social&amp;x=1</title>'));

    // Attribute context on a valid URL: safeUrl emits the parsed, re-escaped
    // href, so the query-string ampersand cannot start an entity.
    assert.ok(page.includes('href="https://remote.example/u?a=1&amp;b=2"'), 'ampersands in a valid href must be entity-encoded');

    // Nested entities: an attacker-supplied &amp;lt;script&amp;gt; is text, not
    // markup - the & is escaped again, so the entity is displayed literally and
    // never decoded into a tag.
    assert.ok(page.includes('&amp;amp;lt;script&amp;amp;gt;'), 'a nested entity must render as literal text, doubly escaped');
  } finally {
    cleanup();
    delete globalThis.__renderEscape;
  }
});
