import { next } from "@vercel/edge";
import { kv } from "@vercel/kv";

export const config = {
  matcher: ['/((?!/api|/images|/javascripts|/css|/static|favicon.ico|.json).*)']
};

// A fixed set of labels keeps arbitrary request headers from creating unlimited KV keys.
const userAgentFamilies = [
  ['Googlebot', /Googlebot/i],
  ['Bingbot', /bingbot/i],
  ['Other bot', /bot|crawler|spider/i],
  ['Edge', /Edg\//i],
  ['Chrome', /Chrome\//i],
  ['Firefox', /Firefox\//i],
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
