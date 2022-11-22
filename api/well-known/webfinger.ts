import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function (req: VercelRequest, res: VercelResponse) {
  const { body, query, method } = req;
  console.log(method, body, query)

  res.statusCode = 200;
  res.setHeader("Content-Type", `application/jrd+json`);
  res.end(`{  
    "subject": "acct:paul@paul.kinlan.me",
    "aliases": [
      "https://status.kinlan.me/@paul",
    ],
    "links": [
      {
        "rel": "self",
        "type": "application/activity+json",
        "href": "https://paul.kinlan.me/paul"
      }
    ]
  }`);
}
