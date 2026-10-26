import { kv } from "@vercel/kv";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export const MAX_SCAN_ITERATIONS = 5;
export const MAX_KEYS = 100;
export const SCAN_COUNT_HINT = 100;
export const MAX_RESPONSE_ROWS = 100;
export const MAX_UA_LENGTH = 512;

export interface KVReader {
  scan(cursor: string | number, options?: { match?: string; count?: number }): Promise<[string | number, string[]]>;
  mget(keys: string[]): Promise<(string | number | null)[]>;
}

/**
 * Returns user agent counts for recent visitors.
 *
 * Keyspace & Sampling Architecture:
 * - middleware.ts writes raw User-Agent strings (v1 un-prefixed, v2 namespaced with ua:v2:).
 * - Under bot churn or high key cardinality, traversing the entire keyspace
 *   via repeated SCAN iterations creates an unbounded read loop and cost spike.
 * - Therefore, this endpoint bounds keyspace traversal to MAX_SCAN_ITERATIONS (5)
 *   and MAX_KEYS (100) with a single bounded MGET batch.
 * - Under high cardinality (when traversal terminates before cursor reaches 0),
 *   the returned list represents a bounded sample of recently active user agents
 *   rather than an exhaustive global keyspace sort. This is indicated via the
 *   'X-Sampling-Policy: bounded-sample-100' header. When the keyspace completes
 *   within limits (cursor reaches '0' without dropped keys), 'X-Sampling-Policy: exhaustive'
 *   is returned.
 * - Sampling Policy Design (paul-kinlan-me-kiw): If MAX_KEYS is reached and the cursor
 *   is non-zero, it is conservatively classified as 'bounded-sample-100' without issuing
 *   an extra probe SCAN. Erring conservative avoids paying an extra network round-trip
 *   under bot churn while ensuring incomplete traversals are never mislabeled as exhaustive.
 * - Truncation & Collision-Free Disambiguation (paul-kinlan-me-dve, paul-kinlan-me-duk):
 *   Keys are aggregated by full UA string, then sliced to top 100. Disambiguation keys on the
 *   final emitted label set and loops until a unique candidate is found, preventing collisions
 *   with both truncated long UAs and crafted 512-character UAs.
 * - Keyspace isolation (paul-kinlan-me-sb4): the KV namespace is shared, so the scan
 *   matches 'ua:v2:*' only, and every collected key is re-checked client-side against the
 *   'ua:v2:' prefix before use. Foreign keys (e.g. mention-cache:, polymath:) can never be
 *   published as visitor rows, even if a backend returns keys outside the match pattern.
 *   The v1 un-prefixed branch is removed: middleware.ts has written only ua:v2: keys since
 *   ADR 7wx (930ee375) and v1 keys had a 60s TTL, so no un-prefixed key can exist.
 *   'ua:budget:' quota keys (ADR 7wx) are excluded by the same prefix rule.
 * - Compatibility: Strips 'ua:v2:' prefix to preserve raw User-Agent labels in output and
 *   aggregates counts by full UA string.
 */
export function createUserAgentsHandler(kvClient: KVReader = kv) {
  return async function userAgentsHandler(request: VercelRequest, response: VercelResponse): Promise<void> {
    const userAgentsMap = new Map<string, number>();
    const collectedKeys: string[] = [];
    let cursor: string | number = "0";
    let iterations = 0;
    let isSampled = false;
    const pattern = "ua:v2:*";

    try {
      do {
        iterations++;
        const [newCursor, matchingKeys] = await kvClient.scan(cursor, {
          match: pattern,
          count: SCAN_COUNT_HINT,
        });

        const flatKeys = (matchingKeys || []).flat().filter(Boolean);
        for (const k of flatKeys) {
          const keyStr = String(k);
          // Keyspace isolation (paul-kinlan-me-sb4): only ua:v2: visitor keys are ever
          // collected. This also excludes ua:budget: quota keys (ADR 7wx) and any foreign
          // key sharing the namespace, regardless of what the scan match returned.
          if (!keyStr.startsWith("ua:v2:")) {
            continue;
          }
          if (!collectedKeys.includes(keyStr)) {
            if (collectedKeys.length < MAX_KEYS) {
              collectedKeys.push(keyStr);
            } else {
              isSampled = true;
              break;
            }
          }
        }

        cursor = newCursor;
        if (collectedKeys.length >= MAX_KEYS || iterations >= MAX_SCAN_ITERATIONS) {
          if (String(cursor) !== "0") {
            isSampled = true;
          }
          break;
        }
      } while (String(cursor) !== "0");

      if (collectedKeys.length > 0) {
        const counts = await kvClient.mget(collectedKeys);
        for (let i = 0; i < collectedKeys.length; i++) {
          const rawKey = collectedKeys[i];
          const rawCount = counts ? counts[i] : 0;
          const count = typeof rawCount === "number" ? rawCount : parseInt(String(rawCount), 10) || 0;

          // Strip the 'ua:v2:' prefix; collected keys are guaranteed to carry it (paul-kinlan-me-sb4)
          const cleanKey = rawKey.slice(6);

          // Aggregate count by full UA string so two distinct long UAs do not collapse counts (paul-kinlan-me-0sw)
          const existingCount = userAgentsMap.get(cleanKey) || 0;
          userAgentsMap.set(cleanKey, existingCount + count);
        }
      }
    } catch (error: any) {
      console.log(error?.message || error);
      // Fail closed with 503 and no-store so transient KV errors never cache empty results in CDN (paul-kinlan-me-6xr)
      response.statusCode = 503;
      response.setHeader("Content-Type", "application/json");
      response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
      const errPayload = { error: "Temporary storage error" };
      if (typeof response.json === "function") {
        response.json(errPayload);
      } else if (typeof response.end === "function") {
        response.end(JSON.stringify(errPayload));
      }
      return;
    }

    const userAgents: [string, number][] = Array.from(userAgentsMap.entries());

    userAgents.sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1];
      }
      return a[0].localeCompare(b[0]);
    });

    const emittedLabels = new Set<string>();
    const finalRows: [string, number][] = [];

    for (const [ua, count] of userAgents.slice(0, MAX_RESPONSE_ROWS)) {
      let label = ua.length > MAX_UA_LENGTH ? ua.slice(0, MAX_UA_LENGTH) : ua;
      if (emittedLabels.has(label)) {
        let index = 2;
        const base = label;
        while (true) {
          const suffix = ` [${index}]`;
          const candidate = (base.length + suffix.length > MAX_UA_LENGTH
            ? base.slice(0, Math.max(0, MAX_UA_LENGTH - suffix.length))
            : base) + suffix;
          if (!emittedLabels.has(candidate)) {
            label = candidate;
            break;
          }
          index++;
        }
      }
      emittedLabels.add(label);
      finalRows.push([label, count]);
    }

    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");
    response.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
    response.setHeader("X-Sampling-Policy", isSampled ? "bounded-sample-100" : "exhaustive");
    if (typeof response.json === "function") {
      response.json(finalRows);
    } else if (typeof response.end === "function") {
      response.end(JSON.stringify(finalRows));
    }
  };
}

export default createUserAgentsHandler(kv);
