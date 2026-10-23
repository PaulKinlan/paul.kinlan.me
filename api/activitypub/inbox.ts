import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AP } from 'activitypub-core-types';
import { CoreObject, EntityReference } from 'activitypub-core-types/lib/activitypub/index.js';

import admin from 'firebase-admin';

import type { Readable } from 'node:stream';
import { v4 as uuid } from 'uuid';
import { fetchActorInformation } from '../../lib/activitypub/utils/fetchActorInformation.js';
import { parseSignature } from '../../lib/activitypub/utils/parseSignature.js';
import { sendSignedRequest } from '../../lib/activitypub/utils/sendSignedRequest.js';
import { verifyInboxActivity } from '../../lib/activitypub/utils/verifyInboxActivity.js';
import { validateFollowerInbox } from '../../lib/activitypub/utils/guardedFetch.js';
import { logSafeText, logSafePeerId } from '../../lib/activitypub/utils/logSafe.js';

// A blocked or unreachable peer must not turn a valid Follow into a 500: the
// follow is already stored and the fan-out will retry it later.
async function sendSignedRequestSafely(inbox: URL, activity: AP.Activity): Promise<Response> {
  try {
    return await sendSignedRequest(inbox, activity);
  } catch (error) {
    console.log("Error sending signed request", error);
    return new Response(null, { status: 502, statusText: 'send-failed' });
  }
}

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

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function getTrustedHost(req: VercelRequest): string | undefined {
  const allowedHosts = new Set<string>();
  if (process.env.PUBLIC_ORIGIN) {
    try {
      allowedHosts.add(new URL(process.env.PUBLIC_ORIGIN).host.toLowerCase());
    } catch {}
  }
  allowedHosts.add('paul.kinlan.me');
  if (process.env.VERCEL_URL) {
    allowedHosts.add(process.env.VERCEL_URL.toLowerCase());
  }

  const rawHost = (typeof req.headers['x-forwarded-host'] === 'string'
    ? req.headers['x-forwarded-host'].split(',')[0].trim()
    : undefined) || (typeof req.headers.host === 'string' ? req.headers.host : undefined);

  if (!rawHost) return undefined;
  const hostLower = rawHost.toLowerCase();
  const hostWithoutPort = hostLower.replace(/:(?:80|443)$/, '');

  if (allowedHosts.has(hostLower) || allowedHosts.has(hostWithoutPort)) {
    return rawHost;
  }
  return undefined;
}

