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
  // Simulate 10,000 unique bot-churned User-Agent keys partitioned into 100 pages of 100 keys each
  const totalKeys = 10000;
  const pageSize = 100;
  let scanCalls = 0;
  let mgetCalls = 0;
  let mgetKeysCount = 0;

  const mockKv = {
    async scan(cursor, options) {
      scanCalls++;
      assert.equal(options?.match, '*', 'must match pattern *');
      assert.equal(options?.count, 100, 'must hint scan count of 100');
      const pageIndex = parseInt(cursor, 10);
      const start = pageIndex * pageSize;
      const end = start + pageSize;
      const nextCursor = end >= totalKeys ? '0' : String(pageIndex + 1);

      const keys = [];
      for (let i = start; i < end && i < totalKeys; i++) {
        keys.push(`Bot-User-Agent-${i}`);
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

  // New implementation bounds:
  assert.equal(scanCalls, 1, 'must stop scanning once MAX_KEYS (100) are collected on first page');
  assert.equal(mgetCalls, 1, 'must issue only 1 batched mget call');
  assert.equal(mgetKeysCount, 100, 'must query mget for at most 100 keys');
  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['content-type'], 'application/json');
  assert.equal(res.headers['cache-control'], 'public, s-maxage=60, stale-while-revalidate=120');
  assert.equal(res.headers['x-sampling-policy'], 'bounded-sample-100');
  assert.equal(Array.isArray(res.body), true);
  assert.equal(res.body.length, 100, 'response must be capped at 100 rows');

  // Verify format matches frontend contract: [ [uaString, countNumber], ... ]
  for (const row of res.body) {
    assert.equal(row.length, 2);
    assert.equal(typeof row[0], 'string');
    assert.equal(typeof row[1], 'number');
  }

  // Comparison against old unbounded algorithm:
  // The old algorithm would have continued until cursor === "0" (100 scan calls and 100 mget calls)
  // producing 10,000 rows.
  const oldEquivalentScanCalls = totalKeys / pageSize; // 100
  const oldEquivalentMgetCalls = totalKeys / pageSize; // 100
  const oldEquivalentRows = totalKeys; // 10,000
  assert.ok(scanCalls < oldEquivalentScanCalls, `scan calls capped (${scanCalls} vs ${oldEquivalentScanCalls})`);
  assert.ok(mgetCalls < oldEquivalentMgetCalls, `mget calls capped (${mgetCalls} vs ${oldEquivalentMgetCalls})`);
  assert.ok(res.body.length < oldEquivalentRows, `rows capped (${res.body.length} vs ${oldEquivalentRows})`);
});

test('sparse keyspace hitting MAX_SCAN_ITERATIONS bounds iterations to 5', async () => {
  // Simulate sparse keyspace: only 10 keys per page over 50 pages (total 500 keys)
  let scanCalls = 0;
  let mgetCalls = 0;

  const mockKv = {
    async scan(cursor) {
      scanCalls++;
      const pageIndex = parseInt(cursor, 10);
      const nextCursor = String(pageIndex + 1);
      const keys = Array.from({ length: 10 }, (_, i) => `Sparse-UA-${pageIndex}-${i}`);
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

test('sanitizes long UA strings and non-numeric counts', async () => {
  const superLongKey = 'A'.repeat(1000);
  const mockKv = {
    async scan() {
      return ['0', [superLongKey, 'Normal-UA', 'NullCount-UA']];
    },
    async mget() {
      return ['42', 15, null];
    },
  };

  const handler = createUserAgentsHandler(mockKv);
  const req = {};
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.body.length, 3);
  // Row with super long key must be truncated to MAX_UA_LENGTH (512)
  const truncatedRow = res.body.find(r => r[0].startsWith('AAA'));
  assert.ok(truncatedRow);
  assert.equal(truncatedRow[0].length, 512, 'must truncate key to 512 chars');
  assert.equal(truncatedRow[1], 42, 'string count parsed to number');

  // Null count defaults to 0
  const nullRow = res.body.find(r => r[0] === 'NullCount-UA');
  assert.ok(nullRow);
  assert.equal(nullRow[1], 0, 'null count defaults to 0');

  // Verify descending sort order
  assert.deepEqual(res.body.map(r => r[1]), [42, 15, 0]);
});
