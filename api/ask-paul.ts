import html from '../lib/whatwg-flora';

export const config = {
  runtime: 'edge'
}

function encodeHTML(s: string) {
  return s.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

function removePlus(s: string) {
  return s.replace(/\+/g, ' ');
}

export default async function (req: Request) {
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const url = new URL(req.url);
  const query = url.searchParams.get("query") || "What are Web Intents?";

  const response = fetch(`${proto}://paul.kinlan.me/api/polymath.js?query=${query}`);

  try {
    const output = await html`
    <html>
      <head>
        <title>Ask Paul: ${removePlus(encodeHTML(query))}</title>
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
          <input type="text" name="query" value="${removePlus(encodeHTML(query))}"/>
          <input type="submit" value="Ask" />
        </form>
      </header>
      <main>
      <p class="loader">Particulating Splines... One moment please.</p>
      ${response
        .then(result => {
          if (result.ok) {
            return result.json()
              .then(({ completion, infos }) => html`<article class="completion">${completion}</article><div class="results"><h2>Links</h2>
          ${infos.map((bit) => html`<p class="link"><a href="${bit.url}">${bit.title}</a></p>`)}<style>.loader {display:none;}</style></div>`)
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
