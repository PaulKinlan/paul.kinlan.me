import type { AP } from 'activitypub-core-types';
import { guardedFetch } from './guardedFetch.js';

/**
 * Fetch an actor document by keyId.
 *
 * The transport is not implemented here: `guardedFetch()` is the single
 * federation boundary and already enforces this call's rules - https only, no
 * credentials in the URL, global-unicast DNS with every answer checked and the
 * chosen address pinned into the TLS connect, no redirects, a 5s timeout and a
 * 1 MiB response cap. Duplicating that here would let the next transport fix
 * land in one file and silently miss the keyId path.
 *
 * The contract for callers stays "null, never throw": a blocked target (private
 * address, redirect, oversized body), a network failure, a non-200 answer and
 * unparseable JSON are all the same non-answer, because the only callers are
 * signature verification and follow handling, which must reject rather than
 * error out on a hostile keyId.
 *
 * ## Why this is bounded (paul-kinlan-me-m4h1)
 *
 * `/inbox` calls this BEFORE it can authenticate anything: a signature cannot be
 * checked without the signer's public key, so the keyId is the one
 * attacker-chosen input that always reaches the network. That makes an unbounded
 * version a reflection/egress amplifier - every anonymous POST buys one DNS
 * lookup and one HTTPS GET to a host the caller picked.
 *
 * Three bounds, applied here rather than in the handler so every caller inherits
 * them and the next caller cannot forget:
 *   1. a per-keyId cache (5 min positive, 60s negative) so a repeated keyId -
 *      the cheapest thing to replay at an inbox - costs no network at all;
 *   2. in-flight de-duplication, so N concurrent requests for one keyId share a
 *      single fetch;
 *   3. a token budget per remote host (10/min) and overall (100/min), so a
 *      caller rotating keyIds inside one host, or across many hosts, is refused
 *      instead of amplified. A refusal is the same `null` the rest of the
 *      module returns, i.e. `401`s at the inbox, and it is not cached.
 *
 * The budgets are deliberately per-instance: the site runs on several
 * serverless instances and a shared counter would be another remote dependency
 * on the request path. Per-instance is enough to turn "one GET per POST, always"
 * into "at most 100 GETs a minute from this instance".
 *
 * `./guardedFetch.js` keeps the SSRF rules; this module keeps the volume rules.
 */

/** Positive results live long enough to cover a replay window, not a key rotation. */
export const ACTOR_CACHE_TTL_MS = 5 * 60 * 1000;
/** Failures and non-actor documents are cached briefly so a dead keyId cannot be re-fetched. */
export const ACTOR_NEGATIVE_TTL_MS = 60 * 1000;
/** Hard cap on cached keyIds, so a caller rotating URLs cannot grow the map. */
export const ACTOR_CACHE_MAX_ENTRIES = 200;
/** Fetches allowed per remote host inside PER_HOST_WINDOW_MS. */
export const PER_HOST_BUDGET = 10;
export const PER_HOST_WINDOW_MS = 60 * 1000;
/** Fetches allowed across all hosts inside GLOBAL_WINDOW_MS. */
export const GLOBAL_BUDGET = 100;
export const GLOBAL_WINDOW_MS = 60 * 1000;
/** Bound on the number of host windows kept, so host churn cannot grow that map either. */
export const MAX_TRACKED_HOSTS = 512;

export interface ActorFetchOptions {
  /** Transport seam for tests; production always uses guardedFetch(). */
  fetch?: typeof guardedFetch;
  /** Clock seam for tests; production uses Date.now(). */
  now?: () => number;
}

interface CacheEntry {
  expiresAt: number;
  actor: AP.Actor | null;
}

interface Window {
  start: number;
  count: number;
}

const cache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<AP.Actor | null>>();
const hostWindows = new Map<string, Window>();
let globalWindow: Window = { start: 0, count: 0 };

const hostOf = (url: URL): string => url.hostname.replace(/^\[|\]$/g, '').toLowerCase();

