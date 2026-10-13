/**
 * One validation boundary for outbound federation requests.
 *
 * Every URL on the federation surface that comes from a remote actor is
 * attacker-controlled: actor ids, inboxes, key ids, mention sources. A raw
 * `fetch()` to one of those is an SSRF primitive (the cron in
 * `api/activitypub/sendNote.ts` used to POST signed activities to whatever inbox
 * a follower had registered).
 *
 * Rules enforced here, in this order, before a socket is opened:
 *   1. `https:` only, no credentials in the URL (`user:pass@`);
 *   2. a literal IP host must be global unicast - private, loopback, link-local,
 *      CGNAT, documentation and multicast ranges are refused;
 *   3. a hostname must resolve, and *every* answer must be global unicast;
 *   4. the resolved address is pinned into the TLS connect, so a hostname cannot
 *      resolve to a public address during the check and a private one during the
 *      connect (DNS rebinding);
 *   5. redirects are not followed - a public host must not be able to bounce the
 *      request to an internal one;
 *   6. a timeout and a response size cap are always applied.
 *
 * Callers must never call `fetch()` directly on federation data: go through
 * `guardedFetch()`, or `isSafeFederationUrl()` when only the URL needs checking.
 * This is a plain ESM module (like lib/escape.js) so that tests can run it with
 * `node --test`; the TypeScript handlers import it as `./guardedFetch.js`.
 */
import { lookup } from 'node:dns/promises';
import { request as httpsRequest } from 'node:https';
import { BlockList, isIP } from 'node:net';

/** @type {BlockList} */
const blocked = new BlockList();
for (const [network, prefix] of [
  ['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10],
  ['127.0.0.0', 8], ['169.254.0.0', 16], ['172.16.0.0', 12],
  ['192.0.0.0', 24], ['192.0.2.0', 24], ['192.168.0.0', 16],
  ['198.18.0.0', 15], ['198.51.100.0', 24], ['203.0.113.0', 24],
  ['224.0.0.0', 4], ['240.0.0.0', 4]
]) blocked.addSubnet(network, prefix, 'ipv4');
// Only global-unicast IPv6 is eligible. Exclude documentation, transition and
// special-purpose allocations that can tunnel traffic to private networks.
for (const [network, prefix] of [
  ['2001::', 23], ['2001:db8::', 32], ['2002::', 16]
]) blocked.addSubnet(network, prefix, 'ipv6');

/** @type {BlockList} */
const globalIPv6 = new BlockList();
globalIPv6.addSubnet('2000::', 3, 'ipv6');

/**
 * True only for global-unicast addresses, the ones a federation peer can live at.
 * @param {string} address
 * @returns {boolean}
 */
export function isPublicIpAddress(address) {
  const family = isIP(address);
  if (family === 4) return !blocked.check(address, 'ipv4');
  if (family === 6) return globalIPv6.check(address, 'ipv6') && !blocked.check(address, 'ipv6');
  return false;
}

/** Thrown when a target fails validation; carries a short machine-readable reason. */
export class BlockedRequestError extends Error {
  /** @param {string} reason */
  constructor(reason) {
    super(`guarded-fetch: blocked request (${reason})`);
    this.name = 'BlockedRequestError';
    /** @type {string} */
    this.reason = reason;
  }
}

/**
 * Structural checks only - no DNS. Cheap enough to run on every stored value
 * (e.g. at follow-acceptance time) and to decide whether a follower record is
 * worth pruning.
 * @param {string | URL} value
 * @returns {boolean}
 */
export function isSafeFederationUrl(value) {
  let url;
  try {
    url = value instanceof URL ? value : new URL(String(value));
  } catch {
    return false;
  }
  if (url.protocol !== 'https:') return false;
  if (url.username || url.password) return false;
  const hostname = url.hostname.replace(/^\[|\]$/g, '');
  if (!hostname) return false;
  if (isIP(hostname)) return isPublicIpAddress(hostname);
  return true;
}

/**
 * Resolve a hostname, refusing it unless every answer is global unicast.
 * @param {string} hostname
 * @returns {Promise<{ address: string, family: number }>}
 */
export async function resolvePublicAddress(hostname) {
  const host = hostname.replace(/^\[|\]$/g, '');
  const literal = isIP(host);
  if (literal) {
    if (!isPublicIpAddress(host)) throw new BlockedRequestError('private-address');
    return { address: host, family: literal };
  }
  const answers = await lookup(host, { all: true });
  if (!answers.length) throw new BlockedRequestError('unresolvable-host');
  if (answers.some(({ address }) => !isPublicIpAddress(address))) throw new BlockedRequestError('private-address');
  return { address: answers[0].address, family: answers[0].family };
}

/**
 * @typedef {object} GuardedRequestInit
 * @property {string} [method]
 * @property {Record<string, string>} [headers]
 * @property {string} [body]
 * @property {number} [timeoutMs] defaults to 5000
 * @property {number} [maxBytes] defaults to 1 MiB
 */

/**
 * @param {number} status
 * @param {string} statusText
 * @param {Buffer} body
 * @returns {Response}
 */
function toResponse(status, statusText, body) {
  // Response only accepts 200-599, and null bodies for 204/205/304.
  const safeStatus = status >= 200 && status <= 599 ? status : 502;
  const nullBody = safeStatus === 204 || safeStatus === 205 || safeStatus === 304;
  return new Response(nullBody ? null : body, { status: safeStatus, statusText });
}

/**
 * The only way federation code may make an outbound HTTP request. Returns a
 * `Response` (with a buffered body), throws `BlockedRequestError` when the
 * target fails validation, and never follows a redirect.
 * @param {string | URL} target
 * @param {GuardedRequestInit} [init]
 * @returns {Promise<Response>}
 */
export async function guardedFetch(target, init = {}) {
  if (!isSafeFederationUrl(target)) throw new BlockedRequestError('unsafe-url');
  const url = target instanceof URL ? target : new URL(String(target));
  const pinned = await resolvePublicAddress(url.hostname);
  const timeoutMs = init.timeoutMs ?? 5000;
  const maxBytes = init.maxBytes ?? 1024 * 1024;

  return await new Promise((resolve, reject) => {
    const req = httpsRequest(url, {
      method: init.method ?? 'GET',
      headers: init.headers,
      signal: AbortSignal.timeout(timeoutMs),
      // DNS was checked above; do not resolve a second time during connect.
      lookup: (_hostname, options, callback) => {
        // Node may request one address or an array (autoSelectFamily).
        if (options.all) callback(null, [pinned]);
        else callback(null, pinned.address, pinned.family);
      }
    }, (response) => {
      const status = response.statusCode ?? 0;
      if (status >= 300 && status < 400) {
        // A public peer must not be able to redirect us to a private one.
        response.resume();
        reject(new BlockedRequestError('redirect-not-followed'));
        return;
      }
      /** @type {Buffer[]} */
      const chunks = [];
      let size = 0;
      response.on('data', (chunk) => {
        size += chunk.length;
        if (size > maxBytes) {
          response.destroy();
          reject(new BlockedRequestError('response-too-large'));
        } else chunks.push(chunk);
      });
      response.on('end', () => resolve(toResponse(status, response.statusMessage ?? '', Buffer.concat(chunks))));
      response.on('error', (error) => reject(error));
    });
    req.on('error', (error) => reject(error));
    if (init.body != null) req.write(init.body);
    req.end();
  });
}
