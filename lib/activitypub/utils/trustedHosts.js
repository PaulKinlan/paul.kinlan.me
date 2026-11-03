// The hosts this project's federation surfaces trust: the configured public
// origin, the canonical site host, and the current deployment's own Vercel
// host (previews included). Read lazily so tests (and runtime config changes)
// see the current environment, not an import-time snapshot.
//
// One assembly, two consumers: api/activitypub/inbox.ts uses it to validate
// the request's own host before processing an activity, and
// api/activitypub-html/render.ts uses it to restrict the ?url= document key
// to pages that actually belong to one of these hosts (paul-kinlan-me-stn4,
// paul-kinlan-me-tvqu: a literal host list 400s a preview deployment's own
// pages that the inbox already trusts).
export function trustedActivityHosts() {
  const allowedHosts = new Set();
  if (process.env.PUBLIC_ORIGIN) {
    try {
      const parsed = new URL(process.env.PUBLIC_ORIGIN);
      allowedHosts.add(parsed.host.toLowerCase());
      allowedHosts.add(parsed.host.toLowerCase().replace(/:(?:80|443)$/, ''));
    } catch {}
  }
  allowedHosts.add('paul.kinlan.me');
  if (process.env.VERCEL_URL) {
    const vhost = process.env.VERCEL_URL.toLowerCase();
    allowedHosts.add(vhost);
    allowedHosts.add(vhost.replace(/:(?:80|443)$/, ''));
  }
  return allowedHosts;
}

// Does a hostname (e.g. a URL's .hostname, no port) name one of the trusted
// hosts? Port suffixes on allowlist entries (PUBLIC_ORIGIN/VERCEL_URL with an
// explicit port) are ignored, matching how the inbox validates host headers.
export function isTrustedActivityHost(hostname) {
  if (typeof hostname !== 'string' || hostname === '') return false;
  const host = hostname.toLowerCase().replace(/:(?:80|443)$/, '');
  for (const allowed of trustedActivityHosts()) {
    if (allowed.replace(/:(?:80|443)$/, '') === host) return true;
  }
  return false;
}
