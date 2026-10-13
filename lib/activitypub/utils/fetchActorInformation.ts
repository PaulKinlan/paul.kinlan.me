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
 */
export async function fetchActorInformation(actorUrl: string): Promise<AP.Actor | null> {
  try {
    if (typeof actorUrl !== 'string') return null;
    const response = await guardedFetch(actorUrl, {
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
}
