import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AP } from 'activitypub-core-types';
import admin from 'firebase-admin';
import { OrderedCollection } from 'activitypub-core-types/lib/activitypub/index.js';
import { sendSignedRequest } from '../../lib/activitypub/utils/sendSignedRequest.js';
import { fetchActorInformation } from '../../lib/activitypub/utils/fetchActorInformation.js';
import { isSafeFederationUrl } from '../../lib/activitypub/utils/guardedFetch.js';

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
  A follower whose inbox is not a public HTTPS URL is not a peer we can deliver
  to, and it is not a record worth keeping: drop it. Only structurally unsafe
  inboxes are pruned - a DNS lookup that fails or resolves privately keeps the
  follower, because that can be transient.
*/
async function pruneFollower(ref: admin.firestore.DocumentReference) {
  try {
    await ref.delete();
    console.log("Pruned follower with an unsafe inbox");
  } catch (ex) {
    console.log("Could not prune follower", ex);
  }
}

/*
  Sends the latest not that hasn't yet been sent.
*/
export default async function (req: VercelRequest, res: VercelResponse) {
  const { body, query, method, url, headers } = req;

  if (
    headers.authorization !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return res.status(401).end("Unauthorized");
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
      console.log(`Fetching actor information for ${actorUrl}`)
      const actorInformation = await fetchActorInformation(actorUrl);
      if (actorInformation == undefined) {
        // We can't send to this actor, so skip the actor. We should log it.
        continue;
      }
    
      if (actorInformation.inbox == undefined) { 
        console.log(
          `Actor ${actorUrl} doesn't have an inbox, so we can't send to them.`
        );
        continue;
      }
      let actorInbox: URL;
      try {
        actorInbox = new URL(actorInformation.inbox.toString());
      } catch {
        await pruneFollower(followerDoc.ref);
        continue;
      }

      // Re-validate at send time: the inbox is follower-controlled data, and it
      // may have been stored before this check existed. Anything that is not a
      // public HTTPS address must never receive a signed activity.
      // See lib/activitypub/utils/guardedFetch.js.
      if (!isSafeFederationUrl(actorInbox)) {
        await pruneFollower(followerDoc.ref);
        continue;
      }

      for (const iteIdx in (<AP.EntityReference[]>outbox.orderedItems)) {
        // We have to break somewhere... do it after the first.
        const item = (<AP.EntityReference[]>outbox.orderedItems)[iteIdx];
       
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

        // Item will be an entity, i.e, { Create { Note } }
        try {
          console.log(`Sending to ${actorInbox}`);

          const response = await sendSignedRequest(actorInbox, <AP.Activity> item);
          console.log(`Send result: ${actorInbox}`, response.status, response.statusText, await response.text());

          // It's not been sent.
          lastSuccessfulSentId = item.id; // we shouldn't really set this every time.
        } catch (sendSignedError) {
          console.log("Error sending signed request", sendSignedError)
        }

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
