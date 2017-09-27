---
slug: the-web-is-my-api
date: 2017-08-27T13:20:31+01:00
title: "The Web is my API"
image_header: /images/bridges.png
---

[Michael Mahemoff](http://softwareas.com) taught me a lot about the
possibilities of the web. Prior to working with Mike I built on the web and I
understood the benefits such as linkability and discovery, but I never really
had a full picture of what would be possible.

One thing that Mike said was "[the Web is my
API](http://softwareas.com/cors-scraping-and-microformats/)", where he talked
about the being able to expose your site and your data in a page via
microformats and other structured data and being able to access it directly from
another another browser context, using a simple XMLHttpRequest and the CORS API:

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
similar &mdash; give users access to data and services from another origin
&mdash; but it was a lot more complex. I wanted to enable discovery of services
and then to interact with those pages. And Mike wanted to move the web to
providing access to data and services. It stuck with me. [Even if I did forget
the original
attribution](https://twitter.com/Paul_Kinlan/status/913000817170534400).

I recently did a talk for Nordic JS where I highlighted that we don't build
really build truley interconnected services on the web, and when we do it
follows a model of mostly server to server interactions. That is a web site will
integrate with a 3rd party service by routing all API request through their
server to the remote service and managing all the complexities that come with
that.

<figure>
  <img src="/images/server-server.png">
  <figcaption>Server to Server - like building a tunnel between services</figcaption>
</figure>

It works, we have entire web built with this, but it can be incredibly complex
when you consider authenticaion, authorization, transport protocols and
differing RPC methods (REST, GraphQL etc). Mike was proposing something much
more elegant, that with CORS enabled sites and a bit of JavaScript, we can talk
directly to the remote service by using the site.

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

We are moving to a world where sites are getting generated in the client with JS
and sessions and state for the user are managed in the entirely on the client.

We still need the ability to communicate from our sites to a remote service, and
I still strongly believe that we need to decentralize our integrations with
other sites and apps, but the first thing that we need to do is connect our
sites and apps together in away that is more than just a link. We need our sites
to expose their capabilities and functionality directly to other windows on the
users system.

Every website should be able to expose an API that the owner of the site is
control of, directly to other clients.

<figure>
  <img src="/images/client-rpc.png">
  <figcaption>Client to client</figcaption>
</figure>

The good news is that we can already do it, we've had the primitives on the
platform for at least 7 years (`postMessage` and `MessageChannel`), and forever
since `window.open`, but we don't for similar reasons why we don't interact with
sites via CORS. It's hard and it's nearly impossible to define a sane API that
is simple and consistent to use and that doesn't require pulling in huge third
party libraries for each service that you want to interact with.

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

### Is there a better example?

I built a [site that subscribes to a pubsubhubbub endpoint and when it recieves
a ping it sends a JSON message](https://rss-to-web-push.glitch.me/) to a user
defined endpoint. I didn't want to manage the push notification
infrastructurion, another site I built ([https://webpush.rocks/](webpush.rocks))
does all that. 

But the question is, how do I get the subscription ID held in the client of
webpush.rocks back into my site? The first itteration the user would open the
site and copy and past the URL between the pages. Why not just expose an API
that any site could use?

That's what I did.

The service (webpush.rocks) defines an API called `PushManager` that has a
single method on it `subscriptionId`. When the page loads it exposes
this API to the window as follows:

```
class PushManager {
  constructor() {
  }

  async subscriptionId() {
    //global var ick...
    let reg = await navigator.serviceWorker.getRegistration();
    let sub = await reg.pushManager.getSubscription();
    if(sub) {
        return `${location.origin}/send?id=${sub.endpoint}`;
    }
    else {
        return ``;
    }
  }
}

Comlink.expose({PushManager}, window);
```

The API interacts with the `PushManager` API that is state that is local to 
the user instance. The important thing here is that because it is running
asynchronously I can wait for user verifcation that they want to perform
the action (or not).

Getting back to the client site (the app that wants to get the subscriptionId).
When a user clicks on the link, we obtain a refernce to the window we just
opened and hook-up our `Comlink` proxy to it, this exposes the API of the
service to our client site. Once the API is exposed to the proxy and we can
instantiate the `PushManager` API like it was a local service, but it is all
interacting with the remote instance service in the other window.

```
let endpointWindow = window.open('', 'endpointUrlWindow');

let pushAPI = Comlink.proxy(endpointWindow);
let pm = await new pushAPI.PushManager();
let id = await pm.subscriptionId();

// Update the UI.
endpointUrlEl.value = id;
```

<figure>
<iframe width="560" height="315" src="https://www.youtube.com/embed/vTYZXx31EHc" frameborder="0" allowfullscreen></iframe>
</figure>

As a service provider I have exposed a constrained set of functionality that is
only available on the client to another site and I can secure it and ask for
user consent at the same time before I return the data back to the user, all
with a simple to use API.

The Web is the API.

Quite rightly, we don't let sites inspect or manipulate the DOM or state of
another origin, but I posit that if you have control over the services and
functionality of your site and how users engage with it then you can expose the
most important information and services to any client that wants to use your
service securely (you are in control) and it allows you to:

* Focus on what you are good at.
* Fast data transfer between sites and apps because it is all in the client.
* IPC even when offline.
* Run code in the origin context

### What API's should sites expose?

This is something that I would like to explore more. I exposed some basic
functionality to a Push Notifications service because that is the intent of the
site, but the important piece for me was that I was in control of which parts of
the DOM that I wanted to give back to other developers.

I would like to get to a place where every site can expose a consistent API to
users and a way to discover other functionality and services.

Each site owner could expose just the core functionality to their service so
that we could do CRUD based operations. We could have complex interactions.

We could get to a web where we have Unix like services that do one thing well
and a user pipes them together all on the client.

Each site could expose a `VDOM` of a subset of the page that is defined by the
service owner so that we have a consistent way to pull move data based on the 
DOM between sites securely.

I could imagine that we might want quick access to all of the schema.org based
objects or other structured data on the page (they could be dynamically
generated) like Mike did in his original post.

[Comlink](https://github.com/GoogleChromeLabs/comlink) gives us a way to expose
and consume services quickly and easily on top of the platform primitives that
have been around for years. We finally have a lot of the pieces in place that
allow us to make the Web the API.

_The Web is my API. Make it yours too._