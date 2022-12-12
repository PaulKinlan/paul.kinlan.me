import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'experimental-edge'
}

export default function (req: Request) {

  const url = new URL(req.url);
  const title = url.searchParams.get("title");
  const imgUrl = url.searchParams.get("imgUrl") || "https://paul.kinlan.me/images/me.png";

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
  }, { width: 800, height: 418px }); // 800px by 418px
}
