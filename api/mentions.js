import html from 'whatwg-flora-tmpl';
import { Readable } from 'stream';
import { guardedFetch } from '../lib/activitypub/utils/guardedFetch.js';

// Everything rendered here comes from webmention.io, which means a third party
// controls it. So:
//   1. every interpolated value goes through escapeHtml - all five
//      HTML-significant characters, replaced globally (the old helper used
//      String.replace('<', ...) with a string pattern, which only ever replaced
//      the FIRST occurrence and left & and ' untouched);
//   2. anything that becomes an href/src goes through safeUrl, which drops every
//      scheme except http(s), so `javascript:` and `data:` URLs render inert
//      instead of becoming executable anchors.
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const escapeHtml = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (char) => ESCAPES[char]);
};

export const safeUrl = (value) => {
  if (value === null || value === undefined) return '';
  const raw = String(value).trim();
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return '';
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
  // Emit the parsed form, so what the browser resolves is exactly what was
  // validated above - never the raw string that was handed to us.
  return escapeHtml(parsed.href);
};

export const render = (items, pageUrl) => {
  const mentions = Array.isArray(items) ? items : [];
  return html`<html><head><title>Interactions with ${escapeHtml(pageUrl)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>

body {
  font-family: Helvetica,Arial,sans-serif;
  font-size: 1.1em;
}

.webmentions .comments .reply img {
  float: left;
  margin-right: 1em;
}

img.profile.photo {
  width: 32px;
  height: 32px;
  border-radius: 50% 50%;
}

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
</style>
</head>
<body>
<div class="comments webmentions">            
  <h4>Likes and bookmarks</h4>
  ${mentions.filter(item => item['wm-property'] === 'like-of' || item['wm-property'] === 'bookmark-of').map(item => html`<a href="${safeUrl(item.author && item.author.url)}" target="_blank"><img src="${safeUrl(item.author && item.author.photo)}" alt="${escapeHtml(item.author && item.author.name)}" class="profile photo" loading="lazy"></a>`)}
  <h4>Reposts</h4>
  ${mentions.filter(item => item['wm-property'] === 'repost-of').map(item => html`<a href="${safeUrl(item.author && item.author.url)}" target="_blank"><img src="${safeUrl(item.author && item.author.photo)}" alt="${escapeHtml(item.author && item.author.name)}" class="profile photo" loading="lazy"></a>`)}
  <h4>Comments and Replies</h4>
  <div class="comments">
  ${mentions.filter(item => item['wm-property'] === 'in-reply-to' || item['wm-property'] === 'mention-of').map(item => html`<div class="reply">
    <a href="${safeUrl(item.url)}" target="_blank"><img src="${safeUrl(item.author && item.author.photo)}" alt="${escapeHtml(item.author && item.author.name)}" class="profile photo" loading="lazy"></a><span><a href="${safeUrl(item.url)}" target="_blank">${escapeHtml(item.author && item.author.name)}</a></span>
    <blockquote>${escapeHtml(item.content && item.content.text)}</blockquote>
    </div>`)}
  </div>
</div>
</body></html>`;
};

class FromWhatWGReadableStream extends Readable {
  constructor(options, whatwgStream) {
    super(options);
    const streamReader = whatwgStream.getReader();
    const outStream = this;

    function pump() {
      return streamReader.read().then(({ value, done }) => {
        if (done) {
          outStream.push(null);
          return;
        }

        outStream.push(value);
        return pump();
      });
    }

    pump();
  }
}

// The upstream query is built from request input (`url`, `count`) and from the
// Referer header, all of which the caller controls. So:
//   1. every value is validated before use and a value that cannot be one (not
//      an http(s) URL, not a page size the upstream accepts) is answered with
//      400 instead of being sent upstream;
//   2. the upstream URL is built with URL + URLSearchParams, so a crafted value
//      is encoded into the `target` parameter rather than adding a parameter,
//      changing the path or truncating the query - interpolating it meant
//      `?url=https://x/&per-page=100000` became a second upstream parameter;
//   3. webmention.io is fetched through guardedFetch, the one outbound
//      transport for third-party URLs in this repo.
const MENTIONS_ENDPOINT = 'https://webmention.io/api/mentions.jf2';
const DEFAULT_TARGET = 'https://paul.kinlan.me/';
const DEFAULT_PER_PAGE = 200;
// webmention.io's own per-page ceiling: a larger number is a caller error, not a
// reason to build a huge upstream query.
const MAX_PER_PAGE = 1000;
// A 1000-mention jf2 document is large, so the transport response cap is raised
// above guardedFetch's 1 MiB default. The cap exists to bound a hostile peer,
// not to truncate this one fixed upstream.
const UPSTREAM_TIMEOUT_MS = 15 * 1000;
const UPSTREAM_MAX_BYTES = 8 * 1024 * 1024;
const CACHE_AGE = 12 * 60 * 60;

