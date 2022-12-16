+++
date = 2022-12-16T14:16:15Z
slug = "adding-activity-pub-to-your-static-site"
summary = "This is a short post about I how I added ActivityPub to my Hugo static blog"
tags = ["hugo", "activitypub"]
title = "Adding ActivityPub to your static site"

+++
My blog is built on Hugo and hosted on Vercel. It mostly works well.

I wanted to have my blog automatically publish posts that I create in a way that I didn't need to spin up an instance of Mastodon.

I got a minimal version of it working. You can discover my page, follow my account, and it will post updates when my blog deploys a new page.

The biggest learning that I had was that ActivityPub is a Message protocol. You can't just output a feed of posts and be done (I tried) - so even if you are a statically generated site you need a Server component because you need to POST message replies to people who send a 'Follow' request to your account and POST to the people who follow your account to 'Create' a 'Note'.

To see it all in action, you can subscribe to my blog on any ActivityPub system by following this account: @paul@paul.kinlan.me < try it.

While I had fun, I will say that I found it **very** hard to get started - I found the spec hard to read; testing was almost impossible (there seem to be no easy test harnesses to determine if you are building a compatible client) so I had to test against a live instance; and there is little documentation of what messages should look like; and I hit snags in all places.

Hopefully this post will help you get started if you want to go down a similar path.

My implementation uses Hugo to create my posts and feed data, Vercel Serverless functions to handle in bound messages, and Firebase Firestore to store the data.

This post will assume that you know the terminology of ActivityPub, but I will try and link to the relevant part of the spec. I also made a lot of assumptions that I am a single user host.

### Discovery

