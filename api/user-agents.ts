import { kv } from "@vercel/kv";

export default async function userAgents(request: Request) {
  let userAgents = [];

  try {
    // 30 days.
    userAgents = await kv.get("*")
  } catch (error) {
    // Handle errors
    console.log(error.message);
  }
  return new Response(JSON.stringify(userAgents), { headers: { "content-type": "application/json" } });
}
