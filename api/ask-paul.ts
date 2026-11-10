import html from '../lib/whatwg-flora';
import { escapeHtml } from '../lib/escape.js';
import { renderAnswer } from '../lib/ask-paul-answer.js';
import { polymathUrl } from '../lib/ask-paul-request.js';

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

// One visitor request has two unbounded inputs (paul-kinlan-me-8qew, nightly
// factory row unclassified at this file): the query arrives straight off the
// GET form, and the upstream body used to be read with result.json(), which
// buffers however many bytes arrive. The 20s race below bounds wall time, not
// bytes, so the edge function's memory was whatever the upstream chose to
// send. Both are bounded now: the query is truncated to what a search box
// needs, and the body is read through a byte counter that aborts transfer.
export const MAX_QUERY_CHARS = 512;
export const MAX_RESPONSE_BYTES = 1_000_000;

export class PolymathTooLargeError extends Error {
  constructor() {
    super('Polymath response too large');
    this.name = 'PolymathTooLargeError';
  }
}

// Truncate on a code-point boundary: slicing UTF-16 units in half would leave a
// lone surrogate in the page title and in the upstream parameter. What the
// visitor sees in the form is then exactly what was asked, so a pasted essay
// answers its first 512 characters instead of failing a search box silently.
export function boundQuery(query: string, max = MAX_QUERY_CHARS) {
  if (query.length <= max) return query;
  return Array.from(query).slice(0, max).join('');
}

const decodeChunks = (chunks: Uint8Array[]) => {
  const total = chunks.reduce((bytes, chunk) => bytes + chunk.byteLength, 0);
  const bytes = new Uint8Array(total);
  let at = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, at);
    at += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
};

// Read a JSON body under a hard byte cap. The declared Content-Length is
// refused before the first read when it is already over the cap; otherwise
// bytes are counted as they stream, and crossing the cap aborts the transfer
// rather than waiting for the 20s deadline to end it.
export async function readJsonCapped(
  response: Response,
  abort: () => void = () => {},
  maxBytes = MAX_RESPONSE_BYTES
) {
  const declared = Number(response.headers?.get?.('content-length') ?? '');
  const body = response.body;
  if (!body || typeof body.getReader !== 'function') {
    // No stream to bound (a stub response, or a runtime without streams): the
    // bytes are already in memory, so the cap is enforced on their measured size.
    const text = await response.text();
    if (new TextEncoder().encode(text).byteLength > maxBytes) {
      abort();
      throw new PolymathTooLargeError();
    }
    return JSON.parse(text);
  }

  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    if (Number.isFinite(declared) && declared > maxBytes) throw new PolymathTooLargeError();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      total += value.byteLength;
      if (total > maxBytes) throw new PolymathTooLargeError();
      chunks.push(value);
    }
  } catch (error) {
    abort();
    try {
      await reader.cancel(error);
    } catch {
      // already closed by the abort
    }
    throw error;
  }
  return JSON.parse(decodeChunks(chunks));
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
        const { completion, infos } = await readJsonCapped(result, () => controller.abort());
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
  const query = boundQuery(url.searchParams.get("query") || "What are Web Intents?");

  // Escaped once, then used for both the <title> and the input value.
  const displayQuery = escapeHtml(removePlus(query));
  // Handle every upstream outcome inside the stream: an unhandled rejection in
  // whatwg-flora leaves its ReadableStream open indefinitely.
  // Built from a literal endpoint and searchParams.set, never interpolated:
  // the visitor's query stays one parameter and no request header can pick
  // the scheme or the host (lib/ask-paul-request.js).
  const answer = fetchPolymathAnswer(polymathUrl(query)).catch(error => {
    console.error('Ask Paul upstream failed:', error);
    const message = error instanceof PolymathTooLargeError
      ? 'That answer was too large to display. Please ask something narrower.'
      : error instanceof Error && error.message === 'Polymath timed out'
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
