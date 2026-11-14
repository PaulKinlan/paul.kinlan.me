import { isTrustedActivityHost } from "./trustedHosts.js";
import { isStorableDocIdUrl } from "./docId.ts";

// One definition of "a post URL this project serves"
// (paul-kinlan-me-z5ej). It replaces two copies that were written three days
// apart and were NOT in fact identical:
//
//   api/activitypub/inbox.ts   asTrustedPostUrlString()
//     accepted a URL instance as well as a string, did NOT trim, and required the
//     value to survive being turned into a Firestore document id (paul-kinlan-me-g5bp).
//   api/activitypub-html/render.ts   httpUrlOrNull()
//     accepted only a string, trimmed it first, and left the document-id length
//     check to its caller.
//
// The differences are carried here once, on purpose, instead of in two bodies:
//
//   - A URL instance is accepted (both sides of the inbox hand one in; the
//     render route and the document id encoding already work from a string).
//   - The value is returned unchanged, never normalised. WHATWG's parser tolerates
//     surrounding whitespace, so a padded IRI does parse; what differs between the
//     two routes was the RETURN value - render.ts trims its own ?url= parameter
//     before calling, the inbox never trimmed - and the document key is derived
//     from that return value. Keeping "unchanged" here means the key cannot change
//     for either caller.
//   - The value must be storable as a Firestore document id, so an over-long IRI
//     is refused at the guard rather than becoming a 500 (paul-kinlan-me-g5bp).
//     The injective encoding triples the bytes of non-ASCII and reserved
//     characters and Firestore rejects an id over 1500 bytes.
//
// Both call sites had these rejections already; what changes is that there is now
// one place to review, so a future bound (a served-post allowlist, a per-actor
// quota) has a single site to extend instead of a third copy to fork.
export function trustedPostUrlOrNull(value: unknown): string | null {
  // A URL instance is what an ActivityPub document typically hands over; a string
  // is what a query parameter and a parsed JSON document give.
  const candidate = value instanceof URL ? value.toString() : value;
  if (typeof candidate !== "string") return null;
  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  if (!isTrustedActivityHost(parsed.hostname)) return null;
  if (!isStorableDocIdUrl(candidate)) return null;
  return candidate;
}
