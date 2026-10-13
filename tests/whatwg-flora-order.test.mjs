// The order contract of lib/whatwg-flora.ts - the template-literal HTML streamer that
// api/ask-paul.ts returns as its Response body (api/ask-paul.ts:57 builds it, :95 hands the
// ReadableStream to `new Response`). Chunk order here IS the byte order of a response body.
//
// Why this test exists: the factory's nightly perf-review flags the serial
// `await enqueueItem(...)` chain in that module as `sequential-await-waterfall` (finding
// 75c0bdf43a67a8694ec4e0b7376973ac4c38467ad9ce2d3e715b2507d26b0879). It was confirmed
// BY DESIGN in paul-kinlan-me-dpr and suppressed in PaulKinlan/agents
// findings/suppressions.yaml. Suppressing it removes the page that would have shown a
// reordering regression, so this test is what guards the contract the suppression claims:
// a future "fix" that resolves values concurrently and enqueues them as they settle must
// fail here instead of quietly reordering the HTML Paul's site serves.
//
// Fast tier: no browser, no network, no shared state. Each test builds its own template
// and reads only the stream it created, so the file is order-independent.
import test from 'node:test';
import assert from 'node:assert/strict';

import html from '../lib/whatwg-flora.ts';

const decoder = new TextDecoder();
const collect = async (stream) => {
  const reader = stream.getReader();
  let out = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    out += typeof value === 'string' ? value : decoder.decode(value, { stream: true });
  }
  return out;
};

test('a value that resolves later is still emitted in template order', async () => {
  const slow = new Promise((resolve) => setTimeout(() => resolve('<b>slow</b>'), 25));
  const out = await collect(await html`<p>${slow}</p><p>${Promise.resolve('<i>fast</i>')}</p>`);
  assert.equal(out, '<p><b>slow</b></p><p><i>fast</i></p>',
    'concurrent resolution would put the fast value first; template order is the contract');
});

test('arrays, nested streams, skipped falsy values and the tail string keep exact order', async () => {
  const nested = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('<span>n1</span>'));
      controller.enqueue(new TextEncoder().encode('<span>n2</span>'));
      controller.close();
    }
  });
  const deps = [new Promise((resolve) => setTimeout(() => resolve('<li>a</li>'), 25)), Promise.resolve('<li>b</li>')];
  const out = await collect(await html`<div>${deps}${nested}${null}${undefined}${0}${'<em>tail</em>'}</div>`);
  assert.equal(out, '<div><li>a</li><li>b</li><span>n1</span><span>n2</span><em>tail</em></div>');
});

test('a stream that is still being produced is fully drained before the next template chunk', async () => {
  const slow = new ReadableStream({
    async start(controller) {
      for (const chunk of ['<u>s1</u>', '<u>s2</u>']) {
        await new Promise((resolve) => setTimeout(resolve, 10));
        controller.enqueue(new TextEncoder().encode(chunk));
      }
      controller.close();
    }
  });
  const out = await collect(await html`<section>${slow}<hr>${Promise.resolve('<p>after</p>')}</section>`);
  assert.equal(out, '<section><u>s1</u><u>s2</u><hr><p>after</p></section>',
    'the nested reader must be drained in place, not interleaved with later chunks');
});
