import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge'
}

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

const plainResponse = (status: number, message: string) =>
  new Response(message, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });

export default function (req: Request) {

  const url = new URL(req.url);
  const width = dimensionOrNull(url.searchParams.get("width"), DEFAULT_WIDTH);
  if (width === null) return plainResponse(400, 'invalid width');
  const height = dimensionOrNull(url.searchParams.get("height"), DEFAULT_HEIGHT);
  if (height === null) return plainResponse(400, 'invalid height');

  // The title is caller-controlled free text, so it is bounded here rather than
  // left to the renderer to lay out.
  const title = (url.searchParams.get("title") ?? '').slice(0, MAX_TITLE_LENGTH);
  const imgUrl = url.searchParams.get("imgUrl") || "https://paul.kinlan.me/images/me.png";

  return new ImageResponse({ "type": "div", "props": { "style": { "display": "flex", "height": "100%", "width": "100%", "alignItems": "center", "justifyContent": "center", "letterSpacing": "-.02em", "fontWeight": 700, "background": "white" }, "children": [{ "type": "div", "props": { "style": { "left": 42, "top": 42, "position": "absolute", "display": "flex", "alignItems": "center" }, "children": [{ "type": "span", "props": { "style": { "width": 24, "height": 24, "background": "black" } } }, { "type": "span", "props": { "style": { "marginLeft": 8, "fontSize": 20 }, "children": "paul.kinlan.me" } }] } }, { "type": "div", "props": { "style": { "display": "flex", "flexWrap": "wrap", "justifyContent": "center", "padding": "20px 50px", "margin": "0 42px", "fontSize": 40, "width": "auto", "maxWidth": 550, "textAlign": "center", "backgroundColor": "black", "color": "white", "lineHeight": 1.4 }, "children": title } }] } }, 
  { 
    width, 
    height
  }); // 800px by 418px
}
