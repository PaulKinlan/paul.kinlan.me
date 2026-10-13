import type { AP } from 'activitypub-core-types';
import { request } from 'node:https';
import { resolvePublicAddress } from './guardedFetch.js';

/** Reject unsafe URLs before DNS, then pin the checked DNS result to the TLS request. */
export async function fetchActorInformation(actorUrl: string): Promise<AP.Actor | null> {
  try {
    if (typeof actorUrl !== 'string') return null;
    const url = new URL(actorUrl);
    if (url.protocol !== 'https:' || url.username || url.password) return null;

    // Shared with guardedFetch(): global-unicast addresses only, all DNS
    // answers checked (see lib/activitypub/utils/guardedFetch.ts).
    let address: string;
    let family: number;
    try {
      ({ address, family } = await resolvePublicAddress(url.hostname));
    } catch {
      return null;
    }

    return await new Promise<AP.Actor | null>((resolve) => {
      const req = request(url, {
        headers: { Accept: 'application/activity+json' },
        signal: AbortSignal.timeout(5000),
        // DNS was checked above; do not resolve a second time during connect.
        lookup: (_hostname, options, callback) => {
          // Node may request one address or an array (autoSelectFamily).
          if (options.all) (callback as Function)(null, [{ address, family }]);
          else callback(null, address, family);
        }
      }, (response) => {
        // Do not follow redirects: a public actor could redirect to an internal URL.
        if (response.statusCode !== 200) { response.resume(); resolve(null); return; }
        const chunks: Buffer[] = [];
        let size = 0;
        response.on('data', (chunk: Buffer) => {
          size += chunk.length;
          if (size > 1024 * 1024) {
            response.destroy();
            resolve(null);
          } else chunks.push(chunk);
        });
        response.on('end', () => {
          try {
            const actor = JSON.parse(Buffer.concat(chunks).toString('utf8')) as AP.Actor;
            resolve(actor && typeof actor === 'object' ? actor : null);
          } catch { resolve(null); }
        });
        response.on('error', () => resolve(null));
      });
      req.on('error', () => resolve(null));
      req.end();
    });
  } catch {
    return null;
  }
}
