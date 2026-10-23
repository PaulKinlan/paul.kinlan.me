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
 * - middleware.ts writes raw User-Agent strings as un-prefixed keys in KV.
 * - Under bot churn or high key cardinality, traversing the entire keyspace
 *   via repeated SCAN iterations creates an unbounded read loop and cost spike.
 * - Therefore, this endpoint bounds keyspace traversal to MAX_SCAN_ITERATIONS (5)
 *   and MAX_KEYS (100) with a single bounded MGET batch.
 * - Under high cardinality, the returned list represents a bounded sample of
 *   recently active user agents rather than an exhaustive global keyspace sort.
 */
export function createUserAgentsHandler(kvClient: KVReader = kv) {
  return async function userAgentsHandler(request: VercelRequest, response: VercelResponse): Promise<void> {
    const userAgents: [string, number][] = [];
    const collectedKeys: string[] = [];
    let cursor: string | number = "0";
    let iterations = 0;
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
          if (!collectedKeys.includes(keyStr)) {
            collectedKeys.push(keyStr);
            if (collectedKeys.length >= MAX_KEYS) {
              break;
            }
          }
        }

        cursor = newCursor;
        if (collectedKeys.length >= MAX_KEYS || iterations >= MAX_SCAN_ITERATIONS) {
          break;
        }
      } while (String(cursor) !== "0");

      if (collectedKeys.length > 0) {
        const counts = await kvClient.mget(collectedKeys);
        for (let i = 0; i < collectedKeys.length; i++) {
          const rawKey = collectedKeys[i];
          const rawCount = counts ? counts[i] : 0;
          const count = typeof rawCount === "number" ? rawCount : parseInt(String(rawCount), 10) || 0;
          const safeKey = rawKey.length > MAX_UA_LENGTH ? rawKey.slice(0, MAX_UA_LENGTH) : rawKey;
          userAgents.push([safeKey, count]);
        }
      }
    } catch (error: any) {
      console.log(error?.message || error);
    }

    userAgents.sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1];
      }
      return a[0].localeCompare(b[0]);
    });

    const finalRows = userAgents.slice(0, MAX_RESPONSE_ROWS);

    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");
    response.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
    response.setHeader("X-Sampling-Policy", "bounded-sample-100");
    if (typeof response.json === "function") {
      response.json(finalRows);
    } else if (typeof response.end === "function") {
      response.end(JSON.stringify(finalRows));
    }
  };
}

export default createUserAgentsHandler(kv);
