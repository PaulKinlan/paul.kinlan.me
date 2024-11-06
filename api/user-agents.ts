import { kv } from "@vercel/kv";

export default async function userAgents(request: Request) {
  let userAgents = [];
  let cursor: string| number = "0";
  let pattern = "*";

  try {
    // 30 days.
    //userAgents = await kv.keys("*")

    do {
     const [newCursor, matchingKeys] = await kv.scan(
        cursor,
        { match: pattern }
      );
      console.log(`Scanning, ${matchingKeys.length}, Old Cursor ${cursor}, New Cursor ${newCursor} `);

      cursor = newCursor;
      userAgents.push(matchingKeys);
    } while(cursor != "0")

      console.log(`Scanning finished, ${userAgents.length}`);

  } catch (error) {
    // Handle errors
    console.log(error.message);
  }
  return new Response(JSON.stringify(userAgents), { headers: { "content-type": "application/json" } });
}
