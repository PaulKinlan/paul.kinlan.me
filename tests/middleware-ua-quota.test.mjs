// Request-level admission tests for the User-Agent quota middleware (ADR 7wx,
// paul-kinlan-me-cu3).
//
// The REAL middleware.ts is bundled with esbuild (same harness shape as
// tests/card.test.mjs); '@vercel/edge' and '@vercel/kv' are stubbed at the module
// boundary, so these tests drive the shipped middleware function, not a copy of it.
//
// The Lua->JS translator and the fake KV that EXECUTES the shipped script (never a
// hand-written model of it - paul-kinlan-me-3s4, and never a silently skipped line)
// live in tests/helpers/lua-redis.mjs, shared with the render.ts admission suite
// (paul-kinlan-me-stn4); the stated limits of that harness are documented there.
//
// Fast tier: no browser, no network, no shared state between tests.
import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

import { build } from 'esbuild';

import { FakeRedis, LAST_MS_OF_A_MINUTE, compileScript, freezeClock, luaToJs } from './helpers/lua-redis.mjs';

const EDGE_STUB = `export const next = async () => new Response(null, { status: 200 });`;

// Fake redis with the UA-quota assertion helpers: how many distinct UAs were ever
// admitted and how many different minute budget keys the middleware asked for.
class FakeKV extends FakeRedis {
  admissions = 0;
  budgetKeysSeen = new Set();

  noteSet(key) {
    if (key.startsWith('ua:v2:')) this.admissions += 1;
    if (key.startsWith('ua:budget:')) this.budgetKeysSeen.add(key);
  }

  get liveCounts() {
    this.purge();
    return [...this.values.keys()].filter((key) => key.startsWith('ua:v2:'));
  }

  get counts() {
    this.purge();
    const counts = new Map();
    for (const [key, value] of this.values) {
      if (key.startsWith('ua:v2:')) counts.set(key, { value: Number(value) });
    }
    return counts;
  }

