// Request-level admission tests for the User-Agent quota middleware (ADR 7wx,
// paul-kinlan-me-cu3).
//
// The REAL middleware.ts is bundled with esbuild (same harness shape as
// tests/card.test.mjs); '@vercel/edge' and '@vercel/kv' are stubbed at the
// module boundary. The fake KV's eval() executes a JS reference model of the
// admission script's semantics: Redis runs a script atomically, and the test
// issues calls the way Redis executes them - serialised, whole - so the model
// mirrors script-level atomicity. Stated limit: the Lua text itself cannot run
// offline (no Redis here); the script is review text against the model, and
// the fixture additionally pins the wire shape (one eval per eligible request,
// key names, TTL args) so drift between script and model is reviewable.
//
// Fast tier: no browser, no network, no shared state between tests.
import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

import { build } from 'esbuild';

const EDGE_STUB = `export const next = async () => new Response(null, { status: 200 });`;

// JS reference model of ADMISSION_SCRIPT in middleware.ts. Keep in review
// sync with that script: same branches, same order.
class FakeKV {
  counts = new Map(); // key -> { value, createdAtMinute }
  budgets = new Map(); // minute -> used
  evalCalls = 0;
  nowMinute = 20_000;

  get liveCounts() {
    // EX60: a count key admitted in minute m is live through minute m+1.
    return [...this.counts.entries()].filter(([, v]) => this.nowMinute - v.createdAtMinute < 2);
  }

  eval(script, keys, args) {
    this.evalCalls += 1;
    this.script = script;
    this.lastKeys = keys;
    this.lastArgs = args;
    const [countKey, budgetKey] = keys;
    const maxNew = Number(args[0]);
    const currentMinute = this.nowMinute;
    assert.match(countKey, /^ua:v2:/, 'count keys are namespaced ua:v2:');
    assert.match(budgetKey, /^ua:budget:\d+$/, 'budget key is ua:budget:<minute>');

    const existing = this.counts.get(countKey);
    if (existing !== undefined) {
      existing.value += 1; // INCR without TTL extension
      return [1, existing.value];
    }
    const used = this.budgets.get(budgetKey) ?? 0;
    if (used === 0 && !this.budgets.has(budgetKey)) this.budgets.set(budgetKey, 0); // SET EX120
    if (used >= maxNew) return [0, 0];
    this.budgets.set(budgetKey, used + 1);
    this.counts.set(countKey, { value: 1, createdAtMinute: currentMinute });
    return [1, 1];
  }
}

