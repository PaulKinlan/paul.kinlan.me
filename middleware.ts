import { next } from "@vercel/edge";
import { kv } from "@vercel/kv";

export const config = {
  matcher: ['/((?!/api|/images|/javascripts|/css|/static|favicon.ico|.json).*)']
};

// A fixed set of labels keeps arbitrary request headers from creating unlimited KV keys
// (paul-kinlan-me-cu3): the set is the cardinality bound, so it is these eight labels and
// not "one key per browser we can name". Anything else that carries `Chrome/` or
// `Safari/` - Samsung Internet, Opera, Brave, an in-app webview - therefore counts as
// that engine family. That is the intended resolution of an unbounded header into a
// bounded dimension, not a claim about which browser it was.
//
// Each brand is matched by every token its builds actually send, not just the desktop
// one: Edge ships `EdgA/` on Android and `EdgiOS/` on iOS, Chrome ships `CriOS/` on iOS,
// Firefox ships `FxiOS/` on iOS, and pre-Chromium Edge shipped `Edge/` (paul-kinlan-me-wp1).
// Every iOS browser is WebKit and its user agent also carries `Safari/`, and every
// Chromium browser carries `Chrome/` on Android and desktop, so the brands are tested
// before the Safari and Chrome fallbacks - with the fallback first, a whole platform's
// worth of brands disappears into it. The order below is the contract for that.
const userAgentFamilies = [
  ['Googlebot', /Googlebot/i],
  ['Bingbot', /bingbot/i],
  ['Other bot', /bot|crawler|spider/i],
  ['Edge', /Edg\/|EdgA\/|EdgiOS\/|Edge\//i],
  ['Chrome', /Chrome\/|CriOS\//i],
  ['Firefox', /Firefox\/|FxiOS\//i],
  ['Safari', /Safari\//i],
] as const;

export default async function middleware(request: Request) {
  const userAgent = request.headers.get('user-agent') ?? '';
  const family = userAgentFamilies.find(([, pattern]) => pattern.test(userAgent))?.[0] ?? 'Other';
  const key = `ua:${family}`;

  try {
    // Keep only a rolling minute of counts for each of the fixed families.
    await kv.set(key, 0, { ex: 60, nx: true });
    await kv.incr(key);
  } catch (error) {
    console.log(error);
  }
  return next();
}
