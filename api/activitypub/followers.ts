import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as admin from 'firebase-admin';


if (!admin.default.apps.length) {
  admin.default.initializeApp({
    credential: admin.default.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

const db = admin.default.firestore();

export default async function (req: VercelRequest, res: VercelResponse) {
  const collection = db.collection('followers');
  const actors = await collection.select("actor").get();

  const output = { 
    "@context": "https://www.w3.org/ns/activitystreams", 
    "id": "https://status.kinlan.me/users/paul/following?page=1",
    "type": "OrderedCollectionPage", 
    "totalItems": actors.docs.length,
    "orderedItems": actors.docs.map(item=>item.get("actor"))
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", `application/activity+json`);
  res.json(output);
};

