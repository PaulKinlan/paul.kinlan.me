const html = require('whatwg-flora-tmpl');
const { Readable } = require('stream');
const fetch = require('node-fetch');

const sanitize = (str) => str.replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;');

const render = (data) => html`<html><head><title>Interactions with ${data.url}</title>
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
    background-color: rgb(36, 36, 36);
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
  ${data.filter(item => item['wm-property'] === 'like-of' || item['wm-property'] === 'bookmark-of').map(item => html`<a href="${sanitize(item.author.url)}" target="_blank"><img src="${sanitize(item.author.photo)}" alt="${sanitize(item.author.name)}" class="profile photo" loading="lazy"></a>`)}
  <h4>Reposts</h4>
  ${data.filter(item => item['wm-property'] === 'repost-of').map(item => html`<a href="${sanitize(item.author.url)}" target="_blank"><img src="${sanitize(item.author.photo)}" alt="${sanitize(item.author.name)}" class="profile photo" loading="lazy"></a>`)}
  <h4>Comments and Replies</h4>
  <div class="comments">
  ${data.filter(item => item['wm-property'] === 'in-reply-to' || item['wm-property'] === 'mention-of').map(item => html`<div class="reply">
    <a href="${item.url}" target="_blank"><img src="${sanitize(item.author.photo)}" alt="${sanitize(item.author.name)}" class="profile photo" loading="lazy"></a><span><a href="${sanitize(item.url)}" target="_blank">${sanitize(item.author.name)}</a></span>
    <blockquote>${sanitize(item.content.text)}</blockquote>
    </div>`)}
  </div>
</div>
</body></html>`;

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

module.exports = async (req, res) => {
  const { url = 'https://paul.kinlan.me/', count = 200 } = req.query;
  const referer = req.headers.referer;
  const cacheAge = 12 * 60 * 60;

  const mentionsUrl = `https://webmention.io/api/mentions.jf2?per-page=${count}&target=${referer || url}`;

  try {
    const mentionsResponse = await fetch(mentionsUrl);
    const data = await mentionsResponse.json();
    data.url = referer || url;

    // Add caching.
    res.statusCode = 200;
    res.setHeader('Content-Type', `text/html; charset=utf-8`);
    res.setHeader('Cache-Control', `public,s-maxage=${cacheAge}, max-age=${cacheAge}`);
    const output = await render(data.children);
    const stream = new FromWhatWGReadableStream({}, output);
    stream.pipe(res, { end: true });
  } catch (ex) {
    console.error(ex);
    res.status(500).send(ex);
  }
}