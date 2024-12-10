---
date: 2020-07-27 18:27:40.770000+00:00
link: ''
slug: simulating-apache-mod_include-for-vercel
summary: For my Hugo static site hosted on Vercel, I wanted a simple way to include
  server-side logic, like a copyright notice, without setting up a full backend.  I
  created a function that mimics Apache's `mod_include` to inject dynamic content.
  It rewrites HTML requests through a handler that parses files for `<!--#include
  ... -->` directives. The `file` command injects file content, while the `virtual`
  command fetches content from the `/api` directory (like a modern `/cgi-bin/`). Caching
  is crucial for performance.  Check out the [demo](https://ssi.vercel.app/) and [code](https://github.com/PaulKinlan/vercel-ssi).  A
  more robust solution like Cloudflare Workers' HTMLRewriter would be ideal, but this
  works for simple use cases.
tags:
- vercel
- hugo
- mod_include
- server-side includes
- SSI
- static site generation
- edge functions
- dynamic content
- cloudflare workers
- htmlrewriter
title: Simulating Apache mod_include for Vercel

---

I run a static site, it's built with Hugo and hosted on the edge with Vercel. Sometimes, I just want to include a small piece of server-side logic (Copyright notice anyone?) without having to spin up a complex node server or api endpoints. Sometimes I want to be able to drop a small piece of dynamic content in one single page on my static site.

That's what I loved about Apache mod_include. `mod_include` let's you drop a specially formatted HTML comment in to your HTML template and Apache server would then 'include' the output of the command in your outputted HTML. e.g,`<!--#include file="test.txt" -->` which will include the content of a file where the include is and&nbsp; `<!--#include virtual="/api/time.js" -->` would call a function and return the output in place of the include.

But how do you get it working for sites hosted with Vercel?

I wrote a little [function](https://github.com/PaulKinlan/vercel-ssi) ([demo](https://ssi.vercel.app/) - note you can see a file included and also a function call) that you can use to simulate `mod_include`.

Vercel has a [request router that is configured](https://github.com/PaulKinlan/vercel-ssi/blob/master/vercel.json#L3) to rewrite *all* requests for html pages so that they pass through the [ssi.js](https://github.com/PaulKinlan/vercel-ssi/blob/master/api/ssi.js) function which in turn will parse the requested html file looking for the includes to replace.

The implementation of `file` command ([demo](https://ssi.vercel.app/file.html)) is relatively straight forward using simple `fs` functions to inject content into a page. The `virtual` command ([demo](https://ssi.vercel.app/virtual.html)) is more interesting because I didn't want to spin up a `vm` in node to execute a function so instead the handler uses `http-fetch` to call the file in /api directory. /api/ is the new /cgi-bin/ - I'm certainly open to suggestions if `vm` is a better solution, because the `node-fetch` certainly adds some extra latency.

You will want to make sure caching is properly enabled because you really don't want to have to execute functions for every single page-view, you still want to get your 'static' pages cached on the edge.

I'm unsure if you should use this in production, I would love Vercel to offer something similar to cloudflare's workers and [HTMLRewriter](https://developers.cloudflare.com/workers/reference/apis/html-rewriter/) that allow you to manipulate static files (or function response) before it's sent to the client.
