// Request-level admission tests for the User-Agent quota middleware (ADR 7wx,
// paul-kinlan-me-cu3).
//
// The REAL middleware.ts is bundled with esbuild (same harness shape as
// tests/card.test.mjs); '@vercel/edge' and '@vercel/kv' are stubbed at the module
// boundary, so these tests drive the shipped middleware function, not a copy of it.
//
// The first version of this suite replaced `kv.eval` with a HAND-WRITTEN JS model of
// ADMISSION_SCRIPT's semantics, which meant the Lua was never executed and the model
// could keep passing while the script changed underneath it: deleting the per-minute
// admission gate (`if used >= tonumber(ARGV[1]) then` -> `if false then`) and deleting
// the count key's expiry (`'EX', tonumber(ARGV[2])` -> nothing) left all six tests
// green (paul-kinlan-me-3s4). The tests were measuring the model, not the code.
//
// So the fake KV now EXECUTES the script text that middleware.ts ships. There is no
// Redis (and no Lua) on this host and the fast gate must stay offline and fast, so
// `luaToJs` translates the construct subset ADMISSION_SCRIPT actually uses into a JS
// function and hands it a fake redis table. It is deliberately strict: an
// unrecognised line throws, because a silently skipped line is exactly the drift this
// suite exists to catch - a new Lua construct must fail here, loudly, and be modelled.
//
// Stated limits, pinned rather than pretended:
//   * Redis's own atomicity is not reproduced; the fake runs one EVAL to completion at a
//     time, which is the order Redis guarantees for the whole script, so concurrent
//     request tests exercise admission accounting, not SET .. NX race behaviour. The NX
//     guard is therefore pinned textually in the wire-shape test below.
//   * TTLs are simulated on a fake clock the test advances; the script never reads a
//     clock, so this models Redis's expiry, not the middleware's.
//
// Fast tier: no browser, no network, no shared state between tests.
import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

import { build } from 'esbuild';

const EDGE_STUB = `export const next = async () => new Response(null, { status: 200 });`;

