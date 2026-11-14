import { ImageResponse } from '@vercel/og';

import { admitCard } from '../lib/card-admission.js';

export const config = {
  runtime: 'edge'
}

// The JSX factory. satori consumes plain { type, props } elements, so three
// lines give this file real JSX markup with no React dependency on the edge
// function (and @vercel/og ships no JSX runtime of its own). The factory is
// selected by tsconfig.json's jsx/jsxFactory settings - the single source of
// truth that Vercel's build, esbuild and tsc all read - so there is no
// per-file pragma whose removal could silently change the compile
// (paul-kinlan-me-tgpj). tests/card.test.mjs pins the same transform so the
// harness cannot drift from the production build.
const h = (type: string, props: Record<string, unknown> = {}, ...children: unknown[]) => ({
  type,
  props: { ...props, children: children.length <= 1 ? children[0] : children }
});

// A card's canvas is a cost the caller picks if we let them: the edge image
// pipeline rasterises whatever width/height it is handed, and 100000x100000 is a
// rectangle nobody asked to see. layouts/partials/head.html never sends
// dimensions at all, so these bounds only ever refuse a hand-crafted URL.
const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 418;
const MIN_DIMENSION = 200;
const MAX_DIMENSION = 2400;
// A card title is a headline. Past this the string is not a title any more, and
// the renderer would lay out an unbounded amount of text.
const MAX_TITLE_LENGTH = 200;

// A dimension from the query string: the default when absent, `null` when the
// value cannot be a canvas size at all, clamped into [MIN_DIMENSION,
// MAX_DIMENSION] otherwise.
//
// Number() alone is too generous - '0x10', '1e5', ' ', 'NaN' and 'Infinity' all
// become numbers - so the digits are checked first, and a negative or zero
// dimension is refused rather than clamped: it is not a smaller card, it is a
// broken request.
const dimensionOrNull = (value: string | null, fallback: number): number | null => {
  if (value === null || value === '') return fallback;
  if (!/^[0-9]{1,9}$/.test(value)) return null;
  const parsed = Number(value);
  if (parsed < 1) return null;
  return Math.min(Math.max(parsed, MIN_DIMENSION), MAX_DIMENSION);
};

const plainResponse = (status: number, message: string, headers: Record<string, string> = {}) =>
  new Response(message, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', ...headers }
  });

// The card is a pure function of its query string, so the browser and the Vercel
// edge CDN may both keep it: @vercel/og already defaults the response to
// `public, immutable, no-transform, max-age=31536000`, which caches in BROWSERS
// only - Vercel's edge CDN caches a function response on s-maxage, and social
// crawlers (the main fetchers of an og:image) hold no browser cache between
// fetches. This header is what makes a repeat fetch, of any kind, cost zero
// rasterisation (paul-kinlan-me-7wgy).
const CARD_CACHE_CONTROL = 'public, immutable, no-transform, max-age=31536000, s-maxage=86400';

export default async function (req: Request) {

  const url = new URL(req.url);
  const width = dimensionOrNull(url.searchParams.get("width"), DEFAULT_WIDTH);
  if (width === null) return plainResponse(400, 'invalid width');
  const height = dimensionOrNull(url.searchParams.get("height"), DEFAULT_HEIGHT);
  if (height === null) return plainResponse(400, 'invalid height');

  // The title is caller-controlled free text, so it is bounded here rather than
  // left to the renderer to lay out.
  const title = (url.searchParams.get("title") ?? '').slice(0, MAX_TITLE_LENGTH);

  // Admission BEFORE the rasterisation (paul-kinlan-me-7wgy): this route is
  // unauthenticated CPU with no other quota (middleware.ts's matcher excludes
  // /api), so the render rate was whatever an anonymous caller chose. One
  // atomic KV EVAL against a global per-minute budget (lib/card-admission.js);
  // the refusals below commit nothing cacheable, and a KV outage fails CLOSED
  // (503) rather than restoring the unbounded lever - the same contract as
  // api/activitypub-html/render.ts and api/ask-paul.ts. The cheap 400s above
  // stay ahead of admission on purpose: an invalid request costs no KV
  // round-trip and no budget.
  const admission = await admitCard();
  if (admission.unavailable) {
    return plainResponse(503, 'Card rendering is unavailable right now. Please try again shortly.', {
      'Cache-Control': 'no-store'
    });
  }
  if (!admission.admitted) {
    return plainResponse(429, 'Too many cards rendered right now. Please try again in a minute.', {
      'Cache-Control': 'no-store',
      'Retry-After': '60'
    });
  }

  return new ImageResponse(
    <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', letterSpacing: '-.02em', fontWeight: 700, background: 'white' }}>
      <div style={{ left: 42, top: 42, position: 'absolute', display: 'flex', alignItems: 'center' }}>
        <span style={{ width: 24, height: 24, background: 'black' }} />
        <span style={{ marginLeft: 8, fontSize: 20 }}>paul.kinlan.me</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '20px 50px', margin: '0 42px', fontSize: 40, width: 'auto', maxWidth: 550, textAlign: 'center', backgroundColor: 'black', color: 'white', lineHeight: 1.4 }}>{title}</div>
    </div>,
    {
      width,
      height,
      headers: { 'Cache-Control': CARD_CACHE_CONTROL }
    }); // 800px by 418px
}