/** Read-through with LRU refresh: a hit is re-inserted so the newest keys survive eviction. */
const readCache = (key: string, now: number): CacheEntry | undefined => {
  const entry = cache.get(key);
  if (!entry) return undefined;
  cache.delete(key);
  if (entry.expiresAt <= now) return undefined;
  cache.set(key, entry);
  return entry;
};

const writeCache = (key: string, actor: AP.Actor | null, now: number): void => {
  cache.delete(key);
  cache.set(key, {
    expiresAt: now + (actor === null ? ACTOR_NEGATIVE_TTL_MS : ACTOR_CACHE_TTL_MS),
    actor
  });
  while (cache.size > ACTOR_CACHE_MAX_ENTRIES) {
    const oldest = cache.keys().next();
    if (oldest.done) break;
    cache.delete(oldest.value);
  }
};

/** Fixed-window budget: true when a slot was available and has been taken. */
const takeBudget = (window: Window, now: number, windowMs: number, budget: number): boolean => {
  if (now - window.start >= windowMs || window.count === 0) {
    window.start = now;
    window.count = 0;
  }
  if (window.count >= budget) return false;
  window.count += 1;
  return true;
};

/** Drop host windows that have fully expired once the map grows past its cap. */
const pruneHostWindows = (now: number): void => {
  if (hostWindows.size <= MAX_TRACKED_HOSTS) return;
  for (const [host, window] of hostWindows) {
    if (now - window.start >= PER_HOST_WINDOW_MS) hostWindows.delete(host);
    if (hostWindows.size <= MAX_TRACKED_HOSTS) break;
  }
  // Still over the cap (host churn faster than the window): drop the oldest
  // entries rather than grow without bound. Losing a window only resets that
  // host's count, it never grants more than PER_HOST_BUDGET at a time.
  while (hostWindows.size > MAX_TRACKED_HOSTS) {
    const oldest = hostWindows.keys().next();
    if (oldest.done) break;
    hostWindows.delete(oldest.value);
  }
};

const hostWindow = (host: string, now: number): Window => {
  let window = hostWindows.get(host);
  if (!window) {
    pruneHostWindows(now);
    window = { start: now, count: 0 };
    hostWindows.set(host, window);
  }
  return window;
};

/** Test seam: forget every cached actor and every spent budget. */
export function resetActorFetchBounds(): void {
  cache.clear();
  inFlight.clear();
  hostWindows.clear();
  globalWindow = { start: 0, count: 0 };
}

export async function fetchActorInformation(
  actorUrl: string,
  options: ActorFetchOptions = {}
): Promise<AP.Actor | null> {
  if (typeof actorUrl !== 'string') return null;

  const now = () => (options.now ? options.now() : Date.now());
  const fetchImpl = options.fetch ?? guardedFetch;

  let url: URL;
  try {
    url = new URL(actorUrl);
  } catch {
    // guardedFetch() would refuse this too; refusing it here costs no socket.
    return null;
  }
  const key = url.href;

  const cached = readCache(key, now());
  if (cached) return cached.actor;

  const pending = inFlight.get(key);
  if (pending) return pending;

  if (!takeBudget(hostWindow(hostOf(url), now()), now(), PER_HOST_WINDOW_MS, PER_HOST_BUDGET)) return null;
  if (!takeBudget(globalWindow, now(), GLOBAL_WINDOW_MS, GLOBAL_BUDGET)) return null;

  const request = (async (): Promise<AP.Actor | null> => {
    try {
      const response = await fetchImpl(key, {
        headers: { Accept: 'application/activity+json' }
      });
      // An actor document is served at 200. Anything else is not one, and a
      // redirect never reaches here: guardedFetch() refuses those outright.
      if (response.status !== 200) return null;
      const actor = (await response.json()) as AP.Actor;
      return actor && typeof actor === 'object' ? actor : null;
    } catch {
      return null;
    }
  })();

  inFlight.set(key, request);
  try {
    const actor = await request;
    writeCache(key, actor, now());
    return actor;
  } finally {
    inFlight.delete(key);
  }
}
