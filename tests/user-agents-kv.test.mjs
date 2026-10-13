import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

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

const middleware = await loadTs('../middleware.ts', {
  '@vercel/edge': { next: () => 'next' },
  '@vercel/kv': { kv },
});
const userAgents = await loadTs('../api/user-agents.ts', { '@vercel/kv': { kv } });

async function report() {
  let data;
  await userAgents({}, {
    setHeader() {},
    json(value) { data = value; },
  });
  return data;
}

test('arbitrary user-agent headers cannot create unbounded KV keys', async () => {
  for (let i = 0; i < 1000; i++) {
    assert.equal(await middleware(new Request('https://example.com/', {
      headers: { 'user-agent': `random-${i}` },
    })), 'next');
  }
  assert.deepEqual([...store.keys()], ['ua:Other']);
  assert.equal(store.get('ua:Other'), 1000);

  for (const header of [
    'Googlebot/2.1', 'bingbot/2.0', 'SomeCrawler/1.0',
    'Mozilla/5.0 Edg/120 Chrome/120', 'Chrome/120', 'Firefox/120',
    'Mozilla/5.0 Safari/605', '',
  ]) {
    const headers = header ? { 'user-agent': header } : {};
    assert.equal(await middleware(new Request('https://example.com/', { headers })), 'next');
  }
  assert.deepEqual([...store.keys()].sort(), [
    'ua:Bingbot', 'ua:Chrome', 'ua:Edge', 'ua:Firefox', 'ua:Googlebot',
    'ua:Other', 'ua:Other bot', 'ua:Safari',
  ]);
  assert.equal(store.size, 8);

  // A legacy or unrelated KV key must not appear in the public family report.
  store.set('unrelated-private-key', 123);
  const data = await report();
  assert.equal(data.length, 8);
  assert.equal(data[0][0], 'Other');
  assert.equal(data[0][1], 1001);
  assert.ok(data.every(([family]) => !family.startsWith('ua:')));
});

test('an empty family store yields an empty report without mget([])', async () => {
  store.clear();
  assert.equal((await report()).length, 0);
});
