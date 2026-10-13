import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import html from '../lib/whatwg-flora';
import { escapeHtml } from '../lib/escape.js';
import { renderAnswer } from '../lib/ask-paul-answer.js';
import { polymathUrl } from '../lib/ask-paul-request.js';
import { guardedFetch } from '../lib/activitypub/utils/guardedFetch.js';

// Node.js runtime, not edge: the outbound call goes through guardedFetch (ADR
// paul-kinlan-me-9oi), which pins the DNS answer into the TLS connect with
// node:https/node:dns, and the edge runtime has neither.
//
// The handler is the plain (req, res) function every other Node function here
// uses, NOT the Web Standard `export default { fetch }` shape. The pinned
// @vercel/node 2.9.10 / node-bridge 3.1.14 unwraps a default export and then
// accepts only a function or a server (node-bridge/launcher.js:79-110), so an
// object export is refused with "Invalid export found in module" and the route
// never registers (paul-kinlan-me-se4). res.send() is not used either: this
// version of the helpers JSON-stringifies any non-Buffer object, so the stream
// lib/whatwg-flora builds is piped into the response instead.

function removePlus(s: string) {
  return s.replace(/\+/g, ' ');
}

async function askPaul(req: VercelRequest, res: VercelResponse) {
  // Vercel parses the query for us; a repeated parameter arrives as an array and
  // the previous implementation took the first value.
  const param = req.query.query;
  const query = (Array.isArray(param) ? param[0] : param) || "What are Web Intents?";

  // Escaped once, then used for both the <title> and the input value.
  const displayQuery = escapeHtml(removePlus(query));
  // A refusal must not become an unhandled rejection. lib/whatwg-flora renders by
  // pushing into a detached async loop, so a rejected promise there takes the
  // whole function down instead of rendering the error page. Resolve a refusal to
  // a 502 and let the template render its error state - which is what an
  // unreachable upstream already did (paul-kinlan-me-a74).
  const response = guardedFetch(polymathUrl(query)).catch((error) => {
    console.log("polymath request failed", error);
    return new Response(null, { status: 502 });
  });

  try {
    const output = await html`
    <html>
      <head>
        <title>Ask Paul: ${displayQuery}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/css/ask.css">
        <script>
        (function (i, s, o, g, r, a, m) {
          i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
          }, i[r].l = 1 * new Date(); a = s.createElement(o),
            m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
        
        ga('create', 'UA-114468-20', 'auto');
        ga('send', 'pageview');
        </script>
      </head>
      <body>
      <header>
        <h1>Question</h1>
        <form method="GET" action="/ask-paul">
          <input type="text" name="query" value="${displayQuery}"/>
          <input type="submit" value="Ask" />
        </form>
      </header>
      <main>
      <p class="loader">Particulating Splines... One moment please.</p>
      ${response
        .then(result => {
          if (result.ok) {
            return result.json()
              .then(({ completion, infos }) => renderAnswer({ completion, infos }))
              .catch((e) => html`<p class="error">Something went wrong.</p>`)
          }
          else {
            console.log("Ok", result.ok);
            console.log("Status", result.status);
            console.log("StatusText", result.statusText);
          }
          return html`There was an error.`;
        })
      }
      </main>
      <footer>
      <p>Powered by <a href="https://www.npmjs.com/package/@polymath-ai/client">Polymath</a>.</p>
      </footer>
    </body>
  </html>`;
    res.status(200);
    res.setHeader("content-type", "text/html");
    await pipeline(Readable.fromWeb(output), res);
  } catch (e) {
    console.log(e);
    // The page streams, so the failure may arrive after the headers are on the
    // wire; only answer with an error page while nothing has been sent.
    if (res.headersSent) res.end(); else res.status(500).send("Error");
  }
}

export default askPaul;
