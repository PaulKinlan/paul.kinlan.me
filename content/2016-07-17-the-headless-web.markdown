---
slug: the-headless-web
date: 2016-08-01
title: "The Headless Web"
tags: ["headless"]
description: "Do we need a browser in the future?"
image_header: "/images/future-of-web-on-mobile/100.jpg"
---

In 2014 I was honoured to speak at Fronteers in Amsterdam (I would heartily recommend it). I was attempting to 
talk about the state of the web platform, where it was, where it is, and where it will be.

Where it is, I've partly covered recently in [The Lumpy Web](/the-lumpy-web). It covers the state of inconsistent feature 
support and the pain that it can cause developers. Where it (the web) will be, I touched on briefly as something
I was calling "The headless web".

<script async class="speakerdeck-embed" data-slide="16" data-id="7105f980347a013238ed56e996df704e" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

Many of us are already familiar with a "Headless Browser", it is an instance of a web browser that the user can't
see and doesn't interact with, and to most people that seems to be useless. For developers, we've mostly used these Headless
Browsers for automated testing of user-interfaces. If you take it one step further, many of the modern search engines run a
browser behind the scenes to be able to themselves to execute JavaScript so that the content you host using you preferred
framework of choice will still render and the data will then be indexable. But I think headless browsers offer us a lot more,
in fact I think they are a core part of the future of the web for businesses and services and hopefully I can explain that 
in this post.

The Headless Web I posited was a web where the user only lightly ever interacts with a web page in a web browser. Instead,
the user experience is still expressed in HTML and executed with JavaScript but you might just visit a web page once
to build a long term relationship with it. You might never actually ever visit the site directly.

I saw this being in at least four types of interactions:

* **Interactions with Notifications** - Web sites or apps could create little app like experiences that you
  interact with directly, for example: like a photo, there is no need to ever open a web page to be able to do this interaction. My 
  early thought about this, is that the Service Worker is the key enabler for interactive headless experiences.
* **Local discovery**, aka "The Physical Web" - URLs that are broadcast around you could have contextual actions expressed in their site via
  something like schema.org verbs and nouns. That way rather than visit the site to buy that movie ticket, it 
  is integrated directly in to the notification about the beacon.
* **Embedded Content** - Google Now as an example of this in action today. Data is expressed in a page either via HTML or schema.org 
  and it is presented to the user in a form that might not be how it was represented in the page. Movie listings for example could
  be aggregated and be applied with other data such as ratings and reviews from other sites.
* **Native Integrated Content** - aka WebViews. If you spent all of your time in Facebook or WeChat you will be interacting with 
  the web, but you may not know it, and if you look at the progression then more and more of the traditional web browser is
  being replaced by the host app.

It turns out there are many more ways that we can think about the Web without a browser, but this is how I was looking at it at the
time. 

There is an pessimistic way to look at this and an optimistic one:

* **Glass half empty**: It spells the end for web developers, UI designers and the web at large.
* **Glass half full**: Content is open, available everywhere and more composable than ever, all hosted and powered by the web.

Jump forward a year, I was at [Coldfront Conf 2015](https://2015.coldfrontconf.com/) where Kenneth Auchenberg had asked me to talk about "The headless web" (and to
my shame, I never really got to it in that talk). Instead I focused on the [Future of the mobile web](/future-of-web-on-mobile-coldfront-conf)
which was more directly concerned about the [The Rise of meta platforms](/rise-of-the-meta-platforms) as expression of 
the headless web.

<script async class="speakerdeck-embed" data-slide="37" data-id="b9db06014c9047e7bee3db08b2d036c1" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

The web as we see it is accessed through a browser on the users home screen, be it Safari on iOS or Chrome on Android and that is what
we worry about. We Web Developers worry about a web that is accessible and usable inside a browser at the very time that what a "web browser" is, is changing.

The content and tools we are creating are being consumed in an experience that is not the traditional browser. At the time
I saw it split between News and Social platforms and other Apps.

* Apple News
* Google's rendering of AMP content (I don't think this was a thing when I was talking about Meta platforms)
* Facebook WebView, Facebook Instant Articles
* Chrome custom tabs
* WeChat and other Social apps that have platforms on mobile.

The interesting thing about this is that because these platforms control the viewing experience, they can start to inject
their own platform capabilities and API's into the web. I will touch on this a little later.

### The table stakes

I am incredibly passionate about the concept of Progressive Web Apps. They allow us to express and formulate web 
applications in a way that work as people expect them to work and excel at being instantly accessible, available and light-weight.

