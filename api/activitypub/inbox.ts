import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AP } from 'activitypub-core-types';
import type { Readable } from 'node:stream';
import * as admin from 'firebase-admin';
import { v4 as uuid } from 'uuid';
import parser, { Sha256Signer } from '../../lib/http-signature';
import { createHash } from 'crypto';
import { CoreObject, Entity } from 'activitypub-core-types/lib/activitypub/index';

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

function parseSignature(request: VercelRequest) {
  const { url, method, headers } = request;
  return parser.parse({ url, method, headers });
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

    console.log('Follow');
    // We are following.
    const followMessage: AP.Follow = <AP.Follow>message;
    if (followMessage.id == null) return;

    const collection = db.collection('followers');

    // The user might follow twice.

    const actorID = (<URL>followMessage.actor).toString()

    const followDocRef = collection.doc(actorID.replace(/\//g, "_"));
    const followDoc = await followDocRef.get();

    if (followDoc.exists) {
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

    const publicKeyId = "https://paul.kinlan.me/paul#main-key";
    const privateKey = process.env.ACTIVITYPUB_PRIVATE_KEY;

    const signer = new Sha256Signer({ publicKeyId, privateKey, headerNames: ["host", "date", "digest"] });

    const requestHeaders = {
      host: actorInbox.hostname,
      date: new Date().toUTCString(),
      digest: `SHA-256=${createHash('sha256').update(JSON.stringify(acceptRequest)).digest('base64')}`
    }

    // Generate the signature header
    const signature = signer.sign({
      url: actorInbox,
      method: "POST",
      headers: requestHeaders
    });

    console.log("Posting to Actor Inbox", actorInformation.inbox);
    console.log("Headers", {
      method: 'POST',
      body: JSON.stringify(acceptRequest),
      headers: {
        'content-type': "application/activity+json",
        accept: "application/activity+json",
        ...requestHeaders,
        signature: signature
      }
    });

    const followAcceptResponse = await fetch(
      actorInbox,
      {
        method: 'POST',
        body: JSON.stringify(acceptRequest),
        headers: {
          'content-type': "application/activity+json",
          accept: "application/activity+json",
          ...requestHeaders,
          signature: signature
        }
      }
    );

    console.log("Following result", followAcceptResponse.status, followAcceptResponse.statusText, await followAcceptResponse.text());

    return res.end("ok")
  }

  if (message.type == "Undo") {
    const undoObject: AP.Undo = <AP.Undo>message;
    if (undoObject == null || undoObject.id == null) return;
    if (undoObject.object == null) return;
    if ("id" in undoObject.object == false && (<CoreObject>undoObject.object).type != "Follow") return;

    await db.collection('followers').doc(undoObject.id.toString().replace(/\//g, "_")).delete();
  }

  res.end();
};
