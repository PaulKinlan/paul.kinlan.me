// The one outbound request /ask-paul makes: its own /api/polymath.js.
//
// The target is built here rather than interpolated into a string for two
// reasons. The scheme used to come from the `x-forwarded-proto` request header,
// so a request could choose it; and the raw query was pasted into the URL, so
// `?query=x&extra=1` reached polymath as a second query parameter (observed by
// the dn9 lane: `?query=<script>...&extra=1`). `URL` + `searchParams` pins the
// origin to https and keeps everything the visitor sent inside the value of
// `query`, which is what this function's existence is tested for.
const POLYMATH_ENDPOINT = 'https://paul.kinlan.me/api/polymath.js';

/**
 * The polymath URL for a query. The returned URL is always https on
 * paul.kinlan.me, whatever the caller passed.
 * @param {string} query
 * @returns {URL}
 */
export function polymathUrl(query) {
  const url = new URL(POLYMATH_ENDPOINT);
  url.searchParams.set('query', String(query));
  return url;
}