const buildMiddleware = async (fakeKv) => {
  // The stubbed kv binding is read at module-eval, so the fake must be in
  // place before the bundle is imported.
  globalThis.__fakeKV = fakeKv;
  const dir = mkdtempSync(join(tmpdir(), 'ua-mw-'));
  const built = await build({
    entryPoints: [new URL('../middleware.ts', import.meta.url).pathname],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
    logLevel: 'silent',
    plugins: [
      {
        name: 'edge-kv-stub',
        setup(plugin) {
          const STUBS = { 'edge-stub': EDGE_STUB, 'kv-stub': 'export const kv = globalThis.__fakeKV;' };
          plugin.onResolve({ filter: /^@vercel\/(edge|kv)$/ }, (args) => ({
            path: args.path.includes('edge') ? 'edge-stub' : 'kv-stub',
            namespace: 'stub'
          }));
          plugin.onLoad({ filter: /.*/, namespace: 'stub' }, (args) => ({
            loader: 'js',
            contents: STUBS[args.path]
          }));
        }
      }
    ]
  });
  const file = join(dir, 'middleware.mjs');
  writeFileSync(file, built.outputFiles[0].contents);
  const { default: middleware } = await import(`file://${file}`);
  assert.equal(typeof middleware, 'function', 'bundle exports the middleware function');
  return { middleware, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
};

const randomUa = (n) => {
  const uas = [];
  while (uas.length < n) uas.push(`fixture-agent/${uas.length}-${Math.random().toString(36).slice(2)}${Math.random()}`);
  return uas;
};

test('1000 random UAs in one minute admit at most 100 keys, one eval per request', async () => {
  const kv = new FakeKV();
  const { cleanup, middleware } = await buildMiddleware(kv);
  try {
    const uas = randomUa(1000);
    for (const ua of uas) {
      const res = await middleware(new Request('https://paul.kinlan.me/', { headers: { 'user-agent': ua } }));
      assert.equal(res.status, 200, 'middleware never blocks the visitor');
    }
    assert.equal(kv.liveCounts.length, 100, 'exactly the minute budget of distinct keys');
    assert.equal(kv.evalCalls, 1000, 'one KV round-trip per eligible request, no scans');
    const budgetUsed = [...kv.budgets.values()].reduce((a, b) => a + b, 0);
    assert.equal(budgetUsed, 100, 'budget key counts admissions only');
  } finally {
    cleanup();
  }
});

test('a repeat UA keeps incrementing after the quota is full; fresh UAs are skipped', async () => {
  const kv = new FakeKV();
  const { cleanup, middleware } = await buildMiddleware(kv);
  try {
    const repeat = 'Mozilla/5.0 fixture-repeat';
    await middleware(new Request('https://paul.kinlan.me/', { headers: { 'user-agent': repeat } }));
    for (const ua of randomUa(150)) {
      await middleware(new Request('https://paul.kinlan.me/', { headers: { 'user-agent': ua } }));
    }
    const countsBefore = kv.counts.get(`ua:v2:${repeat}`).value;
    for (let i = 0; i < 5; i++) {
      await middleware(new Request('https://paul.kinlan.me/', { headers: { 'user-agent': repeat } }));
    }
    assert.equal(kv.counts.get(`ua:v2:${repeat}`).value, countsBefore + 5, 'repeat UA increments even when full');
    const fresh = `fresh-after-full/${Math.random()}`;
    await middleware(new Request('https://paul.kinlan.me/', { headers: { 'user-agent': fresh } }));
    assert.equal(kv.counts.has(`ua:v2:${fresh}`), false, 'full quota: fresh UA creates no key');
    const budgetUsed = [...kv.budgets.values()].reduce((a, b) => a + b, 0);
    assert.equal(budgetUsed, 100, 'skipped fresh UA did not consume budget');
  } finally {
    cleanup();
  }
});

test('minute-boundary spray (10k UAs over 3 minutes) stays under 200 live keys, 3 budget keys', async () => {
  const kv = new FakeKV();
  const { cleanup, middleware } = await buildMiddleware(kv);
  try {
    for (let minute = 0; minute < 3; minute++) {
      kv.nowMinute += 1;
      for (const ua of randomUa(1000)) {
        await middleware(new Request('https://paul.kinlan.me/', { headers: { 'user-agent': ua } }));
      }
    }
    assert.ok(kv.liveCounts.length <= 200, `<=200 live count keys (got ${kv.liveCounts.length})`);
    assert.ok(kv.budgets.size <= 3, `<=3 budget keys with EX120 (got ${kv.budgets.size})`);
  } finally {
    cleanup();
  }
});

test('missing and oversize headers never reach KV; the 512 limit is UTF-8 bytes', async () => {
  const kv = new FakeKV();
  const { cleanup, middleware } = await buildMiddleware(kv);
  try {
    await middleware(new Request('https://paul.kinlan.me/'));
    assert.equal(kv.evalCalls, 0, 'missing UA: no KV call');
    // 300 chars but 600 UTF-8 bytes: a String.length check would admit this,
    // the byte check must refuse it. (Header values are ByteStrings, so
    // non-ASCII code points above 0xFF cannot ride a Request header.)
    await middleware(new Request('https://paul.kinlan.me/', { headers: { 'user-agent': '\u00ff'.repeat(300) } }));
    assert.equal(kv.evalCalls, 0, '600 UTF-8 bytes in 300 chars: no KV call');
    await middleware(new Request('https://paul.kinlan.me/', { headers: { 'user-agent': 'a'.repeat(512) } }));
    assert.equal(kv.evalCalls, 1, 'exactly 512 bytes is admitted');
    await middleware(new Request('https://paul.kinlan.me/', { headers: { 'user-agent': `${'a'.repeat(512)}b` } }));
    assert.equal(kv.evalCalls, 1, '513 bytes is refused');
  } finally {
    cleanup();
  }
});

test('50 same-UA requests in one turn admit once and count exactly', async () => {
  const kv = new FakeKV();
  const { cleanup, middleware } = await buildMiddleware(kv);
  try {
    const ua = 'race-fixture/1.0';
    await Promise.all(
      Array.from({ length: 50 }, () => middleware(new Request('https://paul.kinlan.me/', { headers: { 'user-agent': ua } })))
    );
    const budgetUsed = [...kv.budgets.values()].reduce((a, b) => a + b, 0);
    assert.equal(budgetUsed, 1, 'one admission slot for one distinct UA');
    assert.equal(kv.counts.get(`ua:v2:${ua}`).value, 50, 'every request counted, none lost, none overwritten');
  } finally {
    cleanup();
  }
});

test('wire shape: script, key names and TTL args match the ADR contract', async () => {
  const kv = new FakeKV();
  const { cleanup, middleware } = await buildMiddleware(kv);
  try {
    await middleware(new Request('https://paul.kinlan.me/', { headers: { 'user-agent': 'wire-shape/1.0' } }));
    assert.match(kv.script, /SET/, 'script stores counts');
    assert.match(kv.script, /'NX'/, 'admission is NX - a different UA is never overwritten');
    assert.match(kv.script, /'EX'/, 'counts are stored with expiry');
    assert.deepEqual(kv.lastKeys, ['ua:v2:wire-shape/1.0', `ua:budget:${Math.floor(Date.now() / 60000)}`]);
    assert.deepEqual(kv.lastArgs, ['100', '60', '120']);
  } finally {
    cleanup();
  }
});