export default async function (req: VercelRequest, res: VercelResponse) {
  res.statusCode = 200;
  res.setHeader("Content-Type", `application/activity+json`);

  // Reading the body is untrusted input too: a broken or aborted stream must be
  // the same 400 as a body that is not JSON, not an unhandled 500.
  const buf = await buffer(req).catch(() => null);
  if (buf === null) {
    res.statusCode = 400;
    return res.end('invalid activity');
  }

  let message: AP.Activity;
  try {
    message = JSON.parse(buf.toString('utf8')) as AP.Activity;
    if (!message || typeof message !== 'object') throw new Error('invalid activity');
  } catch {
    res.statusCode = 400;
    return res.end('invalid activity');
  }

  let signature;
  try {
    signature = parseSignature(req);
  } catch {
    res.statusCode = 401;
    return res.end('invalid signature');
  }
  const actorInformation = await fetchActorInformation(signature.keyId);
  const expectedHost = getTrustedHost(req);
  if (!actorInformation || !verifyInboxActivity(buf, req.headers.digest, message, signature, actorInformation, {
    expectedMethod: req.method,
    expectedPath: req.url,
    expectedHost: expectedHost ?? '__UNTRUSTED_HOST__'
  })) {
    res.statusCode = 401;
    return res.end('invalid signature or actor');
  }

  if (message.type == "Delete") {
    // Ignore authenticated deletes for now.
    return res.end("delete");
  }

  await saveActor(actorInformation);
  // Add the actor information to the message so that it's saved directly.
  message.actor = actorInformation;

  console.log(logSafeText(message.type));

  if (message.type == "Follow") {
    // We are following.
    await saveFollow(<AP.Follow>message, actorInformation);
  }

  if (message.type == "Like") {
    await saveLike(<AP.Like>message);
  }

  if (message.type == "Announce") {
    await saveAnnounce(<AP.Announce>message);
  }

  if (message.type == "Create") {
    console.log("Message type Create")
    // Someone is sending us a message. 
    const createMessage = <AP.Create>message;

    if (createMessage == null || createMessage.id == null) return;
    if (createMessage.object == null) return;
    // We only interested in Replies - that is a "note" with a "replyTo"
    const createObject = <CoreObject>createMessage.object
    if (createObject.type == "Note" && createObject.inReplyTo != undefined) {
      await saveReply(<AP.Create>createMessage);
    }
  }

  if (message.type == "Undo") {
    // Undo a follow.
    const undoObject: AP.Undo = <AP.Undo>message;
    if (undoObject == null || undoObject.id == null) return;
    if (undoObject.object == null) return;
    // A signed Undo can carry an object IRI instead of an embedded activity.
    // Do not use `in` on that primitive; ignore it with the usual 200 response.
    if (typeof undoObject.object !== 'object') return res.end("ok");
    if ("actor" in undoObject.object == false) return;

    if ((<CoreObject>undoObject.object).type == "Follow") {
      await removeFollow(<AP.Follow>undoObject);
    }

    if ((<CoreObject>undoObject.object).type == "Like") {
      await removeLike(<AP.Like>undoObject);
    }

    if ((<CoreObject>undoObject.object).type == "Announce") {
      await removeAnnounce(<AP.Announce>undoObject);
    }
  }

  if (message.type == "Update") {
    // TODO: We need to update the messages
    // The body is a peer-supplied activity and is not logged: the fact that it
    // arrived and was ignored is the whole of what this branch does with it.
    console.log("Ignored an Update message; updates are not applied");
  }

  res.end("ok");
};

// An ActivityPub id/object is an absolute http(s) IRI, and only that is worth
// storing: anything else is either absent (which used to throw a 500 here) or
// would be persisted as a junk Firestore key. Returns the value unchanged once it
// is known to be a URL, or null.
const asHttpUrlString = (value: unknown): string | null => {
  const candidate = value instanceof URL ? value.toString() : value;
  if (typeof candidate !== 'string') return null;
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
  } catch {
    return null;
  }
  return candidate;
};

const getActorId = (actor: AP.EntityReference): string => {
  if (typeof actor == "string") {
    return actor;
  }
  else if (actor instanceof URL) {
    return actor.toString()
  }
  else {
    return (actor.id || "").toString();
  }
}

