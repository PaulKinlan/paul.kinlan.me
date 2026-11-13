import html from '../lib/whatwg-flora';
import { escapeHtml } from '../lib/escape.js';
import { renderAnswer } from '../lib/ask-paul-answer.js';
import { polymathUrl } from '../lib/ask-paul-request.js';
import { admitAnswer } from '../lib/ask-paul-admission.js';

// Edge runtime, and native fetch with it. The outbound call is the function's
// own /api/polymath.js, so it does not go through the guardedFetch boundary
// (ADR paul-kinlan-me-9oi) yet: guardedFetch pins the DNS answer into the TLS
// connect with node:https/node:dns, and the edge runtime has neither. That
// question is parked as paul-kinlan-me-xvt/n2a; until it is answered the URL
// contract below is enforced here.
export const config = {
  runtime: 'edge'
}

function removePlus(s: string) {
  return s.replace(/\+/g, ' ');
}

// Bound the entire upstream operation, including a response body that stalls
// after its headers. The race also settles if an upstream ignores abort.
export async function fetchPolymathAnswer(url: string | URL, timeoutMs = 20_000) {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout>;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error('Polymath timed out'));
    }, timeoutMs);
  });
  try {
    return await Promise.race([
      (async () => {
        const result = await fetch(url, { signal: controller.signal });
        if (!result.ok) throw new Error(`Polymath returned ${result.status}`);
        const { completion, infos } = await result.json();
        return renderAnswer({ completion, infos });
      })(),
      deadline,
    ]);
  } finally {
    clearTimeout(timer!);
  }
}

export default async function (req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("query") || "What are Web Intents?";

  // Admission BEFORE any paid work (paul-kinlan-me-gjsg): this route fetches its
  // own /api/polymath.js, which bills OpenAI, and middleware.ts's matcher
  // excludes /api, so no quota covered it. One atomic KV EVAL against a
  // per-minute budget (lib/ask-paul-admission.js); the refusal commits nothing
  // cacheable, so a 429 cannot deny the page its answer after the minute rolls
  // over, and a KV outage fails CLOSED (503) rather than restoring the
  // unbounded spend lever - the same contract as api/activitypub-html/render.ts.
  const admission = await admitAnswer();
  if (admission.unavailable) {
    return new Response("Ask Paul is unavailable right now. Please try again shortly.", {
      status: 503,
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
    });
  }
  if (!admission.admitted) {
    return new Response("Too many questions right now. Please try again in a minute.", {
      status: 429,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        "retry-after": "60",
      },
    });
  }

  // Escaped once, then used for both the <title> and the input value.
  const displayQuery = escapeHtml(removePlus(query));
  // Handle every upstream outcome inside the stream: an unhandled rejection in
  // whatwg-flora leaves its ReadableStream open indefinitely.
  // Built from a literal endpoint and searchParams.set, never interpolated:
  // the visitor's query stays one parameter and no request header can pick
  // the scheme or the host (lib/ask-paul-request.js).
  const answer = fetchPolymathAnswer(polymathUrl(query)).catch(error => {
    console.error('Ask Paul upstream failed:', error);
    const message = error instanceof Error && error.message === 'Polymath timed out'
      ? 'The answer is taking too long. Please try again.'
      : 'Sorry, I could not answer that question right now.';
    return `<div class="error" role="alert"><p>${message}</p><input type="submit" form="ask-paul-form" value="Try again"></div>`;
  });

  try {
    const output = await html`
    <html>
      <head>
        <title>Ask Paul: ${displayQuery}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/css/ask.css">
        <!-- Analytics is absent on purpose. The Universal Analytics property this page
             used (UA-114468-20) was sunset by Google, and its snippet was never blocked
             by our CSP: script-src already names https://www.google-analytics.com. A
             future GA4/gtag tag here would be a product and CSP decision (this page
             renders third-party model output under script-src 'self'), not a re-enable.
             The aria-busy flip lives in static/javascripts/ask-paul-ready.js. -->
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
      <script src="/javascripts/ask-paul-ready.js"></script>
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
