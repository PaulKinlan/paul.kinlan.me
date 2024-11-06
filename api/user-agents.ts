import { kv } from "@vercel/kv";
import type { VercelRequest, VercelResponse } from "@vercel/node";


export default async function userAgents(request: VercelRequest, response: VercelResponse) {
  let userAgents = [];
  let cursor: string | number = "0";
  let pattern = "*";

  try {

    do {
      const [newCursor, matchingKeys] = await kv.scan(cursor, {
        match: pattern,
      });
      const keys = matchingKeys.flat();
      const counts = kv.mget(keys);

      const zipped = keys.map((key, index) => [key, counts[index]]);
      // console.log(
      //   `Scanning, ${matchingKeys.length}, Old Cursor ${cursor}, New Cursor ${newCursor} `
      // );

      cursor = newCursor;
      userAgents.push(zipped);
    } while (cursor != "0");

  } catch (error) {
    // Handle errors
    console.log(error.message);
  }

  response.statusCode = 200;
  response.setHeader("Content-Type", `application/json`);
  response.json(userAgents);
}
