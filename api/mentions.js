const html = require('whatwg-flora-tmpl');
const { Readable } = require('stream');
const fetch = require('node-fetch');

const render = (data) => html`<html><head><title>Interactions with ${data.url}</title>
<style>
.webmentions .comments .reply img {
  float: left;
  margin-right: 1em;
}

img.profile.photo {
  width: 32px;
  height: 32px;
  border-radius: 50% 50%;
}
</style>
</head>
<body>
<div class="comments webmentions">            
  <h4>Likes</h4>
  ${data.filter(item => item['wm-property'] === 'like-of').map(item => html`<a href="${item.author.url}"><img src="${item.author.photo}" alt="${item.author.name}" class="profile photo" loading="lazy"></a>`)}
  <h4>Reposts</h4>
  ${data.filter(item => item['wm-property'] === 'repost-of').map(item => html`<a href="${item.author.url}"><img src="${item.author.photo}" alt="${item.author.name}" class="profile photo" loading="lazy"></a>`)}
  <h4>Comments and Replies</h4>
  <div class="comments">
  ${data.filter(item => item['wm-property'] === 'in-reply-to').map(item => html`<div class="reply">
    <a href="${item.url}"><img src="${item.author.photo}" alt="${item.author.name}" class="profile photo" loading="lazy"><span><a href="${item.url}">${item.author.name}</a></span></a>
    <blockquote>${item.content.text}</blockquote>
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
  const { referrer } = req;
  const cacheAge = 12 * 60 * 60;

  const mentionsUrl = `https://webmention.io/api/mentions.jf2?per-page=${count}&target=${referrer || url}`;

  try {
    const mentionsResponse = await fetch(mentionsUrl);
    const data = await mentionsResponse.json();
    data.url = referrer || url;

    console.log(data.children);
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