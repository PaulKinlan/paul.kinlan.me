import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import {
  createUserAgentsHandler,
  MAX_SCAN_ITERATIONS,
  MAX_KEYS,
  SCAN_COUNT_HINT,
  MAX_RESPONSE_ROWS,
  MAX_UA_LENGTH,
} from '../api/user-agents.ts';

function createMockResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(key, value) {
      this.headers[key.toLowerCase()] = value;
    },
    json(data) {
      this.body = data;
    },
    end(data) {
      this.body = JSON.parse(data);
    },
  };
}

test('user-agents endpoint constants are properly bounded', () => {
  assert.equal(MAX_SCAN_ITERATIONS, 5, 'must bound scan iterations to 5');
  assert.equal(MAX_KEYS, 100, 'must bound collected keys to 100');
  assert.equal(SCAN_COUNT_HINT, 100, 'must hint scan count to 100');
  assert.equal(MAX_RESPONSE_ROWS, 100, 'must bound response rows to 100');
  assert.equal(MAX_UA_LENGTH, 512, 'must bound UA string length to 512 bytes');
});

test('bot-churn scenario: 10,000 keys across 100 pages is strictly bounded', async () => {
  const totalKeys = 10000;
  const pageSize = 100;
  let scanCalls = 0;
  let mgetCalls = 0;
  let mgetKeysCount = 0;

  const mockKv = {
    async scan(cursor, options) {
      scanCalls++;
      assert.equal(options?.match, 'ua:v2:*', 'must match only the ua:v2: visitor keyspace (paul-kinlan-me-sb4)');
      assert.equal(options?.count, 100, 'must hint scan count of 100');
      const pageIndex = parseInt(cursor, 10);
      const start = pageIndex * pageSize;
      const end = start + pageSize;
      const nextCursor = end >= totalKeys ? '0' : String(pageIndex + 1);

      const keys = [];
      for (let i = start; i < end && i < totalKeys; i++) {
        keys.push(`ua:v2:Bot-User-Agent-${i}`);
      }
      return [nextCursor, keys];
    },
    async mget(keys) {
      mgetCalls++;
      mgetKeysCount += keys.length;
      return keys.map((_, i) => i + 1);
    },
  };

  const handler = createUserAgentsHandler(mockKv);
  const req = {};
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(scanCalls, 1, 'must stop scanning once MAX_KEYS (100) are collected on first page');
  assert.equal(mgetCalls, 1, 'must issue only 1 batched mget call');
  assert.equal(mgetKeysCount, 100, 'must query mget for at most 100 keys');
  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['content-type'], 'application/json');
  assert.equal(res.headers['cache-control'], 'public, s-maxage=60, stale-while-revalidate=120');
  assert.equal(res.headers['x-sampling-policy'], 'bounded-sample-100');
  assert.equal(Array.isArray(res.body), true);
  assert.equal(res.body.length, 100, 'response must be capped at 100 rows');

  for (const row of res.body) {
    assert.equal(row.length, 2);
    assert.equal(typeof row[0], 'string');
    assert.equal(typeof row[1], 'number');
  }

  const oldEquivalentScanCalls = totalKeys / pageSize; // 100
  const oldEquivalentMgetCalls = totalKeys / pageSize; // 100
  const oldEquivalentRows = totalKeys; // 10,000
  assert.ok(scanCalls < oldEquivalentScanCalls, `scan calls capped (${scanCalls} vs ${oldEquivalentScanCalls})`);
  assert.ok(mgetCalls < oldEquivalentMgetCalls, `mget calls capped (${mgetCalls} vs ${oldEquivalentMgetCalls})`);
  assert.ok(res.body.length < oldEquivalentRows, `rows capped (${res.body.length} vs ${oldEquivalentRows})`);
});

test('sparse keyspace hitting MAX_SCAN_ITERATIONS bounds iterations to 5 and marks sample', async () => {
  let scanCalls = 0;
  let mgetCalls = 0;

  const mockKv = {
    async scan(cursor) {
      scanCalls++;
      const pageIndex = parseInt(cursor, 10);
      const nextCursor = String(pageIndex + 1);
      const keys = Array.from({ length: 10 }, (_, i) => `ua:v2:Sparse-UA-${pageIndex}-${i}`);
      return [nextCursor, keys];
    },
    async mget(keys) {
      mgetCalls++;
      return keys.map(() => 5);
    },
  };

  const handler = createUserAgentsHandler(mockKv);
  const req = {};
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(scanCalls, 5, 'must stop at MAX_SCAN_ITERATIONS (5)');
  assert.equal(mgetCalls, 1, 'must issue only 1 mget call');
  assert.equal(res.body.length, 50, 'must return 50 rows (5 iterations * 10 keys)');
  assert.equal(res.headers['x-sampling-policy'], 'bounded-sample-100');
});

