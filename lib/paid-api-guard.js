/**
 * The ceiling on the endpoints that spend money for whoever asks.
 *
 * `/api/polymath.js` calls OpenAI (an embedding plus a gpt-3.5-turbo
 * completion) and `/api/polymath/ask.ts` reads Pinecone. Both are public and
 * unauthenticated on purpose: they are the two halves of the Polymath protocol
 * this site publishes (`<link rel="polymath" href="/polymath">`), and
 * `/api/ask-paul.ts` calls the first one server-side. Nothing bounded them, so
 * anyone could spend Paul's API budget at will.
 *
 * Three things bound that here:
 *
 *  1. A per-IP fixed-window request limit and an endpoint-wide daily cap, both
 *     counted in Vercel KV so they hold across lambda instances. Vercel
 *     overwrites `x-forwarded-for` (it "does not forward external IPs", to
 *     prevent IP spoofing), so a caller cannot choose their own bucket.
 *  2. When the counter cannot be consulted - an error, or no answer inside
 *     COUNTER_DEADLINE_MS - the paid request is REFUSED with 503 rather than
 *     served. This matters: a caller who can drive the counter store into an
 *     error state - for instance by exhausting its request quota - would
 *     otherwise get unbounded paid calls, because Vercel's lambda instances
 *     scale per request and each one would start with a fresh per-instance
 *     budget. The counters are only a ceiling if they are also a gate.
 *     Availability during a counter outage is the price, and it is bounded:
 *     503, no paid work, within a couple of seconds.
 *  3. Input caps and an output-token cap, so a single request cannot be made
 *     arbitrarily expensive.
 *
 * Per-instance memory is used ONLY when KV is not configured at all (local
 * development, previews without a KV store, where the paid credentials are not
 * expected either). It bounds one process, not the bill, and says so in the log.
 */
import { kv } from "@vercel/kv";

export const DEFAULT_PER_IP_LIMIT = 8;
export const DEFAULT_WINDOW_SECONDS = 60;

/** Told to a caller when the counter itself is unreachable. */
export const UNAVAILABLE_RETRY_SECONDS = 30;

/** The in-memory fallback is per-instance; never let it grow without bound. */
const MEMORY_STORE_MAX_ENTRIES = 4096;

/**
 * How long to wait for the counter before deciding it is unavailable.
 *
 * The KV client retries a failed request internally (measured: a dead KV took
 * ~12s to surface as an error), and a refusal that takes that long holds the
 * lambda slot it was meant to protect. Normal KV latency is tens of
 * milliseconds, so this is generous by two orders of magnitude.
 */
const COUNTER_DEADLINE_MS = 2000;

const UNKNOWN_CLIENT = "unknown";

/**
 * Reads an integer knob from the environment, falling back on anything that is
 * not a positive integer - including `0`, so "I set the limit to zero" can
 * never silently mean "there is no limit".
 */
export function envInt(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const value = Number.parseInt(String(raw), 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function headerValue(req, name) {
  const headers = req && req.headers;
  if (!headers) return "";
  if (typeof headers.get === "function") return String(headers.get(name) || "");
  const value = headers[name];
  if (Array.isArray(value)) return String(value[0] || "");
  return value === undefined || value === null ? "" : String(value);
}

/**
 * The caller's address, for bucketing.
 *
 * `x-forwarded-for` first: that is the header Vercel documents itself as
 * overwriting, so it cannot be chosen by the caller. `x-vercel-forwarded-for`
 * and `x-real-ip` are documented as identical to it, but nothing guarantees
 * they were set by the platform rather than sent by the caller, so they are
 * only a fallback for a host that sets them and no `x-forwarded-for`. Requests
 * with none of them (a direct call to a local server) share one bucket.
 */
export function clientAddress(req) {
  for (const header of ["x-forwarded-for", "x-vercel-forwarded-for", "x-real-ip"]) {
    const value = headerValue(req, header).split(",")[0].trim();
    if (value) return value;
  }
  const socket = req && (req.socket || req.connection);
  const remote = socket && socket.remoteAddress;
  return remote ? String(remote) : UNKNOWN_CLIENT;
}

/** Seconds until the next UTC midnight, for a calendar-day budget. */
export function secondsUntilUtcMidnight(now = Date.now()) {
  const date = new Date(now);
  const midnight = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1);
  return Math.max(1, Math.ceil((midnight - now) / 1000));
}

/** KV counts across instances only when its credentials are actually present. */
export function hasKvCredentials(env = process.env) {
  return Boolean(env.KV_REST_API_URL && env.KV_REST_API_TOKEN);
}

function prune(buckets, now) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAtMs <= now) buckets.delete(key);
  }
  // Still full after pruning expired windows: drop everything rather than grow.
  // Failing open for one window beats an unbounded map.
  if (buckets.size >= MEMORY_STORE_MAX_ENTRIES) buckets.clear();
}

