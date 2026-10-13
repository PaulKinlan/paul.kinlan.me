/**
 * Drives the real endpoint handlers - the limits, the caps and the deadlines -
 * with the two packages that spend money stubbed out, so a request that should
 * be refused proves it never reached OpenAI or Pinecone.
 */
import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";

// The guard must never be tested against a live KV in CI: without credentials it
// takes its in-memory path, which is what these tests count on.
delete process.env.KV_REST_API_URL;
delete process.env.KV_REST_API_TOKEN;

register(new URL("./helpers/upstream-stub-loader.mjs", import.meta.url));

const { default: polymathEndpoint } = await import("../api/polymath.js");

// ask.ts is TypeScript, which these tests can import only where Node strips
// types for us (22.18+/23.6+, on by default in 24). Rather than fail the whole
// file on an older Node, say so and run the JavaScript endpoint's tests.
let polymathHostEndpoint;
let hostImportError;
try {
  ({ default: polymathHostEndpoint } = await import("../api/polymath/ask.ts"));
} catch (error) {
  hostImportError = error;
}

const hostTests = hostImportError
  ? `this Node cannot run TypeScript directly (${hostImportError.code})`
  : false;
const { defaultStore } = await import("../lib/paid-api-guard.js");

// Each test gets an empty window, so no test depends on the order of the others
// (and the daily bucket in particular does not carry over).
beforeEach(() => {
  defaultStore.reset();
});

function upstream() {
  return globalThis.__PAID_UPSTREAM__;
}

function fakeRes() {
  return {
    statusCode: 0,
    headers: {},
    body: undefined,
    contentType: undefined,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
  };
}

function get(ip, query = "What are web intents?") {
  return {
    method: "GET",
    headers: { "x-forwarded-for": ip },
    query: { query },
  };
}

/** Sets the knobs the handler reads, and puts them back afterwards. */
async function withEnv(values, run) {
  const previous = {};
  for (const [name, value] of Object.entries(values)) {
    previous[name] = process.env[name];
    if (value === undefined) delete process.env[name];
    else process.env[name] = String(value);
  }
  try {
    return await run();
  } finally {
    for (const [name, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
}

test("/api/polymath.js answers up to its budget and then 429s without calling OpenAI", async () => {
  await withEnv({ AI_RATE_LIMIT: 3, AI_RATE_WINDOW_SECONDS: 60, AI_DAILY_REQUEST_CAP: 1000 }, async () => {
    const before = { ...upstream() };

    for (let i = 1; i <= 3; i++) {
      const res = fakeRes();
      await polymathEndpoint(get("198.51.100.20"), res);
      assert.equal(res.body.completion, "stub answer", `request ${i} answered`);
    }
    assert.equal(upstream().completion - before.completion, 3);
    const constructed = upstream().constructed;

    const blocked = fakeRes();
    await polymathEndpoint(get("198.51.100.20"), blocked);
    assert.equal(blocked.statusCode, 429);
    assert.equal(blocked.body.error, "rate_limited");
    assert.ok(Number(blocked.headers["retry-after"]) >= 1);
    // The point of the fix: no further paid work happened, and no paid client
    // was even constructed.
    assert.equal(upstream().completion - before.completion, 3);
    assert.equal(upstream().constructed, constructed);
  });
});

test("/api/polymath.js has its own budget per caller", async () => {
  await withEnv({ AI_RATE_LIMIT: 1, AI_RATE_WINDOW_SECONDS: 60, AI_DAILY_REQUEST_CAP: 1000 }, async () => {
    const first = fakeRes();
    await polymathEndpoint(get("198.51.100.21"), first);
    assert.ok(first.body.completion);
    assert.equal(first.statusCode, 0);

    const blocked = fakeRes();
    await polymathEndpoint(get("198.51.100.21"), blocked);
    assert.equal(blocked.statusCode, 429);

    const other = fakeRes();
    await polymathEndpoint(get("198.51.100.22"), other);
    assert.ok(other.body.completion);
  });
});

test("/api/polymath.js caps the query before it becomes an embedding call", async () => {
  await withEnv({ AI_RATE_LIMIT: 10, AI_MAX_QUERY_CHARS: 50, AI_DAILY_REQUEST_CAP: 1000 }, async () => {
    const before = upstream().completion;

    const res = fakeRes();
    await polymathEndpoint(get("198.51.100.23", "x".repeat(51)), res);
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.error, "query_too_long");
    assert.equal(upstream().completion, before);

    // A repeated ?query= arrives as an array, which is not a query either.
    const repeated = fakeRes();
    await polymathEndpoint(
      { method: "GET", headers: { "x-forwarded-for": "198.51.100.23" }, query: { query: ["a", "b"] } },
      repeated
    );
    assert.equal(repeated.statusCode, 400);
    assert.equal(upstream().completion, before);
  });
});

test("/api/polymath.js answers 504 when the model outlives the deadline", async () => {
  await withEnv({ AI_RATE_LIMIT: 10, AI_UPSTREAM_TIMEOUT_MS: 20, AI_DAILY_REQUEST_CAP: 1000 }, async () => {
    const res = fakeRes();
    await polymathEndpoint(get("198.51.100.24", "SLOW question"), res);
    assert.equal(res.statusCode, 504);
    assert.equal(res.body.error, "upstream_timeout");
  });
});

test("/api/polymath.js stops answering when the whole endpoint hits its daily budget", async () => {
  await withEnv({ AI_RATE_LIMIT: 100, AI_DAILY_REQUEST_CAP: 2 }, async () => {
    for (const ip of ["198.51.100.30", "198.51.100.31"]) {
      const res = fakeRes();
      await polymathEndpoint(get(ip), res);
      assert.ok(res.body.completion, `${ip} answered inside the budget`);
    }

    const blocked = fakeRes();
    await polymathEndpoint(get("198.51.100.32"), blocked);
    assert.equal(blocked.statusCode, 429);
  });
});

test("/api/polymath/ask.ts 429s a hammering caller before it reads Pinecone", { skip: hostTests }, async () => {
  await withEnv({ AI_HOST_RATE_LIMIT: 2, AI_RATE_WINDOW_SECONDS: 60 }, async () => {
    const before = upstream().query;

    for (let i = 1; i <= 2; i++) {
      const res = fakeRes();
      await polymathHostEndpoint({ method: "GET", headers: { "x-forwarded-for": "203.0.113.30" } }, res);
      assert.ok(res.body.error.includes("POST"), `request ${i} reached the handler`);
    }

    const blocked = fakeRes();
    await polymathHostEndpoint({ method: "GET", headers: { "x-forwarded-for": "203.0.113.30" } }, blocked);
    assert.equal(blocked.statusCode, 429);
    assert.equal(blocked.body.error, "rate_limited");
    assert.equal(upstream().query, before);
  });
});
