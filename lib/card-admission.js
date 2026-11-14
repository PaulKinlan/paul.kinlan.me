// The /api/card rendering budget (paul-kinlan-me-7wgy).
//
// /api/card is a public, unauthenticated edge function whose whole job is CPU:
// satori/sharp rasterise an OpenGraph image per request (api/card.tsx).
// middleware.ts's matcher excludes /api (middleware.ts:5), so the User-Agent
// admission quota never covered this route, and nothing in api/card.tsx bounded
// how often a caller could make it rasterise. The shape/size guards (84w) bound
// ONE render; the rate was still whatever an anonymous caller chose.
//
// The remedy is the pattern this repo already ships three times - ADR
// paul-kinlan-me-7wx for User-Agent keys (middleware.ts), the cold-render
// budget paul-kinlan-me-stn4 (api/activitypub-html/render.ts:96-190) and the
// /ask-paul spend budget paul-kinlan-me-gjsg (lib/ask-paul-admission.js): ONE
// atomic Redis EVAL per request, before any paid work, against a fixed-minute
// budget key.
//
// Deliberately a GLOBAL budget, not a per-caller one. A per-caller bucket needs
// a caller identity, and the only candidates on edge are headers (spoofable) or
// the egress IP (which every social-crawler fetch shares). A global cap bounds
// the CPU, which is what this bead is for; fairness between real visitors under
// the cap is a43's problem and is not made worse here, because the cap sits far
// above interactive traffic - the site has one card per post, fetched by
// crawlers that cache.
//
// Key cardinality is bounded by construction: one key per minute, EX120, minted
// only inside the budget check - the cu3 lesson (unbounded caller-keyed KV
// keys) applied to the fix itself. Nothing here is keyed by caller input.
//
// Failure contract, the same one render.ts, user-agents.ts and ask-paul use
// (paul-kinlan-me-6xr): a KV error fails CLOSED. A storage outage must not
// silently restore the unbounded rasterisation lever, and neither the 429 nor
// the 503 may ever be edge-cached.
import { kv } from '@vercel/kv';

export const MAX_CARDS_PER_MINUTE = 60;
const ADMISSION_TTL_SECONDS = 120;

// KEYS[1] = card:budget:<minute>
// ARGV[1] = max cards per minute, ARGV[2] = TTL for the key.
// Returns {1} admitted, {0} refused.
//
// One key and no read-modify-write in script space beyond INCR: Redis runs the
// script whole, so two concurrent requests cannot both see the same count.
// INCR preserves an existing TTL; the EXPIRE on the first increment is what
// gives the key its bounded lifetime.
export const ADMISSION_SCRIPT = `
local used = redis.call('INCR', KEYS[1])
if used == 1 then
  redis.call('EXPIRE', KEYS[1], tonumber(ARGV[2]))
end
if used > tonumber(ARGV[1]) then
  return {0}
end
return {1}
`;

export const budgetKey = (minute) => `card:budget:${minute}`;

// The binding is resolved per call, not at module eval, so a test (or a
// fallback store) can supply its own client without re-importing this module.
// `kv` from @vercel/kv is a Proxy that only reads its env when a property is
// first touched, so importing it costs nothing when it is never used.
const resolveClient = (client) => client ?? globalThis.__cardAdmissionKv ?? kv;

// Returns { admitted: true } | { admitted: false } | { admitted: false,
// unavailable: true }. Never throws: the caller decides the status code, and a
// throw here would be an unhandled rejection in the edge entrypoint.
export async function admitCard({ now = Date.now, client } = {}) {
  const minute = Math.floor(now() / 60000);
  const kvClient = resolveClient(client);
  try {
    const result = await kvClient.eval(
      ADMISSION_SCRIPT,
      [budgetKey(minute)],
      [String(MAX_CARDS_PER_MINUTE), String(ADMISSION_TTL_SECONDS)]
    );
    const admitted = Array.isArray(result) ? Number(result[0]) : Number(result);
    return admitted === 1 ? { admitted: true, minute } : { admitted: false, minute };
  } catch (error) {
    // Deliberately status-free: the message is logged, the caller gets a fixed
    // body. A KV outage must not restore the unbounded lever (fail closed).
    console.log(error?.message || error);
    return { admitted: false, unavailable: true, minute };
  }
}
