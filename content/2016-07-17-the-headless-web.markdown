---
slug: the-headless-web
date: 2016-07-17
title: "The Headless Web"
description: "Do we need a browser in the future?"
image_header: "/images/headless.jpg"
draft: true
---

In 2014 I was honoured to speak at Fronteers in Amsterdam (I would heartily recommend it).  I was attempting to 
talk about the state of the web platform, where it was, where it is, and where it will be.

Where it is, I covered recently in [The Lumpy Web](/the-lumpy-web). It covers the state of inconsistent feature 
support and the pain that it can cause developers.  Where it (the web) will be, I touched on briefly as something
I was calling "The headless web".

<script async class="speakerdeck-embed" data-slide="16" data-id="7105f980347a013238ed56e996df704e" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

Many of us are already familiar with a "Headless Browser", it is an instance of a web browser that the user can't
see and doesn't interact with, and to most people that seems to be useless.  For developers, we've mostly used these Headless
Browsers for automated testing of user-interfaces.  If you take it one step further, many of the modern search engines run a
browser behind the scenes to be able to themselves to execute JavaScript so that the content you host using you preferred
framework of choice will still render and the data will then be indexable. But I think headless browsers offer us a lot more,
in fact I think they are a core part of the future of the web for businesses and services and hopefully I can explain that 
in this post.

The Headless Web I posited was a web where the user only lightly ever interacts with a web page in a web browser. Instead,
the user experience is still expressed in HTML and executed with JavaScript but you might just visit a web page once
to build a long term relationship with it.  You might never actually ever visit the site directly.

I saw this being in at least three types of interactions:

* Interactions with Notifications - Web sites or apps could create little app like experiences that you
  interact with directly, for example: like a photo, there is no need to ever open a web page to be able to do this interaction.  My 
  early thought about this, is that the Service Worker is the key enabler for interactive headless experiences.
* Local discovery, aka "The Physical Web" - URLs that are broadcast around you could have contextual actions expressed in their site via
  something like schema.org verbs and nouns. That way rather than visit the site to buy that movie ticket, it 
  is integrated directly in to the notification about the beacon.
* Embedded Content - Google Now as an example of this in action today. Data is expressed in a page either via HTML or schema.org 
  and it is presented to the user in a form that might not be how it was represented in the page. Movie listings for example could
  be aggregated and be applied with other data such as ratings and reviews from other sites.

It turns out there are many more ways that we can think about the Web without a browser, but this is how I was looking at it at the
time. 

There is an pessimistic way to look at this and an optimistic one:

* **Glass half empty**: It spells the end for web developers, UI designers and the web at large.
* **Glass half full**: Content is open, available everywhere and more composable than ever, all hosted and powered by the web.

Jump forward a year, I was at Coldfront Conf 2015 where Kenneth Auchenberg had asked me to talk about "The headless web" (and to
my shame, I never really got to it in that talk). Instead I focused on the [Future of the mobile web](/future-of-web-on-mobile-coldfront-conf)
which was more directly concerned about the [The Rise of meta platforms](/rise-of-the-meta-platforms) as expression of 
the headless web.

<script async class="speakerdeck-embed" data-slide="37" data-id="b9db06014c9047e7bee3db08b2d036c1" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

The web as we see it is accessed through a browser on the users home screen, be it Safari on iOS or Chrome on Android and that is what
we worry about. We Web Developers worry about a web that is accessible and usable inside a browser at the very time that what a "web browser" is, is changing.

The content and tools we are creating are being consumed in an experience that is not the traditional browser.

* Apple News
* Google AMP content (I don't think this was a thing when I was talking about Metaplatforms)
* Facebook WebView, Facebook Instant Articles
* Chrome custom tabs
* WeChat

The interesting thing about this is that because these platforms control the viewing experience, they can start to inject
their own platform capabilities and API's into the web.

### Progressive Web Apps are the table stakes

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
fitness layer in to Android all the way back to Android KitKat without changing the underlying operating system.

Why am I talking about fitness?  Well in this case it is a higher abstraction of a set of
individual sensor APIs that we don't have on the web, and it highlights the gaps we have: 

1. Our API surface is still immature - Sensors are still not a fully solved problem
2. Our development model is diverse and disparate - 

This cadence of Native platforms is interesting to follow, I am going to bet that iOS soon
starts to update the core platform incrementally - I believe it is starting with the unbundling
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
the point is that Mobile platforms, heck all platforms are competing in the [SLICE](/slice-the-web) space.

The web is catching up, and we've more that we absolutely must catch-up on but we need to work out a way
that keeps us differentiated whilst keeping to our principles of Openness and SLICE.  I think the idea
of the headless web is one of those that can help us.

### What if everything was powered by "The Web", but you never saw a browser?

Service Worker *is* the platform piece that allows this, but it really is focused at the local user level. The
user has to have the Service Worker registered, but once we do system events at platform level can potentially
allow us to quickly build and deploy any headless experience that we want.  Right now the UI would still be
notifications.  The great thing is, this is already happening.

I don't claim any connection between my talks and the Guardian, but it is happening.
The Guardian.. example notifications.

### Tools

Headless Browsers

* [Headless Chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=546953)
* [Phantom](https://github.com/ariya/phantomjs) &mdash; Headless WebKit with a scripting API layer on top.
* [SlimerJS](https://slimerjs.org/)

Extractions

[DOM Distiller](https://github.com/chromium/dom-distiller)
[Mozilla Fathom](https://github.com/mozilla/fathom)


Expressing Meaning

* [AMP](https://www.ampproject.com/)
* [Schema.org](https://schema.org)

### Problems we face

The Semantic Web as we know it has not and may not work.

The incentives aren't fully there for marking up schema.org data.

Scale isn't yet there.  We've been running these tools as individual instances of the browser to run 
our test suites. We need to get scale at being able to run hundreds, if not thousands of instances
of the browser.