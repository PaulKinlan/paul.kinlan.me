// Browser acceptance gate for the user-agent family classifier (paul-kinlan-me-wp1,
// the finding raised on paul-kinlan-me-cu3's bounded-KV change).
//
// The fast-tier sibling (tests/user-agents-kv.test.mjs) drives the real middleware
// and the real read handler with real Request objects and pins the per-brand
// mapping. What only a browser can add is the part the bug was actually about: a
// request that arrives with the user agent the browser *really sends* for that
// build, through a real HTTP request/response cycle, and the family that ends up
// reported. Chrome does not let a page set its own User-Agent header, so the
// fixtures are driven with page.setUserAgent - which is exactly the "the UA string
// the browser claims" input the middleware consumes on Vercel.
//
// The server below is the smallest thing that is still the real code path: the
// middleware module that ships (transpiled, not re-implemented) runs on every
// request against a KV double, and /families serves the real api/user-agents.ts
// handler's response. So a pass means "Chrome said it was Edge iOS and the site's
// own middleware counted it as Edge", not "a regex matched a string in isolation".
//
// Run by hand when middleware.ts or api/user-agents.ts changes (it needs Chrome, so
// it is not in the fast gate):
//   node tests/user-agents-kv.browser.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import vm from 'node:vm';
import ts from 'typescript';
import puppeteer from 'puppeteer';

const PORT = Number(process.env.UA_GATE_PORT ?? 8131);
const PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>ua family gate</title></head><body>ok</body></html>`;

async function loadTs(relativePath, dependencies, exportName = 'default') {
  const source = await readFile(new URL(relativePath, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  vm.runInNewContext(outputText, {
    exports,
    require: name => {
      assert.ok(name in dependencies, `unexpected import: ${name}`);
      return dependencies[name];
    },
    console,
  }, { filename: relativePath });
  return exports[exportName];
}

const store = new Map();
const kv = {
  async set(key, value) {
    if (!store.has(key)) store.set(key, value);
  },
  async incr(key) {
    store.set(key, (store.get(key) ?? 0) + 1);
  },
  async scan(_cursor, { match }) {
    assert.equal(match, 'ua:*');
    return ['0', [...store.keys()].filter(key => key.startsWith('ua:'))];
  },
  async mget(keys) {
    return keys.map(key => store.get(key));
  },
};

const middleware = await loadTs('../middleware.ts', {
  '@vercel/edge': { next: () => 'next' },
  '@vercel/kv': { kv },
}, 'default');
const middlewareConfig = await loadTs('../middleware.ts', {
  '@vercel/edge': { next: () => 'next' },
  '@vercel/kv': { kv },
}, 'config');
const userAgents = await loadTs('../api/user-agents.ts', { '@vercel/kv': { kv } });

// The real Vercel middleware matcher, not a copy of it: Vercel anchors the pattern to
// the whole path (so `/api/families` and `/favicon.ico` are excluded), and replaying it
// here is what keeps a page load from being counted twice by the gate's own traffic.
const runsMiddleware = path => new RegExp(`^${middlewareConfig.matcher[0]}$`).test(path);

// The real Vercel middleware signature: a Request in, a Response (from next()) out.
const server = createServer(async (request, response) => {
  const path = new URL(request.url, `http://127.0.0.1:${PORT}`).pathname;
  // Mirrors production, where the read path is /api/user-agents and the matcher
  // excludes /api - the read must not be counted as a user-agent hit.
  if (path === '/api/families') {
    let body;
    await userAgents({}, {
      setHeader() {},
      set statusCode(_) {},
      json(value) { body = value; },
    });
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify(body));
    return;
  }
  if (runsMiddleware(path)) {
    await middleware(new Request(`http://127.0.0.1:${PORT}${request.url}`, { headers: request.headers }));
  }
  response.writeHead(200, { 'content-type': 'text/html' });
  response.end(PAGE);
});

// The user agents the real builds send, with the family the brand must be counted as.
const FIXTURES = [
  ['Chrome Android', 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36', 'Chrome'],
  ['Chrome iOS', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1', 'Chrome'],
  ['Edge Android', 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36 EdgA/120.0.2210.86', 'Edge'],
  ['Edge iOS', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 EdgiOS/120.0.2210.86 Mobile/15E148 Safari/605.1.15', 'Edge'],
  ['Firefox iOS', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/120.0 Mobile/15E148 Safari/605.1.15', 'Firefox'],
  ['Safari iOS', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1', 'Safari'],
];

let browser;
let failures = 0;
try {
  await new Promise(resolve => server.listen(PORT, '127.0.0.1', resolve));
  browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

  for (const [label, userAgent, family] of FIXTURES) {
    const before = store.get(`ua:${family}`) ?? 0;
    const page = await browser.newPage();
    try {
      await page.setUserAgent(userAgent);
      const sent = await page.evaluate(() => navigator.userAgent);
      assert.equal(sent, userAgent, 'the page must actually be sending the fixture user agent');
      await page.goto(`http://127.0.0.1:${PORT}/`);
      const reported = await page.evaluate(async () => (await fetch('/api/families')).json());
      const byFamily = Object.fromEntries(reported);
      const after = store.get(`ua:${family}`) ?? 0;
      const ok = after === before + 1 && !Object.keys(byFamily).some(key => key.includes('Mozilla') || key.includes('/'));
      if (!ok) failures++;
      console.log(`${ok ? 'ok  ' : 'FAIL'} ${label.padEnd(16)} -> ${family.padEnd(8)} (ua:${family} ${before}->${after}, report ${JSON.stringify(reported)})`);
      assert.ok(ok, `${label} must be counted as ${family}`);
    } finally {
      await page.close();
    }
  }

  const families = [...store.keys()].sort();
  console.log('KV keys after the browser corpus:', families);
  if (families.some(key => !['ua:Chrome', 'ua:Edge', 'ua:Firefox', 'ua:Safari'].includes(key))) {
    failures++;
    console.log('FAIL: the corpus wrote a key outside the fixed families');
  }
  if (failures) throw new Error(`${failures} browser check(s) failed`);
  console.log(`PASS: ${FIXTURES.length} real Chrome user agents were each counted as their own family by the shipped middleware, the report exposes family names only, and the corpus wrote no key outside the fixed set.`);
} finally {
  if (browser) await browser.close().catch(() => {});
  server.close();
}
