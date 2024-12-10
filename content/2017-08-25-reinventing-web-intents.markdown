---
date: 2017-08-25 13:20:31+00:00
description: ''
image_header: /images/bridges.png
slug: reinventing-web-intents
summary: I've been exploring solutions to connect web apps and overcome the limitations
  of isolated experiences.  Web Intents was a good start, but ultimately fell short.
  The Share API helps, but we need a more general solution for IPC and service discovery.  My
  latest experiment builds on the Tasklets API and Comlink, allowing seamless communication
  between windows and web workers. It simplifies the complex postMessage API and makes
  it easy to expose and consume APIs across different contexts.  I've created a service
  discovery mechanism where a 'middleman' site keeps track of available services.
  Clients can request services based on criteria, and the middleman facilitates the
  connection.  Once connected, the client and service communicate directly, bypassing
  the middleman.  This approach simplifies the developer experience and makes it much
  easier to build interconnected web experiences. Check out the demos and let me know
  your thoughts!
tags:
- web intents
- service discovery
- ipc
- comlink
- tasklets api
- web workers
- postMessage
- javascript
- interoperability
- developer experience
title: Reinventing Web Intents

---
I never got over the [death of Web Intents](/what-happened-to-web-intents/). I
always felt that there is still a serious problem on the web, we build
[silos](/unintended-silos/) that lock the user into one web site and we don't
connect our apps together to build richer experiences. We have links that allow
us to navigate to another site, but we don't connect our apps to functionality
that we can use in our sites. Be it picking an image from a cloud service to use
in your app, or editing an image in the users preferred editor; we just don't
link our services the way we link our pages.

