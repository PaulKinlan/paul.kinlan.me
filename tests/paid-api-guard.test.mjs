import test from "node:test";
import assert from "node:assert/strict";

import {
  clientAddress,
  createFallbackStore,
  createKvStore,
  createMemoryStore,
  guardPaidRequest,
  isTimeoutError,
  rejectRequest,
  secondsUntilUtcMidnight,
  sendJson,
  withDeadline,
} from "../lib/paid-api-guard.js";

/** A Vercel-shaped response, recording what the handler wrote. */
function fakeRes() {
  return {
    statusCode: 0,
    headers: {},
    body: undefined,
    finished: false,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      this.finished = true;
      return this;
    },
    send(body) {
      this.body = body;
      this.finished = true;
      return this;
    },
  };
}

function fakeReq(ip, headers = {}) {
  return { method: "GET", headers: { "x-forwarded-for": ip, ...headers } };
}

/** The in-memory shape of the Vercel KV REST client, with call recording. */
function fakeKv() {
  const entries = new Map();
  const calls = [];
  return {
    calls,
    entries,
    async set(key, value, options = {}) {
      calls.push(["set", key, options]);
      if (options.nx && entries.has(key)) return null;
      entries.set(key, { value, ttl: options.ex ?? -1 });
      return "OK";
    },
    async incr(key) {
      calls.push(["incr", key]);
      const existing = entries.get(key);
      const value = Number(existing?.value ?? 0) + 1;
      entries.set(key, { value, ttl: existing?.ttl ?? -1 });
      return value;
    },
    async expire(key, seconds) {
      calls.push(["expire", key, seconds]);
      const existing = entries.get(key);
      if (existing) existing.ttl = seconds;
      return 1;
    },
    async ttl(key) {
      calls.push(["ttl", key]);
      const existing = entries.get(key);
      return existing ? existing.ttl : -2;
    },
  };
}

test("clientAddress prefers the headers Vercel sets over anything a caller sends", () => {
  assert.equal(clientAddress({ headers: { "x-vercel-forwarded-for": "198.51.100.4", "x-forwarded-for": "10.0.0.1" } }), "198.51.100.4");
  assert.equal(clientAddress({ headers: { "x-forwarded-for": "203.0.113.9, 10.0.0.1" } }), "203.0.113.9");
  assert.equal(clientAddress({ headers: { "x-real-ip": "203.0.113.10" } }), "203.0.113.10");
  assert.equal(clientAddress({ headers: new Headers({ "x-forwarded-for": "203.0.113.11" }) }), "203.0.113.11");
  assert.equal(clientAddress({ headers: {}, socket: { remoteAddress: "127.0.0.1" } }), "127.0.0.1");
  assert.equal(clientAddress({ headers: {} }), "unknown");
});

test("a per-IP window allows the budget, then refuses without counting further", async () => {
  const store = createMemoryStore();
  const options = { bucket: "unit", limit: 3, windowSeconds: 60, store };

  for (let i = 1; i <= 3; i++) {
    const res = fakeRes();
    assert.equal(await guardPaidRequest(fakeReq("203.0.113.1"), res, options), false, `request ${i} allowed`);
    assert.equal(res.finished, false);
  }

  const blocked = fakeRes();
  assert.equal(await guardPaidRequest(fakeReq("203.0.113.1"), blocked, options), true);
  assert.equal(blocked.statusCode, 429);
  assert.equal(blocked.body.error, "rate_limited");
  assert.equal(blocked.headers["cache-control"], "no-store");
  const retryAfter = Number(blocked.headers["retry-after"]);
  assert.ok(retryAfter >= 1 && retryAfter <= 60, `retry-after was ${retryAfter}`);
  assert.equal(blocked.body.retry_after, retryAfter);

  // Another caller has their own budget.
  assert.equal(await guardPaidRequest(fakeReq("203.0.113.2"), fakeRes(), options), false);
});

