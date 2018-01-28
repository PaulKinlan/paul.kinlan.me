---
slug: we-need-a-DOM-in-workers
date: 2018-01-28T13:20:31+01:00
title: "We need DOM APIs in Workers"
description: "If we are to build HTML in Workers then we need some 'DOM' in them."
---

I need DOM APIs in Workers for different reasons than most people. Many people
would like the DOM in Workers to make updating the DOM not block the main
thread. I need it so I can efficiently parser and manipulate XML data _and_ to
output HTML, and I suspect many other people do.

In a [recent project](https://webgdedeck.com/), I wanted to share as much logic
as possible between the server, service worker and the client. The project is
essentially a simple RSS feed reader, it takes RSS feeds, parses the data and
merges them in to a nice set of columns (much like TweetDeck), and also a single
merged list.

The project works with the RSS feed data in three places:

1. On client &mdash; When the page loads for the very first time, it AJAX
   requests the RSS feed data from a proxy service that I run, and it then
   caches the raw data in the `window.caches` object for later use before
   rendering it in the client.
2. In the service worker &mdash; 
   1. When the main page loads and the service worker installed, the service
      worker loads the shell and merges in the RSS feed data so that no AJAX
      requests need to be made on 2nd load - thus keeping the Time to
      interactive time high.
   1. When a request to the proxy is made from the client, the service worker
      when installed, will intercept the request and serve the data from the
      `window.caches`. This allows the site to work offline.
3. On the server &mdash; When the page is requested, we can take some of the
   data that is cached on the server 

In each instance there is a simple process that takes the RSS data and maps into
a JSON object that I can then apply to a template to generate HTML. Keeping one
template and unified logic across the client, server and service worker was a
critical requirement. Maintaining one set of templates means that the input data
has to be consistent across all places that will render data.

Because I run a proxy server, there is a simple solution: just transform all the
RSS feeds into a consistent JSON form on the server. I discounted this because:

* data transforms can be intensive to process.
* data transforms can be done on the client to reduce the shared burden on the
  service
* most importantly, if an RSS feed is on https and supports CORS there is no
  need to go through the proxy service. This is the state that I want to be in
  in the future because it allows the feed reader to render content that might
  require the authentication of the user.

Processing the data on the client is possible (and desired in my case) because
browsers have a little used API called `DOMParser`. DOMParser is as the name
suggests: A parser of raw XML and HTML that builds a DOM. Once you have a DOM,
you can do anything with it that you would do with normal DOMs (appendChild,
getAttribute etc etc).

```
let parser = new DOMParser();
let dom = parser.parseFromString('<a><b>hello</b></a>', 'application/xml');
let bString = dom.querySelector('b').textContent;
```

Pretty simple stuff and I use this to convert the RSS data into a simple JSON
structure so that I can pass it to a templating function ([It is here if you are
interested in seeing the
code](https://github.com/PaulKinlan/web-gdedeck/master/src/public/data/common.js).)

This works perfectly in the client, but there is no DOM in web workers, service
workers, nor any native DOM the server.

Luckily there is a npm library that just so happens to work everywhere.
[`xml-dom-parser`](https://npmjs.org/) is a Level 3 compliant implementation of
the W3C DOM.

It's not the end of the world, but it seems silly to have to import 64kb of JS,
for something that the browser already has built in.

I only ever see the 'VDOM' use-case for DOM APIs in workers, and whilst I think
it is an important use-case, I think it gets in the way of another important
uses case: data manipulation. The fact that we can't use workers to process HTML
and XML documents (something that nearly every app has to do) without having to
import a huge chunk of polyfill that won't run at the same speed as a native
implementation and that we rely on OSS contributors to maintain seems like
something that should be fixed.

Thank you to the people who maintain `xml-dom-parser`. Heroes work.