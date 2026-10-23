import { createHash, timingSafeEqual } from 'node:crypto';

export interface VerifyInboxActivityOptions {
  expectedMethod?: string;
  expectedPath?: string;
  expectedHost?: string | string[];
  now?: number | Date;
  clockSkewMs?: number;
}

const DEFAULT_CLOCK_SKEW_MS = 5 * 60 * 1000; // 5 minutes

/** Authenticate the raw request body and bind the signing key to the claimed actor. */
export function verifyInboxActivity(
  rawBody: Buffer,
  digest: string | string[] | undefined,
  activity: { actor?: unknown },
  signature: { keyId?: string; signedHeaders?: string[]; coveredHeaders?: Record<string, string | string[]>; verify: (key: string) => boolean },
  actor: { id?: unknown; publicKey?: { id?: unknown; owner?: unknown; publicKeyPem?: unknown } },
  options?: VerifyInboxActivityOptions
): boolean {
  const actorId = typeof activity.actor === 'string' ? activity.actor :
    activity.actor && typeof activity.actor === 'object' && 'id' in activity.actor ? activity.actor.id : null;
  const key = actor.publicKey;
  if (typeof actorId !== 'string' || typeof actor.id !== 'string' ||
      typeof signature.keyId !== 'string' || typeof key?.id !== 'string' ||
      typeof key.owner !== 'string' || typeof key.publicKeyPem !== 'string' ||
      actorId !== actor.id || actorId !== key.owner || signature.keyId !== key.id) return false;

  try {
    const actorUrl = new URL(actorId);
    const keyUrl = new URL(signature.keyId);
    if (actorUrl.protocol !== 'https:' || keyUrl.protocol !== 'https:' ||
        actorUrl.host !== keyUrl.host || actorUrl.username || actorUrl.password ||
        keyUrl.username || keyUrl.password) return false;
  } catch { return false; }

  // Require (request-target) in the signature to bind the signed request to this
  // endpoint, preventing a signature signed for another path from being accepted.
  if (!signature.signedHeaders?.includes('(request-target)')) return false;
  const coveredTarget = signature.coveredHeaders?.['(request-target)'];
  if (typeof coveredTarget !== 'string') return false;

  let expectedPath = options?.expectedPath ?? '/inbox';
  if (expectedPath.startsWith('http://') || expectedPath.startsWith('https://')) {
    try {
      const u = new URL(expectedPath);
      expectedPath = `${u.pathname}${u.search}`;
    } catch {
      return false;
    }
  }
  const expectedMethod = (options?.expectedMethod ?? 'post').toLowerCase();
  const expectedTarget = `${expectedMethod} ${expectedPath}`;
  if (coveredTarget.toLowerCase() !== expectedTarget.toLowerCase()) return false;

  // Require date in the signature and enforce a freshness window (default 5 min)
  // to prevent replaying captured signed requests indefinitely.
  if (!signature.signedHeaders?.includes('date')) return false;
  const coveredDate = signature.coveredHeaders?.['date'];
  if (typeof coveredDate !== 'string') return false;
  const requestTime = Date.parse(coveredDate);
  if (Number.isNaN(requestTime)) return false;

  const now = typeof options?.now === 'number'
    ? options.now
    : options?.now instanceof Date
      ? options.now.getTime()
      : Date.now();
  const clockSkewMs = typeof options?.clockSkewMs === 'number'
    ? options.clockSkewMs
    : DEFAULT_CLOCK_SKEW_MS;
  if (Math.abs(now - requestTime) > clockSkewMs) return false;

  // Bind host header to prevent replaying a signature across different domains.
  // If expectedHost is specified (e.g. from the receiving request), require host in
  // signedHeaders and verify it matches. If host is signed (even without explicit
  // expectedHost), verify it matches the deployment host ('paul.kinlan.me').
  // Legacy peers signing (request-target), date, digest without host are accepted
  // when expectedHost is not explicitly enforced.
  const expectedHostList = options?.expectedHost !== undefined
    ? (Array.isArray(options.expectedHost) ? options.expectedHost : [options.expectedHost])
    : ['paul.kinlan.me'];

  const hasHostHeader = signature.signedHeaders?.includes('host');
  if (options?.expectedHost !== undefined || hasHostHeader) {
    if (!hasHostHeader) return false;
    const coveredHost = signature.coveredHeaders?.['host'];
    if (typeof coveredHost !== 'string') return false;
    const normalizedCovered = coveredHost.toLowerCase();
    const match = expectedHostList.some(h => {
      if (typeof h !== 'string' || !h) return false;
      const normalizedExpected = h.toLowerCase();
      return (
        normalizedCovered === normalizedExpected ||
        normalizedCovered === `${normalizedExpected}:443` ||
        normalizedCovered === `${normalizedExpected}:80`
      );
    });
    if (!match) return false;
  }

  // A digest header that is not part of the signature can be replaced by a sender
  // after signing. Always compare it with the original bytes, not re-serialized JSON.
  if (!signature.signedHeaders?.includes('digest') || typeof digest !== 'string') return false;
  // Naming the digest header is not enough: the value the signature actually covered
  // must be this one. Otherwise a signature that covered one digest can be paired
  // with another (lib/http-signature/index.js used to resolve a wrongly-cased name,
  // e.g. "Digest", to undefined and sign the string "digest: undefined").
  if (signature.coveredHeaders?.['digest'] !== digest) return false;
  // Digest permits several comma-separated algorithm values; only the SHA-256
  // value authenticates this body. Reject ambiguous duplicate SHA-256 entries.
  const sha256 = digest.split(',').map(value => value.trim())
    .filter(value => /^sha-256=/i.test(value));
  if (sha256.length !== 1) return false;
  const match = /^sha-256=([A-Za-z0-9+/]{43}=)$/i.exec(sha256[0]);
  if (!match) return false;
  const expected = createHash('sha256').update(rawBody).digest();
  const claimed = Buffer.from(match[1], 'base64');
  if (claimed.length !== expected.length || !timingSafeEqual(claimed, expected)) return false;

  try { return signature.verify(key.publicKeyPem); }
  catch { return false; }
}
