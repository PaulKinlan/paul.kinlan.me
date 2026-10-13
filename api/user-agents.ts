import { kv } from "@vercel/kv";
import type { VercelRequest, VercelResponse } from "@vercel/node";


export default async function userAgents(request: VercelRequest, response: VercelResponse) {
  let userAgents = [];
  let cursor: string = "0";
  const pattern = "ua:*";

  try {

    do {
      const [newCursor, matchingKeys] = await kv.scan(cursor, {
        match: pattern,
      });
      const keys = matchingKeys.flat();
      const counts = keys.length ? await kv.mget(keys) : [];

      const zipped = keys.map((key, index) => [key.slice(3), Number(counts[index])]);

      cursor = newCursor;
      userAgents.push(...zipped);
    } while (cursor != "0");

  } catch (error) {
    // Handle errors
    console.log(error.message);
  }

  userAgents.sort((a, b) => {
    return (b[1] > a[1] ? 1 : -1);
  });

  response.statusCode = 200;
  response.setHeader("Content-Type", `application/json`);
  response.json(userAgents);
}
