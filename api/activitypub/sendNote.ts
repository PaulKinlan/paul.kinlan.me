import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AP } from 'activitypub-core-types';
import admin from 'firebase-admin';
import { OrderedCollection } from 'activitypub-core-types/lib/activitypub/index.js';
import { sendSignedRequest } from '../../lib/activitypub/utils/sendSignedRequest.js';
import { fetchActorInformation } from '../../lib/activitypub/utils/fetchActorInformation.js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

const db = admin.firestore();

/*
  Sends the latest not that hasn't yet been sent.
*/
export default async function (req: VercelRequest, res: VercelResponse) {
  const { body, query, method, url, headers } = req;
  const { token } = query;

  if (method != "POST") {
    console.log("Invalid Method, must be POST");
    res.status(401).end("Invalid Method, must be POST");
    return;
  }

  if (token != process.env.ACTIVITYPUB_CREATE_TOKEN) {
    console.log("Invalid token")
    res.status(401).end("Invalid token");
    return;
  }

  const configCollection = db.collection('config');
  const configRef = configCollection.doc("config");
  const config = await configRef.get();

  if (config.exists == false) {
    // Config doesn't exist, make something
    configRef.set({
      "lastId": ""
    });
  }

  const configData = config.data();
  let lastId = "";
  if (configData != undefined) {
    lastId = configData.lastId;
  }

  // Get my outbox because it contains all my notes.
  const outboxResponse = await fetch('https://paul.kinlan.me/outbox');
  const outbox = <OrderedCollection>(await outboxResponse.json());

  const followersCollection = db.collection('followers');
  const followersQuerySnapshot = await followersCollection.get();

  let lastSuccessfulSentId = "";

  for (const followerDoc of followersQuerySnapshot.docs) {
    const follower = followerDoc.data();
    try {
      const actorUrl = (typeof follower.actor == "string") ? follower.actor : follower.actor.id;
      const actorInformation = await fetchActorInformation(actorUrl);
      if (actorInformation == undefined) {
        // We can't send to this actor, so skip it. We should log it.
        continue;
      }

      const actorInbox = new URL(<URL>actorInformation.inbox);

      for (const iteIdx in (<AP.EntityReference[]>outbox.orderedItems)) {
        // We have to break somewhere... do it after the first.
        const item = (<AP.EntityReference[]>outbox.orderedItems)[iteIdx];
        if (item.)
        console.log(`Checking ID ${item.id}, ${lastId}`);
        if (item.id == `${lastId}`) {
          lastSuccessfulSentId = item.id;
          // We've already posted this, don't try and send it again.
          console.log(`${item.id} has already been posted - don't attempt`)
          break;
        }
       
        if (item.object != undefined) {
          // We might not need this.
          item.object.published = (new Date()).toISOString();
        }

        console.log(`Sending to ${actorInbox}`);
        
        // Item will be an entity, i.e, { Create { Note } }
        const response = await sendSignedRequest(actorInbox, <AP.Activity> item);
        console.log(`Send result: ${actorInbox}`, response.status, response.statusText, await response.text());

        // It's not been sent.
        lastSuccessfulSentId = item.id; // we shouldn't really set this everytime.

        break; // At some point we might want to post more than one post, so remove this.
      }
    } catch (ex) {
      console.log("Error", ex);
    }
  }

  configRef.set({
    "lastId": lastSuccessfulSentId
  });

  res.status(200).end("ok");
};
