import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';


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

// /followers is a public rewrite (vercel.json:49) onto this handler, and
// middleware.ts deliberately excludes /api, so nothing upstream of it is
// rate-limited or cached. It used to read the WHOLE followers collection on
// every request (`select("actor").get()`) and publish every actor in one
// OrderedCollectionPage with no Cache-Control: read cost and response size
// grew linearly with follower count, unauthenticated and uncached
// (paul-kinlan-me-40ak, nightly factory row tm-unbounded-follower-collection-read).
//
// So the read is now paged, the page count is bounded, and the response is
// edge-cacheable. OrderedCollectionPage is the paging shape
// application/activity+json already expects, and `next` is emitted while
// another page exists AND the walk is still inside the bound (page < MAX_PAGE),
// so the paged walk always terminates on a page this handler will serve.
export const PAGE_SIZE = 20;
// 100 pages is 2,000 followers. Past that the request is a bad request rather
// than a free unbounded scan of the collection.
export const MAX_PAGE = 100;

const CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=600";

// Accepts only a positive base-10 integer page number: a repeated ?page= is not
// a page, "01" is not page 1, and anything above MAX_PAGE is rejected instead
// of clamped so a caller cannot walk the collection a page at a time.
export function parsePage(raw: unknown): number | null {
  if (raw === undefined || raw === null || raw === "") return 1;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== "string" || !/^[1-9][0-9]*$/.test(value)) return null;
  const page = Number(value);
  return page > MAX_PAGE ? null : page;
}

export default async function (req: VercelRequest, res: VercelResponse) {
  const page = parsePage(req.query?.page);
  if (page === null) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.json({ error: `Invalid page. Expected an integer from 1 to ${MAX_PAGE}.` });
    return;
  }

  const offset = (page - 1) * PAGE_SIZE;
  const collection = db.collection('followers');

  let orderedItems: unknown[];
  let totalItems: number;
  try {
    // Both reads are bounded: one page of documents, plus a count aggregation
    // (which reads no documents). The count is what keeps totalItems honest
    // without loading the collection.
    const [actors, total] = await Promise.all([
      collection.select("actor").offset(offset).limit(PAGE_SIZE).get(),
      collection.count().get()
    ]);
    totalItems = total.data().count;
    orderedItems = actors.docs.map(item => item.get("actor"));
  } catch (error) {
    // Nothing is committed before the reads succeed, so a storage failure can
    // never advertise a cacheable 200 - the same fail-closed ordering as
    // api/activitypub-html/render.ts (paul-kinlan-me-x216).
    console.error('Followers read failed:', error);
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.json({ error: "Follower list unavailable." });
    return;
  }

  const output: Record<string, unknown> = {
    "@context": "https://www.w3.org/ns/activitystreams",
    "id": `https://status.kinlan.me/users/paul/following?page=${page}`,
    "type": "OrderedCollectionPage",
    "totalItems": totalItems,
    "orderedItems": orderedItems
  };
  // `next` only while the walk is inside the bound: at MAX_PAGE a 21st page
  // would be a link this handler itself answers with 400, so the paged walk
  // ends cleanly instead of handing a crawler a dead end
  // (paul-kinlan-me-q9bx, review finding on this change).
  if (page < MAX_PAGE && offset + orderedItems.length < totalItems) {
    output.next = `https://status.kinlan.me/users/paul/following?page=${page + 1}`;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", `application/activity+json`);
  res.setHeader("Cache-Control", CACHE_CONTROL);
  res.json(output);
};
