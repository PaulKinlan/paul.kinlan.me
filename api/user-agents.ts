import { kv } from "@vercel/kv";
import type { VercelRequest, VercelResponse } from "@vercel/node";


export default async function userAgents(request: VercelRequest, response: VercelResponse) {
  let userAgents = [];
  let cursor: string = "0";
  let pattern = "*";

  try {

    do {
      const [newCursor, matchingKeys] = await kv.scan(cursor, {
        match: pattern,
      });
      const keys = matchingKeys.flat();
      const counts = await kv.mget(keys);

      const zipped = keys.map((key, index) => [key, parseInt(counts[index] as string)]);
      // console.log(
      //   `Scanning, ${matchingKeys.length}, Old Cursor ${cursor}, New Cursor ${newCursor} `
      // );

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