  get budgets() {
    this.purge();
    const budgets = new Map();
    for (const [key, value] of this.values) {
      if (key.startsWith('ua:budget:')) budgets.set(key, Number(value));
    }
    return budgets;
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

const request = (userAgent) =>
  new Request('https://paul.kinlan.me/', userAgent === undefined ? undefined : { headers: { 'user-agent': userAgent } });

test('the harness executes the script the middleware ships, and refuses what it cannot model', async () => {
  const kv = new FakeKV();
  const { cleanup, middleware } = await buildMiddleware(kv);
  try {
    await middleware(request('harness-fixture/1.0'));
    // `kv.script` is the exact text middleware.ts handed to EVAL, and it is what the
    // assertions in every other test in this file ran. Every non-comment line must have
    // translated: a line the harness skipped would be behaviour no test here observes.
    const meaningfulLines = kv.script
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '' && !line.startsWith('--'));
    assert.equal(luaToJs(kv.script).split('\n').length, meaningfulLines.length, 'every script line is translated, none skipped');
    assert.match(kv.script, /redis\.call\('SET'/, 'the text executed is the admission script');

    // A construct the harness does not model is a loud failure, never a skipped line: a
    // harness that ignored `while` would report a green suite over behaviour it never ran.
    assert.throws(() => luaToJs('while count do\nend'), /unsupported Lua construct/);
    assert.throws(() => luaToJs('for i = 1, 3 do\nend'), /unsupported Lua construct/);
    // And the translations the script relies on are the ones Redis means.
    assert.equal(
      luaToJs("local used = tonumber(redis.call('GET', KEYS[2])) or 0"),
      "let used = __luaOr(() => Number(redis.call('GET', KEYS[2])), () => 0);",
    );
    assert.equal(luaToJs('return {0, 0}'), 'return [0, 0];');
    assert.equal(luaToJs('if not created then'), 'if (!__luaTruthy(created)) {');
  } finally {
    cleanup();
  }
});

// Run a synthetic script through the same translator and runtime the shipped script uses.
// The redis table throws: these cases are about the LANGUAGE semantics, not Redis.
const runLua = (source) => {
  const run = compileScript(source);
  return run(
    {
      call: () => {
        throw new Error('synthetic script made an unexpected redis.call');
      },
    },
    [null],
    [null],
  );
};

test('the translator models Lua truthiness and and/or values, not JavaScript\'s', () => {
  // The reviewer's repro (paul-kinlan-me-3hx): `if used then` used to translate to
  // `if (used) {`, i.e. JS truthiness, so a zero budget would skip the block in the
  // harness while real Redis enters it. It must never be silently translated as JS again.
  assert.equal(luaToJs('if used then'), 'if (__luaTruthy(used)) {');

  const branch = (condition) =>
    runLua(`if ${condition} then\n  return {'entered'}\nend\nreturn {'skipped'}`);
  assert.deepEqual(branch('0'), ['entered'], 'Lua: 0 is truthy');
  assert.deepEqual(branch("''"), ['entered'], "Lua: '' is truthy");
  assert.deepEqual(branch('true'), ['entered']);
  assert.deepEqual(branch('false'), ['skipped'], 'Lua: false is falsy');
  assert.deepEqual(branch('nil'), ['skipped'], 'Lua: nil is falsy');

  // `a or b` returns an operand, not a boolean: only nil and false fall through.
  const orValue = (left) => runLua(`local value = ${left} or 'fallback'\nreturn {value}`)[0];
  assert.equal(orValue('false'), 'fallback');
  assert.equal(orValue('nil'), 'fallback');
  assert.equal(orValue('0'), 0, 'Lua: 0 is truthy, so `0 or x` is 0');
  assert.equal(orValue("''"), '', "Lua: '' is truthy, so `'' or x` is ''");
  assert.equal(orValue("'kept'"), 'kept');

  // `a and b` returns the operand too: a truthy left side yields the right one.
  assert.equal(runLua("local value = 'kept' and 'next'\nreturn {value}")[0], 'next');
  assert.equal(runLua("local value = false and 'next'\nreturn {value}")[0], false);
  assert.equal(runLua("local value = 0 and 'next'\nreturn {value}")[0], 'next', 'Lua: 0 is truthy');

  // `not` is Lua truthiness too: not 0 is false, not nil is true.
  assert.equal(runLua('return {not 0}')[0], false);
  assert.equal(runLua("return {not ''}")[0], false);
  assert.equal(runLua('return {not nil}')[0], true);
  assert.equal(runLua('return {not false}')[0], true);

  // A string literal must not be rewritten by the identifier translations.
  assert.equal(runLua("return {'nil == 0 or 1'}")[0], 'nil == 0 or 1');

  // And a construct the harness cannot mean is refused, not guessed at.
  assert.throws(() => luaToJs("return {[1] = 'a'}"), /unsupported Lua table constructor/);
});

test('comparison operators translate in one pass: ~= becomes !==, never the invalid !===', () => {
  // A future script line using Lua's not-equal must translate to valid JS. Replacing '~='
  // and then '==' rewrote the '==' inside '!==' and produced '!===', a SyntaxError from
  // new Function with nothing pointing at the translator (paul-kinlan-me-k42).
  assert.equal(luaToJs('if a ~= b then'), 'if (__luaTruthy(a !== b)) {');
  assert.equal(luaToJs('if a == b then'), 'if (__luaTruthy(a === b)) {');
  assert.doesNotMatch(luaToJs('if a ~= b then'), /!===/, 'the mangled operator must not reappear');

  // Behaviour through the same compiler the shipped script uses: each operator takes the
  // branch Lua would take, including nil's equality with itself.
  assert.deepEqual(runLua('if 1 ~= 2 then\n  return {"different"}\nend\nreturn {"same"}'), ['different']);
  assert.deepEqual(runLua('if 1 ~= 1 then\n  return {"different"}\nend\nreturn {"same"}'), ['same']);
  assert.deepEqual(runLua('if 2 == 2 then\n  return {"equal"}\nend\nreturn {"different"}'), ['equal']);
  assert.deepEqual(runLua('if nil == nil then\n  return {"equal"}\nend\nreturn {"different"}'), ['equal']);

  // Neither operator is rewritten inside a string literal.
  assert.deepEqual(runLua("return {'a ~= b and c == d'}"), ['a ~= b and c == d']);
});

test('1000 random UAs in one minute admit at most 100 keys, one eval per request', async () => {
  const kv = new FakeKV();
  const { cleanup, middleware } = await buildMiddleware(kv);
  try {
    for (const ua of randomUa(1000)) {
      const res = await middleware(request(ua));
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
    await middleware(request(repeat));
    for (const ua of randomUa(150)) await middleware(request(ua));
    const countsBefore = kv.counts.get(`ua:v2:${repeat}`).value;
    for (let i = 0; i < 5; i++) await middleware(request(repeat));
    assert.equal(kv.counts.get(`ua:v2:${repeat}`).value, countsBefore + 5, 'repeat UA increments even when full');
    const fresh = `fresh-after-full/${Math.random()}`;
    await middleware(request(fresh));
    assert.equal(kv.counts.has(`ua:v2:${fresh}`), false, 'full quota: fresh UA creates no key');
    const budgetUsed = [...kv.budgets.values()].reduce((a, b) => a + b, 0);
    assert.equal(budgetUsed, 100, 'skipped fresh UA did not consume budget');
  } finally {
    cleanup();
  }
});

test('concurrent new and repeat requests in one minute admit exactly 100 distinct UAs', async () => {
  const kv = new FakeKV();
  const { cleanup, middleware } = await buildMiddleware(kv);
  try {
    const repeat = 'Mozilla/5.0 fixture-concurrent';
    await middleware(request(repeat)); // 1 admission, 1 count
    // Redis runs each EVAL whole, so the interleaving a real burst produces across the
    // minute boundary is what admission accounting must survive: 99 new UAs plus 100
    // repeats all in flight together still admit exactly 100 distinct UAs.
    const fresh = randomUa(99);
    const inFlight = [
      ...fresh.map((ua) => middleware(request(ua))),
      ...Array.from({ length: 100 }, () => middleware(request(repeat))),
    ];
    const responses = await Promise.all(inFlight);
    assert.equal(responses.every((res) => res.status === 200), true, 'no request is blocked');
    assert.equal(kv.liveCounts.length, 100, 'exactly 100 distinct UAs admitted in the minute');
    const budgetUsed = [...kv.budgets.values()].reduce((a, b) => a + b, 0);
    assert.equal(budgetUsed, 100, 'one budget slot per distinct UA, repeats cost none');
    assert.equal(kv.counts.get(`ua:v2:${repeat}`).value, 101, 'every repeat counted, none lost to a race');
  } finally {
    cleanup();
  }
});

test('minute-boundary spray admits 100 new UAs in each of 3 real minutes and rotates the budget key', async () => {
  const kv = new FakeKV();
  const { cleanup, middleware } = await buildMiddleware(kv);
  const clock = freezeClock(kv, LAST_MS_OF_A_MINUTE);
  try {
    const perMinute = [];
    for (let minute = 0; minute < 3; minute++) {
      const before = kv.admissions;
      for (const ua of randomUa(1000)) await middleware(request(ua));
      perMinute.push(kv.admissions - before);
      // Exactly the minute's budget, not "at most": a middleware that never rotates its
      // minute admits 100 in the first minute and then zero forever.
      assert.equal(perMinute[minute], 100, `minute ${minute} admits exactly 100 distinct UAs`);
      clock.advanceMs(60_000);
      // EX60 from admission: a full minute later those count keys are gone (the fake
      // treats expiry as inclusive), so nothing accumulates across minutes.
      assert.equal(kv.liveCounts.length, 0, `minute ${minute} keys expired at the boundary`);
    }
    assert.deepEqual(perMinute, [100, 100, 100], 'every minute gets a fresh budget');
    assert.equal(kv.budgetKeysSeen.size, 3, 'one budget key per UTC minute, and the key rotates');
    assert.ok(kv.budgets.size <= 3, `<=3 budget keys live with EX120 (got ${kv.budgets.size})`);
  } finally {
    clock.restore();
    cleanup();
  }
});

test('the admission minute rolls over: a full minute refuses new UAs, the next minute admits them', async () => {
  const kv = new FakeKV();
  const { cleanup, middleware } = await buildMiddleware(kv);
  const clock = freezeClock(kv, LAST_MS_OF_A_MINUTE);
  try {
    const firstMinute = clock.minute();
    for (const ua of randomUa(100)) await middleware(request(ua));
    assert.equal(kv.admissions, 100, 'the minute is full');

    // Negative: one millisecond before the boundary the cap is hard. A new UA is refused,
    // and refusing it costs no budget.
    const refused = 'boundary-refused/1.0';
    await middleware(request(refused));
    assert.equal(kv.counts.has(`ua:v2:${refused}`), false, 'a new UA is refused at the end of a full minute');
    assert.equal(kv.admissions, 100, 'a refused UA is never admitted');
    assert.equal(kv.budgets.get(`ua:budget:${firstMinute}`), 100, 'the full minute stays exactly at its budget');

    // Positive: the next millisecond is a new minute with a new budget key, so a fresh
    // distinct UA is admitted - the thing a never-rotating minute makes impossible.
    clock.advanceMs(1);
    const nextMinute = clock.minute();
    assert.equal(nextMinute, firstMinute + 1, 'the clock crossed the UTC minute');
    const admitted = 'boundary-admitted/1.0';
    await middleware(request(admitted));
    assert.equal(kv.counts.get(`ua:v2:${admitted}`)?.value, 1, 'the next minute admits a fresh UA');
    assert.equal(kv.budgets.get(`ua:budget:${nextMinute}`), 1, 'the new minute starts its own budget at 1');
    assert.equal(kv.budgets.get(`ua:budget:${firstMinute}`), 100, 'the old minute budget is untouched, not reused');
    assert.deepEqual([...kv.budgetKeysSeen].sort(), [`ua:budget:${firstMinute}`, `ua:budget:${nextMinute}`].sort());

    // The previous minute's count keys expire on their own 60s clock, not on the minute
    // boundary: just after the rollover both minutes' keys are live at once...
    assert.equal(kv.liveCounts.length, 101, 'minute-1 keys are still inside their 60s window just after the boundary');
    // ...and exactly 60s after minute-1 was admitted (59.999s from now) only the new
    // admission survives, because it was created 1ms later.
    clock.advanceMs(59_999);
    assert.deepEqual(kv.liveCounts, [`ua:v2:${admitted}`], 'minute-1 count keys expired 60s after admission');
  } finally {
    clock.restore();
    cleanup();
  }
});

test('count keys expire 60s after admission and the minute budget key expires after 120s', async () => {
  const kv = new FakeKV();
  const { cleanup, middleware } = await buildMiddleware(kv);
  try {
    const ua = 'mozilla/5.0 expiry-fixture';
    await middleware(request(ua));
    // Read the key names the middleware actually wrote rather than recomputing the
    // minute from Date.now(): recomputing races a minute boundary and would flake the
    // moment the two calls straddle xx:59.999.
    const [countKey, budgetKey] = kv.lastKeys;

    assert.equal(kv.ttl(countKey), 60, 'the count key is stored with EX 60');
    assert.equal(kv.ttl(budgetKey), 120, 'the minute budget key is stored with EX 120');

    // A repeat request must not refresh the count key's TTL (ADR 7wx: no sliding
    // window, otherwise traffic alone keeps a key alive forever).
    kv.advanceSeconds(30);
    await middleware(request(ua));
    assert.equal(kv.ttl(countKey), 30, 'a repeat does not extend the count key expiry');

    kv.advanceSeconds(30); // 60s after admission
    assert.equal(kv.liveCounts.length, 0, 'the count key is gone 60s after admission');
    assert.equal(kv.budgets.size, 1, 'the budget key is still live at 60s');

    kv.advanceSeconds(60); // 120s after admission
    assert.equal(kv.budgets.size, 0, 'the budget key is gone 120s after admission');
  } finally {
    cleanup();
  }
});

test('missing and oversize headers never reach KV; the 512 limit is UTF-8 bytes', async () => {
  const kv = new FakeKV();
  const { cleanup, middleware } = await buildMiddleware(kv);
  try {
    await middleware(request(undefined));
    assert.equal(kv.evalCalls, 0, 'missing UA: no KV call');
    // 300 chars but 600 UTF-8 bytes: a String.length check would admit this,
    // the byte check must refuse it. (Header values are ByteStrings, so
    // non-ASCII code points above 0xFF cannot ride a Request header.)
    await middleware(request('\u00ff'.repeat(300)));
    assert.equal(kv.evalCalls, 0, '600 UTF-8 bytes in 300 chars: no KV call');
    await middleware(request('a'.repeat(512)));
    assert.equal(kv.evalCalls, 1, 'exactly 512 bytes is admitted');
    await middleware(request(`${'a'.repeat(512)}b`));
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
    await Promise.all(Array.from({ length: 50 }, () => middleware(request(ua))));
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
    await middleware(request('wire-shape/1.0'));
    // The script text is the one from middleware.ts, executed above: these assertions
    // pin the parts the fake cannot model - SET .. NX is the only defence against two
    // concurrent first-sighters of the same UA overwriting each other's count.
    assert.match(kv.script, /SET/, 'script stores counts');
    assert.match(kv.script, /'NX'/, 'admission is NX - a different UA is never overwritten');
    assert.match(kv.script, /'EX'/, 'counts are stored with expiry');
    assert.equal(kv.lastKeys[0], 'ua:v2:wire-shape/1.0', 'the count key is the ua:v2 namespace');
    // The minute comes from the clock, so match the shape and check it is the current
    // minute rather than recomputing it (which races a minute boundary).
    assert.match(kv.lastKeys[1], /^ua:budget:\d+$/, 'the budget key is ua:budget:<minute>');
    const minute = Number(kv.lastKeys[1].slice('ua:budget:'.length));
    assert.ok(Math.abs(Date.now() / 60000 - minute) < 2, 'the budget key is the current UTC minute');
    // ARGV[4] is the per-UA count ceiling (paul-kinlan-me-1vhf): the published
    // number must not be inflatable without bound.
    assert.deepEqual(kv.lastArgs, ['100', '60', '120', '1000']);
  } finally {
    cleanup();
  }
});

// paul-kinlan-me-1vhf: /api/user-agents republishes the ua:v2:<UA> count verbatim,
// so an uncapped INCR let one client drive a published number to any value. The
// script now stops counting at a ceiling; below it the count stays exact, so the
// no-lost-updates property the INCR exists for is untouched.
test('one client cannot inflate a published UA count past the ceiling (1vhf)', async () => {
  const kv = new FakeKV();
  const { cleanup, middleware } = await buildMiddleware(kv);
  try {
    const spammer = 'spam-fixture/1.0';
    const key = `ua:v2:${spammer}`;

    // 1005 hits of ONE UA: the count saturates at 1000 and every request is still
    // served (the clamp bounds the statistic, not the visitor).
    for (let i = 0; i < 1005; i += 1) {
      const res = await middleware(request(spammer));
      assert.equal(res.status, 200, `request ${i} still served`);
    }

    assert.equal(kv.counts.get(key).value, 1000, 'the stored count is pinned at the ceiling');
    assert.equal(kv.counts.get(key).value <= 1000, true, 'the count never exceeds the ceiling');

    // A different UA is unaffected by the spammer hitting its own ceiling.
    const ordinary = 'sensible-agent/2.0';
    await middleware(request(ordinary));
    await middleware(request(ordinary));
    assert.equal(kv.counts.get(`ua:v2:${ordinary}`).value, 2, 'other UAs keep exact counts');

    // The 1004 saturated repeats consumed no admission budget: only the two distinct
    // UAs (spammer and ordinary) were new keys.
    assert.equal([...kv.budgets.values()].reduce((a, b) => a + b, 0), 2, 'repeat hits are not new UA admissions');
  } finally {
    cleanup();
  }
});

test('below the ceiling a repeat UA still counts exactly, one per request (1vhf regression guard)', async () => {
  const kv = new FakeKV();
  const { cleanup, middleware } = await buildMiddleware(kv);
  try {
    const ua = 'steady-fixture/1.0';
    for (let i = 0; i < 25; i += 1) await middleware(request(ua));
    assert.equal(kv.counts.get(`ua:v2:${ua}`).value, 25, 'no ceiling effect below the limit');
  } finally {
    cleanup();
  }
});
