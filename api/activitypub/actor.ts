import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function (req: VercelRequest, res: VercelResponse) {
  res.statusCode = 200;
  res.setHeader("Content-Type", `application/activity+json`);
  res.json({
    "@context": ["https://www.w3.org/ns/activitystreams", { "@language": "en- GB" }],
    "type": "Person",
    "id": "https://paul.kinlan.me/paul",
    "outbox": "https://paul.kinlan.me/outbox",
    "following": "https://paul.kinlan.me/following",
    "followers": "https://paul.kinlan.me/followers",
    "inbox": "https://paul.kinlan.me/inbox",
    "preferredUsername": "paul",
    "name": "Paul Kinlan - Modern Web Development with Chrome",
    "summary": "Paul is a Developer Advocate for Chrome and the Open Web at Google and loves to help make web development easier.",
    "icon": {
      "type":"Image",
      "mediaType":"image/png",
      "url": "https://paul.kinlan.me/images/me.png"
    },
    "publicKey": {
      "@context": "https://w3id.org/security/v1",
      "@type": "Key",
      "id": "https://paul.kinlan.me/paul#main-key",
      "owner": "https://paul.kinlan.me/paul",
      "publicKeyPem": process.env.ACTIVITYPUB_PUBLIC_KEY
    }
  });
}
