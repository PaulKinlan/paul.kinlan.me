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
 *  1. A per-IP fixed-window request limit, counted in Vercel KV so it holds
 *     across lambda instances. Vercel overwrites `x-forwarded-for` (it "does
 *     not forward external IPs", to prevent IP spoofing), so a caller cannot
 *     choose their own bucket by sending a header.
 *  2. An optional whole-endpoint daily request cap - the per-IP limit bounds
 *     one caller, not the bill.
 *  3. Input caps and an upstream deadline, so a single request cannot be made
 *     arbitrarily expensive or hold its function slot.
 *
 * Without KV (local dev, or a KV outage) the limit falls back to per-instance
 * memory: that bounds a burst but not a sustained distributed one, so KV is the
 * contract and the fallback is damage control.
 */
import { kv } from "@vercel/kv";

export const DEFAULT_PER_IP_LIMIT = 8;
export const DEFAULT_WINDOW_SECONDS = 60;

/** The in-memory fallback is per-instance; never let it grow without bound. */
const MEMORY_STORE_MAX_ENTRIES = 4096;

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
 * `x-vercel-forwarded-for` first: Vercel documents it as identical to
 * `x-forwarded-for` except that it survives a proxy sitting in front of Vercel.
 * Then `x-forwarded-for` and `x-real-ip`, which Vercel sets itself. Requests
 * with none of them (a direct call to a local server) share one bucket.
 */
export function clientAddress(req) {
  for (const header of ["x-vercel-forwarded-for", "x-forwarded-for", "x-real-ip"]) {
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

function prune(buckets, now) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAtMs <= now) buckets.delete(key);
  }
  // Still full after pruning expired windows: drop everything rather than grow.
  // Failing open for one window beats an unbounded map.
  if (buckets.size >= MEMORY_STORE_MAX_ENTRIES) buckets.clear();
}

/**
 * A fixed-window counter in this process's memory. Used when KV is unavailable.
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

/**
 * KV with a memory fallback, so a KV outage costs precision rather than the
 * whole endpoint (or, worse, an unguarded one).
 */
export function createFallbackStore(primary, fallback, onPrimaryError = () => {}) {
  return {
    kind: "fallback",
    async increment(key, windowSeconds) {
      try {
        return await primary.increment(key, windowSeconds);
      } catch (error) {
        onPrimaryError(error);
        return fallback.increment(key, windowSeconds);
      }
    },
    async remainingSeconds(key, windowSeconds) {
      try {
        return await primary.remainingSeconds(key, windowSeconds);
      } catch (error) {
        onPrimaryError(error);
        return fallback.remainingSeconds(key, windowSeconds);
      }
    },
    /**
     * Forgets the counters the fallback kept - a test needing a clean window,
     * or an operator unblocking a bucket after a mis-set limit. Never touches
     * primary: there is no safe way to clear a shared KV from here.
     */
    reset() {
      if (typeof fallback.reset === "function") fallback.reset();
    },
  };
}

let warnedAboutFallback = false;

/**
 * The store every endpoint uses unless a test injects another one.
 */
export const defaultStore = createFallbackStore(createKvStore(), createMemoryStore(), (error) => {
  if (warnedAboutFallback) return;
  warnedAboutFallback = true;
  console.warn(
    "paid-api-guard: Vercel KV unavailable, per-IP limits are per-instance until it recovers:",
    error && error.message
  );
});

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
      count = await store.increment(check.key, check.windowSeconds);
    } catch (error) {
      // Neither store could count. Refusing to serve is the wrong trade for a
      // personal site's own feature: log it and let the request through.
      console.warn("paid-api-guard: rate limit unavailable, request allowed:", error && error.message);
      return false;
    }
    if (count > check.limit) {
      const retryAfter = Math.max(1, Math.ceil(await store.remainingSeconds(check.key, check.windowSeconds)));
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

/** Rejects with `AI_PROXY_TIMEOUT` if `promise` has not settled inside `ms`. */
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
