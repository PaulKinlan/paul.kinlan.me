// The /ask-paul spending budget (paul-kinlan-me-gjsg).
//
// /ask-paul is a public, unauthenticated edge function whose whole job is to
// spend money: it fetches its own /api/polymath.js, which bills OpenAI for a
// chat completion. middleware.ts's matcher excludes /api (middleware.ts:5), so
// the User-Agent admission quota never covered this route, and nothing in
// api/ask-paul.ts caps how often a caller can make it spend. The spend rate was
// therefore whatever an anonymous caller chose.
//
// The remedy is the pattern this repo already ships twice - ADR
// paul-kinlan-me-7wx for User-Agent keys (middleware.ts) and the cold-render
// budget paul-kinlan-me-stn4 (api/activitypub-html/render.ts:96-190): ONE
// atomic Redis EVAL per request, before any paid work, against a fixed-minute
// budget key.
//
// Deliberately a GLOBAL budget, not a per-caller one. A per-caller bucket needs
// a caller identity, and the only candidates on edge are headers (spoofable) or
// the egress IP (which every /ask-paul request shares - that is exactly the
// bug paul-kinlan-me-a43 records for the loopback call into /api/polymath.js).
// A global cap bounds the bill, which is what this bead is for; fairness
// between real visitors under the cap is a43's problem and is not made worse
// here, because the cap is far above interactive traffic.
//
// Key cardinality is bounded by construction: one key per minute, EX120, minted
// only inside the budget check - the cu3 lesson (unbounded caller-keyed KV
// keys) applied to the fix itself. Nothing here is keyed by caller input.
//
// Failure contract, the same one render.ts and user-agents.ts use
// (paul-kinlan-me-6xr): a KV error fails CLOSED. A storage outage must not
// silently restore the unbounded spending lever, and neither the 429 nor the
// 503 may ever be edge-cached.
import { kv } from '@vercel/kv';

export const MAX_ANSWERS_PER_MINUTE = 30;
const ADMISSION_TTL_SECONDS = 120;

// KEYS[1] = askpaul:budget:<minute>
// ARGV[1] = max answers per minute, ARGV[2] = TTL for the key.
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

export const budgetKey = (minute) => `askpaul:budget:${minute}`;

// The binding is resolved per call, not at module eval, so a test (or a
// fallback store) can supply its own client without re-importing this module.
// `kv` from @vercel/kv is a Proxy that only reads its env when a property is
// first touched, so importing it costs nothing when it is never used.
const resolveClient = (client) => client ?? globalThis.__askPaulAdmissionKv ?? kv;

// Returns { admitted: true } | { admitted: false } | { admitted: false,
// unavailable: true }. Never throws: the caller decides the status code, and a
// throw here would be an unhandled rejection in the edge entrypoint.
export async function admitAnswer({ now = Date.now, client } = {}) {
  const minute = Math.floor(now() / 60000);
  const kvClient = resolveClient(client);
  try {
    const result = await kvClient.eval(
      ADMISSION_SCRIPT,
      [budgetKey(minute)],
      [String(MAX_ANSWERS_PER_MINUTE), String(ADMISSION_TTL_SECONDS)]
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
