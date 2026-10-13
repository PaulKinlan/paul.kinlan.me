/**
 * Drives the real endpoint handlers - the limits, the caps and the deadlines -
 * with the two packages that spend money stubbed out, so a request that should
 * be refused proves it never reached OpenAI or Pinecone.
 */
import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";
import { Readable } from "node:stream";

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
  const res = {
    statusCode: 0,
    headers: {},
    body: undefined,
    contentType: undefined,
    responseFinished: false,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      this.responseFinished = true;
      this.settle();
      return this;
    },
    send(body) {
      this.body = body;
      this.responseFinished = true;
      this.settle();
      return this;
    },
  };
  res.settled = new Promise((resolve) => {
    res.settle = resolve;
  });
  return res;
}

/**
 * Waits for a handler to answer, with a bound so a handler that never replies
 * fails the test instead of hanging the gate. (The multipart path answers from
 * multiparty's stream callback, i.e. after the handler function has returned.)
 */
async function awaitResponse(res, label) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`${label} never answered`)), 2000)
  );
  await Promise.race([res.settled, timeout]);
  return res;
}

function get(ip, query = "What are web intents?") {
  return {
    method: "GET",
    headers: { "x-forwarded-for": ip },
    query: { query },
  };
}

/**
 * A real multipart/form-data request body, the way the Polymath CLI posts to
 * this host (see @polymath-ai/client PolymathEndpoint: a FormData with
 * query_embedding), wrapped in the readable stream multiparty parses.
 */
function multipartPost(ip, fields) {
  const boundary = "----fixpaidtestboundary";
  const parts = Object.entries(fields).map(
    ([name, value]) => `--${boundary}\r\ncontent-disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`
  );
  const body = Buffer.from(`${parts.join("")}--${boundary}--\r\n`);
  const req = Readable.from([body]);
  req.method = "POST";
  req.headers = {
    "content-type": `multipart/form-data; boundary=${boundary}`,
    "content-length": String(body.length),
    "x-forwarded-for": ip,
  };
  return req;
}

function embeddingBase64(dimensions = 1536) {
  return Buffer.from(new Float32Array(dimensions).fill(0.5).buffer).toString("base64");
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
  await withEnv({ AI_RATE_LIMIT: 10, AI_RESPONSE_DEADLINE_MS: 20, AI_DAILY_REQUEST_CAP: 1000 }, async () => {
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
  await withEnv({ AI_HOST_RATE_LIMIT: 2, AI_RATE_WINDOW_SECONDS: 60, AI_HOST_DAILY_REQUEST_CAP: 1000 }, async () => {
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

test("/api/polymath/ask.ts serves a real multipart query once, and stops at the budget without querying", { skip: hostTests }, async () => {
  await withEnv({ AI_HOST_RATE_LIMIT: 1, AI_RATE_WINDOW_SECONDS: 60, AI_HOST_DAILY_REQUEST_CAP: 1000 }, async () => {
    const before = upstream().query;
    const fields = { version: "1", query_embedding: embeddingBase64() };

    const served = fakeRes();
    await polymathHostEndpoint(multipartPost("203.0.113.40", fields), served);
    await awaitResponse(served, "multipart query");
    assert.deepEqual(served.body, { version: 1, bits: [] });
    assert.equal(upstream().query - before, 1, "the paid query ran once");

    const refused = fakeRes();
    await polymathHostEndpoint(multipartPost("203.0.113.40", fields), refused);
    await awaitResponse(refused, "refused multipart query");
    assert.equal(refused.statusCode, 429);
    assert.equal(refused.body.error, "rate_limited");
    assert.equal(upstream().query - before, 1, "a refused request does not reach Pinecone");
  });
});

test("/api/polymath/ask.ts answers 400 on a broken embedding instead of hanging on an unhandled throw", { skip: hostTests }, async () => {
  await withEnv({ AI_HOST_RATE_LIMIT: 10, AI_RATE_WINDOW_SECONDS: 60, AI_HOST_DAILY_REQUEST_CAP: 1000 }, async () => {
    const before = upstream().query;

    // Three bytes of base64 is not a whole number of float32s: decodeEmbedding
    // throws RangeError, which used to escape the parse callback unanswered.
    const broken = fakeRes();
    await polymathHostEndpoint(multipartPost("203.0.113.41", { version: "1", query_embedding: "abc" }), broken);
    await awaitResponse(broken, "broken embedding");
    assert.equal(broken.statusCode, 400);
    assert.equal(broken.body.error, "invalid_query_embedding");

    const empty = fakeRes();
    await polymathHostEndpoint(multipartPost("203.0.113.41", { version: "1" }), empty);
    await awaitResponse(empty, "missing embedding");
    assert.equal(empty.statusCode, 400);
    assert.equal(empty.body.error, "query_embedding_required");

    const tooBig = fakeRes();
    await polymathHostEndpoint(
      multipartPost("203.0.113.41", { version: "1", query_embedding: embeddingBase64(7500) }),
      tooBig
    );
    await awaitResponse(tooBig, "oversize embedding");
    assert.equal(tooBig.statusCode, 400);
    assert.equal(tooBig.body.error, "query_embedding_too_large");

    // Too many dimensions for a vector that fits inside the field cap.
    const tooManyDimensions = fakeRes();
    await polymathHostEndpoint(
      multipartPost("203.0.113.41", { version: "1", query_embedding: embeddingBase64(5000) }),
      tooManyDimensions
    );
    await awaitResponse(tooManyDimensions, "oversize vector");
    assert.equal(tooManyDimensions.statusCode, 400);
    assert.equal(tooManyDimensions.body.error, "invalid_query_embedding");

    // Past the form field cap, multiparty refuses the body before it is read.
    const overFieldCap = fakeRes();
    await polymathHostEndpoint(
      multipartPost("203.0.113.41", { version: "1", query_embedding: embeddingBase64(70000) }),
      overFieldCap
    );
    await awaitResponse(overFieldCap, "oversize body");
    assert.equal(overFieldCap.statusCode, 400);
    assert.equal(overFieldCap.body.error, "invalid_form");

    assert.equal(upstream().query, before, "no bad embedding reached Pinecone");
  });
});