/**
 * A fixed-window counter in this process's memory. Development only: the
 * endpoints use it when no KV is configured, never as a fallback from KV.
 */
export function createMemoryStore({ now = Date.now } = {}) {
  const buckets = new Map();
  return {
    kind: "memory",
    async increment(key, windowSeconds) {
      const current = now();
      const bucket = buckets.get(key);
      if (!bucket || bucket.resetAtMs <= current) {
        if (buckets.size >= MEMORY_STORE_MAX_ENTRIES) prune(buckets, current);
        buckets.set(key, { count: 1, resetAtMs: current + windowSeconds * 1000 });
        return 1;
      }
      bucket.count += 1;
      return bucket.count;
    },
    async remainingSeconds(key, windowSeconds) {
      const bucket = buckets.get(key);
      if (!bucket) return windowSeconds;
      return Math.max(1, Math.ceil((bucket.resetAtMs - now()) / 1000));
    },
    reset() {
      buckets.clear();
    },
    get size() {
      return buckets.size;
    },
  };
}

/**
 * A fixed-window counter in Vercel KV, shared by every lambda instance.
 *
 * `set ... nx ex` creates the window and its TTL in one call, so a counter can
 * never outlive its window even if this process dies between calls.
 */
export function createKvStore({ client = kv } = {}) {
  return {
    kind: "kv",
    async increment(key, windowSeconds) {
      await client.set(key, 0, { ex: windowSeconds, nx: true });
      const count = await client.incr(key);
      // A key that already existed without a TTL (should not happen) is repaired
      // rather than left to block this bucket forever.
      if (count === 1) await client.expire(key, windowSeconds);
      return count;
    },
    async remainingSeconds(key, windowSeconds) {
      const ttl = await client.ttl(key);
      return typeof ttl === "number" && ttl > 0 ? ttl : windowSeconds;
    },
  };
}

let activeStore = null;
let warnedAboutMemory = false;

/**
 * The store the endpoints use unless a test injects another one.
 *
 * With KV configured this is KV and nothing else: if it cannot count, the
 * request is refused (503) rather than downgraded to a weaker limit. Memory is
 * chosen only when KV is absent, so it cannot be reached by breaking KV.
 */
export function resolveStore() {
  if (activeStore) return activeStore;
  if (hasKvCredentials()) {
    activeStore = createKvStore();
  } else {
    activeStore = createMemoryStore();
    if (!warnedAboutMemory) {
      warnedAboutMemory = true;
      console.warn("paid-api-guard: no Vercel KV configured - per-instance limits only, development use");
    }
  }
  return activeStore;
}

export const defaultStore = {
  increment: (key, windowSeconds) => resolveStore().increment(key, windowSeconds),
  remainingSeconds: (key, windowSeconds) => resolveStore().remainingSeconds(key, windowSeconds),
  reset: () => {
    const store = resolveStore();
    if (typeof store.reset === "function") store.reset();
  },
};

/**
 * Replies with JSON on either shape of response object this repo uses (a Vercel
 * `VercelResponse` here, a plain `ServerResponse` elsewhere).
 */
export function sendJson(res, status, body, headers = {}) {
  for (const [name, value] of Object.entries(headers)) {
    if (typeof res.setHeader === "function") res.setHeader(name, value);
  }
  if (typeof res.status === "function") res.status(status);
  else res.statusCode = status;
  if (typeof res.json === "function") return res.json(body);
  if (typeof res.setHeader === "function") res.setHeader("content-type", "application/json");
  if (typeof res.end === "function") return res.end(JSON.stringify(body));
  return undefined;
}

