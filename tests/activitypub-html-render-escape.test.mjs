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
          get: async () => globalThis.__renderEscape.snapshot(name)
        })
      })
    })
  })
};
`;

const STUBS = {
  '@vercel/node': 'export {};',
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
        plugin.onResolve({ filter: /^(@vercel\/node|firebase-admin)$/ }, (args) => (
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

    // The control actor keeps working links and a working image.
    assert.ok(page.includes('href="https://remote.example/users/alex"'), 'a valid https profile URL must survive');
    assert.ok(page.includes('src="https://remote.example/alex.png"'), 'a valid https icon URL must survive');
  } finally {
    cleanup();
    delete globalThis.__renderEscape;
  }
});

test('escapeHtml replaces all five HTML-significant characters, including &', async () => {
  const { handler, cleanup } = await buildHandler();
  try {
    useDocs([{ actor: { name: 'Pe & Paul "<3>"', url: 'https://remote.example/u?a=1&b=2' } }]);
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
  } finally {
    cleanup();
    delete globalThis.__renderEscape;
  }
});
