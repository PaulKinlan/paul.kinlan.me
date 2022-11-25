import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AP } from 'activitypub-core-types';
import type { Readable } from 'node:stream';
import * as admin from 'firebase-admin';
import { v4 as uuid } from 'uuid';
import { CoreObject, Entity } from 'activitypub-core-types/lib/activitypub/index';
import { sendSignedRequest } from '../../lib/activitypub/sendSignedRequest';
import { parseSignature } from '../../lib/activitypub/utils/parseSignature';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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

async function fetchActorInformation(actorUrl: string) {
  try {
    const response = await fetch(
      actorUrl,
      {
        headers: {
          "Content-type": 'application/activity+json',
          "Accept": 'application/activity+json'
        }
      }
    );

    return await response.json();
  } catch (error) {
    console.log("Unable to fetch action information", actorUrl)
  }
  return null;
}

function verifySignature(signature, publicKeyJson) {
  let signatureValid;

  try {
    // Verify the signature
    signatureValid = signature.verify(
      publicKeyJson.publicKeyPem,	// The PEM string from the public key object
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
  console.log(req.headers);

  // Verify the message some how.
  const buf = await buffer(req);
  const rawBody = buf.toString('utf8');

  const message = <AP.Activity>JSON.parse(rawBody);

  console.log(message);

  const signature = parseSignature(req);
  const actorInformation = await fetchActorInformation(signature.keyId);
  const signatureValid = verifySignature(signature, actorInformation.publicKey);

  if (signatureValid == null || signatureValid == false) {
    res.end('invalid signature');
    return;
  }

  // We should check the digest.
  if (message.type == "Follow") {
    console.log('Follow');
    // We are following.
    const followMessage: AP.Follow = <AP.Follow>message;
    if (followMessage.id == null) return;

    const collection = db.collection('followers');

    const actorID = (<URL>followMessage.actor).toString();
    const followDocRef = collection.doc(actorID.replace(/\//g, "_"));
    const followDoc = await followDocRef.get();

    if (followDoc.exists) {
      console.log("Already Following")
      return res.end('already following');
    }

    // Create the follow;
    await followDocRef.set(followMessage);

    const guid = uuid();
    const domain = 'paul.kinlan.me';

    const acceptRequest: AP.Accept = <AP.Accept>{
      "@context": "https://www.w3.org/ns/activitystreams",
      'id': new URL(`https://${domain}/${guid}`),
      'type': 'Accept',
      'actor': "https://paul.kinlan.me/paul",
      'object': followMessage
    };

    const actorInbox = new URL(actorInformation.inbox);

    const response = await sendSignedRequest(actorInbox, acceptRequest);

    console.log("Following result", response.status, response.statusText, await response.text());

    return res.end("ok")
  }

  if (message.type == "Undo") {
    // Undo a follow.
    const undoObject: AP.Undo = <AP.Undo>message;
    if (undoObject == null || undoObject.id == null) return;
    if (undoObject.object == null) return;
    if ("actor" in undoObject.object == false && (<CoreObject>undoObject.object).type != "Follow") return;

    const docId = undoObject.actor.toString().replace(/\//g, "_");

    console.log("DocId to delete", docId)

    const res = await db.collection('followers').doc(docId).delete();

    console.log("Deleted", res)
  }

  res.end();
};
