---
slug: using-nonce-with-service-workers
date: 2018-02-04T13:20:31+01:00
title: "Using Nonces effectively with service worker"
tags: ['service worker', 'csp', 'security', 'google analytics']
description: "CSP nonce values can help you securely run inline content on you site. But it can 
be hard to get it working with Service Workers... until now."
---

In a [recent project](https://webgdedeck.com/), I wanted to share as much logic
as possible between the server, service worker and the client. The project is
essentially a simple RSS feed reader, it takes RSS feeds, parses the data and
merges them in to a nice set of columns (much like TweetDeck), and also a single
merged list.

Because I am taking RSS feeds and displaying in my page, I need to be as sure as
possible that it is not doing anything nefarious. I can sanitize the input as
much as I want, however I know my own abilities, and I am certain people could
manipulate an RSS feed in such a way that I would end up running scripts,
importing images or any other 3rd-party in the context of my site.

The web platform offers ability to lock down a site via Content-Security-Policy
(CSP). CSP can lock down the external sources from which we can request context
such as script, styles, images etc. You can even lock down the ability for a
page to run scripts in-line - which can prevent all manor of XSS types of attacks.

It was pretty simple to add it to the app.

```
`default-src 'self';`
```

However.... I had a number of issues.

1. I generate styles inline on the page and thus I needed to run scripts inline.
2. I needed to include Google Analytics which requires an inline script to be
   run on the page.

CSP lets you run scripts and styles inline by letting you turn on an option
called `unsafe-eval` of scripts, however this pretty much by-passes any
protections that CSP affords.

To run inline scripts and still have the protections of CSP, CSP offers a couple
of tools. The one I used is called a 'nonce'. The nonce is a random id that you
set on the CSP HTTP header and that you tally with an associated inline script.

** CSP string on HTTP Header **
```
`default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-script-${nonce.analytics}'; connect-src 'self'; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'nonce-style-${nonce.style}'
```

** Inline script using nonce **
```
<script src="https://www.googletagmanager.com/gtag/js?id=1111"></script>
<script nonce="script-{nonce.analytics}">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '{{=it.config.then(config=>config.site.googleAnalytics)}}');
</script>
```

The above code works well and makes it simple to get analytics working correctly 
when we are securing the site with CSP.

For every single web request, you need to have a unique 'nonce' value and I do
this via the  `{nonce.analytics}` which is a value that I generate on the server
and apply via a template. If you re-use a nonce value the browser will refuse
to execute the content in the script.

I had a little trouble generating nonce values. I needed something that would
create a unique value that wont be re-used by the same user. I felt that a nonce
value of the format '[source]-[date.now + request-count]' would suffice.

The 'source' allows me to add a namespace to the nonce, and date.now() + an ever
increasing request count gives me a relatively stable non-repeatable set of
values.

I generate the nonce using the following function:

```
function generateIncrementalNonce(source) {
  let val = 0;
  let max = Math.pow(10, 3); // Date + pow 3 gets us close to max number;

  const generate = () => {
    let now = max * +new Date();
    if(val >= max) val = 0;
    else val++;
    return (source !== undefined ? source : '') + (now + val).toString();
  }

  return generate;
};
```

Looks good. However, I cache all my pages in a service worker, which means that
if I just simply served the content from the cache the nonce values will be
reused and thus not executed.

Luckily, I am share logic between my server and service worker, which allows me
to generate anything that I need in one central place of my code. I use the
'source' parameter in my `generateIncrementalNonce` function to prepend 'server'
or 'service-worker' to the nonce value and I did this in each of the request
handlers in both the server and service worker. Using this source parameter
means that I can guarantee a nonce value generated via the server will never
clash with a page loaded via the service worker.

This pattern has served me well. It has allowed me to allow the required inline
scripts for Google Analytics whilst stopping any third party from injecting or
running untrusted code in my page.

Below is the code that I used in the project. There are a number of different
places in my pages that I need nonce values, I generate them for each request
and then apply it to my templating function and the HTTP header at the same
time.

#### common.js - shared logic

```
function generateCSPPolicy(nonce) {
  return `default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-script-${nonce.analytics}'; connect-src 'self'; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'nonce-style-${nonce.style}' 'nonce-style-${nonce.inlinedcss}';`;
};

function generateIncrementalNonce(source) {
  let val = 0;
  let max = Math.pow(10, 3); // Date + pow 3 gets us close to max number;

  const generate = () => {
    let now = max * +new Date();
    if(val >= max) val = 0;
    else val++;
    return (source !== undefined ? source : '') + (now + val).toString();
  }

  return generate;
};
```

#### service-worker.js - fetch handler

```
const generator = generateIncrementalNonce('service-worker');
let nonce = {
  analytics: generator(),
  inlinedcss: generator(),
  style: generator()
};

let response = all(nonce, {
  dataPath: paths.dataPath,
  assetPath: paths.assetPath
}).then(r => setHeader(r, 'Content-Security-Policy', generateCSPPolicy(nonce)));;
e.respondWith(response);
```

#### server.js - request handler

```
const generator = generateIncrementalNonce('server');

let nonce = {
  analytics: generator(),
  inlinedcss: generator(),
  style: generator()
};

res.setHeader('Content-Security-Policy', generateCSPPolicy(nonce));
```