import { kv } from "@vercel/kv";
import type { VercelRequest, VercelResponse } from "@vercel/node";


export default async function userAgents(request: VercelRequest, response: VercelResponse) {
  let userAgents = [];
  let cursor: string | number = "0";
  let pattern = "*";

  try {
    // 30 days.
    //userAgents = await kv.keys("*")

    do {
      const [newCursor, matchingKeys] = await kv.scan(cursor, {
        match: pattern,
      });
      console.log(
        `Scanning, ${matchingKeys.length}, Old Cursor ${cursor}, New Cursor ${newCursor} `
      );

      cursor = newCursor;
      userAgents.push(matchingKeys.flat());
    } while (cursor != "0");

    console.log(`Scanning finished, ${userAgents.length}`);
  } catch (error) {
    // Handle errors
    console.log(error.message);
  }

  response.statusCode = 200;
  response.setHeader("Content-Type", `application/json`);
  response.json(userAgents);
}
