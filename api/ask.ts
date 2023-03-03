import html from '../lib/whatwg-flora';

export const config = {
  runtime: 'edge'
}

function encodeHTML(s) {
  return s.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

export default async function (req: Request) {
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("x-vercel-deployment-url");
  const url = new URL(req.url);
  const question = url.searchParams.get("question") || "What are Web Intents?";

  const response = fetch(`${proto}://${host}/api/polymath.ts?question=${question}`);

  const output = await html`
    <html>
      <head>
        <title>Ask Paul: ${encodeHTML(question)}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/css/ask.css">
      </head>
      <body>
      <header>
        <h1>Question: <form method="GET" action="/ask-paul"><input type="text" name="question" value="${encodeHTML(question)}"/><input type="submit" value="Ask" /></h1>
      </header>
      <main>
      ${response
      .then(result => result.json())
      .then(({ completion, infos }) => html`<article class="completion">${completion}</article><div class="results"><h2>Links</h2>
        ${infos.map((bit) => html`<p class="link"><a href="${bit.url}">${bit.title}</a></p>`)}</div>`)
      }
      </main>
      <footer>
      </footer>
    </body>
  </html>`;

  return new Response(output, { headers: { "content-type": "text/html" } });
}
