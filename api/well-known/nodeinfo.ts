import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function (req: VercelRequest, res: VercelResponse) {
  const { resource } = req.query;
  res.statusCode = 200;
  res.setHeader("Content-Type", `application/json; profile="http://nodeinfo.diaspora.software/ns/schema/2.1#"`);
  res.json({
    "links": [
      {
        "rel": "http://nodeinfo.diaspora.software/ns/schema/2.1",
        "href": "https://paul.kinlan.me/nodeinfo/2.1"
      }
    ]
  });
}