// ---------------------------------------------------------------------------
// Lua -> JS, for the construct subset ADMISSION_SCRIPT uses.
//
// Supported: `--` comments, `local x = expr`, `if expr then`, `else`, `end`,
// `return { ... }`, and bare calls. Expressions support identifiers, string/number
// literals, `redis.call(...)`, `tonumber(...)`, table constructors used as return
// values, `not`, `and`, `or` (nullish default) and `==`/`~=`/`>=`/`<` comparisons.
//
// Anything else throws. That is the point: the harness must never quietly ignore a line
// of the script it was asked to execute.
// ---------------------------------------------------------------------------
const luaExprToJs = (expression) =>
  expression
    .replace(/\btonumber\s*\(/g, 'Number(')
    .replace(/\bnot\b\s*/g, '!')
    .replace(/\band\b/g, '&&')
    .replace(/\bor\b/g, '??')
    .replace(/~=/g, '!==')
    .replace(/==/g, '===')
    .replace(/\{([^{}]*)\}/g, '[$1]');

export function luaToJs(source) {
  const statements = [];
  for (const raw of source.split('\n')) {
    const line = raw.trim();
    if (line === '' || line.startsWith('--')) continue;

    const local = line.match(/^local\s+([A-Za-z_]\w*)\s*=\s*(.+)$/);
    if (local) {
      statements.push(`let ${local[1]} = ${luaExprToJs(local[2])};`);
      continue;
    }

    const condition = line.match(/^if\s+(.+)\s+then$/);
    if (condition) {
      statements.push(`if (${luaExprToJs(condition[1])}) {`);
      continue;
    }

    if (line === 'else') {
      statements.push('} else {');
      continue;
    }

    if (line === 'end') {
      statements.push('}');
      continue;
    }

    const returned = line.match(/^return\s+(\{.*\})$/);
    if (returned) {
      statements.push(`return ${luaExprToJs(returned[1])};`);
      continue;
    }

    // A bare statement: a redis.call(...) whose reply the script ignores.
    if (/^[A-Za-z_][\w.]*\s*\(.*\)$/.test(line)) {
      statements.push(`${luaExprToJs(line)};`);
      continue;
    }

    throw new Error(
      `lua-admission harness: unsupported Lua construct, model it here rather than skipping it: ${line}`,
    );
  }
  return statements.join('\n');
}

const compiled = new Map();
const compileScript = (source) => {
  if (!compiled.has(source)) compiled.set(source, new Function('redis', 'KEYS', 'ARGV', luaToJs(source)));
  return compiled.get(source);
};

// Fake redis: the commands ADMISSION_SCRIPT calls, with Redis's TTL semantics
// (INCR preserves a key's TTL; SET with EX sets it; SET NX refuses an existing key),
// on a simulated clock so expiry is observable without waiting 60 real seconds.
class FakeKV {
  values = new Map(); // key -> string value
  expiresAt = new Map(); // key -> absolute simulated second
  nowSeconds = 1_200_000; // arbitrary epoch
  evalCalls = 0;
  // Lifetimes of the run, independent of expiry: how many distinct UAs were ever admitted
  // and how many different minute budget keys the middleware asked for.
  admissions = 0;
  budgetKeysSeen = new Set();

  advanceSeconds(seconds) {
    this.nowSeconds += seconds;
    this.purge();
  }

  advanceMinutes(minutes) {
    this.advanceSeconds(minutes * 60);
  }

  // A frozen clock has to move BOTH clocks: the fake's TTL clock and the middleware's own
  // Date.now(), which is what names the minute's budget key. Advancing only this one was
  // the defect in paul-kinlan-me-bgn: the suite never crossed a middleware minute, so a
  // middleware whose minute never rotates passed.
  frozen(ms) {
    this.nowSeconds = Math.floor(ms / 1000);
    return this;
  }

  purge() {
    for (const [key, at] of this.expiresAt) {
      if (at <= this.nowSeconds) {
        this.values.delete(key);
        this.expiresAt.delete(key);
      }
    }
  }

  // --- assertions helpers -------------------------------------------------
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

  ttl(key) {
    this.purge();
    if (!this.values.has(key)) return -2; // Redis: no such key
    const at = this.expiresAt.get(key);
    return at === undefined ? -1 : at - this.nowSeconds; // -1: key has no expiry
  }

  // --- the redis table the script talks to --------------------------------
  eval(script, keys, args) {
    this.evalCalls += 1;
    this.script = script;
    this.lastKeys = keys;
    this.lastArgs = args;
    const run = compileScript(script);
    // Lua tables are 1-based: Redis hands KEYS and ARGV to a script as tables indexed
    // from 1, so a JS array would silently shift every lookup by one (KEYS[1] would be
    // the SECOND key, ARGV[1] the second argument).
    const luaKeys = [null, ...keys];
    const luaArgs = [null, ...args];
    // Redis serialises EVAL: one script runs to completion before the next starts.
    return run({ call: (command, ...commandArgs) => this.call(String(command).toUpperCase(), commandArgs) }, luaKeys, luaArgs);
  }

  call(command, args) {
    this.purge();
    switch (command) {
      case 'GET': {
        const value = this.values.get(args[0]);
        return value === undefined ? null : value;
      }
      case 'EXISTS':
        return this.values.has(args[0]) ? 1 : 0;
      case 'INCR': {
        // Redis INCR keeps the key's existing TTL.
        const next = Number(this.values.get(args[0]) ?? 0) + 1;
        this.values.set(args[0], String(next));
        return next;
      }
      case 'SET': {
        const [key, value, ...options] = args;
        let onlyIfAbsent = false;
        let expiresIn = null;
        for (let index = 0; index < options.length; index += 1) {
          const option = String(options[index]).toUpperCase();
          if (option === 'NX') onlyIfAbsent = true;
          else if (option === 'EX') {
            expiresIn = Number(options[index + 1]);
            index += 1;
          } else {
            throw new Error(`fake redis: unsupported SET option ${options[index]}`);
          }
        }
        if (onlyIfAbsent && this.values.has(key)) return null;
        this.values.set(key, String(value));
        if (key.startsWith('ua:v2:')) this.admissions += 1;
        if (key.startsWith('ua:budget:')) this.budgetKeysSeen.add(key);
        if (expiresIn === null) this.expiresAt.delete(key);
        else this.expiresAt.set(key, this.nowSeconds + expiresIn);
        return { ok: 'OK' };
      }
      default:
        throw new Error(`fake redis: unsupported command ${command}`);
    }
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

// The middleware names the minute it admits into from Date.now(), so a test that only
// advances FakeKV's TTL clock never crosses a minute: the budget key stays the same, and
// the cap holds forever. Freeze the real clock for the duration of a test and move the
// fake's TTL clock with it, so "the next minute" means the same thing to both.
const freezeClock = (kv, startMs) => {
  const realNow = Date.now;
  let ms = startMs;
  Date.now = () => ms;
  kv.frozen(ms);
  return {
    minute: () => Math.floor(ms / 60000),
    // Advance both clocks by the same amount; callers use whole seconds.
    advanceMs(deltaMs) {
      ms += deltaMs;
      kv.advanceSeconds(deltaMs / 1000);
    },
    restore() {
      Date.now = realNow;
    },
  };
};

// A frozen instant one millisecond before a minute rolls over - the worst place to test
// a boundary, which is the point.
const LAST_MS_OF_A_MINUTE = Date.parse('2026-01-01T00:00:59.999Z');

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
      "let used = Number(redis.call('GET', KEYS[2])) ?? 0;",
    );
    assert.equal(luaToJs('return {0, 0}'), 'return [0, 0];');
    assert.equal(luaToJs('if not created then'), 'if (!created) {');
  } finally {
    cleanup();
  }
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
    assert.deepEqual(kv.lastArgs, ['100', '60', '120']);
  } finally {
    cleanup();
  }
});
