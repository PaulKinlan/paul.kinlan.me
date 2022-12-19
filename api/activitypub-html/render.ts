import { VercelRequest, VercelResponse } from "@vercel/node";
import * as admin from 'firebase-admin';

const escapeHTML = (str: string): string => str.replace(/[<>'"]/g,
  tag => ({
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag]));

const stripHTML = (str: string): string => str.replace(/<[^>]+>/g, '');

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

export default async function (req: VercelRequest, res: VercelResponse) {
  const { body, query, method, headers } = req;

  if (method != "GET") res.status(404).end("Not found");

  res.statusCode = 200;
  res.setHeader("Content-Type", `text/html`);

  const url: string = (query.url instanceof Array) ? query.url[0] : query.url;
  const idAsUrl = url.replace(/\//g, "_");

  if (url == null) {
    res.status(404).end("Not found");
    return;
  }

  const likes = await db.collection("likes").doc(idAsUrl).collection("messages");
  const announces = await db.collection("announces").doc(idAsUrl).collection("messages");
  const replies = await db.collection("replies").doc(idAsUrl).collection("messages");

  const likesSnapshot = await likes.get();
  const announcesSnapshot = await announces.get();
  const repliesSnapshot = await replies.get();

  const likesCount = likesSnapshot.size;
  const announcesCount = announcesSnapshot.size;
  const repliesCount = repliesSnapshot.size;

  res.end(`<!doctype html>
  <html>
    <head>
      <title>Interactions from around the fediverse with ${escapeHTML(url)}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">

      <style>
      @media (prefers-color-scheme: dark) {
        html {
          color: #fefefe;
          background-color: #212529;
        }
      
        a {
          color: #1bcba2
        }
      
        a:visited {
          color: #7ad857
        }
      }

      body {
        font-family: Helvetica,Arial,sans-serif;
        font-size: 1.1em;
      }

      section {
        clear: both;
      }

      a img.profile {
        width: 32px;
        height: 32px;
        border-radius: 50% 50%;
      }

      ul li {
        list-style: none;
        float: left;
      }
      </style>
    </head>
    <body>  
      <h1>Interactions from around the fediverse</h1>
      <section class="likes">
      <h3>Likes (${likesCount})</h3>
      ${likesSnapshot.docs.map(doc => {
    const { actor } = doc.data();
    if (typeof actor == "string") {
      return `<a href="${escapeHTML(actor)}" rel="nofollow">${escapeHTML(actor)}</a>`;
    }

    return `<a title="${escapeHTML(actor.name)}" href="${escapeHTML(actor.url)}" rel="nofollow"><img class="profile" src="${escapeHTML(actor.icon.url)}" alt="The profile picture of ${escapeHTML(actor.name)}"></a>`
  }
  ).join("")}
      </section>
      <section class="announces">
      <h3>Announces (${announcesCount})</h3>
      ${announcesSnapshot.docs.map(doc => {
    const { actor } = doc.data();
    if (typeof actor == "string") {
      return `<a href="${escapeHTML(actor)}" rel="nofollow">${escapeHTML(actor)}</a>`;
    }

    return `<a title="${escapeHTML(actor.name)}" href="${escapeHTML(actor.url)}" rel="nofollow"><img class="profile" src="${escapeHTML(actor.icon.url)}" alt="The profile picture of ${escapeHTML(actor.name)}"></a>`
  }
  ).join("")}
      </section>
      <section class="replies">
      <h3>Replies (${repliesCount})</h3>
      ${repliesSnapshot.docs.map(doc => {
    const { actor, object } = doc.data();
    if (typeof actor == "string") {
      return `<div><a href="${escapeHTML(actor)}" rel="nofollow">${escapeHTML(actor)}</a> wrote: <blockquote>${escapeHTML(stripHTML(object.content))}</blockquote></div>`;
    }

    return `<div>
      <a title="${escapeHTML(actor.name)}" href="${escapeHTML(actor.url)}" rel="nofollow"><img class="profile" src="${escapeHTML(actor.icon.url)}" alt="The profile picture of ${escapeHTML(actor.name)}"></a>
      <p>${escapeHTML(actor.name)} wrote:</p>
        <blockquote>${escapeHTML(stripHTML(object.content))}</blockquote>
      </div>`
  }
  ).join("")}
      </section>
    </body>
  </html>`);
}