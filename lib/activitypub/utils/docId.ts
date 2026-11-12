// Firestore document ids for URL-keyed records (paul-kinlan-me-je6t).
//
// The legacy encoding (every '/' -> '_') is NOT injective:
// 'https://paul.kinlan.me/a/b' and 'https://paul.kinlan.me/a_b' both become
// 'https:__paul.kinlan.me_a_b', so two distinct pages shared one interaction
// document, and two distinct peer activity ids collided the same way
// (threat-model invariant 6: a caller-influenced value that becomes a storage
// id must be injective).
//
// New writes use encodeURIComponent, which is injective, reversible, and
// Firestore-safe: it emits no '/', and any URL the route guards accept
// (trusted-host http(s) URLs) is far under the 1500-byte document-id limit.
//
// Migration: documents written before this change keep their legacy ids.
// Read paths dual-read (api/activitypub-html/render.ts merges both
// encodings; the Undo path in api/activitypub/inbox.ts tries the injective
// id first and falls back to the legacy one), so no re-key migration is
// needed and no stored interaction is orphaned.
export function docIdForUrl(url: string): string {
  return encodeURIComponent(url);
}

// The pre-je6t encoding, retained ONLY for dual-reading documents written
// before the injective encoding landed. Never use it for a new write.
export function legacyDocIdForUrl(url: string): string {
  return url.replace(/\//g, "_");
}
