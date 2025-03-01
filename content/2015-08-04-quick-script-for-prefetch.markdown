---
date: 2015-08-04
description: I love (actual love) the `window.performance` API. Use it to help speed
  up your site.
image_header: /images/dns-prefetch.jpg
slug: quick-script-for-prefetch
summary: I'm really excited about the power of the `window.performance` API for web
  optimization.  It provides valuable insights into network activity, helping identify
  areas for improvement. I've been focusing on site speed, and DNS prefetching is
  one easy win. By including `<link rel='dns-prefetch'>`, we can resolve domain names
  early, potentially reducing connection latency. To simplify finding domains for
  prefetching, I created a script that uses `window.performance` to gather a list
  of domains contacted during page load. You can try it out using the provided bookmarklet.  The
  `window.performance` API opens up many opportunities for automating performance
  enhancements.
tags:
- performance
- web performance
- dns prefetch
- window.performance
- optimization
- javascript
- bookmarklet
title: Working out what DNS to prefetch

---
 
I won't lie. I love (actual love) the `window.performance` API.  It gives you so much information
about what is happenging on the network for the user that it opens up a huge range of 
possibilities.

I have been working on speeding up my site, and one simple thing to do is to add in a `<link rel='dns-prefetch' href='https://somedomain.com'>`
and it simply tells the browser to start trying to resolve the domain name ahead of when the browser will try and 
fetch the resource.  In theory this should reduce the latency for the intial network connection to those domains.

It can be a pain to get that list of domains for prefetching so I wrote this simple script that uses
`window.performance` to get a list of all the requests made by the page and the domains that they are being
made to.

<script src="https://gist.github.com/PaulKinlan/15d13da60c5402e07387.js"></script>

Drag this bookmark to your address bar: <a href="javascript: (function () {     var jsCode = document.createElement('script');     jsCode.setAttribute('src', 'https://cdn.rawgit.com/PaulKinlan/15d13da60c5402e07387/raw/48ff1fb0c4654711dd0717332c5f97baf381576d/prefetchbuilder.js');                    document.body.appendChild(jsCode);  }());">Generate DNS prefetch</a>

The `window.performance` API opens a lot of possibilities for automating the possible performance improvements
you can make to your site.