---
date: 2026-07-01T10:00:00Z
slug: introducing-ua-tracer
summary:
  ua-tracer is a tiny instrument that shows you exactly what a user agent fetches,
  follows, and executes when it loads a page. I built it because we have almost
  no visibility into what bots and AI agents actually see when they crawl the web.
tags:
- bots
- crawling
- deno
- deno kv
- web platform
- analytics
- ai
- agents
title: Introducing ua-tracer — what does a user agent actually do?
---

A couple of years ago I [wrote about wanting to know which user agents were hitting my site](/user-agents-hitting-my-site/). I could see *who* was knocking on the door, but not *what they did once they were inside*. Did they download the CSS? Did they follow the font linked from inside that CSS? Did they actually run the JavaScript — or just fetch the `.js` file and stop?

That second question matters more than ever now. The web is being crawled by a long and growing tail of AI agents — ClaudeBot, GPTBot, Googlebot, Bytespider, Applebot, ChatGPT-User, and dozens more — and we have **almost zero visibility** into what they actually see. A server log tells you a request happened. It tells you nothing about whether the agent parsed the page, rendered it, or executed anything.

So I built [ua-tracer](https://uatracer.com) to answer it.

![ua-tracer homepage showing a freshly minted trace](/images/ua-tracer-homepage.png)

Click through any row in that list and you land on the trace detail — a request-by-request account of what that one user agent did:

![A real trace (pvvoocMX) showing what a visiting agent fetched and executed](/images/ua-tracer-trace-pvvoocMX.png)

## How it works

Every time a user agent loads `https://uatracer.com/`, the site mints a unique **trace id** and renders a page whose every asset — stylesheet, script, images, font, manifest — carries that id in its path:

```
/r/{id}/style.css     the real stylesheet
/r/{id}/main.js       the real script
/r/{id}/photo.png     a real PNG
/r/{id}/font.woff2    a real woff2 font
```

Because the id is unique per page load, **every** later asset request can be tied back to the exact homepage hit and the user agent that made it. That much any server log can do. The interesting signal comes from what the assets *themselves* reference:

| Probe | Referenced from | Hitting it proves… |
| --- | --- | --- |
| `/r/{id}/css-bg.png` | a `background-image:` inside `style.css` | the UA parsed the CSS and followed a URL inside it |
| `/r/{id}/css-font.woff2` | an `@font-face { src: }` inside `style.css` | the UA resolved a CSS font source |
| `/r/{id}/manifest-icon.png` | `icons[].src` inside `manifest.json` | the UA **parsed the manifest** and followed an icon |
| `/r/{id}/js-ran.gif` | `new Image().src = …` in `main.js`, at runtime | the UA **executed classic JS** |
| `/r/{id}/module-ran.gif` | a runtime beacon in an ES module | the UA **executed an ES module** |
| `/r/{id}/timing` | a `POST` of `performance.getEntriesByType('resource')` | a real engine ran and produced a client-side waterfall |

A plain downloader (think `curl`) fetches the HTML and stops. A CSS-aware fetcher additionally hits `css-bg.png` and `css-font.woff2`. A UA that parses the manifest reaches `manifest-icon.png`. Social unfurlers (Twitterbot, facebookexternalhit, Discordbot) fetch the `og:image`. **Only** a user agent that runs JavaScript will ever touch `js-ran.gif` or post to `/timing`. That contrast is the whole point.

## What a trace looks like

![A trace detail page showing what a single user agent fetched and executed](/images/ua-tracer-trace-detail.png)

Open any trace and you get a request-by-request account of how far the agent went: which asset types it fetched, whether it followed the CSS-linked resources, whether it executed JavaScript, and — if it did — the client-side resource-timing waterfall it posted back.

This particular trace is synthetic — I generated it by pointing a made-up user agent at the site and walking it through the assets by hand:

```sh
curl -A "Mozilla/5.0 (compatible; DemoBot/1.0; +https://example.com)" https://uatracer.com/
# then fetch the trace-scoped assets it references:
curl https://uatracer.com/r/{id}/{secret}/style.css
curl https://uatracer.com/r/{id}/{secret}/js-ran.gif   # the JS-execution beacon
```

That's a useful reproducible baseline. DemoBot does no real rendering, yet because it fetched `js-ran.gif` the trace records "EXECUTED classic JS". That flag really means "*something* hit the JS beacon endpoint" — ua-tracer can tell you the beacon was hit, but not whether a real engine ran the script that fired it. For a genuine engine, look for the resource-timing POST to `/timing`, which only a real browser stack produces. Keep that distinction in mind when reading any trace.

The trace detail is intentionally public: share `/trace/{id}` as a link and anyone can read the result, which makes it easy to pass a finding along ("look, this agent doesn't run JS").

## What it's revealed so far

Even with a few weeks of data, three patterns show up consistently:

- **Most AI crawlers don't run JavaScript.** They fetch the HTML, sometimes the CSS, and stop. If your content is rendered client-side, they don't see it — and the rare crawler that *does* fetch the JS file usually doesn't execute it.
- **Many don't even parse the CSS.** They fetch `style.css` as a file but never follow the `background-image` or `@font-face` inside it.
- **Social unfurlers are scrupulous about `og:image`.** Twitterbot, Discordbot and friends reliably fetch exactly the Open Graph image and nothing else.

This is the kind of thing we should be able to see as easily as we see a page view count. Right now, almost nobody can.

## Why I built it

I spent a long time at Google thinking about the web platform from the developer's side. The thing I kept noticing is that the conversation about "the web" almost always assumes a human in a browser. But a large and growing fraction of web traffic is machines reading pages, and those machines behave nothing like browsers. They don't render. They don't execute. They strip the page down to whatever they can extract from the HTML and move on.

If you run a site, a slice of your audience is reading a version of your pages you've never looked at — the version a machine sees when it skips the rendering, the CSS, and the script. ua-tracer is the instrument for reading that version back, request by request, and I haven't found another tool that does it.

## Try it

The site is at [uatracer.com](https://uatracer.com). Open it in a browser to mint your own trace, or point a crawler at it:

```sh
curl -A "ClaudeBot/1.0" https://uatracer.com/
```

Each load is its own trace. Browse recent activity on the [/traces](https://uatracer.com/traces) page, filter by user agent, and tick **"JS ran"** to see only the agents that actually execute. The [source is on GitHub](https://github.com/PaulKinlan/ua-tracer) — it's a single Deno file and a Deno KV database, nothing more.
