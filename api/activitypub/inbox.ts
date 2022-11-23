import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AP } from 'activitypub-core-types';
import type { Readable } from 'node:stream';
import * as admin from 'firebase-admin';
import parser from '../../lib/http-signature';


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

async function verifySignature(request: VercelRequest) {
  const { url, method, headers } = request;
  let signatureValid;

  const signature = parser.parse({ url, method, headers });

  try {
    const keyRes = await fetch(
      signature.keyId,
      {
        headers: {
          accept: 'application/ld+json, application/json'
        }
      }
    );

    const { publicKey } = await keyRes.json();

    // Verify the signature
    signatureValid = signature.verify(
      publicKey.publicKeyPem,	// The PEM string from the public key object
    );
  } catch (error) {
    console.log("Signature Verification error", error)
  }

  return signatureValid;
}

export default async function (req: VercelRequest, res: VercelResponse) {
  const { body, query, method, url, headers } = req;

  res.statusCode = 200;
  res.setHeader("Content-Type", `application/activity+json`);

  console.log(method)
  console.log(body, query)

  // Verify the message some how.
  const buf = await buffer(req);
  const rawBody = buf.toString('utf8');

  const message = <AP.Activity>JSON.parse(rawBody);
  console.log(req.headers);
  console.log(message);

  const signatureValid = await verifySignature(req);

  console.log("Signature Valide", signatureValid)

  if (signatureValid == null || signatureValid == false) {
    res.end('invalid signature');
    return;
  }

  if (message.type == "Follow") {
    /*
      {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: 'https://status.kinlan.me/7c5847cf-ec38-4e6b-8790-914203a975e4',
        type: 'Follow',
        actor: 'https://status.kinlan.me/users/paul',
        object: 'https://paul.kinlan.me/paul'
      }
    */

    console.log('Follow')
    // We are following.
    const obj: AP.Follow = <AP.Follow>message;
    if (obj.id == null) return;

    const collection = db.collection('followers');

    const followDoc = collection.doc();
    await followDoc.set(obj);

    // Queue an Accept Activity 

    res.end("ok")
  }

  if (message.type == "Undo") {
    const undoObject: AP.Undo = <AP.Undo>message;
    if (undoObject.object == null) return;

    const collection = db.collection('followers');
    /*
      {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: 'https://status.kinlan.me/users/paul#follows/2105/undo',
        type: 'Undo',
        actor: 'https://status.kinlan.me/users/paul',
        object: {
          id: 'https://status.kinlan.me/7c5847cf-ec38-4e6b-8790-914203a975e4',
          type: 'Follow',
          actor: 'https://status.kinlan.me/users/paul',
          object: 'https://paul.kinlan.me/paul'
        }
      }
    */

    // Delete the follow
  }

  res.end();
};
