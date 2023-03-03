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
  const host = req.headers.get("x-vercel-deployment-url");
  const url = new URL(req.url);
  const question = url.searchParams.get("question") || "What are Web Intents?";

  const response = fetch(`${proto}://paul.kinlan.me/api/polymath.ts?question=${question}`);

  try {

    const output = await html`
    <html>
      <head>
        <title>Ask Paul: ${removePlus(encodeHTML(question))}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/css/ask.css">
      </head>
      <body>
      <header>
        <h1>Question <form method="GET" action="/ask-paul"><input type="text" name="question" value="${removePlus(encodeHTML(question))}"/><input type="submit" value="Ask" /></h1>
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
          return html`TEST`;
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
