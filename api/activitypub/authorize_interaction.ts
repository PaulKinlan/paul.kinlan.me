import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function (req: VercelRequest, res: VercelResponse) {
  console.log(req)
  res.statusCode = 200;
  res.setHeader("Content-Type", `application/jrd+json`);
  res.end('ok');
};
