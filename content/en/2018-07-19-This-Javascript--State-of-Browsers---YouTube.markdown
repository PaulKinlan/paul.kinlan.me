---
slug: this-javascript--state-of-browsers---youtube
date: 2018-07-19T15:06:53.251Z
title: 'This.Javascript: State of Browsers - YouTube'
link: https://www.youtube.com/watch?v=67etFbKTOFA
tags: [links, browsers, chrome, mozilla, edge, beaker, brave, pwa]
---
Tracy Lee from This Dot organised a rather neat live-stream that brought in many of the browser vendors to give an overview of what they are working on:

> Browser representatives from Brave, Beaker, Edge, Chrome, & Mozilla get together to talk about recent updates and the state of browsers.
> 
> Featured Speakers:
> 
> + Brendan Eich - &#x00a0;Creator of Javascript, Co-founder & CEO at Brave Software
> + Paul Frazee - Works on Beaker Browser
> + Matthew Claypotch - Developer Advocate at Mozilla
> + Paul Kinlan - Senior Developer Advocate at Google
> + Patrick Kettner - Edge at Microsoft
> + Amal Hussein - Senior Open Web Engineer at Bocoup
> + Tracy Lee - GDE,&#x2008;RxJs&#x2008;Core&#x2008;Team, This Dot Co-founder

[Read full post](https://www.youtube.com/watch?v=67etFbKTOFA).

I thoroughly enjoyed the live stream and it was great to hear what everyone is up to. I also love the vision that Beaker Browser has for a distributed web, they've done a lot of work since the last time that we met.

I encourage you to watch the linked video, Edge has had a huge amount of updates including full Service Worker support, variable fonts and also they are introducing WebP. Mozilla have a huge focus on Web Assembly and developer tooling, Beaker is doing amazing things with dat: and distributed computing and Brave has been moving along alot on BAT.

I focused on the work that our team is doing at the moment, and it's broadly around Discovery, Speed and Reliability, UI Responsiveness, UX - Get stuff done, Security and Privacy. A little more concretely:

* Discovery - we really need to make it easier for developers to build sites with JS that render in headless services such as indexers and embedders. That means we need to focus on educating developers in how indexers work and how to test against them, and also how to build good solid SSR experiences.
* Speed and Reliability - All sites should have a TTI < 5s on 3g network on the Median device (a MotoG 4/5) and you should optimize your FID (first input delay). FID is a new metric, so it's important to understand that it's meant to represent how your users experience your site in the wild, where TTI has been hard to measure, FID should be easier. There is a [polyfill here that you can use to test FID](github.com/GoogleChromeLabs/first-input-delay)
* UI Responsiveness - We would like the web to be 60fps everywhere and make it easier for developers to achieve, so we are working on making 
 &#x2018;FLIP&#x2019; easier to understand, building out Houdini so we can give developers a lot more control over the rendering enging and finally trying to move as much work as possible 'off-main-thread' via things like img.decode and tools like comlink to making workers easier to use.
* UX - Get stuff done - We really want to change the way that we talk about new features coming to the platform, specifically we would like to make show where technology should be effectively used to improve users experiences to help them get their work done quickly with as little interruption as possible.
* Security and Privacy - I think Apple's Intelligent Tracking prevention is going to have a long term impact on the web and developers need to start to think more about building privacy supporting web experiences. If anything GDPR is making the web an 'interesting' experience in the EU.

Finally, it was humbling and heart-warming to hear that everyone wants to bring back [Web Intents](https://en.wikipedia.org/wiki/Web_Intents) :)
