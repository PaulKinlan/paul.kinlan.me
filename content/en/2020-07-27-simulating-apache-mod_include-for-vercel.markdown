---
slug: simulating-apache-mod_include-for-vercel
date: 2020-07-27T18:27:40.770Z
title: Simulating Apache mod_include for Vercel
link: ''
tags: [mod_include, vercel]
---

I run a static site, it's built with Hugo and hosted on the edge with Vercel. Sometimes, I just want to include a small piece of server-side logic (Copyright notice anyone?) without having to spin up a complex node server or api endpoints. Sometimes I want to be able to drop a small piece of dynamic content in one single page on my static site.

That's what I loved about Apache mod_include. `mod_include` let's you drop a specially formatted HTML comment in to your HTML template and Apache server would then 'include' the output of the command in your outputted HTML. e.g,`&lt;!--#include file="test.txt" --&gt;` which will include the content of a file where the include is and&nbsp; `&lt;!--#include virtual="/api/time.js" --&gt;` would call a function and return the output in place of the include.

But how do you get it working for sites hosted with Vercel?

I wrote a little [function](https://github.com/PaulKinlan/vercel-ssi) ([demo](https://ssi.vercel.app/)  - note you can see a file included and also a function call) that you can use to simulate `mod_include`.

Vercel has a request router that is configured to pass *all* requests through to the [ssi.js](https://github.com/PaulKinlan/vercel-ssi/blob/master/api/ssi.js) function which in turn will parse the requested html file looking for the includes to replace.

The `file` command is relatively straight forward using simple `fs` functions, the `virtual` command is more interesting because I didn't want to spin up a `vm` in node to execute a function so instead the handler uses `http-fetch` to call the file in /api directory. /api/ is the new /cgi-bin/...

You will want to make sure caching is properly enabled because you really don't want to have to execute functions for every single page-view, you still want to get your 'static' pages cached on the edge.

I'm unsure if you should use this in production, I would love Vercel to offer something similar to cloudflare's workers and [HTMLRewriter](https://developers.cloudflare.com/workers/reference/apis/html-rewriter/) that allow you to manipulate static files (or function response) before it's sent to the client.

