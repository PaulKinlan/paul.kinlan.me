import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'experimental-edge'
}

export default function (req: Request) {

  const url = new URL(req.url);
  const title = url.searchParams.get("title");
  const imgUrl = url.searchParams.get("imgUrl") || "https://paul.kinlan.me/images/me.png";
  const width = url.searchParams.get("width") || "800"
  const height = url.searchParams.get("width") || "418";


  console.log(req);

  return new ImageResponse({
    type: "div",
    props: {
      children: title,
      style: {
        backgroundColor: "black",
        color: "white",
        width: "100%",
        height: "100%",
      }
    }
  }, { width, height }); // 800px by 418px
}
