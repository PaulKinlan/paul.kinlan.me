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
 * So this module renders what is operationally useful and nothing else:
 *   - control characters are escaped, never emitted, so one call is one line;
 *   - a URL's query and fragment are dropped - those are the parts that carry
 *     opaque payloads;
 *   - a URL with no host (`file:`, `javascript:`, `data:`) is not rendered at
 *     all;
 *   - everything is capped, so one peer cannot fill the log.
 *
 * `logSafeUrl` keeps the host (the address the request actually goes to, which
 * the WHATWG parser has already lowercased and punycoded) and the path, because
 * `https://mastodon.social/users/paul` is unidentifiable without the path.
 *
 * The result is redacted text, not a URL or a body: never use it for anything
 * but a log call.
 */

/** @type {number} */
const MAX_LOGGED_URL_LENGTH = 200;
/** @type {number} */
const MAX_LOGGED_TEXT_LENGTH = 400;

// C0 and C1 controls, plus the two Unicode line separators. U+0020 (space) is
// deliberately not here: spaces join words rather than start a line.
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g;

/**
 * Render arbitrary untrusted text as a single bounded log line.
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
  return single.length <= maxLength ? single : `${single.slice(0, maxLength)}...`;
}

/**
 * Render an attacker-controlled URL for a log line: `host + pathname`, escaped
 * and capped, with no query, fragment or credentials.
 *
 * @param {unknown} value a URL instance or URL-shaped string from a remote actor
 * @param {number} [maxLength]
 * @returns {string}
 */
export function logSafeUrl(value, maxLength = MAX_LOGGED_URL_LENGTH) {
  let url;
  try {
    url = value instanceof URL ? value : new URL(String(value));
  } catch {
    return '<unparseable-url>';
  }
  if (!url.host) return '<url-without-host>';
  return logSafeText(`${url.host}${url.pathname}`, maxLength);
}
