import { next } from "@vercel/edge";
import { kv } from "@vercel/kv";

export const config = {
  matcher: "/",
};

export default async function middleware(request: Request) {

  const requestHeaders = new Headers(request.headers);

  const userAgent = requestHeaders.get('user-agent');

  try {
    // 30 days.
    await kv.set(userAgent, 0, { ex: 30 * 86400, nx: true });
    await kv.incr(userAgent);
    console.log(`Logging User Agent ${userAgent}`);
  } catch (error) {
    // Handle errors
    console.log(error.message);
  }
  return next();
}