Progressive Web Apps are the table stakes for a modern web experience. Why are they the table stakes though?

I've focused a lot on the capabilities of the web platform and how over the last 3-4 years we've seen
a massive change in what the web can do across all platforms.

<figure>
  <img src="/images/future-of-web-on-mobile/100.jpg">
  <figcaption>Ever increasing capabilities of the web 2015</figcaption>
</figure>

But, I also expressed that Native is no slouch, and whilst we take for granted that Apple
only update their OS once every 12 months, other platforms such as Android
are updating their platform every 6 weeks (at the time of writing my original presentation)

<figure>
  <img src="/images/future-of-web-on-mobile/101.jpg">
  <figcaption>Native is catching up every 6 weeks</figcaption>
</figure>

I think this is an unseen threat to the web, just as we are catching up then native platforms 
iterate. Google Android, specifically Google Play Services got an update that introduced an entire 
[fitness layer in to Android](https://developers.google.com/fit/) all the way back to Android Gingerbread
without changing the underlying operating system.

Why am I talking about fitness? Well in this case it is a higher abstraction of a set of
individual sensor APIs that we don't have on the web, and it highlights the gaps we have: 

1. Our API surface is still immature - For example, sensors are still not a fully solved problem 
   and we are only really just starting to expose more platform primitives via the principles of the 
   [extensible web](https://extensiblewebmanifesto.org/) (Service Worker for example)
2. Our development model is diverse and disparate - There is a multitude of frameworks and libraries both front-end 
   and back-end that we can choose from that it is harder to form a well-lit and even path for developers and thus building
   out new primitives can be a little harder.

This cadence of Native platforms is interesting to follow, I am going to bet that iOS soon
starts to update the core platform incrementally &mdash; I believe it is starting with the unbundling
of the core apps from the home-screen and I believe allows to update them out of iOS update cadence.

It is this cadence that worries me, look at the following table that I created 8 months (albeit privately) after the
first.

<figure>
  <img src="/images/web-platform-2016.png">
  <figcaption>Ever increasing capabilities of the web 2016</figcaption>
</figure>

Notice the difference? The web got some new capabilities, but the native platforms got
Deep Linking *and* "instant loading" from (Instant Apps). I'm no fan of Instant Apps, but even
before this their was App Streaming in late 2015 - again a pretty poor implementation however
the point is that Mobile platforms. 

**All platforms are competing in the [SLICE](/slice-the-web) space**.

The web is catching up, the concepts of Progressive Web Apps and platform extensibility are giving us that, and
there's a lot more that we absolutely must catch-up on, but we need to work out a way that keeps us differentiated whilst 
keeping to our principles of openness and SLICE. I think the idea of the headless web is *a* model that can help us.

### What if everything was powered by "The Web", but you never saw a browser?

This is a big question. As an industry would we be happy with the user hardly ever seeing a web browser anymore? Or is
that the one thing that is sacrosanct?

I think my original classifications: Notifications, Physical, Embedded and Integrated, were not a million miles off where
I think the platform is headed.

Service Worker *is* the platform piece that allows a lot of this to work (at least local to the user), but it really is 
focused at the local user level. The user has to have the Service Worker registered, but once we do system events at platform 
level can potentially allow us to quickly build and deploy any headless experience that we want. Right now the UI 
would still be notifications.

#### Notifications

**The great thing is that this is already happening!** On the run up to the UK Referendum on Europe, the [Guardian](https://www.gdnmobilelab.com/)
created an experiment to deliver updates and news to the people who subscribed to the service. You
could tailor the experience over time, if you wanted you could get more information by clicking on the notification or
if you got everything you needed from it you could dismiss the notification quickly.

I only took one screenshot :(, but it was an **amazing** experience and for me it pushed the boundaries
of what I experience of the web and the SLICE model. Importantly, it was ephemeral, it was deployed on
the web using a simple URL and when it stopped once the referendum had finished. This is a capability that
I think the web excels at and that a full on Native experience will never be able to match (or should not need to).

<figure>
  <img src="/images/gdnmobile-1.png">
  <figcaption>The Guardian pioneering notification led services.</figcaption>
</figure>

I strongly encourage you to read [the GDN Mobile Lab](https://medium.com/the-guardian-mobile-innovation-lab/web-notifications-introduction-news-on-lock-screens-ba0d685cb4e2) 
it covers a number of distinct and interesting experiences.

#### Composing Services and Embedding Content

The 'C' in SLICE is composability, the ability to take content and functionality from one site or service
and include it in your own site. Traditionally this is where the web on desktop started to beat the capabilities
of the underlying native applications by bringing us Web 2.0, specifically "mash-ups" via IFRAME, JSONP and XMLHttpRequest, which
allowed us to build services that were instantly accessible and providing great value.

This is something for a long time has not really been part of what native experiences offer, but it is starting
to come. Google Now for instance can take data that is discovered on the open web and apply context of your local 
actions. For example maybe it could find cinema times near where you are.

Data is now being embedded and aggregated in apps and then custom actions are applied on top of that. This however is not 
the same as embedding another apps logic directly in your experience, instead the native model is to delegate the experience 
and control out to another app (if it is already installed). This might be a goal of the "semantic web", but I think our
data and function needs to be portable between sites and apps on every platform and *we need to solve this soon*.

[AMP](https://ampproject.org/) is interesting. AMP allows content to be created and hosted on the web, and due to the way
it is defined and validated, it allows web experiences and native experiences to host entire content experiences in situ.
The constraints of AMP allow for a rich composition of experiences that are embedded everywhere **without** `iframes`.

The point, we can get web content rendered easily and quickly outside of a traditional browser.

#### I lied about Composing Services on native: WebViews and Integrated content

I told a little porky-pie when I said that native didn't have the ability to quickly and easily compose services.

We do have that ability! Every single platform has a WebView or a way to embed web-based content directly into native apps, it is just 
incredibly ham-fisted.

WebViews are a bad thing for the user. On Android at a platform level they will not give you a great experience. Everything is
in a single process, everything is intercept-able and the developer has the ability to inspect everything that you do within 
their application. Below is Alex Russell on WebView: *"It's not OK to be loading arbitrary content into a web"*.

<figure>
{{< youtube Sy4oH8JZuJQ >}}
</figure>

A better solution is [Chrome Custom Tabs](https://developer.chrome.com/multidevice/android/customtabs) and the `SafariViewController`, they are
an instance of the respective browsers on the system and provide all of the benefits that you get from running in the browser: Synchronised
cookies, history, payment and auto-fill and a good security sandbox. In most cases though it is very clear that you are running in a browser still 
however more and more of the UI that we expect from the browser is being removed and being replaced with logic inside the app that is hosting the web content.

Even though we have these two tools, they are only really used for rendering full external content such as a web page or hosting a
web app, they are rarely used for hosting and embedding micro-experiences.

If I was building a platform such as Facebook or WeChat, I would never move away from the WebView because of the control
that it gives me as a platform owner. Because I can manage, inspect and manipulate the content inside a WebView
it means that I can build my own platform integrations directly on top of the web and if my platform is used by a large chunck of
the world then I can more easily move into a space where I can define new elements or interfaces that if detected can be deferred
to my own walled-garden platform. Imagine payments for example, you can detect that a payment is about to be made and instead
provide the user with your optimized experience....

#### Server-rendered based experiences

We've had services that have accessed content on the web via HTTP resources and then parsed out the content and have
tried to extract meaning from them. Search Engines, Crawlers etc for the longest time were built this way. They took
the raw HTML and parsed it, after a while this wasn't good enough, many sites would load and generate content via 
JavaScript and this needed to be able to be crawled and indexed.

[Bing looks like it is doing it](https://html5test.com/s/c7a0303058f42596.html). [Google is doing it (PageSpeed)](https://html5test.com/s/69d033305ef7325d.html)

Using the browser as a service is an incredible opportunity. It allows us to take the declarative HTML and combine 
it with the developer defined procedural execution of JavaScript and run deep analysis on the content.

Browser vendors have also got into the game. Opera and UC Browser have products render the content of the website that
the user is visiting on the server so that they can then transfer a highly compressed rendered view of the page
to the user and save them a huge amount of bandwidth.

As a development community we have also taken advantage of the browser to run our CI and Web page screenshot services, 
[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) was probably the first service that I knew 
of that would run a browser on the server, run some tests based on the state of the world that it saw and then return 
that data to the user. 

Using the browser as a service is an incredible opportunity. It allows us to take the declarative HTML with the developer defined
procedural execution of JavaScript and run deep analysis on the content.

I look at it a little like this: Anything you can do in a Chrome Extension you can also now do on the server.

If we are to understand the web around us we need to run a headless browser and there are now a couple of options:

* [Headless Chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=546953) &mdash; as the name implies
* [Phantom](https://github.com/ariya/phantomjs) &mdash; Headless WebKit with a scripting API layer on top.
* [SlimerJS](https://slimerjs.org/) &mdash; The Gecko based version of PhantomJS.

To understand the content that is embedded in those pages traditionally we have suggested that you should use
"Semantic HTML". Semantic HTML allows us to represent document structure in our pages which makes it easier for accessibility tools
to assist users and combined with `micro data` [Schema.org](https://schema.org) allows us to attach higher level nouns on to our semantic HTML
to express "objects" as data, we have even created a horrendous JSON format to help developers encode this schema
data into the web.

Rightly or wrongly, whilst we have some of the tools to express semantic meaning in our pages, we haven't created 
the incentives for developers to encode meaning in to their pages. I am not so sure we will get there fully and 
perhaps this dawn of Artificial Intelligence will help us extract some of that meaning.

* [DOM Distiller](https://github.com/chromium/dom-distiller) &mdash; helps us rip out the crap from our pages and
  just leave us with the content.
* [Metaphor](https://github.com/hueniverse/metaphor) &mdash; Extracts in a uniform way the "sharing" data out of a page.
* [Mozilla Fathom](https://github.com/mozilla/fathom) &mdash; is particularly interesting because to 
  me it is a damning indictment of the failure of semantic HTML to be able to express the intention of the developer, we
  can write tests to find the bits of the pages that we can use

>Fathom is an experimental framework for extracting meaning from web pages, identifying parts like Previous/Next buttons, address forms, and the main textual content. Essentially, it scores DOM nodes and extracts them based on conditions you specify. A Prolog-inspired system of types and annotations expresses dependencies between scoring steps and keeps state under control. It also provides the freedom to extend existing sets of scoring rules without editing them directly, so multiple third-party refinements can be mixed together.

As you may have noted above, Distiller and Fathom strip out the rendering yet we said we need the full rendering
capabilities of the browser so they are really only a part solution to the headless web.

We need to be able to express actions on the data on our pages, both the actions that can be performed on data
and the actions that *my* service can perform on your data. I had visions that web intents might be able
to be extended to handle this, but at the time I was simply stating that a page could perform an action on
a certain piece of data, and if you needed to access that functionality you would delegate the request to "edit
this image" out to another application. But what if you could isolate function in your page directly, imagine
being able to safely embed that content directly into your site. AMP kind of does this for content but I've 
currently no clue how that works for "actions" (I do think Custom Elements will play a part).

Running a browser on the server will allow us to more easily build services which parse data that is generated dynamically, it will
allow us to more easily us run our own logic against the logic in a page (form fill as an example) and I believe
that it will open up the ability to more effectively run actions against data embedded on the page.

### Opportunities for the future

Progressive Web Apps are the table stakes. They allow us to play in the same game as native experiences and get
users experiencing a web that is first class. We need to introduce users to the fact that these experiences 
can be fast, reliable, robust and available everywhere that they expect it to be. Progressive Web Apps
give us the platform to build on top of.

Service Worker will play a huge part in the future of the Headless Web for experiences that live
and are surfaced directly up through the users devices but powered and delivered by HTML and JavaScript. This will 
give us new products entirely built around Notification based interfaces and other future platform pieces 
that are integrated in with Service Workers. 

Headless browsers will help power the back-end by allowing us to aggregate information and more easily extract meaning from
the web as a whole and by running it through an engine that can understand the page content but also the logic that is being
executed on it too.

Custom Elements combined with Headless Browsers will bring back the composability of the web and enable our hosted content to be portable and flourish 
everywhere, be it natively embedding microcontent from web into Apps or the creation of Micro Web Views or even
by parsing the data on a server somewhere. We lost something when native came along and I think we can show the 
power of the web by creating portable data and logic. Custom Elements are the key to this future of
composability on the web (I am going to write this up a little more). Fundamentally Custom Elements 
allow us to define HTML Tags which through a consistently defined developer interface the functionality can be replaced
by any native element or other web implementation.

To enable the next generation of remote services powered by a headless browser, we need to fix the scale issues. We've been running these tools as individual instances 
of the browser to run our test suites. We need to get scale at being able to run hundreds, if not thousands of instances
of the browser. Someone needs to build this! If we can get a scaled and generalised solution to running a browser in the
cloud then we have a very compelling new platform for large scale aggregation of data on the web.

I am very excited by the future of the web, all that I know though is that it won't look like what it looks like today, but
I want it to be powered by URLs and content that is directly addressable and available to every person in the world. We need 
to have a great experience on that content directly, but that content needs to be portable on to every platform where
the users are and usable in what ever User Agent they use.

If we can provide a world where content and utility on that content are available headlessly then I think
we are in a good position.