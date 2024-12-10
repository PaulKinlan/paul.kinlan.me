---
date: 2019-04-05 20:36:42.790000+00:00
link: https://webkit.org/blog/8718/new-webkit-features-in-safari-12-1/
slug: new-webkit-features-in-safari-12-1webkit
summary: Safari 12.1 introduces significant updates for web developers. Notably, Apple
  now recommends using the Payment Request API for Apple Pay implementations on the
  web.  This shift aligns with broader industry efforts towards standardized payment
  methods, though it contrasts with Google's prior emphasis on their Google Pay library.  Additionally,
  the new Web Share API empowers developers to trigger native sharing functionalities
  on the user's device via `navigator.share()`. This allows for seamless content sharing
  across various apps and contacts, enhancing user experience.  While the Share Target
  API is still anticipated, this release marks substantial progress in web sharing
  capabilities.
tags:
- safari
- webkit
- apple pay
- payment request api
- web share api
- ios
- web development
- updates
title: New WebKit Features in Safari 12.1 | WebKit

---
Big updates for the latest Safari!

I thought that this was a pretty huge announcement, and the opposite of Google which a while ago said that Google Pay Lib is the recommend way to implement payments... I mean, it's not a million miles away, Google Pay is built on top of Payment Request, but it's not PR first.

> Payment Request is now the recommended way to pay implement Apple Pay on the web.

[Read full post](https://webkit.org/blog/8718/new-webkit-features-in-safari-12-1/).

And my favourite feature given my history with Web Intents.

> ### Web Share API
> 
> The Web Share API adds navigator.share(), a promise-based API developers can use to invoke a native sharing dialog provided the host operating system. This allows users to share text, links, and other content to an arbitrary destination of their choice, such as apps or contacts.

Now just to get Share Target API and we are on to a winner! :)
