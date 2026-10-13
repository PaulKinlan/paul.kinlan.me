/**
 * Log hygiene for untrusted text on the federation surface.
 *
 * Every URL that arrives here - an inbox, an actor id, a key id, a mention
 * source - is attacker-controlled, and so is every response body a peer sends
 * back. Writing either into a log verbatim turns the log into a replay surface:
 * a newline in the value reads as a second, unrelated log entry (CR can even
 * rewrite the line a terminal just printed), and a multi-kilobyte value floods
 * the log. Neither is a compromise by itself, but both make the log
 * untrustworthy exactly when an incident is being read.
 *
 * There are two rules here, and they are different rules:
 *
 *   - `logSafeText` renders untrusted *text* on one bounded line. Use it for a
 *     peer's response body or a field out of a peer's activity.
 *   - `logSafePeerId` renders only the peer's host plus a digest of the rest, as
 *     `<host>#<12 hex digits>`. Use it for anything that names a peer, because a
 *     peer chooses the whole of its own URL: the path is its own identifier (on a
 *     federation instance it names the user, and it can carry personal data) and
 *     the query can carry anything. The host is the one part that is safe to
 *     publish - the WHATWG parser lowercases and punycodes it, so it cannot carry
 *     a control character or arbitrary text, and guardedFetch has already refused
 *     anything that is not a public HTTPS host.
 *
 * Neither helper returns a URL or a body. Never use the result for anything but
 * a log call.
 */
import { createHash } from 'node:crypto';

/** @type {number} */
const MAX_LOGGED_TEXT_LENGTH = 400;
/** @type {number} */
const PEER_ID_DIGEST_LENGTH = 12;

// C0 and C1 controls, plus the two Unicode line separators. U+0020 (space) is
// deliberately not here: spaces join words rather than start a line.
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g;

// Truncation marker. It is counted inside `maxLength` rather than appended past
// it: a caller that asks for a bounded line must get a bounded line.
const ELLIPSIS = '...';

/**
 * Render arbitrary untrusted text as a single bounded log line no longer than
 * `maxLength` (for any `maxLength` of 3 or more).
 *
 * Control characters are replaced with a `\uXXXX` escape rather than removed, so
 * tampering stays visible instead of silently welding two words together.
 *
 * @param {unknown} value
 * @param {number} [maxLength]
 * @returns {string}
 */
export function logSafeText(value, maxLength = MAX_LOGGED_TEXT_LENGTH) {
  let text;
  try {
    text = typeof value === 'string' ? value : String(value);
  } catch {
    // A value whose own toString/string tag throws must not take the log call down.
    return '<unloggable-value>';
  }
  const single = text.replace(CONTROL_CHARACTERS, (character) =>
    `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`
  );
  if (single.length <= maxLength) return single;
  return `${single.slice(0, Math.max(0, maxLength - ELLIPSIS.length))}${ELLIPSIS}`;
}

/**
 * An id for a URL a remote peer controls: `<host>#<12 hex digits>`.
 *
 * Only the host is rendered. Everything after it - the path that names the user,
 * the query and the fragment, either of which can carry a payload or personal
 * data - is never published. `origin + pathname` is SHA-256'd and truncated to 12
 * hex digits instead.
 *
 * Query and fragment are excluded from the hash as well as from the output, so
 * one actor is the same id on every request and a payload cannot change it: the
 * id stays stable, which is the whole point of having one. It is also
 * deterministic, so an operator who needs to confirm "was this the peer at
 * <url>?" can hash that URL the same way and compare - the correlation, without
 * republishing the peer's own identifier.
 *
 * A URL that cannot be parsed, or that has no host (`file:`, `javascript:`,
 * `data:`), gets a fixed marker instead: it is not a peer, and the value is not
 * worth logging.
 * Every property read is inside the `try`: `instanceof URL` is true for anything
 * built from `URL.prototype` without a URL's internal slots (a subclass, a
 * proxy), and reading `.host` off one of those throws. A log helper must never
 * be the thing that takes a request down.
 *
 * @param {unknown} value a URL instance or URL-shaped string from a remote actor
 * @returns {string}
 */
export function logSafePeerId(value) {
  let host;
  let digest;
  try {
    const url = value instanceof URL ? value : new URL(String(value));
    if (!url.host) return '<url-without-host>';
    host = url.host;
    digest = createHash('sha256').update(`${url.origin}${url.pathname}`).digest('hex');
  } catch {
    return '<unparseable-url>';
  }
  return `${host}#${digest.slice(0, PEER_ID_DIGEST_LENGTH)}`;
}