/** 4xx/5xx with a machine-readable `error`, so a caller can tell why. */
export function rejectRequest(res, status, error, message) {
  return sendJson(res, status, message ? { error, message } : { error });
}

async function retryAfterSeconds(store, key, windowSeconds) {
  try {
    const measured = await withDeadline(
      store.remainingSeconds(key, windowSeconds),
      COUNTER_DEADLINE_MS,
      "rate limit ttl"
    );
    return Math.max(1, Math.ceil(measured));
  } catch (error) {
    // The caller is already being refused; a missing TTL is not worth a failure.
    console.warn("paid-api-guard: could not read the window ttl:", error && error.message);
    return Math.max(1, Math.ceil(windowSeconds));
  }
}

/**
 * Applies the request limits for one endpoint. Returns `true` when the request
 * was refused - the response is already sent, and the caller must stop before
 * touching a paid API.
 */
export async function guardPaidRequest(req, res, options = {}) {
  const {
    bucket,
    limit = DEFAULT_PER_IP_LIMIT,
    windowSeconds = DEFAULT_WINDOW_SECONDS,
    dailyCap = 0,
    store = defaultStore,
  } = options;

  const checks = [{ key: `${bucket}:ip:${clientAddress(req)}`, limit, windowSeconds }];
  if (dailyCap > 0) {
    checks.push({ key: `${bucket}:day`, limit: dailyCap, windowSeconds: secondsUntilUtcMidnight() });
  }

  for (const check of checks) {
    let count;
    try {
      // Bounded: a counter that does not answer is unavailable, not an
      // invitation to wait inside a paid endpoint's lambda slot.
      count = await withDeadline(
        store.increment(check.key, check.windowSeconds),
        COUNTER_DEADLINE_MS,
        "rate limit counter"
      );
    } catch (error) {
      // The counter is the ceiling, so a counter we cannot read means the paid
      // call does not happen. Letting it through instead would hand an attacker
      // who can break the counter store (or exhaust its request quota) unbounded
      // paid calls, one fresh per-instance budget per lambda.
      console.warn("paid-api-guard: counter unavailable, refusing paid request:", check.key, error && error.message);
      sendJson(
        res,
        503,
        {
          error: "rate_limiter_unavailable",
          message: "The rate limiter is temporarily unavailable. Please try again shortly.",
          retry_after: UNAVAILABLE_RETRY_SECONDS,
        },
        { "retry-after": String(UNAVAILABLE_RETRY_SECONDS), "cache-control": "no-store" }
      );
      return true;
    }

    if (count > check.limit) {
      const retryAfter = await retryAfterSeconds(store, check.key, check.windowSeconds);
      console.warn(`paid-api-guard: refused ${check.key} (${count} > ${check.limit}), retry in ${retryAfter}s`);
      sendJson(
        res,
        429,
        {
          error: "rate_limited",
          message: `Too many requests. Try again in ${retryAfter} seconds.`,
          retry_after: retryAfter,
        },
        { "retry-after": String(retryAfter), "cache-control": "no-store" }
      );
      return true;
    }
  }

  return false;
}

export const AI_PROXY_TIMEOUT = "AI_PROXY_TIMEOUT";

/**
 * Bounds how long this function waits for a paid upstream call.
 *
 * This is a response deadline, not a cancellation: the provider's request is
 * not aborted and may still be billed, so `max_tokens` is the cost bound and
 * this is only the "do not hold the lambda slot and the caller" bound.
 */
export function withDeadline(promise, ms, label) {
  let timer;
  const deadline = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const error = new Error(`${label} did not finish within ${ms}ms`);
      error.code = AI_PROXY_TIMEOUT;
      reject(error);
    }, ms);
  });
  return Promise.race([promise, deadline]).finally(() => clearTimeout(timer));
}

export function isTimeoutError(error) {
  return Boolean(error) && error.code === AI_PROXY_TIMEOUT;
}
