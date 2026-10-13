import html from '../lib/whatwg-flora';
import { escapeHtml } from '../lib/escape.js';
import { renderAnswer } from '../lib/ask-paul-answer.js';

export const config = {
  runtime: 'edge'
}

function removePlus(s: string) {
  return s.replace(/\+/g, ' ');
}

export default async function (req: Request) {
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const url = new URL(req.url);
  const query = url.searchParams.get("query") || "What are Web Intents?";

  // Escaped once, then used for both the <title> and the input value.
  const displayQuery = escapeHtml(removePlus(query));
  const response = fetch(`${proto}://paul.kinlan.me/api/polymath.js?query=${query}`);
  // Handle every upstream outcome inside the stream: an unhandled rejection in
  // whatwg-flora leaves its ReadableStream open indefinitely.
  const answer = response.then(async result => {
    if (!result.ok) throw new Error(`Polymath returned ${result.status}`);
    const { completion, infos } = await result.json();
    return renderAnswer({ completion, infos });
  }).catch(error => {
    console.error('Ask Paul upstream failed:', error);
    return `<div class="error" role="alert"><p>Sorry, I could not answer that question right now.</p><input type="submit" form="ask-paul-form" value="Try again"></div>`;
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
        <form id="ask-paul-form" method="GET" action="/ask-paul">
          <input type="text" name="query" value="${displayQuery}"/>
          <input type="submit" value="Ask" />
        </form>
      </header>
      <main id="ask-paul-main" aria-busy="true">
      <p class="loader" role="status" aria-live="polite">Particulating Splines... One moment please.</p>
      ${answer}
      <style>.loader { display: none; }</style>
      <script>document.getElementById('ask-paul-main').setAttribute('aria-busy', 'false');</script>
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
