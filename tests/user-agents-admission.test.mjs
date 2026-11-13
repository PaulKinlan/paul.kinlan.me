// Admission-budget tests for /api/user-agents (api/user-agents.ts,
// paul-kinlan-me-60e8).
//
// The finding: traversal per request was already bounded (MAX_SCAN_ITERATIONS 5,
// MAX_KEYS 100, one batched MGET), but middleware.ts's matcher excludes /api
// (middleware.ts:5), so nothing bounded how many requests a caller could make.
// Each anonymous GET cost up to 5 KV SCANs plus a 100-key MGET at whatever rate
// the caller chose - read cost scaled with attacker request rate, not with
// visitor traffic.
//
// What ships: one atomic Redis EVAL per request, BEFORE any SCAN, against a
// global fixed-minute budget key `uapage:budget:<minute>` (EX120,
// MAX_PAGE_READS_PER_MINUTE=120). Over budget is 429 + Cache-Control: no-store +
// Retry-After: 60 with zero SCANs; a KV failure fails CLOSED with 503 and
// no-store, the read path's existing contract (paul-kinlan-me-6xr). A 200 is
// publicly cached for 60s, so a CDN hit never reaches the function and never
// spends budget.
//
// The fake redis EXECUTES the shipped script text through the shared luaToJs
// harness (tests/helpers/lua-redis.mjs) rather than modelling its semantics by
// hand (paul-kinlan-me-3s4). Fast tier: no browser, no network, no shared state.
// Run with: node --test tests/user-agents-admission.test.mjs
import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import { FakeRedis, LAST_MS_OF_A_MINUTE, freezeClock, luaToJs } from './helpers/lua-redis.mjs';
import {
  MAX_PAGE_READS_PER_MINUTE,
  MAX_SCAN_ITERATIONS,
  createUserAgentsHandler,
} from '../api/user-agents.ts';

// A store whose every SCAN and MGET is counted, so "a refused request scans
// nothing" is asserted rather than assumed. The scan returns one page of
// `ua:v2:` keys so an admitted request is a real read.
const createStore = (fakeRedis, pageSize = 10) => {
  const counts = { scans: 0, mgets: 0, mgetKeys: 0 };
  const store = {
    eval: (...args) => fakeRedis.eval(...args),
    async scan(cursor) {
      counts.scans += 1;
      const page = parseInt(String(cursor), 10);
      const keys = [];
      for (let i = 0; i < pageSize; i++) keys.push(`ua:v2:UA-${page}-${i}`);
      return [String(page + 1), keys];
    },
    async mget(keys) {
      counts.mgets += 1;
      counts.mgetKeys += keys.length;
      return keys.map((_, i) => i + 1);
    },
  };
  return { store, counts };
};

const createMockResponse = () => ({
  statusCode: 0,
  headers: {},
  body: null,
  setHeader(key, value) { this.headers[key.toLowerCase()] = value; },
  json(data) { this.body = data; },
  end(data) { this.body = JSON.parse(data); },
});

const get = (handler) => {
  const res = createMockResponse();
  return handler({}, res).then(() => res);
};

