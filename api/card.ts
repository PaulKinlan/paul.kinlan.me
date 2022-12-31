import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge'
}

export default function (req: Request) {

  const url = new URL(req.url);
  const title = url.searchParams.get("title");
  const imgUrl = url.searchParams.get("imgUrl") || "https://paul.kinlan.me/images/me.png";
  const width = url.searchParams.get("width") || "800"
  const height = url.searchParams.get("height") || "418";

  return new ImageResponse({ "type": "div", "props": { "style": { "display": "flex", "height": "100%", "width": "100%", "alignItems": "center", "justifyContent": "center", "letterSpacing": "-.02em", "fontWeight": 700, "background": "white" }, "children": [{ "type": "div", "props": { "style": { "left": 42, "top": 42, "position": "absolute", "display": "flex", "alignItems": "center" }, "children": [{ "type": "span", "props": { "style": { "width": 24, "height": 24, "background": "black" } } }, { "type": "span", "props": { "style": { "marginLeft": 8, "fontSize": 20 }, "children": "paul.kinlan.me" } }] } }, { "type": "div", "props": { "style": { "display": "flex", "flexWrap": "wrap", "justifyContent": "center", "padding": "20px 50px", "margin": "0 42px", "fontSize": 40, "width": "auto", "maxWidth": 550, "textAlign": "center", "backgroundColor": "black", "color": "white", "lineHeight": 1.4 }, "children": title } }] } }, 
  { 
    width, 
    height
  }); // 800px by 418px
}
