import { next } from "@vercel/edge";
import { kv } from "@vercel/kv";

export const config = {
  matcher: ['/((?!/api|/images|/javascripts|/css|/static|favicon.ico|.json).*)']
};

// Every raw User-Agent used to become a KV key (kv.set + kv.incr on the header
// text): unauthenticated, unbounded cardinality - any request minted two key
// writes and any header value lived for an hour (paul-kinlan-me-cu3).
//
// ADR paul-kinlan-me-7wx (Paul: keep the raw UA, reject family aggregation):
// admission is quota'd per fixed UTC minute. Keys are ua:v2:<raw-UA> (EX60)
// plus one ua:budget:<minute> key (EX120), so the read side's existing v2
// matcher keeps working and at most ~200 count keys and ~3 budget keys are
// ever live. One Redis EVAL per eligible request is the whole KV conversation:
// no scans, no second round-trip.
export const MAX_NEW_UA_PER_MINUTE = 100;
export const MAX_UA_BYTES = 512;
const COUNT_TTL_SECONDS = 60;
const BUDGET_TTL_SECONDS = 120;

const encoder = new TextEncoder();

// KEYS[1] = ua:v2:<raw-UA>, KEYS[2] = ua:budget:<minute>
// ARGV[1] = max new UAs per minute, ARGV[2] = count TTL, ARGV[3] = budget TTL
// Returns [admitted(0|1), count].
//
// Atomicity is the point: Redis runs the script whole, so the budget
// check-and-increment has no GET/SET race, and the SET .. NX on a lost
// same-UA race downgrades to INCR so a count is never overwritten or lost.
// An existing count is INCR'd without touching its TTL - repeat UAs keep
// counting even once the minute's admission budget is spent.
const ADMISSION_SCRIPT = `
local count = redis.call('GET', KEYS[1])
if count then
  return {1, redis.call('INCR', KEYS[1])}
end
if redis.call('EXISTS', KEYS[2]) == 0 then
  redis.call('SET', KEYS[2], 0, 'EX', tonumber(ARGV[3]))
end
local used = tonumber(redis.call('GET', KEYS[2])) or 0
if used >= tonumber(ARGV[1]) then
  return {0, 0}
end
local created = redis.call('SET', KEYS[1], 1, 'EX', tonumber(ARGV[2]), 'NX')
if not created then
  return {1, redis.call('INCR', KEYS[1])}
end
redis.call('INCR', KEYS[2])
return {1, 1}
`;

export function createUaMiddleware(kvClient: { eval: (script: string, keys: string[], args: string[]) => Promise<unknown> } = kv) {
  return async function middleware(request: Request): Promise<Response> {
    const userAgent = request.headers.get('user-agent');

    // Refuse before KV: a missing or oversize header must never mint a key.
    // The 512 cap is UTF-8 bytes, not characters - emoji-heavy UAs are the
    // point of using the encoder rather than String.length.
    if (!userAgent || encoder.encode(userAgent).length > MAX_UA_BYTES) {
      return next();
    }

    const minute = Math.floor(Date.now() / 60000);
    try {
      await kvClient.eval(
        ADMISSION_SCRIPT,
        [`ua:v2:${userAgent}`, `ua:budget:${minute}`],
        [String(MAX_NEW_UA_PER_MINUTE), String(COUNT_TTL_SECONDS), String(BUDGET_TTL_SECONDS)]
      );
    } catch (error: any) {
      // A storage failure must never block the visitor's request.
      console.log(error?.message || error);
    }
    return next();
  };
}

export default createUaMiddleware();
