import { VercelRequest, VercelResponse } from "@vercel/node";
import { kv } from "@vercel/kv";
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
import { docIdForUrl, legacyDocIdForUrl, isStorableDocIdUrl } from '../../lib/activitypub/utils/docId.js';

const stripHTML = (str: unknown): string => String(str ?? '').replace(/<[^>]+>/g, '');

// An absolute http(s) URL on a host this project serves, or null. `?url=`
// names a page of this site - that is the contract the inbox writes against
// (it only ever stores activities about pages on the trusted hosts) and the
// key below derives from it - so a relative value, another scheme
// (`javascript:`), a foreign host, a number or an object is not a page and
// must not be turned into a storage read. Being a string was the whole check
// before, so `?url=javascript:alert(1)` and `?url=not-a-url` answered 200 and
// read likes/announces/replies with that key. The host rule NARROWS the
// namespace to pages that can exist; it is NOT the read-amplification bound -
// a distinct same-site URL (any path, query or fragment) is an equally fresh
// cache key with a guaranteed miss. The bound is the admission budget below
// (paul-kinlan-me-stn4). The trusted hosts are the same assembly the
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

// The read-amplification bound (paul-kinlan-me-stn4): the bead's named remedy,
// applied the way ADR paul-kinlan-me-7wx does for User-Agent keys - one atomic
// Redis EVAL per request that reaches this function, before any Firestore
// read. Two fixed-minute windows:
//
//   * aphtml:budget:<minute>  - a GLOBAL cold-render budget. Every request
//     that gets here is a CDN miss by definition (a 200 carries
//     s-maxage=300), so without this cap the miss rate - and therefore the
//     Firestore read rate, 3 per render - is whatever an anonymous caller
//     chooses: vary the path, a query param or the fragment and every request
//     is a fresh cache key. With it, reads are bounded at
//     3 * MAX_COLD_RENDERS_PER_MINUTE per minute no matter how the caller
//     varies the URL.
//   * aphtml:url:<id>:<minute> - a PER-URL budget, so one page hammered past
//     its own edge-cache entry (junk outer query params bust the CDN key but
//     not the ?url=) cannot spend the whole global budget on itself.
//
// The global key is incremented FIRST and the per-URL key is only minted
// inside the budget, so the KV key cardinality is bounded too: at most
// MAX_COLD_RENDERS_PER_MINUTE + 2 keys per minute, each expiring on its own
// TTL - the cu3 lesson (unbounded caller-keyed KV keys) applied to the fix
// itself. Over budget the answer is 429 with Cache-Control: no-store (a
// cached 429 would deny a real page its render once the minute rolls over);
// a KV failure fails CLOSED with 503 and no-store, the same contract as
// user-agents.ts (paul-kinlan-me-6xr): a storage error must never leave
// anything storable behind, and a KV outage must not silently restore the
// unbounded lever.
export const MAX_COLD_RENDERS_PER_MINUTE = 60;
export const MAX_COLD_RENDERS_PER_URL_PER_MINUTE = 12;
const ADMISSION_TTL_SECONDS = 120;

// KEYS[1] = aphtml:budget:<minute>, KEYS[2] = aphtml:url:<idAsUrl>:<minute>
// ARGV[1] = global max per minute, ARGV[2] = per-URL max per minute,
// ARGV[3] = TTL for both keys. Returns {1} admitted, {0} refused.
//
// Atomicity is the point: Redis runs the script whole, so the two counters
// cannot race each other. INCR preserves an existing TTL, and the EXPIRE on
// the first increment is what gives every key its bounded lifetime.
const ADMISSION_SCRIPT = `
local used = redis.call('INCR', KEYS[1])
if used == 1 then
  redis.call('EXPIRE', KEYS[1], tonumber(ARGV[3]))
end
if used > tonumber(ARGV[1]) then
  return {0}
end
local perUrl = redis.call('INCR', KEYS[2])
if perUrl == 1 then
  redis.call('EXPIRE', KEYS[2], tonumber(ARGV[3]))
end
if perUrl > tonumber(ARGV[2]) then
  return {0}
end
return {1}
`;