[Mastodon uses Web Finger](https://docs.joinmastodon.org/spec/webfinger/) to discover where to look for your servers Actor configuration. WebFinger files are served from a `./well-known/webfinger` file. I created serverless function which returns the required WebFinger configuration. [Code](https://github.com/PaulKinlan/paul.kinlan.me/blob/main/api/well-known/webfinger.ts)

    import type { VercelRequest, VercelResponse } from '@vercel/node';
    
    export default function (req: VercelRequest, res: VercelResponse) {
      res.statusCode = 200;
      res.setHeader("Content-Type", `application/jrd+json`);
      res.end(`{  
        "subject": "acct:paul@paul.kinlan.me",
        "aliases": [
          "https://status.kinlan.me/@paul"
        ],
        "links": [
          {
            "rel": "self",
            "type": "application/activity+json",
            "href": "https://paul.kinlan.me/paul"
          }
        ]
      }`);
    }

The JSON above describes a number of aliases for my ActivityPub account '@paul@paul.kinlan.me' and it points to where I host my ActivityPub Actor information.

**Note**: You need to make sure you are sending the correct MIME types.

Why do I have a serverless function for static content? Vercel... That's why. I couldn't set the `Content-Type` configuration properly for any static file in the `.well-known` folder. In the future if I add multiple accounts I will need to parse the query string to be able to target the `links` and `subject` fields correctly/

Next you need to create an [Actor](https://www.w3.org/TR/activitypub/#actor-objects). The Actor is a configuration file that tells ActivityPub servers where to find many core functions such as the 'inbox' (which will receive messages from other clients), 'outbox' that contains all the messages that a user has created (like an RSS feed), 'publicKey' for verifying messages, how my face should appear etc.

To serve the actor file, I just send a JSON response from my [`api`](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/api)`/`[`activitypub`](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/api/activitypub)`/`**`actor.ts`**. You can see the [code](https://github.com/PaulKinlan/paul.kinlan.me/blob/main/api/activitypub/actor.ts) and the [output](https://paul.kinlan.me/paul).

    import type { VercelRequest, VercelResponse } from '@vercel/node';
    
    export default function (req: VercelRequest, res: VercelResponse) {
      res.statusCode = 200;
      res.setHeader("Content-Type", `application/activity+json`);
      res.json({
        "@context": ["https://www.w3.org/ns/activitystreams", { "@language": "en- GB" }],
        "type": "Person",
        "id": "https://paul.kinlan.me/paul",
        "outbox": "https://paul.kinlan.me/outbox",
        "following": "https://paul.kinlan.me/following",
        "followers": "https://paul.kinlan.me/followers",
        "inbox": "https://paul.kinlan.me/inbox",
        "preferredUsername": "paul",
        "name": "Paul Kinlan - Modern Web Development with Chrome",
        "summary": "Paul is a Developer Advocate for Chrome and the Open Web at Google and loves to help make web development easier.",
        "icon": [
          "https://paul.kinlan.me/images/me.png"
        ],
        "publicKey": {
          "@context": "https://w3id.org/security/v1",
          "@type": "Key",
          "id": "https://paul.kinlan.me/paul#main-key",
          "owner": "https://paul.kinlan.me/paul",
          "publicKeyPem": process.env.ACTIVITYPUB_PUBLIC_KEY
        }
      });
    }

I used a serverless function because for similar reasons to webfinger (setting the correct Content-type) _and_ I wanted to embed a publicKey that I previously generated and store in Vercel's environment variables configuration.

Now that Mastodon can find me and ActivityPub services know where my inboxes are all I needed to do now was to handle what happens when people follow and unfollow me, and what happens when I create a new post.

### Following

I found this one particularly hard - it was almost impossible to find an example of what a Follow message looks like, so I ended up spending a lot of time following my account from a Mastodon client and seeing what data was `HTTP` `POST`ed; **and** I also need to maintain the state of who followed me (so I can send them messages later). I chose Firebase Firestore to store all follow requests because it's pretty simple, has a good client and can store JSON directly.

ActivityPub clients will send all messages to an `Actor`'s inbox. My inbox can only handle `Follow` and `Undo` a `Follow` requests. Once a request is sent to me, I store the data in FireStore and send a response back.

The entire flow is very complex so I will try and explain it as best I can.

[api](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/api)/[activitypub](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/api/activitypub)/**inbox.ts**

    import type { VercelRequest, VercelResponse } from '@vercel/node';
    import { AP } from 'activitypub-core-types';
    import type { Readable } from 'node:stream';
    import * as admin from 'firebase-admin';
    import { v4 as uuid } from 'uuid';
    import { CoreObject, Entity } from 'activitypub-core-types/lib/activitypub/index';
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
        const res = await db.collection('followers').doc(docId).delete();
    
        console.log("Deleted", res)
      }
    
      res.end();
    };

1. Parse the `POST` body and cast it to an Activity object.
2. Parse the signature of the request to verify the message hasn't been tampered with in transit.
3. From the signature HTTP header get the `Actor` that wants to follow you and [fetch their Public Key ](https://github.com/PaulKinlan/paul.kinlan.me/blob/main/lib/activitypub/utils/fetchActorInformation.ts)(from their Actor file).
4. Verify the message with their Public Key

Now we believe that we have a valid messages.

If the message is a `Follow` request

1. See if the Actor trying to follow is already in the db, if they are return;
2. Add the `Actor` to the `followers` collection in FireStore
3. [Prepare](https://github.com/PaulKinlan/paul.kinlan.me/blob/main/api/activitypub/inbox.ts#L100) an `Accept` message to the `Actor` indicating that the Follow has been accepted and [send it](https://github.com/PaulKinlan/paul.kinlan.me/blob/main/lib/activitypub/utils/sendSignedRequest.ts).

If the message is an `Undo` for a `Follow` request.

1. Find the data in the `followers` collection in FireStore
2. Delete it.

**Note**: I found it hard to find much information about sending requests to servers - so after a lot of reading and experimenting I created this [routine](https://github.com/PaulKinlan/paul.kinlan.me/blob/main/lib/activitypub/utils/sendSignedRequest.ts). It will successfully sign the HTTP request with your configured private key and attach a digest.

### Posting

Like many static sites there is no CMS that knows when new content is posted (it is static after all) so I needed to create a routine that would send my posts to all the people that follow the account.

Firstly I generate the `outbox` so that people can read all my public posts. I use a hugo template ([layouts/index.activity_outbox.ajson](https://github.com/PaulKinlan/paul.kinlan.me/blob/main/config.toml)) that reads through all my posts and creates a `Create` object with an embedded `Note` - this is what Mastodon needs to show a Toot.

    {{- $pctx := . -}}
    {{- if .IsHome -}}{{ $pctx = .Site }}{{- end -}}
    {{- $pages := slice -}}
    {{- if or $.IsHome $.IsSection -}}
    {{- $pages = $pctx.RegularPages -}}
    {{- else -}}
    {{- $pages = $pctx.Pages -}}
    {{- end -}}
    {{- $limit := .Site.Config.Services.RSS.Limit -}}
    {{- if ge $limit 1 -}}
    {{- $pages = $pages | first $limit -}}
    {{- end -}}
    {
      "@context": "https://www.w3.org/ns/activitystreams",
      "id": "{{ $.Site.BaseURL }}outbox",
      "summary": "{{$.Site.Author.name}} - {{$.Site.Title}}",
      "type": "OrderedCollection",
      {{ $notdrafts := where $pages ".Draft" "!=" true }}
      {{ $all :=  where $notdrafts "Type" "in" (slice "journal" "post" "page")}}
      "totalItems": {{(len $all)}},
      "orderedItems": [
      {{ range $index, $element := $all  }}
        {{- if ne $index 0 }}, {{ end }}
        {
          "@context": "https://www.w3.org/ns/activitystreams",
          "id": "{{.Permalink}}-create",
          "type": "Create",
          "actor": "https://paul.kinlan.me/paul",
          "object": {
            "id": "{{ .Permalink }}",
            "type": "Note",
            "content": "{{.Title}}<br>{{.Summary}}",
            "url": "{{.Permalink}}",
            "attributedTo": "https://paul.kinlan.me/paul",
            "to": "https://www.w3.org/ns/activitystreams#Public",
            "published": {{ dateFormat "2006-01-02T15:04:05-07:00" .Date | jsonify }}
          }
        }
      {{end}}
      ]
    }

I also set up Hugo to generate this file for the "home" output type as follows

    [mediaTypes]
    [mediaTypes."application/activity+json"]
    suffixes = ["ajson"]
    
    [outputFormats]
    [outputFormats.ACTIVITY_OUTBOX]
    mediaType = "application/activity+json"
    notAlternative = true
    baseName = "outbox"
    
    [outputs]
    home = ["HTML", "RSS", "ACTIVITY_OUTBOX"]

I then serve the file:[ /api/activitypub/outbox.ts](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/api/activitypub)

    import type { VercelRequest, VercelResponse } from '@vercel/node';
    import { join } from 'path';
    import { cwd } from 'process';
    import { readFileSync } from 'fs';
    
    /*
      This returns a list of posts for the single user 'Paul'.
      It's a GET request. This doesn't post it to anyone's timeline.
    */
    export default function (req: VercelRequest, res: VercelResponse) {
      // All of the outbox data is generated at build time, so just return that static file.
      const file = join(cwd(), 'public', 'outbox.ajson');
      const stringified = readFileSync(file, 'utf8');
    
      res.statusCode = 200;
      res.setHeader("Content-Type", `application/activity+json`);
    
      return res.end(stringified);
    };

Finally, when my Vercel build completes, I scan the generated [outbox](https://paul.kinlan.me/outbox) using my [post-deploy Webhook for vercel](https://paul.kinlan.me/post-deploy-webhook-for-vercel/) and calling [api/activitypub/sendNote.ts](https://github.com/PaulKinlan/paul.kinlan.me/blob/main/api/activitypub/sendNote.ts) endpoint to post to all the followers.

    mport type { VercelRequest, VercelResponse } from '@vercel/node';
    import { AP } from 'activitypub-core-types';
    import * as admin from 'firebase-admin';
    import { OrderedCollection } from 'activitypub-core-types/lib/activitypub/index';
    import { sendSignedRequest } from '../../lib/activitypub/utils/sendSignedRequest';
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
        bodyParser: false
      }
    };
    
    /*
      Sends the latest not that hasn't yet been sent.
    */
    export default async function (req: VercelRequest, res: VercelResponse) {
      const { body, query, method, url, headers } = req;
      const { token } = query;
    
      if (method != "POST") {
        res.status(401).end("Invalid Method, must be POST");
        return;
      }
    
      if (token != process.env.ACTIVITYPUB_CREATE_TOKEN) {
        res.status(401).end("Invalid token");
        return;
      }
    
      const configCollection = db.collection('config');
      const configRef = configCollection.doc("config");
      const config = await configRef.get();
    
      if (config.exists == false) {
        // Config doesn't exist, make something
        configRef.set({
          "lastId": 0
        });
      }
    
      const configData = config.data();
      let lastId = 0;
      if (configData != undefined) {
        lastId = configData.lastId;
      }
    
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
            // We have to break somewhere... do it after the first.
            const item = (<AP.EntityReference[]>outbox.orderedItems)[iteIdx];
    
            if (item.object != undefined) {
              // We might not need this.
              item.object.published = (new Date()).toISOString();
            }
    
            console.log(`Sending to ${actorInbox}`, item);
            
            // Item will be an entity, i.e, { Create { Note } }
            const response = await sendSignedRequest(actorInbox, <AP.Activity> item);
            console.log("Send result: ", actorInbox, response.status, response.statusText, await response.text());
    
            break;
          }
        } catch (ex) {
          console.log("Error", ex, follower);
        }
      }
    
      res.status(200).end("ok");
    };

The above code is relative long but the summary of it is as follows:

1. Scan the outbox
2. Pick the first post (I am only sending one note)
3. For each follower in the `followers` table
   1. Get their actor information (where their inbox is)
   2. Send the `Create` object from the outbox to them via a signed HTTP request

### Voila

Simple... Nah. I think it's pretty complex, but it works.

If you have created something similar, send me a comment. I'd love to improve what I have and share that with more people.