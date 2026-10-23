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
 * - Truncation & Disambiguation (paul-kinlan-me-dve): Keys are aggregated by full UA
 *   string, then sliced to top 100. Any distinct UAs exceeding 512 bytes that would
 *   otherwise share an identical truncated label receive a disambiguating suffix so
 *   the rendered table displays distinct entries.
 * - Compatibility: Strips 'ua:v2:' prefix to preserve raw User-Agent labels in output,
 *   ignores 'ua:budget:' quota keys (ADR 7wx), and aggregates counts across formats.
 */
export function createUserAgentsHandler(kvClient: KVReader = kv) {
  return async function userAgentsHandler(request: VercelRequest, response: VercelResponse): Promise<void> {
    const userAgentsMap = new Map<string, number>();
    const collectedKeys: string[] = [];
    let cursor: string | number = "0";
    let iterations = 0;
    let isSampled = false;
    const pattern = "*";

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
          // Ignore internal quota keys (ADR 7wx)
          if (keyStr.startsWith("ua:budget:")) {
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

          // Strip 'ua:v2:' prefix if present (ADR 7wx compatibility) while preserving v1 raw keys
          const cleanKey = rawKey.startsWith("ua:v2:") ? rawKey.slice(6) : rawKey;

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

    const seenLabels = new Map<string, number>();
    const finalRows: [string, number][] = [];

    for (const [ua, count] of userAgents.slice(0, MAX_RESPONSE_ROWS)) {
      let label = ua.length > MAX_UA_LENGTH ? ua.slice(0, MAX_UA_LENGTH) : ua;
      if (seenLabels.has(label) && ua.length > MAX_UA_LENGTH) {
        // Disambiguate duplicate truncated label (paul-kinlan-me-dve)
        const dupIndex = (seenLabels.get(label) || 1) + 1;
        seenLabels.set(label, dupIndex);
        const suffix = ` [${dupIndex}]`;
        label = ua.slice(0, MAX_UA_LENGTH - suffix.length) + suffix;
      } else {
        seenLabels.set(label, 1);
      }
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
