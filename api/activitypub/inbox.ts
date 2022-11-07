import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function(req: VercelRequest, res: VercelResponse) {
  const { body, query } = req;
  console.log(body, query)

  console.log(req)
  res.statusCode = 200;
  res.setHeader("Content-Type", `application/activity+json`);
  res.end('ok');
};
