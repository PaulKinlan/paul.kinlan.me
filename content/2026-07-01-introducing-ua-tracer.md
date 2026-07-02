---
date: 2026-07-01T10:00:00Z
slug: ua-tracer
summary:
  ua-tracer is a tiny instrument that shows you exactly what a user agent fetches,
  follows, and executes when it loads a page. I built it because we have almost
  no visibility into what bots and AI agents actually see when they crawl the web.
tags:
- bots
- crawling
- deno
- web platform
- analytics
- ai
- agents
title: "ua-tracer: what does a user agent actually do?"
---

The work that led to this is a research project that I will soon publish on [aifoc.us](https://aifoc.us), where I am analysing if the presence of a URL in a prompt influences the output based on the latent "knowledge" about that URL in the model. While doing this project I needed to test a heap of URLs and see if their data was in the model or not and I hit on a heap of problems. The more time I spent in that data, the more I realised I couldn't answer a basic question about a large share of the traffic fetching those URLs: when one of the many agents, indexers, and scrapers loads a page, what does it actually do? Download the HTML and stop? Parse the CSS? Follow the font linked from inside that CSS? Can they run the JavaScript, or just fetch the `.js` file and move on?

So I built [ua-tracer](https://uatracer.com) to answer it, and it's a tool that I think will be useful for many web developers trying to understand what any browser or bot does when it accesses your site.

![ua-tracer homepage showing a freshly minted trace](/images/ua-tracer-homepage.png)

Click through any row in that list and you land on the trace detail, a request-by-request account of what that one user agent did:

![A real trace (pvvoocMX) showing what a visiting agent fetched and executed](/images/ua-tracer-trace-pvvoocMX.png)

## How it works

Every time a user agent loads `https://uatracer.com/`, the site mints a unique **trace id** *and* a per-request secret, and renders a page whose every asset (stylesheet, script, images, font, manifest) carries both in its path. The secret is private to that one page load, so only the agent that received the HTML can fetch the probe assets: no guessing, no replay by anyone else.

```
/r/{id}/{secret}/style.css     the real stylesheet
/r/{id}/{secret}/main.js       the real script
/r/{id}/{secret}/photo.png     a real PNG
/r/{id}/{secret}/font.woff2    a real woff2 font
```

Because the id is unique per page load, **every** later asset request can be tied back to the exact homepage hit and the user agent that made it. That much any server log can do. The interesting signal comes from what the assets *themselves* reference (paths below drop the `{secret}` segment for readability):

| Probe | Referenced from | Hitting it proves… |
| --- | --- | --- |
| `/r/{id}/css-bg.png` | a `background-image:` inside `style.css` | the UA parsed the CSS and followed a URL inside it |
| `/r/{id}/css-font.woff2` | an `@font-face { src: }` inside `style.css` | the UA resolved a CSS font source |
| `/r/{id}/manifest-icon.png` | `icons[].src` inside `manifest.json` | the UA **parsed the manifest** and followed an icon |
| `/r/{id}/js-ran.gif` | `new Image().src = …` in `main.js`, at runtime | the UA **executed classic JS** |
| `/r/{id}/module-ran.gif` | a runtime beacon in an ES module | the UA **executed an ES module** |
| `/r/{id}/timing` | a `POST` of `performance.getEntriesByType('resource')` | a real engine ran and produced a client-side waterfall |

A plain downloader (think `curl`) fetches the HTML and stops. A CSS-aware fetcher additionally hits `css-bg.png` and `css-font.woff2`. A UA that parses the manifest reaches `manifest-icon.png`. Social unfurlers (Twitterbot, facebookexternalhit, Discordbot) fetch the social-card image. **Only** a user agent that runs JavaScript will ever touch `js-ran.gif` or post to `/timing`. That contrast is the whole point.

## What a trace looks like

![A trace detail page showing what a single user agent fetched and executed](/images/ua-tracer-trace-detail.png)

Open any trace and you get a request-by-request account of how far the agent went: which asset types it fetched, whether it followed the CSS-linked resources, whether it executed JavaScript, and the client-side resource-timing waterfall it posted back if it did.

This particular trace is synthetic: I generated it by pointing a made-up user agent at the site and walking it through the assets by hand:

```sh
curl -A "Mozilla/5.0 (compatible; DemoBot/1.0; +https://example.com)" https://uatracer.com/
# then fetch the trace-scoped assets it references:
curl https://uatracer.com/r/{id}/{secret}/style.css
curl https://uatracer.com/r/{id}/{secret}/js-ran.gif   # the JS-execution beacon
```

That's a useful reproducible baseline. DemoBot does no real rendering, yet because it fetched `js-ran.gif` the trace records "EXECUTED classic JS". That flag really means "*something* hit the JS beacon endpoint." ua-tracer can tell you the beacon was hit, but not whether a real engine ran the script that fired it. For a genuine engine, look for the resource-timing POST to `/timing`, which only a real browser stack produces. Keep that distinction in mind when reading any trace.

The trace detail is intentionally public: share `/trace/{id}` as a link and anyone can read the result, which makes it easy to pass a finding along ("look, this agent doesn't run JS").

## Some early analysis on what the bots actually do

This site hasn't been live that long so it's not got heaps of data yet (hence this post to try and raise some awareness), but I've got some insights that I think are interesting.

**The AI crawlers I observed don't execute JavaScript.** ClaudeBot, GPTBot, and ChatGPT-User fetched the page and its assets (some parsed the CSS; see below), but none hit the JS-execution beacon or posted a resource-timing payload. The sample is small, and crawlers like Googlebot are documented to render JavaScript in a second pass that I haven't caught here, so this isn't a universal claim. But for the agents most often described as reading the web for AI, the traces so far show downloaders, not engines. If your page renders client-side, it's worth assuming these agents see the pre-JS HTML until you check. ua-tracer is how you check. ([browse all bot traces](https://uatracer.com/traces?ua=bot))

**ClaudeBot and GPTBot differ in the CSS.** Both fetch the full set of directly-referenced assets: stylesheet, script, images, font, favicon, manifest, preload, prefetch, even the iframe. GPTBot then parses the stylesheet and follows the `background-image`, the `@font-face` source, and the `@import` inside it. ClaudeBot fetches `style.css` as a file and stops; it never reaches the resources linked from inside it. Neither parses the web manifest's icon list. ([ClaudeBot traces](https://uatracer.com/traces?ua=ClaudeBot) · [GPTBot traces](https://uatracer.com/traces?ua=GPTBot))

**Some bots announce their intent; most don't.** `DomainArrivalsBot/0.1` identifies itself as either `(+homepage-extract; research)` or `(+homepage-only; research)`, telling you in the UA string whether it takes the whole page or just the root. That honesty is rare. Most agents either masquerade as browsers with full Mozilla/AppleWebKit strings or skip the courtesy entirely: `okhttp/5.3.0` and `Go-http-client/1.1` between them account for dozens of visits, and both are raw HTTP libraries with no name.

This is the data I wanted for aifoc.us and couldn't get from any log. We can measure page views to the nearest second; we still can't tell whether the thing reading the page ran the code on it.

## Try it

The site is at [uatracer.com](https://uatracer.com). Open it in a browser to mint your own trace, or point a crawler at it:

```sh
curl -A "KinlanBot/1.0" https://uatracer.com/
```

Each load is its own trace. Browse recent activity on the [/traces](https://uatracer.com/traces) page, filter by user agent, and tick **"JS ran"** to see only the agents that actually execute. The [source is on GitHub](https://github.com/PaulKinlan/ua-tracer): a single Deno file and a Deno KV database, nothing more.
