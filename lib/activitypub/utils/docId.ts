// Firestore document ids for URL-keyed records (paul-kinlan-me-je6t,
// paul-kinlan-me-g5bp).
//
// The legacy encoding (every '/' -> '_') is NOT injective:
// 'https://paul.kinlan.me/a/b' and 'https://paul.kinlan.me/a_b' both become
// 'https:__paul.kinlan.me_a_b', so two distinct pages shared one interaction
// document, and two distinct peer activity ids collided the same way
// (threat-model invariant 6: a caller-influenced value that becomes a storage
// id must be injective).
//
// New writes use encodeURIComponent, which is injective and reversible. It is
// NOT bounded, though: it triples the bytes of non-ASCII and of ':/?#[]@$&+,;=',
// and Firestore rejects a document id over 1500 bytes - so a peer-chosen id that
// used to store cleanly could 500. The route guards therefore bound the input
// with isStorableDocIdUrl() before any write or read; that is the precondition
// this module relies on (paul-kinlan-me-g5bp).
//
// Migration: documents written before je6t keep their legacy ids. Read paths
// dual-read (api/activitypub-html/render.ts merges both encodings and dedupes
// by stored activity id; api/activitypub/inbox.ts checks both encodings before
// writing and deletes both copies on an Undo), so no re-key migration is
// needed and no stored interaction is orphaned (paul-kinlan-me-qal8).
export const MAX_DOC_ID_BYTES = 1500;

// The injective encoding. Total: a lone surrogate makes encodeURIComponent
// throw URIError, and such a value has no storable id, so the helpers report it
// as unusable rather than raising (a peer-controlled id must never turn a
// delivery into a 500).
function isEncodableUrl(value: string): boolean {
  try {
    encodeURIComponent(value);
    return true;
  } catch {
    return false;
  }
}

export function docIdForUrl(url: string): string | null {
  if (!isEncodableUrl(url)) return null;
  return encodeURIComponent(url);
}

// The pre-je6t encoding, retained ONLY for dual-reading documents written
// before the injective encoding landed. Never use it for a new write.
export function legacyDocIdForUrl(url: string): string | null {
  // The legacy encoding itself never throws, but a lone surrogate is not a
  // string the store accepts as an id, so the helper refuses it the same way.
  if (!isEncodableUrl(url)) return null;
  return url.replace(/\//g, "_");
}

// Whether this URL has a document id the store will accept under both
// encodings. Checked by the route guards (inbox id/object, render ?url=) so a
// peer-chosen id can be ignored with the handler's usual 200 instead of
// reaching Firestore and becoming a 500.
export function isStorableDocIdUrl(url: string): boolean {
  const injective = docIdForUrl(url);
  const legacy = legacyDocIdForUrl(url);
  if (injective === null || legacy === null) return false;
  const encoder = new TextEncoder();
  return encoder.encode(injective).length <= MAX_DOC_ID_BYTES
    && encoder.encode(legacy).length <= MAX_DOC_ID_BYTES;
}

// Both ids for one URL: the injective one to write, the legacy one to
// dual-read (and to delete when an Undo removes a duplicated interaction).
// null components mean "not storable" and must be treated as "ignore".
export function docIdsForUrl(url: string): { injective: string | null; legacy: string | null } {
  return { injective: docIdForUrl(url), legacy: legacyDocIdForUrl(url) };
}
