---
date: 2026-07-08T10:00:00Z
draft: true
slug: replace-dont-diff
summary:
  I have been playing with Declarative Partial Updates in Chrome, a small new
  primitive that lets the server mark a region of a page and later stream a
  template that replaces it. It turns out a lot of the things we reach for a
  framework to do, live regions, streaming SSR, islands, even an HTMX-style
  experience, fall out of it with little or no client-side JavaScript. So I built
  a pile of demos and started wondering out loud whether we still need the virtual
  DOM.
tags:
- web platform
- chrome
- html
- streaming
- htmx
- view transitions
title: Replace, don't diff
---

<link rel="stylesheet" href="/dpu/dpu-embed.css">
<script>
  // Set these to the deployed demo hosts to turn the embeds below into LIVE iframes
  // on browsers that support the API. Leave empty and every demo uses its recorded
  // video. (Deploy targets: the two public repos linked at the end of the post.)
  window.DPU_DEMO_BASE = "https://declarative-partial-updates.paulkinlan-ea.deno.net";  // serves /01 .. /09 (the leaderboard is /09)
</script>
<script src="/dpu/dpu-embed.js" defer></script>

I built a live leaderboard the other week. Six teams, scores ticking up and down every second, the rows reordering as the standings change, the bars sliding to their new widths, the whole thing cross-fading as it reshuffles. Then I opened DevTools to check something and remembered that there is no client-side JavaScript in it. None. The server prints the list as HTML, keeps the connection open, and once a second it prints the list again. The browser swaps the new one in. That is the entire program.

<figure class="dpu-demo" data-demo-name="replace, don't diff" data-demo-path="/09">
  <video src="/dpu/replace-dont-diff.mp4" poster="/dpu/replace-dont-diff.jpg" autoplay muted loop playsinline preload="metadata" width="760"></video>
  <figcaption>A live, sorted, animated leaderboard. No virtual DOM, no diffing, no framework, no client JS. <a href="https://github.com/PaulKinlan/declarative-partial-updates-experiments/tree/main/examples/09-replace-dont-diff">Source</a>.</figcaption>
</figure>

