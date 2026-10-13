import html from 'whatwg-flora-tmpl';
import { Readable } from 'stream';
import fetch from 'node-fetch';

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

export default async (req, res) => {
  const { url = 'https://paul.kinlan.me/', count = 200 } = req.query || {};
  const referer = req.headers && req.headers.referer;
  const cacheAge = 12 * 60 * 60;

  const mentionsUrl = `https://webmention.io/api/mentions.jf2?per-page=${count}&target=${referer || url}`;

  try {
    const mentionsResponse = await fetch(mentionsUrl);
    const data = await mentionsResponse.json();
    // Add caching.
    res.statusCode = 200;
    res.setHeader('Content-Type', `text/html; charset=utf-8`);
    res.setHeader('Cache-Control', `public,s-maxage=${cacheAge}, max-age=${cacheAge}`);
    const output = await render(data.children, referer || url);
    const stream = new FromWhatWGReadableStream({}, output);
    stream.pipe(res, { end: true });
  } catch (ex) {
    console.error(ex);
    res.statusCode = 500;
    res.end('mentions unavailable');
  }
}