// `?url=a&url=b` arrives as an array; only the first value is considered.
const firstValue = (value) => (Array.isArray(value) ? value[0] : value);

// An absolute http(s) URL, or null. A relative value, another scheme
// (`javascript:`), a number or an object is not a webmention target.
const httpUrlOrNull = (value) => {
  if (typeof value !== 'string') return null;
  const raw = value.trim();
  if (raw === '') return null;
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
  // Emit the parsed form, so what goes upstream is exactly what was validated.
  return parsed.href;
};

// A page size the upstream accepts, or null. Number() alone is too generous
// (`Number('0x10')` and `Number('2e3')` are numbers), so the digits are checked
// first.
const perPageOrNull = (value) => {
  if (value === undefined) return DEFAULT_PER_PAGE;
  if (typeof value !== 'string' || !/^[0-9]{1,4}$/.test(value)) return null;
  const perPage = Number(value);
  if (perPage < 1 || perPage > MAX_PER_PAGE) return null;
  return perPage;
};

// Exported so the encoding rules can be asserted directly, without a network.
// The path is fixed: no request value can move it.
export const buildMentionsUrl = (target, perPage) => {
  const endpoint = new URL(MENTIONS_ENDPOINT);
  endpoint.searchParams.set('per-page', String(perPage));
  endpoint.searchParams.set('target', target);
  return endpoint;
};

// The fetch implementation is a parameter so tests can drive the handler
// offline; production and the default export always use guardedFetch.
export const createMentionsHandler = (fetchImpl = guardedFetch) => async (req, res) => {
  const query = (req && req.query) || {};
  const headers = (req && req.headers) || {};

  const fail = (status, message) => {
    res.setHeader('Content-Type', `text/plain; charset=utf-8`);
    res.statusCode = status;
    return res.end(message);
  };

  // A missing `url` keeps its documented default. A `url` that is present and
  // cannot be a target is the caller's error, however valid the Referer is.
  const rawUrl = firstValue(query.url);
  const requestedTarget = rawUrl === undefined ? DEFAULT_TARGET : httpUrlOrNull(rawUrl);
  if (requestedTarget === null) return fail(400, 'invalid url');

  // The Referer is optional: an unparsable one is dropped, not forwarded, so a
  // proxy sending a malformed value cannot turn every embed into a 400.
  const target = httpUrlOrNull(headers.referer) || requestedTarget;

  const perPage = perPageOrNull(firstValue(query.count));
  if (perPage === null) return fail(400, 'invalid count');

  try {
    const mentionsUrl = buildMentionsUrl(target, perPage);
    const mentionsResponse = await fetchImpl(mentionsUrl, {
      timeoutMs: UPSTREAM_TIMEOUT_MS,
      maxBytes: UPSTREAM_MAX_BYTES
    });

    let data = null;
    try {
      data = await mentionsResponse.json();
    } catch {
      data = null;
    }
    if (data === null || typeof data !== 'object' || !Array.isArray(data.children)) {
      // The upstream did not answer with a mentions document: that is a bad
      // gateway, not an empty page and not a 500.
      return fail(502, 'mentions unavailable');
    }

    // Add caching.
    res.statusCode = 200;
    res.setHeader('Content-Type', `text/html; charset=utf-8`);
    res.setHeader('Cache-Control', `public,s-maxage=${CACHE_AGE}, max-age=${CACHE_AGE}`);
    const output = await render(data.children, target);
    const stream = new FromWhatWGReadableStream({}, output);
    stream.pipe(res, { end: true });
  } catch (ex) {
    console.error(ex);
    fail(502, 'mentions unavailable');
  }
};

export default createMentionsHandler();
