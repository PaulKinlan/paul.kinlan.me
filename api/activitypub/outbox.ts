import type { VercelRequest, VercelResponse } from '@vercel/node';
import {join} from 'path';
import {cwd} from 'process';
import {readFileSync} from 'fs';

export default function(req: VercelRequest, res: VercelResponse) {
  const { body, query } = req;
  console.log(body, query)

  const file = join(cwd(),'public', 'outbox.ajson');
  const stringified = readFileSync(file, 'utf8');

  res.statusCode = 200;
  res.setHeader("Content-Type", `application/activity+json`);

  return res.end(stringified);
};