async function removeFollow(message: AP.Follow) {
  // If from Mastodon - someone unfollowed me, we need to delete it from the store.
  const actorId = getActorId(<EntityReference>message.actor);
  const docId = actorId.replace(/\//g, "_");

  // The document key is the actor URL with its slashes swapped out, so it cannot
  // be reparsed as a URL; log the id through logSafePeerId() instead.
  console.log("Deleting follower record for", logSafePeerId(actorId));

  const res = await db.collection('followers').doc(docId).delete();

  console.log("Deleted", res);
}

async function removeLike(message: AP.Like) {
  // If from Mastodon - someone un-liked the post. We need to delete it from the store.
  /*
   {
     '@context': 'https://www.w3.org/ns/activitystreams',
     id: 'https://status.kinlan.me/users/paul#likes/854/undo',
     type: 'Undo',
     actor: 'https://status.kinlan.me/users/paul',
     object: {
       id: 'https://status.kinlan.me/users/paul#likes/854',
       type: 'Like',
       actor: 'https://status.kinlan.me/users/paul',
       object: 'https://paul.kinlan.me/thoughts-on-web-follow/'
     }
   }
  */
  const inner = message.object as { object?: unknown; id?: unknown } | undefined;
  const postURL = asHttpUrlString(inner?.object);
  // `id` here is the inner Like's own id, which is the key saveLike() stored it
  // under. It is NOT an actor id, whatever the field happens to be called on the
  // way through - see removeOwnedInteraction().
  const likeId = asHttpUrlString(inner?.id);

  // Same guard as the save paths: `?.object.toString()` threw on an Undo whose
  // Like carries no object (or a non-URL one), which answered 500 to an
  // authenticated peer. An Undo we cannot read is ignored instead.
  if (postURL === null || likeId === null) {
    console.log("Ignored an Undo whose Like has no absolute http(s) id/object");
    return;
  }

  await removeOwnedInteraction('likes', 'Like', message.actor, postURL, likeId);
}

async function removeAnnounce(message: AP.Announce) {
  // If from Mastodon - someone un-boosted the post. We need to delete it from the store.
  const object = message.object as { object?: unknown; id?: unknown } | undefined;
  const postURL = asHttpUrlString(object?.object);
  const announceId = asHttpUrlString(object?.id);

  // As removeLike: a malformed signed Undo must be ignored, not a 500.
  if (postURL === null || announceId === null) {
    console.log("Ignored an Undo whose Announce has no absolute http(s) id/object");
    return;
  }

  await removeOwnedInteraction('announces', 'Announce', message.actor, postURL, announceId);
}

// The id an entity reference points at, if it is an absolute http(s) URL. Unlike
// getActorId() this never throws on a peer-supplied shape: the stored record and
// the activity body are both untrusted input.
const actorIdFrom = (value: unknown): string | null => {
  if (typeof value === 'string' || value instanceof URL) return asHttpUrlString(value);
  if (value === null || typeof value !== 'object') return null;
  return asHttpUrlString((value as { id?: unknown }).id);
};

// Two actor ids name the same account when they differ only in what does not
// identify the resource: a trailing slash on the path, or the fragment a peer
// appends to pick a key out of the document. Real peers do send both spellings
// (an actor stored by one activity, named with a trailing slash by the next), and
// refusing those would leave the interaction row behind for good.
//
// This cannot be used to reach another account's rows: the host is part of the
// comparison, and verifyInboxActivity() has already required the activity actor
// and the signing key to share a host, so the only ids that can collide are two
// spellings on the peer's own instance.
const canonicalActorId = (value: string): string | null => {
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    // A credential in the authority is not an actor id; never let it compare equal
    // to one that has none.
    if (url.username || url.password) return null;
    return `${url.protocol}//${url.host}${url.pathname.replace(/\/+$/, '')}${url.search}`;
  } catch {
    return null;
  }
};

