import { createHash, timingSafeEqual } from 'node:crypto';

/** Authenticate the raw request body and bind the signing key to the claimed actor. */
export function verifyInboxActivity(
  rawBody: Buffer,
  digest: string | string[] | undefined,
  activity: { actor?: unknown },
  signature: { keyId?: string; signedHeaders?: string[]; verify: (key: string) => boolean },
  actor: { id?: unknown; publicKey?: { id?: unknown; owner?: unknown; publicKeyPem?: unknown } }
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

  // A digest header that is not part of the signature can be replaced by a sender
  // after signing. Always compare it with the original bytes, not re-serialized JSON.
  if (!signature.signedHeaders?.includes('digest') || typeof digest !== 'string') return false;
  const match = /^SHA-256=([A-Za-z0-9+/]{43}=)$/.exec(digest);
  if (!match) return false;
  const expected = createHash('sha256').update(rawBody).digest();
  const claimed = Buffer.from(match[1], 'base64');
  if (claimed.length !== expected.length || !timingSafeEqual(claimed, expected)) return false;

  try { return signature.verify(key.publicKeyPem); }
  catch { return false; }
}
