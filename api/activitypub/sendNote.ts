import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AP } from 'activitypub-core-types';
import type { Readable } from 'node:stream';
import * as admin from 'firebase-admin';
import { v4 as uuid } from 'uuid';
import { CoreObject, Entity, OrderedCollection } from 'activitypub-core-types/lib/activitypub/index';
import { sendSignedRequest } from '../../lib/activitypub/sendSignedRequest';
import { parseSignature } from '../../lib/activitypub/utils/parseSignature';
import { fetchActorInformation } from '../../lib/activitypub/utils/fetchActorInformation';

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


/*
  Sends the latest not that hasn't yet been sent.
*/
export default async function (req: VercelRequest, res: VercelResponse) {
  const { body, query, method, url, headers } = req;
  // Check the security token so that we know it was triggered from vercel.

  const configCollection = db.collection('config');
  const configRef = configCollection.doc("config");
  const config = await configRef.get();

  if (config.exists == false) {
    // Config doesn't exist, make something
    configRef.set({
      "lastId": ""
    });
  }

  const { lastId } = config.data();

  // Get my outbox because it contains all my notes.

  const outboxResponse = await fetch('https://paul.kinlan.me/outbox');
  const outbox = <OrderedCollection>(await outboxResponse.json());

  const followersCollection = db.collection('followers');
  const followersQuerySnapshot = await followersCollection.get();

  for (const followerDoc of followersQuerySnapshot.docs) {
    const follower = followerDoc.data();
    try {
      const actorInformation = await fetchActorInformation(follower.actor);
      const actorInbox = new URL(actorInformation.inbox);

      for (const iteIdx in (<AP.EntityReference[]>outbox.orderedItems)) {
        // We have to break somewhereh... do it after the first.
        const item = (<AP.EntityReference[]>outbox.orderedItems)[iteIdx];
        // Item will be an entity, i.e, { Create { Note } }
        const response = await sendSignedRequest(actorInbox, item);
        console.log("Following result", actorInbox, response.status, response.statusText, await response.text());

        break;
      }

    } catch (ex) {
      console.log("Error", ex, follower);
    }
  }

  res.status(200).end("ok");
};
