import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AP } from 'activitypub-core-types';
import type { Readable } from 'node:stream';
import * as admin from 'firebase-admin';

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

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function (req: VercelRequest, res: VercelResponse) {
  const { body, query, method } = req;

  res.statusCode = 200;
  res.setHeader("Content-Type", `application/activity+json`);

  console.log(method)
  console.log(body, query)

  const buf = await buffer(req);
  const rawBody = buf.toString('utf8');

  const message = <AP.Activity>JSON.parse(rawBody);
  console.log(message);

  if (message.type == "Follow") {
    console.log('Follow')
    // We are following.
    const obj: AP.Follow = <AP.Follow>message;
    
    const collection = db.collection('follows');

    const followDoc = collection.doc();
    await followDoc.set(obj);

    // Queue an Accept Activity 

    res.end("ok")
  }

  if (message.type == "Undo") {
    const obj: AP.Follow = <AP.Follow>message;
    const collection = db.collection('follows');

    // Delete the follow
  }

  res.end();
};
