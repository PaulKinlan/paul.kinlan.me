// Admission-budget tests for /ask-paul (api/ask-paul.ts + lib/ask-paul-admission.js,
// paul-kinlan-me-gjsg).
//
// The finding: /ask-paul is a public, unauthenticated edge function whose whole
// job is to spend money - it fetches its own /api/polymath.js, which bills
// OpenAI. middleware.ts's matcher excludes /api, so the User-Agent admission
// quota never covered this route and nothing in the handler capped how often a
// caller could make it spend: the rate was whatever an anonymous caller chose.
//
// What ships: one atomic Redis EVAL per request, before any paid work, against
// a global per-minute budget key `askpaul:budget:<minute>` (EX120). Over budget
// the answer is 429 with Cache-Control: no-store and ZERO upstream calls; a KV
// failure is a fail-closed 503 with no-store (the paul-kinlan-me-6xr contract,
// the same one api/activitypub-html/render.ts and api/user-agents.ts use). The
// budget is deliberately global, not per-caller: the only caller identities on
// edge are spoofable headers or the shared egress IP that paul-kinlan-me-a43
// already records as a bug.
//
// The handler is bundled with esbuild and driven through the seam the lib
// resolves per call (globalThis.__askPaulAdmissionKv), and the fake redis
// EXECUTES the shipped script text through the shared luaToJs harness
// (tests/helpers/lua-redis.mjs) rather than modelling its semantics by hand
// (paul-kinlan-me-3s4). Fast tier: no browser, no network, no shared state.
// Run with: node --test tests/ask-paul-admission.test.mjs
import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

import { build } from 'esbuild';

import { FakeRedis, LAST_MS_OF_A_MINUTE, freezeClock, luaToJs } from './helpers/lua-redis.mjs';
import { ADMISSION_SCRIPT, MAX_ANSWERS_PER_MINUTE } from '../lib/ask-paul-admission.js';

const dir = mkdtempSync(join(tmpdir(), 'ask-paul-admission-'));
const bundlePath = join(dir, 'handler.mjs');
const built = await build({
  entryPoints: [new URL('../api/ask-paul.ts', import.meta.url).pathname],
  bundle: true,
  platform: 'neutral',
  format: 'esm',
  write: false,
  logLevel: 'silent',
});
writeFileSync(bundlePath, built.outputFiles[0].contents);
const { default: handler } = await import(`file://${bundlePath}`);

// One adapter over the real route: the KV seam, an upstream counter standing in
// for the paid call, and the response read back as text.
const drive = async (kv) => {
  globalThis.__askPaulAdmissionKv = kv;
  let upstreamCalls = 0;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    upstreamCalls += 1;
    return Response.json({ completion: 'A working answer', infos: [] });
  };
  return {
    upstreamCalls: () => upstreamCalls,
    ask: async (query = 'hi') => {
      const response = await handler(new Request(`https://paul.kinlan.me/ask-paul?query=${encodeURIComponent(query)}`));
      const body = await response.text();
      return { status: response.status, headers: response.headers, body };
    },
    restore: () => {
      globalThis.fetch = originalFetch;
      delete globalThis.__askPaulAdmissionKv;
    },
  };
};

// The finding's repro, closed: N answers are served, and the (N+1)th request in
// the same minute is refused BEFORE the paid call rather than after it.
test('the per-minute budget caps paid answers: 30 served, then 429 with no upstream call', async () => {
  const kv = new FakeRedis();
  const route = await drive(kv);
  const clock = freezeClock(kv, LAST_MS_OF_A_MINUTE);
  try {
    for (let i = 0; i < MAX_ANSWERS_PER_MINUTE; i++) {
      const res = await route.ask(`question ${i}`);
      assert.equal(res.status, 200, `answer ${i} inside the budget`);
      assert.match(res.body, /<article class="completion">A working answer<\/article>/);
    }
    assert.equal(route.upstreamCalls(), MAX_ANSWERS_PER_MINUTE, 'every admitted request pays for exactly one answer');

    const refused = await route.ask('one too many');
    assert.equal(refused.status, 429, 'over the budget is a 429');
    assert.equal(refused.headers.get('cache-control'), 'no-store',
      'a 429 must never be edge-cached - a cached one would deny the page its answer after the minute rolls over');
    assert.equal(refused.headers.get('retry-after'), '60');
    assert.equal(refused.headers.get('content-type'), 'text/plain; charset=utf-8');
    assert.equal(route.upstreamCalls(), MAX_ANSWERS_PER_MINUTE, 'a refused request makes ZERO paid calls');
    assert.ok(!refused.body.includes('one too many'), 'the refusal does not reflect the query back');
    assert.ok(!refused.body.includes('<'), 'the refusal is inert text, never markup');

    // The next minute admits again: the budget is a rate, not a ban.
    clock.advanceMs(60_000);
    const next = await route.ask('a fresh minute');
    assert.equal(next.status, 200, 'the next minute gets a fresh budget');
    assert.equal(route.upstreamCalls(), MAX_ANSWERS_PER_MINUTE + 1);
  } finally {
    clock.restore();
    route.restore();
  }
});

