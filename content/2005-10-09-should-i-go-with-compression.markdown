---
date: 2005-10-09
published: true
slug: should-i-go-with-compression
summary: I'm considering compressing Yahoo Search results from my proxy, as suggested
  in a Yahoo Developer Blog post.  I'm unsure if it's easy, worthwhile, and where
  to implement it (client-side or proxy-side).  I'll need to handle browsers without
  compression support.  Any advice?
tags:
- compression
- proxy
- Yahoo Search
- performance
- web development
title: Should I go with compression

---
I am debating if I should go with compression of the Yahoo Search Results from my proxy following this post [[Yahoo Developer Blog Entry](http://developer.yahoo.net/blog/archives/2005/10/getting_less_fr.html#comments)].  I am trying to work out if it will be A) easy, B) worth it and C) Where to put it.<p />I could compress the results back to the client or compress the results to the proxy and then decompress the results to the client.  Either way I will have to code for some fallback support, because some people who use my App might not have compression support in their browser and thus my proxy will have to detect that.<p />Does anyone have any thoughts?<p />