test('small complete keyspace is marked exhaustive', async () => {
  const mockKv = {
    async scan() {
      return ['0', ['ua:v2:Chrome-1', 'ua:v2:Firefox-1']];
    },
    async mget(keys) {
      return [10, 5];
    },
  };

  const handler = createUserAgentsHandler(mockKv);
  const req = {};
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.length, 2);
  assert.equal(res.headers['x-sampling-policy'], 'exhaustive', 'exhaustive traversal when cursor completes under cap');
});

test('empty KV keyspace returns empty array without calling mget', async () => {
  let scanCalls = 0;
  let mgetCalls = 0;

  const mockKv = {
    async scan() {
      scanCalls++;
      return ['0', []];
    },
    async mget() {
      mgetCalls++;
      return [];
    },
  };

  const handler = createUserAgentsHandler(mockKv);
  const req = {};
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(scanCalls, 1, 'must perform initial scan');
  assert.equal(mgetCalls, 0, 'must not call mget when no keys found');
  assert.deepEqual(res.body, [], 'must return empty array');
});

test('sanitizes long UA strings, handles non-numeric counts, and sorts descending', async () => {
  const superLongKey = 'A'.repeat(1000);
  // Unsorted inputs to verify real descending sort
  const mockKv = {
    async scan() {
      return ['0', ['ua:v2:LowCount-UA', `ua:v2:${superLongKey}`, 'ua:v2:MidCount-UA', 'ua:v2:NullCount-UA']];
    },
    async mget() {
      return [3, '42', 15, null];
    },
  };

  const handler = createUserAgentsHandler(mockKv);
  const req = {};
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.body.length, 4);

  // Descending sort order verification: 42, 15, 3, 0
  assert.deepEqual(res.body.map(r => r[1]), [42, 15, 3, 0]);

  // Key length check
  const truncatedRow = res.body.find(r => r[0].startsWith('AAA'));
  assert.ok(truncatedRow);
  assert.equal(truncatedRow[0].length, 512, 'must truncate key to 512 chars');
  assert.equal(truncatedRow[1], 42);

  // Null count defaults to 0
  const nullRow = res.body.find(r => r[0] === 'NullCount-UA');
  assert.ok(nullRow);
  assert.equal(nullRow[1], 0);
});

test('ADR 7wx compatibility: strips ua:v2: prefix and aggregates counts across duplicate keys', async () => {
  const mockKv = {
    async scan() {
      return ['0', [
        'ua:v2:Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'ua:v2:Googlebot/2.1',
      ]];
    },
    async mget(keys) {
      assert.deepEqual(keys, [
        'ua:v2:Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'ua:v2:Googlebot/2.1',
      ]);
      return [30, 10];
    },
  };

  const handler = createUserAgentsHandler(mockKv);
  const req = {};
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, [
    ['Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 30],
    ['Googlebot/2.1', 10],
  ]);
});

test('keyspace isolation: foreign, budget and legacy v1 keys are never published or mget-ed (paul-kinlan-me-sb4)', async () => {
  // Defense in depth: even if the backend returns keys outside the ua:v2:* match,
  // the client-side prefix guard must drop them before mget and before the rows.
  const mockKv = {
    async scan(cursor, options) {
      assert.equal(options?.match, 'ua:v2:*');
      return ['0', [
        'ua:v2:Mozilla/5.0 (real visitor)',
        'ua:budget:29400000',                 // quota key (ADR 7wx)
        'mention-cache:example.org',           // foreign cache key
        'polymath:cache:v1',                   // foreign cache key
        'Mozilla/5.0 (legacy v1 raw key)',     // v1 un-prefixed key (dead keyspace)
      ]];
    },
    async mget(keys) {
      assert.deepEqual(keys, ['ua:v2:Mozilla/5.0 (real visitor)'], 'only ua:v2: keys may reach mget');
      return [3];
    },
  };

  const handler = createUserAgentsHandler(mockKv);
  const req = {};
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, [['Mozilla/5.0 (real visitor)', 3]], 'only the ua:v2: visitor row is published');
});

