import { VercelRequest, VercelResponse } from "@vercel/node";
import * as admin from 'firebase-admin';

const escapeHTML = (str: string): string => str.replace(/[<>'"]/g,
  tag => ({
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag]));

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

  const likesSnapshot = await likes.get();
  const announcesSnapshot = await announces.get();

  const likesCount = likesSnapshot.size;
  const announcesCount = announcesSnapshot.size;

  res.end(`<doctype html>
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

      a img.profile {
        width: 32px;
        height: 32px;
        border-radius: 50% 50%;
      }
      </style>
    </head>
    <body>  
      <h1>Iteractions from around the fediverse</h1>
      <p>URL: ${escapeHTML(url)}</p>
      <h2>Likes</h2>
      <p>Count: ${likesCount}</p>
      <ul>
        ${likesSnapshot.docs.map(doc => {
    const { actor } = doc.data();
    if (typeof actor == "string") {
      return `<li><a href="${escapeHTML(actor)}" rel="nofollow">${escapeHTML(actor)}</a></li>`;
    }

    return `<li><a href="${escapeHTML(actor.url)}" rel="nofollow"><img class="profile" src="${escapeHTML(actor.icon.url)}" alt="${escapeHTML(actor.name)}"></a></li>`
  }
  ).join("")}
      </ul>
      <h2>Announces</h2>
      <p>Count: ${announcesCount}</p>
      <ul>
        ${announcesSnapshot.docs.map(doc => {
    const { actor } = doc.data();
    if (typeof actor == "string") {
      return `<li><a href="${escapeHTML(actor)}" rel="nofollow">${escapeHTML(actor)}</a></li>`;
    }

    return `<li><a href="${escapeHTML(actor.url)}" rel="nofollow"><img class="profile" src="${escapeHTML(actor.icon.url)}" alt="${escapeHTML(actor.name)}"></a></li>`
  }
  ).join("")}
      </ul>
    </body>
  </html>`);
}