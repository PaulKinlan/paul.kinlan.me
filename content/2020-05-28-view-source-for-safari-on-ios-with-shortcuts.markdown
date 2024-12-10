---
date: 2020-05-28 20:11:14.887000+00:00
link: ''
slug: view-source-for-safari-on-ios-with-shortcuts
summary: I created a shortcut for iOS that lets you view the source code of web pages
  in Safari and Chrome.  It's a workaround for the lack of a built-in view-source
  feature on these mobile browsers.  The shortcut shares the URL to a third-party
  website I built which then displays the source code. Because it uses a third-party
  site, it won't reflect the current state of the page if you are logged in or have
  specific cookies set.  Hopefully, Safari and Chrome will eventually bring back a
  native view-source option.
tags:
- ios
- safari
- chrome
- view-source
- shortcuts
- mobile web
- web development
title: View Source for Safari on iOS with Shortcuts

---

I love [view-source](https://en.wikipedia.org/wiki/View-source_URI_scheme), it's a nifty super power of the web that nearly all mobile browsers are trying to kill. Not exactly sure why. View-source is what got me into web development because I could see how other people structured their pages, and at the time I started web development it was pretty much the only way to debug web pages.

I've also been using my iPad Pro whilst I am not at work for the next month or so... It's a great device, and it appears to be locked down in a way that restricts me from doing exactly what I want... this is until I found out about the Shortcuts app that is built in to iOS.

Shortcuts let you build small utilities, programs and automations that perform actions on certain user gestures like "Share a Page", or "Open an app", or "Connect to WiFi".

Now that I can share URLs to an "app", I can do a lot of things that are not really possible on mobile devices.

I created [this "View Source" shortcut](https://www.icloud.com/shortcuts/7ec2af9dfa6a4a0aa8ddfc765b2e63c1) that you can use (if you trust me) to Share a page from Safari or Chrome and quickly view the source.

Here it is in action:

<figure><img src="/images/2020-05-28-view-source-for-safari-on-ios-with-shortcuts-0.jpeg" alt="View Source in the Share Sheet"></figure>

<figure><img src="/images/2020-05-28-view-source-for-safari-on-ios-with-shortcuts-1.jpeg" alt="View Source of this site"></figure>

There is one major caveat. It doesn't inspect the exact instance of the page you are running, it has to the page in a 3rd party site that I built (https://www-source.glitch.me) / [source](https://glitch.com/edit/#!/www-source) - this means that if you are logged in, or there is any state that is shared (such as cookies) then it will *not* display the same content that you are viewing.

It's kinda hard to share the source code of a Shortcuts, so here is a screenshot:

<figure><img src="/images/2020-05-28-view-source-for-safari-on-ios-with-shortcuts-2.jpeg" alt="View Source Code"></figure>

Have fun.

I really hope that Safari (and Chrome) can deprecate the need for this shortcut.