test('KV error mid-scan fails closed with 503 no-store instead of caching empty 200 body (paul-kinlan-me-6xr)', async () => {
  let callCount = 0;
  const mockKv = {
    async scan() {
      callCount++;
      if (callCount === 2) {
        throw new Error('KV connection timeout');
      }
      return ['1', ['ua:v2:UA-1', 'ua:v2:UA-2']];
    },
    async mget() {
      return [1, 2];
    },
  };

  const handler = createUserAgentsHandler(mockKv);
  const req = {};
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 503, 'must return 503 on KV error');
  assert.equal(res.headers['cache-control'], 'no-store, no-cache, must-revalidate', 'must not cache error response in CDN');
  assert.deepEqual(res.body, { error: 'Temporary storage error' });
});

test('exactly 100 keys with completed cursor 0 is marked exhaustive, not sample (paul-kinlan-me-08g, paul-kinlan-me-j1y)', async () => {
  const keys = Array.from({ length: 100 }, (_, i) => `ua:v2:Exhaustive-UA-${i}`);
  const mockKv = {
    async scan() {
      return ['0', keys];
    },
    async mget(k) {
      return k.map(() => 1);
    },
  };

  const handler = createUserAgentsHandler(mockKv);
  const req = {};
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.length, 100);
  assert.equal(res.headers['x-sampling-policy'], 'exhaustive', 'exactly 100 keys with cursor 0 must be exhaustive');
});

test('two distinct >512-byte UAs sharing a 512-byte prefix do not collapse counts (paul-kinlan-me-0sw)', async () => {
  const head = 'X'.repeat(512);
  const mockKv = {
    async scan() {
      return ['0', [`ua:v2:${head}-A`, `ua:v2:${head}-B`]];
    },
    async mget() {
      return [10, 5];
    },
  };

  const handler = createUserAgentsHandler(mockKv);
  const req = {};
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.length, 2, 'must not collapse distinct long UAs into 1 row');
  assert.deepEqual(res.body.map(r => r[1]), [10, 5]);
});

test('two distinct >512-byte UAs render distinguishable non-identical labels <=512 chars (paul-kinlan-me-dve)', async () => {
  const head = 'X'.repeat(512);
  const mockKv = {
    async scan() {
      return ['0', [`ua:v2:${head}-A`, `ua:v2:${head}-B`]];
    },
    async mget() {
      return [10, 5];
    },
  };

  const handler = createUserAgentsHandler(mockKv);
  const req = {};
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.length, 2);
  const [label1, label2] = res.body.map(r => r[0]);
  assert.notEqual(label1, label2, 'must render distinguishable labels rather than duplicates');
  assert.ok(label1.length <= 512, 'label1 must be <= 512 bytes');
  assert.ok(label2.length <= 512, 'label2 must be <= 512 bytes');
  assert.deepEqual(res.body.map(r => r[1]), [10, 5]);
});

test('100 keys on page 1 with non-zero cursor is conservatively marked bounded-sample-100 without extra scan (paul-kinlan-me-kiw)', async () => {
  let scanCalls = 0;
  const keys = Array.from({ length: 100 }, (_, i) => `ua:v2:Sample-UA-${i}`);
  const mockKv = {
    async scan() {
      scanCalls++;
      return ['5', keys];
    },
    async mget(k) {
      return k.map(() => 1);
    },
  };

  const handler = createUserAgentsHandler(mockKv);
  const req = {};
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(scanCalls, 1, 'must not issue extra probe scan to preserve KV budget under churn');
  assert.equal(res.headers['x-sampling-policy'], 'bounded-sample-100', 'must conservatively mark bounded-sample-100');
});

test('disambiguated truncation label does not collide with a crafted 512-char UA (paul-kinlan-me-duk)', async () => {
  const L = 'Z'.repeat(512);
  const mockKv = {
    async scan() {
      return ['0', ['ua:v2:' + L + '-a', 'ua:v2:' + L + '-b', 'ua:v2:' + 'Z'.repeat(508) + ' [2]']];
    },
    async mget() {
      return [9, 7, 3];
    },
  };

  const handler = createUserAgentsHandler(mockKv);
  const req = {};
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.length, 3);
  const labels = res.body.map(r => r[0]);
  const uniqueLabels = new Set(labels);
  assert.equal(uniqueLabels.size, 3, 'all 3 labels must be distinct');
  for (const label of labels) {
    assert.ok(label.length <= 512, `label must be <= 512 chars: ${label.length}`);
  }
  assert.deepEqual(res.body.map(r => r[1]), [9, 7, 3]);
});



