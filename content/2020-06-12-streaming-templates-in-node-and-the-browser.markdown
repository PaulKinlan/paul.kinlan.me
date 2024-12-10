---
date: 2020-06-12 23:32:44.743000+00:00
link: ''
slug: streaming-templates-in-node-and-the-browser
summary: I needed a streaming template engine for a web app I'm building that works
  in Node.js, the browser, and service workers.  Existing solutions like flora-tmpl
  were great for Node.js, but I needed something smaller and compatible with all environments.
  So, I created whatwg-flora-tmpl (name pending), a lightweight library based on the
  WhatWG Streams API. It uses template literals, handles dynamic content, and even
  supports nested streams.  The example code demonstrates how it can be used to render
  HTML responses piece by piece instead of waiting for all data, significantly improving
  perceived performance.  It's particularly useful for responses generated in service
  worker fetch events.  Big thanks to Matthew Phillips, the creator of flora-tmpl,
  which served as the inspiration for this project.
tags:
- streaming
- templates
- node
- browser
- service worker
- web app
- performance
- WhatWG Streams
- template literals
- flora-tmpl
- whatwg-flora-tmpl
title: Streaming Templates in node and the browser

---

I'm currently building a simple web app and I needed a simple templating engine that can stream dynamically generated responses to the network.&nbsp;

It's hard to build sites that are fast. One known pattern for building sites that render quickly is to ensure that the browser gets the HTML as quickly as possible. Yet, many of the tools (middleware and templating engines) that developers use to build sites wait for the response from the server application to be completely created before they are put on to the wire and send to the client.

Streaming template engines are important because they don't wait until the entire response is ready before sending the data on, but they are also able to wait for gathered data (say from a database request) before proceeding with the rest of the response.

<figure><video src="/videos/2020-06-12-streaming-templates-in-node-and-the-browser-0.mp4" alt="Streaming templating in action" controls></video></figure>

It feels like there are scant few streaming templating engines in Node. There are fewer that work in Node, in the Browser and in a service worker.

I came across the awesome [flora-tmpl](https://www.npmjs.com/package/flora-tmpl) project. It's a streaming templating engine that uses template literals ``html`Hello ${world}`;`` to make it easy to author streaming templates, and if you just need them for Node JS, then you should totally use it.

The project I am building needs to work in Node, the Browser and a Service Worker (I am running my app in both Node and the SW) and whilst it would have been possible to browserify the library, it makes it a lot larger than I need it to be. I know enough about `ReadableStreams` in the browser to damage, so I wanted to see if I could port `flora-tmpl` to use the WhatWG streams API...

[whatwg-flora-tmpl](https://www.npmjs.com/package/whatwg-flora-tmpl) (I might have to change the name, it's not affiliated with the whatwg or flora really) is a small library that does pretty much everything `flora` does, but using the WhatWG Streams API in the browser (and a polyfill in Node).

The template literal function takes your, well, template and returns a `ReadableStream`, the template function will then push string literals on the stream, and when it needs to evaluate a variable, it will do that and then enqueue that on to the stream too. This means, for example that you can generate responses in a service worker fetch event like: ``new Response(tmpl`Hello ${world}`)``;

It's not just basic values that can be evaluated (such as strings, numbers and arrays), it can also evaluate `ReadableStreams`, which means you stream templates in your template.

The demo for the video at the start of this article is below (you wouldn't do this in real life, it's just to show the templating engine can also embed readable streams which means it can embed the templating engine and stream that response too)

```JavaScript
import tmpl from '../lib/index.js';
import streams from "web-streams-polyfill";

const read = (stream) => {
  const reader = stream.getReader();
  const decoder = new TextDecoder();

  return reader.read().then(function process(result) {
    if (result.done) {
      return;
    }

    console.log(decoder.decode(result.value));
    return reader.read().then(process);
  });
};

const encoder = new TextEncoder();
const title = 'Awesome';

tmpl`<html>
  <head>
    <title>${title}</title>
  </head>
<body>
${new streams.ReadableStream({
  start(controller) {
    let counter = 0;
    const interval = setInterval(async () => { 
      controller.enqueue(encoder.encode(`${counter++}`));
      if (counter >= 10) {
        controller.close();
        clearInterval(interval);
      }
    }, 1000);
  }
})}
</body>`.then(read);
```

A better (albeit a lot more complex) example is the one I am using in my project.

```JavaScript
const head = (data, bodyTemplate) => template`<!DOCTYPE html>
<html>
  <head>
    <title>Baby Logger</title>
    <script src="/client.js" type="module" defer></script>
    <link rel="stylesheet" href="/styles/main.css">
    <link rel="manifest" href="/manifest.json">
    <meta name="viewport" content="width=device-width">
  </head>
  <body>
  ${bodyTemplate}
  </body>
</html>`;

const body = (data, items) => template`<header>
    <h1>Baby Log</h1>
    <div><a href="/">All</a>, <a href="/feeds">Feeds</a>, <a href="/sleeps">Sleeps</a>, <a href="/poops">Poops</a>,  <a href="/wees">Wees</a></div>
    </header>
  <main>
    <header>
      <h2>${data.header}</h2>
    </header>
    <section>
    ${items}
    </section>
  </main>
  <footer>
    <span>Add</span><a href="/feeds/new" title="Add a feed">🍼</a><a href="/sleeps/new" title="Add a Sleep">💤</a><a href="/poops/new" title="Add a Poop">💩</a><a href="/wees/new" title="Add a Wee">⛲️</a>
  </footer>`;

const aggregate = (data) => {
  // Do a lot of work in IndexedDB and other data munging
}

new Response(template`${head(data,
      body(data,
        template`${aggregate(data)}`)
    )}`);
```

We have many templates, `head` generates the skeleton of the HTML, `body` is the content of the page based on the output of `aggregate`. The latter of those functions does a lot of asynchronous work which takes some time, however the response can start rendering pretty much straight away because the `head` and `body` functions mostly output text.

I think it's pretty neat, and hopefully I can write up a lot more about the architecture of the app I am building that uses this across the Server, Client and Service Worker.

Finally, a big shout out to [Matthew Phillips](https://twitter.com/matthewcp) who wrote the awesome original version of [flora-tmpl](https://github.com/matthewp/flora).

