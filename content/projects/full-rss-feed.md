---
slug: full-rss-feed
date: 2024-12-21T23:07:00
title: Full RSS feed
description: Make full content rss feeds when the author only provides a summary.
---

I love RSS feeds (and ATOM too (and JSONFeed)) but one thing that frustrates me is when a feed doesn\'t include all of the content.

[https://full-rss.deno.dev](https://full-rss.deno.dev "https://full-rss.deno.dev") was created to partially solve this. If there is a feed that you really wish was full-content and isn\'t then you can replace that feed with [https://full-rss.deno.dev/?url=https://developer.chrome.com/static/blog/feed.xml](https://full-rss.deno.dev/?url=https://developer.chrome.com/static/blog/feed.xml "https://full-rss.deno.dev/?url=https://developer.chrome.com/static/blog/feed.xml") and it will get the 10 most recent posts, scrape the linked page and replace the content with a stripped down version of the full HTML page.

There are some caveats though:

1.  if the feed is an ATOM feed it will accept it but the output will be RSS.

2.  if the linked page uses JS to render content, it will not be included. I didn\'t want to spin up a puppeteer instance

3.  if a post is updated after the entry has been fetched and parsed by a user it will not be fetched again (I need to work something out here)

Source: [https://github.com/PaulKinlan/full-rss](https://github.com/PaulKinlan/full-rss "https://github.com/PaulKinlan/full-rss")

If you are interested in how it was built, here is a rough outline. It uses Deno and Deno Deploy. On the first fetch of a post the system hasn\'t seen before it will fetch the html, convert it to markdown and then gzip compress it so it can be stored it in Deno KV and not breach the 16kb limit. Then for each entry it will pull the content from the Deno KV store, decompress it and render to HTML.