[Web Intents](https://en.wikipedia.org/wiki/Web_Intents) was a failed attempt to
fix that. The [Share API](/navigator.share/) solves one use case for
interconnecting sites and apps, but generally IPC and service discovery have
never been solved and I think I have a solution... Ok, I don't have a solution,
I have an experiment that I am incredibly excited about.

Over the past couple of months Surma on my team and Ian Kilpatrick were working
on a shim for the [Tasklets API](https://github.com/GoogleChromeLabs/tasklets).
The Tasklets API was designed to allow a light-weight multi-threaded API's to exist on
the web. An ES6 class could be exposed as a 'tasklet' and you could call it
without blocking the main thread - great for UI's. The tasklet API by itself is
very interesting, but the most interesting piece for me was that they built a
Polyfill using a Web Worker and developed a way to expose the functionality of
the ES6 class that was defined in the Worker. They had abstracted all of the
complexities of the postMessage API away into a neat package and a sane model
for JS developers.

One of the reasons that we built the Web Intents API was because the developer
experience of creating an API and a service that worked with the postMessage API
was incredibly complex, you have to deal with the postMessage API and then you
have to manage a complex message processing system and associated state machine.

<figure>
  <img src="/images/worker-dx.png">
  <figcaption>Traditional Worker</figcaption>
</figure>

It's just complex. It get's even worse if you want to have two windows
interacting with each other. The window you open has to signal back the the
`opener` that it is ready before you can start to send it messages. TL;DR -
`window.open` opens `about:blank` before it navigates to the URL you define.

<figure>
  <img src="/images/window-dx.png">
  <figcaption>Window postMessage experiences</figcaption>
</figure>

It gets even more complex when you want to pass messages between multiple windows
or workers in other windows. 

<figure>
  <img src="/images/complex-workers.png">
  <figcaption>Even more complex...</figcaption>
</figure>

I think this is one of the main reasons why people expose client side API's. It's too
hard.

The tasklets polyfill had a solution buried inside of it
and I cheekily asked Surma if he could refactor the tasklets API into a simple
Proxy API, a couple of hours later out popped
[Comlink](https://github.com/GoogleChromeLabs/comlink/). Comlink is a small API
that abstracts the MessageChannel and postMessage API's in to an API that looks
like you are instantiating remote classes and functions in the local context. For 
example:

**Website**

```javascript
const worker = new Worker('worker.js');
const api = Comlink.proxy(worker);
const work = await new api.HardWork();
const results = await work.expensive();
```

**Web Worker**

```javascript
class HardWork {
  expensive() {
    for(let i = 0; i < 1e12; i++)
      sum += /* …omg so much maths… */
    return sum;
  }
}

Comlink.expose({HardWork}, self);
```

We expose an API on the service, we consume the API in the client via a proxy.

I think it is incredibly compelling and Comlink by itself has the ability to
revolutionize the usage of Web worker by drastically improving the developer
experience by providing a simple API for their team to be able to use.

Doing the same thing between windows is just as easy.

<figure>
  <img src="/images/comlink.png">
  <figcaption>Comlink</figcaption>
</figure>

But I had another thought... I can reinvent a small part of Web Intents was supposed:
improve service discovery and make it easy for developers to interact with the
services.

### Web Intents?

One of the neat things about the Comlink API is that it automatically will try
to use `Transferable` objects to pass data between the client and the service,
and it turns out that `MessagePorts` are transferable. The idea that I had is
that if I could create a simple API that is designed to just return a
MessagePort based on some criteria (such as verb) then as the client, I wouldn't
care where that MessagePort came from.

Here is my thinking: I will have a site that acts as a middle-man and will
maintain a list of services and where they live and will be able hook up 
clients who ask for types of services, kind of like so.

* A service site will be able to say to the middle man "I offer service X that
  works on data Y and lives at page Z"
* A client site will be able to say to the middle man "I need a service that does
  X on this data Y. What do you have?" 

Mapping this back to a rough design, I need a Service that exposes two methods:
`register` and `pick`.

`register`, will, well register the service with the middle man. `pick` on the
other hand is a little more interesting and I've broken it down into a couple of
steps.

<figure>
  <img src="/images/webintents-step-1.png">
  <figcaption>Connecting sites</figcaption>
</figure>

The flow isn't overly complex when you dive into it. I crated a [basic
wrapper that you include in every service and client
application](https://web-intents.glitch.me/scripts/service.js). The wrapper
handles the first interaction with the middleman and does some basic
housekeeping by wrapping the complexities of opening a window to the service
picker at 'https://web-intents.glitch.me/pick'.

Once the picker is open it will find all the services that match the criteria
the user needs, it will then present it to the user as a simple list. The user
opens their preferred site and behind the scenes that site exposes it's API back
to the original client via the middleman. Finally, when the connection is
complete and we are talking to the chosen service we can remove the middle-man.

<figure>
  <img src="/images/webintents-step-2.png">
  <figcaption>Removing middleman</figcaption>
</figure>

The process actually is a little more complex than I am letting on. Under the
hood we are passing a lot of MessagePorts between windows but the consumers of
the API never see any of this complexity. The good thing is that that when the
client and the service are connected and they talk directly via a nice service
defined API and they don't actually know who is on either end. Neat.

Below is a quick dive into the code to show how simple it is.

**Service** ([demo](https://web-intents-service-1.glitch.me/))

The service is relatively simple, it has a class that interacts with the DOM
and logs some output.

We expose the `Test` class to the `ServiceRegistry` and we offer a way to
register the capabilities of this service.

```javascript
class Test {
  constructor() {}

  outputToPre(msg) {
    let output = document.getElementById('output');
    output.innerText += msg + '\n';
  }
}

let registry = new ServiceRegistry({ Test })
register.onclick = async () => {    
  let resolvedService = await registry.register('test-action','*', location.href);  
};
```

**Client** ([demo](https://web-intents-client.glitch.me/))

The client is simple, we create an instance of the registry and call `pick`.

`pick` connects to the middleman, and waits for the user to select the
service. Once the user selects the service the middleman (`ServiceRegistry`)
passes the API that the remote service has exposed to the client. We can
then instantiate an instance of the remote API and invoke methods on it.

```javascript
let registry = new ServiceRegistry();
let resolvedService = await registry.pick('test-action','image/*');
remote = await new resolvedService.Test();
remote.outputToPre('calling from window.');
```

I am quite pleased with this as an experiment. Here is a video of the Service
Discovery and invocation of the above code.

<figure>
{{< fast-youtube 1igal-ehMB4 >}}
<figcaption>end to end demo</figcaption>
</figure>

Let me know what you think. Too much?