// Fail-closed on KV failure (the 6xr contract): an outage must not silently
// restore the unbounded spending lever, and the 503 must leave nothing storable.
test('a KV failure is a 503 with no-store and zero paid calls; recovery restores answers', async () => {
  let evalCalls = 0;
  const failing = { eval: async () => { evalCalls += 1; throw new Error('kv unavailable'); } };
  const route = await drive(failing);
  try {
    const res = await route.ask('any question');
    assert.equal(res.status, 503, 'KV down fails closed');
    assert.equal(res.headers.get('cache-control'), 'no-store', 'the 503 is not storable');
    assert.equal(evalCalls, 1, 'one admission attempt, no retry loop');
    assert.equal(route.upstreamCalls(), 0, 'a KV failure makes zero paid calls');
    assert.ok(!res.body.includes('<'), 'the 503 body is inert text');

    // Recovery: the seam delegates per call, so restoring the store is what a
    // recovered KV looks like to the next request.
    globalThis.__askPaulAdmissionKv = new FakeRedis();
    const recovered = await route.ask('any question');
    assert.equal(recovered.status, 200, 'answers resume when KV recovers');
    assert.equal(route.upstreamCalls(), 1);
  } finally {
    route.restore();
  }
});

// The cu3 lesson applied to the fix itself: admission must not mint unbounded
// KV keys, and it must stay one round-trip per request with no scans.
test('a spray of refused requests mints one bounded key per minute, and every script line is executed', async () => {
  const kv = new FakeRedis();
  const route = await drive(kv);
  const clock = freezeClock(kv, LAST_MS_OF_A_MINUTE);
  try {
    for (let i = 0; i < 200; i++) await route.ask(`spray ${i}`);

    assert.equal(route.upstreamCalls(), MAX_ANSWERS_PER_MINUTE, 'paid answers are flat once the budget is spent');
    assert.equal(kv.evalCalls, 200, 'one KV round-trip per request, no scans');
    assert.deepEqual([...kv.values.keys()], [`askpaul:budget:${clock.minute()}`],
      'exactly one key for the minute - nothing keyed by caller input');

    // Wire shape, read off the LAST eval: the shipped script text, the budget
    // key, and the exported cap and TTL as args.
    assert.equal(kv.script, ADMISSION_SCRIPT, 'the script the module ships is the script that ran');
    assert.deepEqual(kv.lastKeys, [`askpaul:budget:${clock.minute()}`]);
    assert.deepEqual(kv.lastArgs, [String(MAX_ANSWERS_PER_MINUTE), '120']);

    // Every non-comment line of the shipped script translated - a skipped line
    // would be behaviour this suite never observes (paul-kinlan-me-3s4).
    const meaningfulLines = ADMISSION_SCRIPT.split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '' && !line.startsWith('--'));
    assert.equal(luaToJs(ADMISSION_SCRIPT).split('\n').length, meaningfulLines.length,
      'every script line is translated, none skipped');

    // The key lives exactly its TTL, so nothing accumulates across minutes.
    const key = `askpaul:budget:${clock.minute()}`;
    const ttl = kv.ttl(key);
    assert.ok(ttl > 0 && ttl <= 120, `budget key TTL within its window (got ${ttl})`);
    clock.advanceMs(121_000);
    assert.equal(kv.values.has(key), false, 'the budget key expires on its TTL');
  } finally {
    clock.restore();
    route.restore();
  }
});
