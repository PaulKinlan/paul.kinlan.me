import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

async function loadTs(relativePath, dependencies) {
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
  return exports.default;
}

// Every test builds its own KV double and its own module instances, so no test can
// depend on another test's writes, on the order the file runs in, or on machine
// state (the previous shape shared one module-level store between tests).
async function load() {
  const store = new Map();
  const kv = {
    async set(key, value, options) {
      assert.equal(options.ex, 60);
      assert.equal(options.nx, true);
      if (!store.has(key)) store.set(key, value);
    },
    async incr(key) {
      store.set(key, (store.get(key) ?? 0) + 1);
    },
    async scan(cursor, options) {
      assert.equal(options.match, 'ua:*');
      return ['0', [...store.keys()].filter(key => key.startsWith('ua:'))];
    },
    async mget(keys) {
      return keys.map(key => store.get(key));
    },
  };
  const middleware = await loadTs('../middleware.ts', {
    '@vercel/edge': { next: () => 'next' },
    '@vercel/kv': { kv },
  });
  const userAgents = await loadTs('../api/user-agents.ts', { '@vercel/kv': { kv } });
  const request = userAgent => new Request('https://example.com/', userAgent ? { headers: { 'user-agent': userAgent } } : {});
  return {
    store,
    request,
    async visit(userAgent) {
      return middleware(request(userAgent));
    },
    async report() {
      let data;
      await userAgents({}, {
        setHeader() {},
        json(value) { data = value; },
      });
      return data;
    },
  };
}

const FAMILIES = ['Bingbot', 'Chrome', 'Edge', 'Firefox', 'Googlebot', 'Other', 'Other bot', 'Safari'];
const keysOf = store => [...store.keys()].sort();

test('arbitrary user-agent headers cannot create unbounded KV keys', async () => {
  const { store, request, visit } = await load();
  for (let i = 0; i < 1000; i++) {
    assert.equal(await visit(`random-${i}`), 'next');
  }
  assert.deepEqual(keysOf(store), ['ua:Other']);
  assert.equal(store.get('ua:Other'), 1000);

  for (const header of [
    'Googlebot/2.1', 'bingbot/2.0', 'SomeCrawler/1.0',
    'Mozilla/5.0 Edg/120 Chrome/120', 'Chrome/120', 'Firefox/120',
    'Mozilla/5.0 Safari/605', '',
  ]) {
    assert.equal(await visit(header), 'next');
  }
  assert.deepEqual(keysOf(store), FAMILIES.map(family => `ua:${family}`));
  assert.equal(store.size, 8);
});

test('an empty family store yields an empty report without mget([])', async () => {
  const { report } = await load();
  assert.equal((await report()).length, 0);
});

// paul-kinlan-me-wp1: the classifier matched only the desktop tokens, so every mobile
// and iOS brand was attributed to the family that happens to carry the engine string
// (EdgA/ -> Chrome, CriOS//EdgiOS//FxiOS/ -> Safari) and no iOS row could ever be
// reported. These are the real user agents those builds send.
const BROWSER_FIXTURES = [
  ['Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36', 'Chrome', 'Chrome Android'],
  ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', 'Chrome', 'Chrome desktop'],
  ['Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1', 'Chrome', 'Chrome iOS'],
  ['Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36 EdgA/120.0.2210.86', 'Edge', 'Edge Android'],
  ['Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 EdgiOS/120.0.2210.86 Mobile/15E148 Safari/605.1.15', 'Edge', 'Edge iOS'],
  ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.2210.91', 'Edge', 'Edge desktop'],
  ['Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246', 'Edge', 'Edge legacy (pre-Chromium)'],
  ['Mozilla/5.0 (Android 14; Mobile; rv:120.0) Gecko/120.0 Firefox/120.0', 'Firefox', 'Firefox Android'],
  ['Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/120.0 Mobile/15E148 Safari/605.1.15', 'Firefox', 'Firefox iOS'],
  ['Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0', 'Firefox', 'Firefox desktop'],
  ['Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1', 'Safari', 'Safari iOS'],
  ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15', 'Safari', 'Safari macOS'],
];

test('every mobile and iOS browser brand is reported as its own family', async () => {
  const { store, visit } = await load();
  for (const [userAgent, family, label] of BROWSER_FIXTURES) {
    store.clear();
    assert.equal(await visit(userAgent), 'next');
    assert.deepEqual(keysOf(store), [`ua:${family}`], `${label} must be counted as ${family}`);
  }
});

test('the browser corpus still writes only the fixed families, and the report never sees a raw user agent', async () => {
  const { store, visit, report } = await load();
  for (let round = 0; round < 3; round++) {
    for (const [userAgent] of BROWSER_FIXTURES) assert.equal(await visit(userAgent), 'next');
  }
  assert.deepEqual(keysOf(store), ['ua:Chrome', 'ua:Edge', 'ua:Firefox', 'ua:Safari']);
  assert.equal(store.get('ua:Chrome'), 9, 'three rounds x (Android + iOS + desktop)');
  assert.equal(store.get('ua:Edge'), 12, 'three rounds x (EdgA + EdgiOS + Edg + Edge)');
  assert.equal(store.get('ua:Firefox'), 9, 'three rounds x (Android + iOS + desktop)');
  assert.equal(store.get('ua:Safari'), 6, 'three rounds x (iOS + macOS), and neither brand above leaked into it');

  // The public report is family names and counts only - no user-agent string, in whole
  // or in part, is reachable from the read path (paul-kinlan-me-cu3's privacy contract).
  const data = await report();
  // Compared as a map, not as an array: the read path's sort comparator is not total
  // for equal counts, so a tie's order is not part of this contract.
  assert.deepEqual(Object.fromEntries(data), { Chrome: 9, Edge: 12, Firefox: 9, Safari: 6 });
  for (const [family] of data) {
    assert.ok(FAMILIES.includes(family), `${family} is not one of the fixed families`);
  }
  assert.ok(!JSON.stringify(data).includes('Mozilla'), 'the report must not carry any part of a raw user agent');
});