export function createRenderHandler(kvClient: { eval: (script: string, keys: string[], args: string[]) => Promise<unknown> } = kv) {
  return async function (req: VercelRequest, res: VercelResponse) {
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
  // neither reaches Firestore. A url whose document id would exceed Firestore's
  // limit is unusable for the same reason (paul-kinlan-me-g5bp).
  const url = httpUrlOrNull(urlValue);
  if (url === null || !isStorableDocIdUrl(url)) {
    res.status(400).end("Bad request");
    return;
  }

  // The reads run BEFORE any status or header is committed: a storage failure
  // must leave nothing storable behind. The header used to be set before the
  // awaited reads, which let a Firestore error escape while the response
  // already advertised itself as a 200 publicly cacheable for five minutes
  // (paul-kinlan-me-x216; the same fail-closed contract as user-agents.ts and
  // mentions.js).
  // The admission bucket key keeps the legacy (non-injective) encoding: two
  // URLs colliding into one per-minute bucket only tightens a rate limit, and
  // the key is not a storage id. The Firestore document id is the injective
  // encoding (paul-kinlan-me-je6t), with the legacy one dual-read below for
  // documents written before it landed.
  const idAsUrl = legacyDocIdForUrl(url);
  const docId = docIdForUrl(url);
  // Both encodings must be storable: the url guard above already refused a value
  // whose doc id would exceed Firestore's limit (paul-kinlan-me-g5bp), so this is
  // the type-honest tail of that check.
  if (idAsUrl === null || docId === null) {
    res.status(400).end("Bad request");
    return;
  }

  // Admission BEFORE the reads: a refused request costs one KV round-trip and
  // zero Firestore reads, and commits nothing cacheable.
  const minute = Math.floor(Date.now() / 60000);
  let admission: unknown;
  try {
    admission = await kvClient.eval(
      ADMISSION_SCRIPT,
      [`aphtml:budget:${minute}`, `aphtml:url:${idAsUrl}:${minute}`],
      [String(MAX_COLD_RENDERS_PER_MINUTE), String(MAX_COLD_RENDERS_PER_URL_PER_MINUTE), String(ADMISSION_TTL_SECONDS)]
    );
  } catch (error: any) {
    // Fail closed: a KV outage must not restore the unbounded read lever, and
    // the 503 must never be stored at the edge.
    console.log(error?.message || error);
    res.setHeader("Cache-Control", "no-store");
    res.status(503).end("Admission check unavailable");
    return;
  }
  const admitted = Array.isArray(admission) ? Number(admission[0]) : Number(admission);
  if (admitted !== 1) {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Retry-After", "60");
    res.status(429).end("Too many requests");
    return;
  }

  // The three collections are independent, so they are read concurrently -
  // one batch of round-trips instead of serial ones. Each collection is read
  // under BOTH document-id encodings (injective first, legacy for pre-je6t
  // documents) and the two snapshots are merged, so a cold render now costs
  // 6 reads; the admission budget above and the cache header below are what
  // bound it.
  const readMessages = (collection: string, id: string) =>
    db.collection(collection).doc(id).collection("messages").get();
  // Merging both encodings must not double-count a pre-je6t interaction that was
  // re-delivered after the fix and so exists under both ids (paul-kinlan-me-qal8):
  // dedupe by the stored activity id, preferring the injective copy.
  //
  // A row is also only evidence for THIS page when the post it names is this page
  // (paul-kinlan-me-cout): the legacy encoding is not injective, so two distinct
  // posts - /a/b and /a_b - share one legacy root document and therefore one
  // messages subcollection, and a cold render of either used to count and draw the
  // other's interactions. The field that names the post is not the same in every
  // collection, because the write paths store different things: saveLike and
  // saveAnnounce store the whole activity, so the post is `object` (a URL string,
  // or an object with an `id` for some peers); saveReply stores the Create, so the
  // post is `object.inReplyTo`. A row whose post cannot be read is kept: an
  // interaction we cannot attribute must not be silently dropped from a page that
  // legitimately earned it, and the pre-identity rows are exactly the population
  // this dual-read exists for.
  const canonicalPostUrl = (value: unknown): string | null => {
    const candidate = typeof value === 'string'
      ? value.trim()
      : (value && typeof value === 'object' && typeof (value as { id?: unknown }).id === 'string')
        ? String((value as { id: string }).id).trim()
        : '';
    if (candidate === '') return null;
    try {
      return new URL(candidate).toString();
    } catch {
      return null;
    }
  };
  const storedPostUrl = (collection: string, data: any): string | null => {
    const object = data?.object;
    if (collection === 'replies') {
      return canonicalPostUrl(object && typeof object === 'object' ? (object as { inReplyTo?: unknown }).inReplyTo : null);
    }
    return canonicalPostUrl(object);
  };
  const pagePostUrl = canonicalPostUrl(url);
  const belongsToPage = (collection: string, doc: any) => {
    const storedPost = storedPostUrl(collection, doc?.data?.());
    if (storedPost === null || pagePostUrl === null) return true;
    return storedPost === pagePostUrl;
  };
  const mergeSnapshots = (collection: string, primary: any, legacy: any) => {
    const docs = primary.docs.filter((doc: any) => belongsToPage(collection, doc));
    const seen = new Set<string>();
    for (const doc of docs) {
      const storedId = doc?.data?.()?.id;
      if (typeof storedId === 'string' && storedId !== '') seen.add(storedId);
    }
    for (const doc of legacy.docs) {
      if (!belongsToPage(collection, doc)) continue;
      const storedId = doc?.data?.()?.id;
      if (typeof storedId === 'string' && storedId !== '' && seen.has(storedId)) continue;
      docs.push(doc);
    }
    return { size: docs.length, docs };
  };
  const [likesSnapshot, announcesSnapshot, repliesSnapshot] = (await Promise.all([
    readMessages("likes", docId), readMessages("likes", idAsUrl),
    readMessages("announces", docId), readMessages("announces", idAsUrl),
    readMessages("replies", docId), readMessages("replies", idAsUrl)
  ]).then(([likes, legacyLikes, announces, legacyAnnounces, replies, legacyReplies]) => [
    mergeSnapshots('likes', likes, legacyLikes),
    mergeSnapshots('announces', announces, legacyAnnounces),
    mergeSnapshots('replies', replies, legacyReplies)
  ]));

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
  };
}

export default createRenderHandler(kv);