import type { AP } from 'activitypub-core-types';
import { lookup } from 'node:dns/promises';
import { request } from 'node:https';
import { BlockList, isIP } from 'node:net';

const blocked = new BlockList();
for (const [network, prefix] of [
  ['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10],
  ['127.0.0.0', 8], ['169.254.0.0', 16], ['172.16.0.0', 12],
  ['192.0.0.0', 24], ['192.0.2.0', 24], ['192.168.0.0', 16],
  ['198.18.0.0', 15], ['198.51.100.0', 24], ['203.0.113.0', 24],
  ['224.0.0.0', 4], ['240.0.0.0', 4]
] as [string, number][]) blocked.addSubnet(network, prefix, 'ipv4');
// Only global-unicast IPv6 is eligible. Exclude documentation, transition and
// special-purpose allocations that can tunnel traffic to private networks.
for (const [network, prefix] of [
  ['2001::', 23], ['2001:db8::', 32], ['2002::', 16]
] as [string, number][]) blocked.addSubnet(network, prefix, 'ipv6');

const globalIPv6 = new BlockList();
globalIPv6.addSubnet('2000::', 3, 'ipv6');

function publicAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 4) return !blocked.check(address, 'ipv4');
  if (family === 6) return globalIPv6.check(address, 'ipv6') && !blocked.check(address, 'ipv6');
  return false;
}

/** Reject unsafe URLs before DNS, then pin the checked DNS result to the TLS request. */
export async function fetchActorInformation(actorUrl: string): Promise<AP.Actor | null> {
  try {
    if (typeof actorUrl !== 'string') return null;
    const url = new URL(actorUrl);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    const hostname = url.hostname.replace(/^\[|\]$/g, '');
    let address: string;
    let family: number;
    if (isIP(hostname)) {
      address = hostname;
      family = isIP(hostname);
    } else {
      const answers = await lookup(hostname, { all: true });
      if (!answers.length || answers.some(({ address }) => !publicAddress(address))) return null;
      ({ address, family } = answers[0]);
    }
    if (!publicAddress(address)) return null;

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
