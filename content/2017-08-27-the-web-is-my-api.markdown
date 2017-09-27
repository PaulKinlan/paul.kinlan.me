---
slug: the-web-is-my-api
date: 2017-08-27T13:20:31+01:00
title: "The Web is my API"
description: ""
image_header: /images/bridges.png
---

[Michael Mahemoff](http://softwareas.com) taught me a lot about the
possibilities of the web. Prior to working with Mike I built on the web and I
understood the benefits such as linkability and discovery, but I never really
had a full picture of what would be possible.

I remember Mike saying "[the Web is my
API](http://softwareas.com/cors-scraping-and-microformats/)" talking about the
being able to expose your site and your data in a page via microformats and other
structured data and being able to access it directly from another another
browser context, using a simple XMLHttpRequest and the CORS API:

>Anyway, what’s cool about this is you can treat the web as an API. The Web is
>my API. "Scraping a web page" may sound dirtier than "consuming a web service",
>but it’s the cleaner approach in principle. A website sitting in your browser
>is a perfectly human-readable depiction of a resource your program can get hold
>of, so it’s an API that’s self-documenting. The best kind of API. But a whole
>HTML document is a lot to chew on, so we need to make sure it’s structured
>nicely, and that’s where microformats come in, gloriously defining lightweight
>standards for declaring info in your web page. There’s another HTML5 tie-in
>here, because we now have a similar concept in the standard, microdata.

It was around the same time that I was starting to work on [Web
Intents](https://en.wikipedia.org/wiki/Web_Intents), the spirit of which was the
same but it was a lot more complex, I wanted to enable discover of services and
interact with those pages. It stuck with me. [Even if I did forget the original
attribution](https://twitter.com/Paul_Kinlan/status/913000817170534400).

I recently did a talk for Nordic JS where I highlighted that we don't build
interconnected services on the web, and when we do it follows a model of mostly 
server to server interactions. That is a web site will integrate with a 3rd party
service by routing all API request through their server and managing all 
the complexities that come with that.

<figure>
  <img src="/images/server-server.png">
  <figcaption>Server to Server - like building a tunnel between services</figcaption>
</figure>

It works, we have entire web built with this, but it can be incredibly complex.
Mike was proposing that with CORS enabled sites and a bit of work, we can talk
directly to the remote service.

<figure>
  <img src="/images/server-rpc.png">
  <figcaption>My terrible drawing I used to describe Client to Server</figcaption>
</figure>

There have been a couple of issues that cropped up in between. The primary issue
is that even though CORS is widely supported in browsers, developers rarely use
it. CORS is a protection that we need on the web but it's hard to set up and
debug, and the "Web as an API" has not really been pushed too much.

<figure>
  <img src="/images/server-rpc-nope.png">
  <figcaption>CORS gets in the way</figcaption>
</figure>

We are moving to a world where:

1. Sites are getting generated in the client with JS
2. Sessions and state for the user are managed in the client

We still need the ability to communicate from our sites to a remote service,
but I've come full circle. I strongly believe that we need to decentralize our
integrations with other sites and apps, but the first thing that we need to do
is connect our sites and apps together in away that is more than just a link. We 
need our sites to expose their capabilities and functionality directly to other 
windows on the users system.

<figure>
  <img src="/images/client-rpc.png">
  <figcaption>Client to client</figcaption>
</figure>

Every website to be able to expose an API that the owner of the site is
control of directly to other clients.

We can already do it, we've had the primitives on the platform for at least 7
years (`postMessage` and `MessageChannel`), and forever since `window.open`, but
we don't for similar reasons why we don't interact with sites via CORS. It's
hard and it's nearly impossible to define a sane API that is simple to use and
consistent and that doesn't require pulling in huge third party libraries for
each service that you want to interact with.

We have a library that helps. [Comlink](https://github.com/GoogleChromeLabs/comlink).

Comlink is a small API that abstracts the `MessageChannel` and `postMessage` API's
in to an API that looks like you are instantiating remote classes and functions
in the local context. For example:

**Website**
```
// Set up.
const worker = w.open('somesite');
const api = Comlink.proxy(w);

// Use the API.
const work = await new api.Test();
const str = await work.say('Yo!');
console.log(str);
```

**Web Worker**
```
class Test {
  say() {
    return `Hi ${this.x++}, ${msg}`;
  }
}

// Expose the API to anyone who connects.
Comlink.expose({Test}, window);
```

<figure>
  <img src="/images/comlink.png">
  <figcaption>Comlink</figcaption>
</figure>

We expose an API on the service, we consume the API in the client via a proxy.

Quite rightly, we don't let sites inspect or manipulate the DOM or state of
another origin. But I posit that if you have control over the services and
functionality of your site and how users engage with it.

* Focus on what you are good at
* Fast data transfer
* IPC even when offline
* Run code in the origin context

### What API's should sites expose?

That is a great question.

### There must be issues?



The Web is my API, make it yours too.