test("the window rolls over", async () => {
  let clock = 1_000_000;
  const store = createMemoryStore({ now: () => clock });
  const options = { bucket: "unit", limit: 1, windowSeconds: 60, store };

  assert.equal(await guardPaidRequest(fakeReq("203.0.113.3"), fakeRes(), options), false);
  assert.equal(await guardPaidRequest(fakeReq("203.0.113.3"), fakeRes(), options), true);

  clock += 61_000;
  assert.equal(await guardPaidRequest(fakeReq("203.0.113.3"), fakeRes(), options), false);
});

test("a daily cap bounds callers who rotate addresses", async () => {
  const store = createMemoryStore();
  const options = { bucket: "unit", limit: 100, windowSeconds: 60, dailyCap: 2, store };

  assert.equal(await guardPaidRequest(fakeReq("198.51.100.1"), fakeRes(), options), false);
  assert.equal(await guardPaidRequest(fakeReq("198.51.100.2"), fakeRes(), options), false);

  const blocked = fakeRes();
  assert.equal(await guardPaidRequest(fakeReq("198.51.100.3"), blocked, options), true);
  assert.equal(blocked.statusCode, 429);
  assert.ok(secondsUntilUtcMidnight() >= 1);
});

test("the KV store windows keys with a TTL that outlives a dying process", async () => {
  const client = fakeKv();
  const store = createKvStore({ client });

  assert.equal(await store.increment("k", 60), 1);
  assert.equal(await store.increment("k", 60), 2);
  assert.equal(await store.increment("k", 60), 3);

  const set = client.calls.filter(([name]) => name === "set");
  assert.equal(set.length, 3);
  for (const [, key, options] of set) {
    assert.equal(key, "k");
    assert.deepEqual(options, { ex: 60, nx: true });
  }
  // The TTL is on the key from the moment it is created, so a crash between
  // calls cannot leave a counter that blocks the bucket forever.
  assert.equal(client.entries.get("k").ttl, 60);
  assert.equal(await store.remainingSeconds("k", 60), 60);
});

test("KV errors degrade to the in-memory store instead of removing the limit", async () => {
  const broken = {
    async increment() {
      throw new Error("KV down");
    },
    async remainingSeconds() {
      throw new Error("KV down");
    },
  };
  const errors = [];
  const store = createFallbackStore(broken, createMemoryStore(), (error) => errors.push(error.message));
  const options = { bucket: "unit", limit: 2, windowSeconds: 60, store };

  assert.equal(await guardPaidRequest(fakeReq("203.0.113.4"), fakeRes(), options), false);
  assert.equal(await guardPaidRequest(fakeReq("203.0.113.4"), fakeRes(), options), false);
  assert.equal(await guardPaidRequest(fakeReq("203.0.113.4"), fakeRes(), options), true);
  assert.ok(errors.length >= 1);
});

test("sendJson writes JSON on both response shapes", async () => {
  const vercel = fakeRes();
  sendJson(vercel, 418, { error: "teapot" }, { "retry-after": "5" });
  assert.deepEqual([vercel.statusCode, vercel.body, vercel.headers["retry-after"]], [418, { error: "teapot" }, "5"]);

  const plain = {
    statusCode: 0,
    headers: {},
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    end(body) {
      this.body = body;
    },
  };
  rejectRequest(plain, 400, "bad_request", "no");
  assert.equal(plain.statusCode, 400);
  assert.equal(plain.headers["content-type"], "application/json");
  assert.deepEqual(JSON.parse(plain.body), { error: "bad_request", message: "no" });
});

test("the upstream deadline rejects with a recognisable error", async () => {
  await assert.rejects(withDeadline(new Promise(() => {}), 10, "unit"), (error) => isTimeoutError(error));
  assert.equal(await withDeadline(Promise.resolve(7), 50, "unit"), 7);
  assert.equal(isTimeoutError(new Error("other")), false);
});