// The finding's repro, closed: after the budget is spent, further requests are
// refused BEFORE the scan, so KV read volume stops growing with request rate.
test('the per-minute budget caps reads: 120 served, then 429 with zero SCANs', async () => {
  const kv = new FakeRedis();
  const { store, counts } = createStore(kv);
  const handler = createUserAgentsHandler(store);
  const clock = freezeClock(kv, LAST_MS_OF_A_MINUTE);
  try {
    for (let i = 0; i < MAX_PAGE_READS_PER_MINUTE; i++) {
      const res = await get(handler);
      assert.equal(res.statusCode, 200, `read ${i} inside the budget`);
      assert.equal(res.headers['cache-control'], 'public, s-maxage=60, stale-while-revalidate=120');
    }
    const scansWhileAdmitted = counts.scans;
    // The stub keyspace never completes (the cursor never reaches '0'), so every
    // admitted read runs the full MAX_SCAN_ITERATIONS loop - the worst case the
    // budget has to bound.
    assert.equal(scansWhileAdmitted, MAX_PAGE_READS_PER_MINUTE * MAX_SCAN_ITERATIONS,
      'each admitted read scans the bounded worst case');

    const refused = await get(handler);
    assert.equal(refused.statusCode, 429, 'over the budget is a 429');
    assert.equal(refused.headers['cache-control'], 'no-store, no-cache, must-revalidate',
      'a 429 must never be edge-cached - a cached one would deny the table after the minute rolls over');
    assert.equal(refused.headers['retry-after'], '60');
    assert.deepEqual(refused.body, { error: 'Too many requests' });
    assert.equal(counts.scans, scansWhileAdmitted, 'a refused request issues ZERO SCANs');
    assert.equal(counts.mgets, MAX_PAGE_READS_PER_MINUTE, 'and no MGET either');

    // The next minute admits again: a rate, not a ban.
    clock.advanceMs(60_000);
    const next = await get(handler);
    assert.equal(next.statusCode, 200, 'the next minute gets a fresh budget');
    assert.equal(counts.scans, scansWhileAdmitted + MAX_SCAN_ITERATIONS);
  } finally {
    clock.restore();
  }
});

// Fail-closed on KV failure: an outage must not restore the unbounded read
// lever, and the 503 must leave nothing storable.
test('a KV failure is a 503 with no-store and zero SCANs; recovery restores reads', async () => {
  const { store, counts } = createStore(new FakeRedis());
  let evalCalls = 0;
  const failing = { ...store, eval: async () => { evalCalls += 1; throw new Error('kv unavailable'); } };
  const handler = createUserAgentsHandler(failing);

  const res = await get(handler);
  assert.equal(res.statusCode, 503, 'KV down fails closed');
  assert.equal(res.headers['cache-control'], 'no-store, no-cache, must-revalidate');
  assert.deepEqual(res.body, { error: 'Temporary storage error' });
  assert.equal(evalCalls, 1, 'one admission attempt, no retry loop');
  assert.equal(counts.scans, 0, 'a KV failure scans nothing');

  const recovered = createUserAgentsHandler(store);
  const after = await get(recovered);
  assert.equal(after.statusCode, 200, 'reads resume when KV recovers');
  assert.ok(counts.scans >= 1, 'and the scan runs again');
});

// The cu3 lesson applied to the fix itself: admission must not mint unbounded
// KV keys, and the wire shape is the shipped script with the exported cap.
test('refused requests mint one bounded key per minute, and every script line is executed', async () => {
  const kv = new FakeRedis();
  const { store } = createStore(kv);
  const handler = createUserAgentsHandler(store);
  const clock = freezeClock(kv, LAST_MS_OF_A_MINUTE);
  try {
    for (let i = 0; i < MAX_PAGE_READS_PER_MINUTE + 80; i++) await get(handler);

    assert.deepEqual([...kv.values.keys()], [`uapage:budget:${clock.minute()}`],
      'exactly one key for the minute - nothing keyed by caller input');
    assert.deepEqual(kv.lastKeys, [`uapage:budget:${clock.minute()}`]);
    assert.deepEqual(kv.lastArgs, [String(MAX_PAGE_READS_PER_MINUTE), '120']);
    assert.equal(kv.evalCalls, MAX_PAGE_READS_PER_MINUTE + 80, 'one KV round-trip per request, no scans');

    // Every non-comment line of the shipped script translated (paul-kinlan-me-3s4).
    const meaningfulLines = kv.script.split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '' && !line.startsWith('--'));
    assert.equal(luaToJs(kv.script).split('\n').length, meaningfulLines.length,
      'every script line is translated, none skipped');
    assert.match(kv.script, /redis\.call\('INCR', KEYS\[1\]\)/);
    assert.match(kv.script, /EXPIRE/);

    const key = `uapage:budget:${clock.minute()}`;
    const ttl = kv.ttl(key);
    assert.ok(ttl > 0 && ttl <= 120, `budget key TTL within its window (got ${ttl})`);
    clock.advanceMs(121_000);
    assert.equal(kv.values.has(key), false, 'the budget key expires on its TTL');
  } finally {
    clock.restore();
  }
});
