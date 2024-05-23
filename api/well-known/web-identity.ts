import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function (req: VercelRequest, res: VercelResponse) {
  const { resource } = req.query;
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
  "provider_urls":
     ["https://sso.kinlan.me/test/fedcm.json"]
});
}
