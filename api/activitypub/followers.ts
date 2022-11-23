import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AP } from 'activitypub-core-types';
import type { Readable } from 'node:stream';
import * as admin from 'firebase-admin';
import { v4 as uuid } from 'uuid';
import { Sha256Signer, parser } from '../../lib/http-signature';


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });
}

const db = admin.firestore();


export default async function (req: VercelRequest, res: VercelResponse) {
  const { body, query, method } = req;
  console.log(method, body, query)

  console.log(req)

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