I have been playing with [Declarative Partial Updates](https://developer.chrome.com/blog/declarative-partial-updates) in Chrome and I have not been this excited about a platform primitive in a while. It is a small idea and the blast radius is large.

Here is the small idea. You mark a region of the page, then later you send a `<template>` that names that region, and the browser puts the template's content there. You can mark a single point with a processing instruction, `<?marker name="feed">`, or a range with `<?start name="feed">` and `<?end>`. Then anywhere later in the stream, `<template for="feed">...</template>` lands its contents at that spot, either replacing what was between the markers or appending to it. That is the whole vocabulary. The reason it matters is what the "later" buys you: the response does not have to be finished, or even in order, for the page to keep filling in.

The smallest possible example is a placeholder that gets replaced exactly once. The server sends a region that says "loading", holds the connection while it does some slow work, then flushes the template with the real content. The region swaps and the request ends. That is the atom that everything below is built from.

<figure class="dpu-demo" data-demo-name="basic marker" data-demo-path="/01">
  <video src="/dpu/01-basic-marker.mp4" poster="/dpu/01-basic-marker.jpg" autoplay muted loop playsinline preload="metadata" width="760"></video>
  <figcaption>The atomic case: a marked region, replaced once when the real content is ready.</figcaption>
</figure>

The most literal version of the always-on variant is a clock. The server sends the page, then every second it flushes one more template with the new time, and the region updates in place. It is a long-lived response that never closes. There is no `setInterval`, no fetch, no script tag.

<figure class="dpu-demo" data-demo-name="streaming clock" data-demo-path="/07">
  <video src="/dpu/07-streaming-clock.mp4" poster="/dpu/07-streaming-clock.jpg" autoplay muted loop playsinline preload="metadata" width="760"></video>
  <figcaption>A clock that ticks with zero client-side JavaScript. The server just keeps flushing templates.</figcaption>
</figure>

Once you have seen the clock, a lot of things you normally build with a framework start to look like the same trick with different content. Take the skeleton-screen pattern, where you show grey placeholder shapes in the shape of the real content so the layout does not jump around when the data arrives. Normally that is a loading state you manage in JavaScript. Here the server just sends the skeleton first, keeps going, and streams the real card into the same region when the backend is ready. No layout shift, because the placeholder was already the right shape, and no client code, because the swap is the platform's job.

<figure class="dpu-demo" data-demo-name="skeleton card" data-demo-path="/08">
  <video src="/dpu/08-skeleton-card.mp4" poster="/dpu/08-skeleton-card.jpg" autoplay muted loop playsinline preload="metadata" width="760"></video>
  <figcaption>Placeholder shapes that match the final layout, replaced in place when the data resolves.</figcaption>
</figure>

The same move gives you islands. If a page has several independent regions that each depend on a different slow backend, you can mark all of them up front, fire the requests in parallel on the server, and let each island stream into place the moment its data is ready. The fast ones do not wait for the slow ones. This is islands architecture, but the runtime doing the hydration is the browser's HTML parser rather than a framework you shipped to the client.

<figure class="dpu-demo" data-demo-name="islands" data-demo-path="/05">
  <video src="/dpu/05-islands.mp4" poster="/dpu/05-islands.jpg" autoplay muted loop playsinline preload="metadata" width="760"></video>
  <figcaption>Independent islands, each filling in as its own backend resolves.</figcaption>
</figure>

Push that all the way and you get proper streaming server-side rendering. One HTTP response renders the whole document. The shell flushes immediately so the user sees structure, and then every section fills in out of order as its data comes back. This is the thing people reach for React Server Components or a streaming framework to get, and it is a page that the server prints.

<figure class="dpu-demo" data-demo-name="streaming SSR" data-demo-path="/06">
  <video src="/dpu/06-ssr.mp4" poster="/dpu/06-ssr.jpg" autoplay muted loop playsinline preload="metadata" width="760"></video>
  <figcaption>A whole page streamed in one response, sections landing out of order.</figcaption>
</figure>

There is a version of this that is almost the meme. The pitch for HTMX has always been that you put an attribute on an element and it fetches some HTML and swaps it into the page, and you get most of what a single-page app gives you without writing the app. With Declarative Partial Updates the swap is already built in, so the client side of that shrinks to almost nothing: a tiny handler that reads a `data-get` attribute, fetches the fragment, and hands the stream to the region. Add the attribute to any element and it works. I would not quite claim it is one line, but it is one attribute per element and a client small enough to read in a single screen.

<figure class="dpu-demo" data-demo-name="HTMX emulation" data-demo-path="/03">
  <video src="/dpu/03-htmx-emulation.mp4" poster="/dpu/03-htmx-emulation.jpg" autoplay muted loop playsinline preload="metadata" width="760"></video>
  <figcaption>HTMX-style partial updates: one attribute per element, backed by a tiny client.</figcaption>
</figure>

I have been leaning on the "no JavaScript" line because that is the surprising part, but the API has a second half that is all JavaScript, and it is just as useful. There is a renewed set of insertion methods, `setHTML`, `appendHTML`, `prependHTML`, `beforeHTML`, `afterHTML`, `replaceWithHTML`, and streaming versions that take a `ReadableStream`. So when you do want to drive things from script, you can pipe a chunked fetch straight into an element and watch it fill in as the bytes arrive, without building up a string and setting `innerHTML` at the end.

<figure class="dpu-demo" data-demo-name="streaming fetch" data-demo-path="/02">
  <video src="/dpu/02-streaming-fetch.mp4" poster="/dpu/02-streaming-fetch.jpg" autoplay muted loop playsinline preload="metadata" width="760"></video>
  <figcaption>Streaming a fetch response directly into the DOM as it arrives.</figcaption>
</figure>

Which brings me back to the leaderboard, and the question I cannot stop turning over. The virtual DOM exists to solve a specific problem: you have new state, you have the old DOM, and re-rendering everything from scratch is expensive and destroys focus and scroll and selection, so you keep a lightweight copy of the tree, diff the new render against it, and patch only the parts that changed. That machinery is the reason a lot of us pay a framework tax on every page.

The leaderboard does not diff anything. Every second the server renders the entire list, freshly sorted, and streams it as one template that replaces the whole region. No previous state is consulted. No difference is computed. And it still animates cleanly, because I put a stable `view-transition-name` on each row, so when the region is replaced the browser matches the old rows to the new ones and tweens them itself. The reordering animation, the thing that feels the most framework-y, is a CSS property and a whole-region replace.

I am not going to tell you the virtual DOM is dead. There are real UIs, big editable ones with lots of local state and fine-grained interactivity, where diffing earns its keep, and this does not touch client-side state management at all. But a very large class of the things we build, the dashboards and feeds and lists and detail pages that are mostly a function of server data, do not obviously need it once the platform can replace a named region from a stream. "Re-render the whole thing and replace it" used to be the naive approach you were supposed to grow out of. It is starting to look like the answer again.

The honest caveats: this is early. It is in Chrome 148 and up behind `chrome://flags/#enable-experimental-web-platform-features`, the shape can still change, and no other browser has it yet. But it degrades in a way I really like. Without the API, the first render still lands, so the clock shows a time, the leaderboard shows a board, the page shows its content. You lose the live updates, not the page. There are polyfills too, `template-for-polyfill` and `html-setters-polyfill`, if you want to try the patterns on browsers that do not have it natively.

If you want the longer version of all this, I have been talking about it for a while now: [at the Chrome DevRel session in Berlin](TODO-berlin-link), [at Google I/O Connect in Bengaluru](TODO-india-link), on the [main Google I/O stage](TODO-io-link), and it is written up in [What's new in Chrome](TODO-wnic-link). The [explainer lives in WICG](https://github.com/WICG/declarative-partial-updates) and Barry Pollard's [Chrome blog post](https://developer.chrome.com/blog/declarative-partial-updates) is the best worked introduction. All the demos above are in [one repo](https://github.com/PaulKinlan/declarative-partial-updates-experiments) if you want to pull them apart.

I have spent most of my career watching the platform slowly absorb the things frameworks did first. This is the first time in a while that the absorbed thing feels like it changes the shape of what I would reach for on a new project, rather than just saving me a dependency.
