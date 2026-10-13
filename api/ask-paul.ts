import html from '../lib/whatwg-flora';
import { escapeHtml } from '../lib/escape.js';
import { renderAnswer } from '../lib/ask-paul-answer.js';
import { polymathUrl } from '../lib/ask-paul-request.js';
import { guardedFetch } from '../lib/activitypub/utils/guardedFetch.js';

// Node.js runtime, not edge. The outbound call goes through guardedFetch (ADR
// paul-kinlan-me-9oi), which pins the DNS answer into the TLS connect with
// node:https/node:dns - neither exists in the edge runtime. Nothing else here
// is edge-specific: the fetch Web Standard export below keeps the handler a
// plain (Request) => Response, returning the same page it always did.

function removePlus(s: string) {
  return s.replace(/\+/g, ' ');
}

async function askPaul(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("query") || "What are Web Intents?";

  // Escaped once, then used for both the <title> and the input value.
  const displayQuery = escapeHtml(removePlus(query));
  const response = guardedFetch(polymathUrl(query));

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
    return new Response(output, { headers: { "content-type": "text/html" } });
  } catch (e) {
    console.log(e);
    return new Response("Error", { headers: { "content-type": "text/html" }, status: 500 });
  }
}

export default { fetch: askPaul };
