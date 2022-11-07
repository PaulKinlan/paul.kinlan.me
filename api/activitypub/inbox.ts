import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Readable } from 'node:stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function(req: VercelRequest, res: VercelResponse) {
  const { body, query, method } = req;
  
  console.log(method)
  console.log(body, query)

  const buf = await buffer(req);
  const rawBody = buf.toString('utf8');

  console.log(rawBody);

  res.statusCode = 200;
  res.setHeader("Content-Type", `application/activity+json`);
  res.end('ok');
};
