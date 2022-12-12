import { ImageResponse } from '@vercel/og';
import { VercelRequest } from '@vercel/node';

export const config = {
  runtime: 'experimental-edge'
}

export default function (req: VercelRequest) {

  const { title = '', description = '', imgUrl = 'https://paul.kinlan.me/images/me.png', width = 800, height = 400 } = req.query;

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
  }, { width: 500, height: 500 });
}
