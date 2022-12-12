import type { VercelRequest, VercelResponse } from '@vercel/node';
import { join } from 'path';
import { cwd } from 'process';
import { readFileSync } from 'fs';

/*
  This returns a list of posts for the single user 'Paul'.

  It's a GET request. This doesn't post it to anyone's timeline.
*/
export default function (req: VercelRequest, res: VercelResponse) {
  // All of the outbox data is generated at build time, so just return that static file.
  const file = join(cwd(), 'public', 'outbox.ajson');
  const stringified = readFileSync(file, 'utf8');

  res.statusCode = 200;
  res.setHeader("Content-Type", `application/activity+json`);

  return res.end(stringified);
};
