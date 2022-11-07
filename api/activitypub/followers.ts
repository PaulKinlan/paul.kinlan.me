import type { VercelRequest, VercelResponse } from '@vercel/node';


export default function (req: VercelRequest, res: VercelResponse) {
  const { body, query, method } = req;
  console.log(method, body, query)

  console.log(req)
  res.statusCode = 200;
  res.setHeader("Content-Type", `application/activity+json`);
  res.end('ok');
};
