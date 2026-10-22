// Browser check for the federation interactions renderer
// (api/activitypub-html/render.ts).
//
// The unit tests in tests/activitypub-html-render-escape.test.mjs assert on the
// generated markup; this one drives the real thing: it renders a hostile
// stored like/announce/reply set, serves the page with production's
// Content-Security-Policy (which allows 'unsafe-inline' scripts, so it does not
// rescue an injection here), loads it in headless Chrome and fails if any
// injected payload executed.
//
// Not part of tools/fast-gate.sh - it needs a browser - but it is the evidence
// gate for changes to this file. Run with:
//   node tests/activitypub-html.xss.browser.mjs
import { createServer } from 'node:http';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeFile } from 'node:fs/promises';

import { build } from 'esbuild';
import puppeteer from 'puppeteer';

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

// A hostile like / announce / reply set: every federated URL and name carries
// an executing payload. The honest actor is set per-run (see below) to the
// local origin, so the browser drive makes no external network call.
globalThis.__renderEscape = {
  snapshot: () => ({ size: 3, docs: hostileDocs })
};
let hostileDocs;

const buildHandler = async () => {
  const dir = mkdtempSync(join(tmpdir(), 'render-xss-'));
  const built = await build({
    entryPoints: [new URL('../api/activitypub-html/render.ts', import.meta.url).pathname],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
    logLevel: 'silent',
    plugins: [{
      name: 'render-xss-stubs',
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
  return {
    handler,
    cleanup: () => { rmSync(dir, { recursive: true, force: true }); delete globalThis.__renderEscape; }
  };
};

const mockResponse = () => ({
  statusCode: 0,
  headers: {},
  ends: 0,
  setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
  status(code) { this.statusCode = code; return { end: (body) => this.end(body) }; },
  end(body) { this.ends += 1; this.body = body; return this; }
});

// Same CSP the site serves for every route (vercel.json).
const CSP = "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'";

const server = createServer((_req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Security-Policy', CSP);
  res.end(currentPage);
});

let currentPage = '';
let browser;
let cleanup;

try {
  const harness = await buildHandler();
  cleanup = harness.cleanup;

  const port = await new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));

  // The honest actor lives on this local origin, so clicking it and loading its
  // icon stay strictly offline.
  hostileDocs = [
    { data: () => ({ actor: { name: 'x"><img src=x onerror=__xss=1>', url: 'javascript:__xss=2', icon: { url: 'data:image/svg+xml,<svg onload=__xss=3></svg>' } } }) },
    { data: () => ({ actor: 'javascript:__xss=4' }) },
    { data: () => ({ actor: { name: 'Alex', url: `http://127.0.0.1:${port}/users/alex`, icon: { url: `http://127.0.0.1:${port}/alex.png` } } }) }
  ];

  const res = mockResponse();
  await harness.handler({ query: { url: 'https://paul.kinlan.me/some-post/' }, method: 'GET' }, res);
  if (res.statusCode !== 200) throw new Error(`FAIL: handler answered ${res.statusCode}`);
  currentPage = String(res.body);

  browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  // Every request the page makes must be http(s) to this local server: an
  // unsafe img src must not so much as be fetched.
  const requests = [];
  page.on('request', (r) => requests.push(r.url()));

  // A dialog (alert/confirm/prompt) would be proof of script execution.
  let dialoged = false;
  page.on('dialog', async (d) => { dialoged = true; await d.dismiss(); });

  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle0' });

  // 1. Nothing executed. Loaded event handlers fire before networkidle0.
  const xss = await page.evaluate(() => globalThis.__xss);
  if (xss !== undefined) throw new Error(`FAIL: injected payload executed (window.__xss=${xss})`);

  // 2. No element in the rendered DOM carries an event-handler attribute.
  const handlers = await page.evaluate(() =>
    [...document.querySelectorAll('*')].flatMap((el) =>
      [...el.attributes].filter((a) => a.name.startsWith('on')).map((a) => `${el.tagName.toLowerCase()}[${a.name}]`)));
  if (handlers.length) throw new Error(`FAIL: event-handler attributes in the DOM: ${handlers.join(', ')}`);

  // 3. No href/src resolved to a non-http(s) scheme.
  const urls = await page.evaluate(() =>
    [...document.querySelectorAll('[href],[src]')].map((el) => el.getAttribute('href') || el.getAttribute('src')));
  const bad = urls.filter((u) => u && !/^https?:\/\//i.test(u));
  if (bad.length) throw new Error(`FAIL: non-http(s) URLs emitted: ${bad.join(', ')}`);

  // 4. The payloads are still on the page, as inert visible text.
  const text = await page.evaluate(() => document.body.innerText);
  if (!text.includes('javascript:__xss=4')) throw new Error('FAIL: the string-actor payload was not rendered as literal text');

  // 5. Driving the page, not just loading it: click the hostile anchor. Its
  // href dropped to "", so the worst a click can do is reload this local page -
  // a javascript: navigation or a dialog would be an execution. (The honest
  // external link is NOT clicked: that would be a real network call.)
  await Promise.all([
    page.click('a[href=""]'),
    page.waitForNavigation({ waitUntil: 'load', timeout: 5000 }).catch(() => {})
  ]);
  const afterXss = await page.evaluate(() => globalThis.__xss);
  if (afterXss !== undefined) throw new Error(`FAIL: payload executed after clicking the hostile anchor (__xss=${afterXss})`);
  if (dialoged) throw new Error('FAIL: a dialog fired - script executed');
  const afterUrl = page.url();
  if (!afterUrl.startsWith(`http://127.0.0.1:${port}/`)) throw new Error(`FAIL: click navigated off the local page: ${afterUrl}`);

  // 6. The honest actor still has a working profile link and icon (local
  // origin, so no external call).
  const good = await page.evaluate((port) => !!document.querySelector(`a[href="http://127.0.0.1:${port}/users/alex"]`)
    && !!document.querySelector(`img[src="http://127.0.0.1:${port}/alex.png"]`), port);
  if (!good) throw new Error('FAIL: a valid http(s) actor profile/icon did not survive');

  // 7. Everything the page fetched was plain http(s) - no data:/javascript:
  // resource load of any kind.
  const badRequests = requests.filter((u) => !/^https?:\/\//i.test(u));
  if (badRequests.length) throw new Error(`FAIL: non-http(s) resource fetches: ${badRequests.join(', ')}`);

  const shot = '/tmp/activitypub-html-xss-after.png';
  await writeFile(shot, await page.screenshot());
  console.log('PASS: payloads inert, no handler attributes, no javascript:/data: URLs, no execution');
  console.log(`evidence: ${shot}`);
  console.log(`visible text sample: ${text.replace(/\s+/g, ' ').slice(0, 160)}`);
} finally {
  if (browser) await browser.close();
  server.close();
  if (cleanup) cleanup();
}
