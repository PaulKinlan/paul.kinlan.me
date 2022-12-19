import { VercelRequest, VercelResponse } from "@vercel/node";
import * as admin from 'firebase-admin';

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

  const url:string = (query.url instanceof Array) ? query.url[0] : query.url;
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
      <title>ActivityPub HTML</title>
    </head>
    <body>  
      <h1>ActivityPub HTML</h1>
      <p>URL: ${url}</p>
      <h2>Likes</h2>
      <p>Count: ${likesCount}</p>
      <ul>
        ${likesSnapshot.docs.map(doc => { 
          const { actor, id } = doc.data();
          return `<li><a href="${id}" rel="nofollow">${actor}</a></li>`}
        ).join("")}
        </ul>
      <h2>Announces</h2>
      <p>Count: ${announcesCount}</p>
      <ul>
        ${announcesSnapshot.docs.map(doc => { 
          const { actor, id } = doc.data();
          return `<li><a href="${id}" rel="nofollow">${actor}</a></li>`}
        ).join("")}
      </ul>
    </body>
  </html>`);
}