// Delete one stored interaction (a Like or an Announce) on behalf of its owner.
//
// saveLike()/saveAnnounce() key each interaction by the inner activity's own id,
// which the remote peer chooses, so the key says nothing about who wrote the row.
// A signed Undo therefore used to be able to delete any peer's Like or Announce:
// the signature proves who sent the Undo, never who owns the row, and both the
// post URL and another actor's activity id are public (paul-kinlan-me-hnk). The
// verified actor - message.actor, replaced with the fetched actor before dispatch
// - is the one identity the body cannot forge, so the stored record has to name
// it before anything is deleted.
//
// A row that is absent or owned by someone else is ignored with the usual 200:
// a mismatched Undo is not an error, and the response must not let a peer probe
// the store for other actors' interaction ids.
async function removeOwnedInteraction(
  collectionName: 'likes' | 'announces',
  label: 'Like' | 'Announce',
  actor: AP.EntityReference,
  postURL: string,
  activityId: string,
) {
  const verifiedActorId = actorIdFrom(actor);
  const verifiedActorKey = verifiedActorId === null ? null : canonicalActorId(verifiedActorId);
  if (verifiedActorId === null || verifiedActorKey === null) {
    console.log(`Ignored an Undo of a ${label} whose actor has no absolute http(s) id`);
    return;
  }

  const messageDocRef = db.collection(collectionName)
    .doc(postURL.replace(/\//g, "_"))
    .collection('messages')
    .doc(activityId.replace(/\//g, "_"));

  const stored = await messageDocRef.get();
  const storedRecord = stored && stored.exists && typeof stored.data === 'function' ? stored.data() : null;
  const storedActorId = storedRecord === null ? null : actorIdFrom(storedRecord.actor);
  const storedActorKey = storedActorId === null ? null : canonicalActorId(storedActorId);

  if (storedActorKey === null || storedActorKey !== verifiedActorKey) {
    console.log(
      `Ignored an Undo from ${logSafePeerId(verifiedActorId)} for ${label} ${logSafePeerId(activityId)} on ${logSafePeerId(postURL)}: not stored by that actor`
    );
    return;
  }

  const res = await messageDocRef.delete();

  console.log(`Deleted ${label} ${logSafePeerId(activityId)} on ${logSafePeerId(postURL)}`, res);
}

// Save the Actor objects so that we have a cache of them.
// Note: We will be embeddeding the actor information in the messages for saving directly so we can do less reads.
async function saveActor(message: AP.Actor) {
  if (message.id == null) return;
  const collection = db.collection('actors');
  const actorId = message.id.toString().replace(/\//g, "_");

  const actorDocRef = collection.doc(actorId);

  // Create the follow;
  await actorDocRef.set(message); // Always update the actor.
}

async function saveFollow(message: AP.Follow, actorInformation: AP.Actor) {
  if (message.id == null) return;

  // The inbox belongs to the follower, so it is untrusted input: validate it
  // (https, public host - structurally AND by DNS) before the follow is stored.
  // Otherwise the hourly fan-out would POST signed activities to whatever
  // address the follower registered, and a private-resolving inbox would sit in
  // the registry as an undeliverable follower. See
  // lib/activitypub/utils/guardedFetch.js.
  const inboxDecision = await validateFollowerInbox(<string | URL>actorInformation.inbox);
  if (inboxDecision.ok == false) {
    // The reason is safe to log; the inbox itself is not (it may name an
    // internal host).
    console.log(`Follower inbox rejected at acceptance (${inboxDecision.reason}), not storing the follow`);
    return;
  }
  const actorInbox = inboxDecision.url;

  const collection = db.collection('followers');

  const actorID = getActorId(<EntityReference>message.actor).toString();
  const followDocRef = collection.doc(actorID.replace(/\//g, "_"));
  const followDoc = await followDocRef.get();

  if (followDoc.exists) {
    console.log("Already Following");
    return;
  }

  // Create the follow;
  await followDocRef.set(message);

  const guid = uuid();
  const domain = 'paul.kinlan.me';

  const acceptRequest: AP.Accept = <AP.Accept><unknown>{
    "@context": "https://www.w3.org/ns/activitystreams",
    'id': `https://${domain}/${guid}`,
    'type': 'Accept',
    'actor': "https://paul.kinlan.me/paul",
    'object': (message.actor as CoreObject).id
  };

  const response = await sendSignedRequestSafely(actorInbox, acceptRequest);

  // The result is a per-peer fact, so name the peer: without it the line says a
  // delivery failed without saying to whom, and the response body alone cannot
  // tell you which follower to look at.
  console.log("Following result for", logSafePeerId(actorInbox), response.status, response.statusText, logSafeText(await response.text()));
}

async function saveLike(message: AP.Like) {
  // If from Mastodon - someone liked the post.
  const collection = db.collection('likes');

  // We should do some checks 
  // 1. TODO: in reply to is against a post that I made.

  const actorId = (message.actor as { id?: unknown })?.id ?? message.actor;
  console.log("Save Like from", logSafePeerId(actorId));

  /* 
    We store likes as a collection of collections.
    Root key is the url of my messages
      Each object has a sub-collection of the specific message made by someone.
  */
  // A signature proves the sender controls the key and that the body arrived
  // unmodified; it says nothing about the shape of the activity. An absent or
  // non-URL id/object used to throw here, which answered 500 to an authenticated
  // peer, so ignore the like instead - the same way an unparsable Create or Undo
  // is already ignored. A 4xx would invite the peer to retry a body it will never
  // get right.
  const id = asHttpUrlString(message.id);
  const objectId = asHttpUrlString(message.object);
  if (id === null || objectId === null) {
    console.log("Ignored a Like whose id or object is not an absolute http(s) URL");
    return;
  }
  const rootDocRef = collection.doc(objectId.replace(/\//g, "_"));
  const rootDoc = await rootDocRef.get();

  if (rootDoc.exists == false) {
    console.log("Root doesn't exists, make it so.");
    await rootDocRef.set({});
  }

  const messagesCollection = rootDocRef.collection('messages');
  const messageDocRef = messagesCollection.doc(id.replace(/\//g, "_"));
  const messageDoc = await messageDocRef.get();

  if (messageDoc.exists == false) {
    console.log(`Adding message ${logSafePeerId(id)} to ${logSafePeerId(objectId)}`);
    await messageDocRef.set(message);
  }
}

async function saveAnnounce(message: AP.Announce) {
  // If from Mastodon - someone boosted the post.
  const collection = db.collection('announces');

  // We should do some checks 
  // 1. TODO: in reply to is against a post that I made.

  const actorId = (message.actor as { id?: unknown })?.id ?? message.actor;
  console.log("Save Announce from", logSafePeerId(actorId));

  /* 
    We store announces as a collection of collections.
    Root key is the url of my messages
      Each object has a sub-collection of the specific message made by someone.
  */
  // Same guard as saveLike: a malformed but signed Announce must not be a 500.
  const id = asHttpUrlString(message.id);
  const objectId = asHttpUrlString(message.object);
  if (id === null || objectId === null) {
    console.log("Ignored an Announce whose id or object is not an absolute http(s) URL");
    return;
  }
  const rootDocRef = collection.doc(objectId.replace(/\//g, "_"));
  const rootDoc = await rootDocRef.get();

  if (rootDoc.exists == false) {
    await rootDocRef.set({});
  }

  const messagesCollection = rootDocRef.collection('messages');
  const messageDocRef = messagesCollection.doc(id.replace(/\//g, "_"));
  const messageDoc = await messageDocRef.get();

  if (messageDoc.exists == false) {
    console.log(`Adding message ${logSafePeerId(id)} to ${logSafePeerId(objectId)}`);
    await messageDocRef.set(message);
  }
}

async function saveReply(message: AP.Create) {
  // If from Mastodon - someone boosted the post.
  const collection = db.collection('replies');

  if (message.object == undefined) return;

  // We should do some checks 
  // 1. TODO: in reply to is against a post that I made.

  const actorId = (message.actor as { id?: unknown })?.id ?? message.actor;
  console.log("Save Reply from", logSafePeerId(actorId));

  /* 
    We store announces as a collection of collections.
    Root key is the url of my messages
      Each object has a sub-collection of the specific message made by someone.
  */
  const objectId = asHttpUrlString((<CoreObject>message.object).inReplyTo);
  if (objectId === null) {
    console.log("Ignored a Create whose object has no inReplyTo that is an absolute http(s) URL");
    return;
  }

  // Both URLs are checked before anything is read or written: the reply root used
  // to be created before `id` was validated, so a Create with a usable inReplyTo
  // and an unusable id left `replies/<post>` behind while logging that it was
  // ignored (review finding paul-kinlan-me-3f0).
  const id = asHttpUrlString(message.id);
  if (id === null) {
    console.log("Ignored a Create whose id is not an absolute http(s) URL");
    return;
  }

  const rootDocRef = collection.doc(objectId.replace(/\//g, "_"));
  const rootDoc = await rootDocRef.get();

  if (rootDoc.exists == false) {
    await rootDocRef.set({});
  }

  const messagesCollection = rootDocRef.collection('messages');

  const messageDocRef = messagesCollection.doc(id.replace(/\//g, "_"));
  const messageDoc = await messageDocRef.get();

  if (messageDoc.exists == false) {
    console.log(`Adding message ${logSafePeerId(id)} to ${logSafePeerId(objectId)}`);
    await messageDocRef.set(message);
  }
}