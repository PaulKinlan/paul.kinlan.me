import { VercelRequest, VercelResponse } from "@vercel/node";
import admin from 'firebase-admin';

// Everything rendered below comes from stored federation data - actor names,
// profile URLs and icons a remote server controls - so the same two rules as
// lib/escape.js (and api/mentions.js) apply:
//   1. escapeHtml every interpolated text value - all five HTML-significant
//      characters, replaced globally (the local copy this replaces missed &, so
//      an ampersand in a name or page URL went into the HTML unescaped);
//   2. safeUrl anything that becomes an href or src, dropping every scheme
//      except http(s), so a federated `javascript:` or `data:` URL renders
//      inert instead of becoming an executable anchor on this domain.
// Both helpers accept a missing value and render it as empty text: an actor
// record can be missing any field, and dereferencing one undefined field used
// to be a 500.
import { escapeHtml, safeUrl } from '../../lib/escape.js';
import { isTrustedActivityHost } from '../../lib/activitypub/utils/trustedHosts.js';

const stripHTML = (str: unknown): string => String(str ?? '').replace(/<[^>]+>/g, '');

// An absolute http(s) URL on a host this project serves, or null. `?url=`
// names a page of this site - that is the contract the inbox writes against
// (it only ever stores activities about pages on the trusted hosts) and the
// key below derives from it - so a relative value, another scheme
// (`javascript:`), a foreign host, a number or an object is not a page and
// must not be turned into a storage read. Being a string was the whole check
// before, so `?url=javascript:alert(1)` and `?url=not-a-url` answered 200 and
// read likes/announces/replies with that key. The host rule is also the
// read-amplification bound: without it every distinct foreign URL is a fresh
// cache key with a guaranteed miss and three uncached reads per request,
// forever (paul-kinlan-me-stn4). The trusted hosts are the same assembly the
// inbox uses (lib/activitypub/utils/trustedHosts.js), so preview deployments
// accept their own pages too (paul-kinlan-me-tvqu).
const httpUrlOrNull = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  let parsed: URL;
  try {
    parsed = new URL(value.trim());
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  if (!isTrustedActivityHost(parsed.hostname)) return null;
  // The raw (trimmed) value is what is returned, not `parsed.href`: the key
  // below was always derived from the request value, and normalising it here
  // would silently re-key every document whose URL is not already canonical.
  return value.trim();
};

if (!admin.apps?.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

const db = admin.firestore();

export default async function (req: VercelRequest, res: VercelResponse) {
  const { body, query, method, headers } = req;

  // A non-GET request must not fall through into Firestore reads and a second
  // res.end().
  if (method != "GET") {
    res.status(404).end("Not found");
    return;
  }

  // Answer a missing or non-string ?url= before it is used. It used to be
  // `.replace()`d two lines above the null check, so `?url=` absent (or an
  // array/object value) was a 500.
  const urlValue = (query.url instanceof Array) ? query.url[0] : query.url;
  if (typeof urlValue !== "string" || urlValue.trim() === "") {
    res.status(404).end("Not found");
    return;
  }
  // Present but unusable is a different answer from absent: the parameter was
  // supplied, and it cannot be one of this site's pages. Both are 4xx, and
  // neither reaches Firestore.
  const url = httpUrlOrNull(urlValue);
  if (url === null) {
    res.status(400).end("Bad request");
    return;
  }

  // The reads run BEFORE any status or header is committed: a storage failure
  // must leave nothing storable behind. The header used to be set before the
  // awaited reads, which let a Firestore error escape while the response
  // already advertised itself as a 200 publicly cacheable for five minutes
  // (paul-kinlan-me-x216; the same fail-closed contract as user-agents.ts and
  // mentions.js).
  const idAsUrl = url.replace(/\//g, "_");

  // The three collections are independent, so they are read concurrently:
  // one round-trip instead of three serial ones. Read count per cold render
  // is unchanged; the cache header and the site-host rule above are what
  // bound it.
  const [likesSnapshot, announcesSnapshot, repliesSnapshot] = await Promise.all([
    db.collection("likes").doc(idAsUrl).collection("messages").get(),
    db.collection("announces").doc(idAsUrl).collection("messages").get(),
    db.collection("replies").doc(idAsUrl).collection("messages").get()
  ]);

  // The reads succeeded, so the response is now fully determined and safely
  // cacheable at the edge.

  const likesCount = likesSnapshot.size;
  const announcesCount = announcesSnapshot.size;
  const repliesCount = repliesSnapshot.size;

  res.statusCode = 200;
  res.setHeader("Content-Type", `text/html`);
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");

  res.end(`<!doctype html>
  <html>
    <head>
      <title>Interactions from around the fediverse with ${escapeHtml(url)}</title>
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

      div.reply p a {
        margin-right: 1em;
        vertical-align: middle;
      }
      </style>
    </head>
    <body>  
      <h1>Interactions from around the fediverse</h1>
      <section class="likes">
      <h4>Likes (${likesCount})</h4>
      ${likesSnapshot.docs.map(doc => {
    const { actor } = doc.data();
    if (typeof actor == "string") {
      return `<a href="${safeUrl(actor)}" target="_parent" rel="nofollow">${escapeHtml(actor)}</a>`;
    }

    return `<a title="${escapeHtml(actor?.name)}" href="${safeUrl(actor?.url)}" target="_parent" rel="nofollow"><img class="profile" src="${safeUrl(actor?.icon?.url)}" alt="The profile picture of ${escapeHtml(actor?.name)}"></a>`
  }
  ).join("")}
      </section>
      <section class="announces">
      <h4>Announces (${announcesCount})</h4>
      ${announcesSnapshot.docs.map(doc => {
    const { actor } = doc.data();
    if (typeof actor == "string") {
      return `<a href="${safeUrl(actor)}" target="_parent" rel="nofollow">${escapeHtml(actor)}</a>`;
    }

    return `<a title="${escapeHtml(actor?.name)}" href="${safeUrl(actor?.url)}" target="_parent" rel="nofollow"><img class="profile" src="${safeUrl(actor?.icon?.url)}" alt="The profile picture of ${escapeHtml(actor?.name)}"></a>`
  }
  ).join("")}
      </section>
      <section class="replies">
      <h4>Replies (${repliesCount})</h4>
      ${repliesSnapshot.docs.map(doc => {
    const { actor, object } = doc.data();
    if (typeof actor == "string") {
      return `<div><a href="${safeUrl(actor)}" target="_parent" rel="nofollow">${escapeHtml(actor)}</a> wrote: <blockquote>${escapeHtml(stripHTML(object?.content))}</blockquote></div>`;
    }

    return `<div class="reply">
      <p><a title="${escapeHtml(actor?.name)}" href="${safeUrl(actor?.url)}" target="_parent" rel="nofollow"><img class="profile" src="${safeUrl(actor?.icon?.url)}" alt="The profile picture of ${escapeHtml(actor?.name)}"></a>${escapeHtml(actor?.name)} wrote: <blockquote>${escapeHtml(stripHTML(object?.content))}</blockquote></p>
       
      </div>`
  }
  ).join("")}
      </section>
    </body>
  </html>`);
}