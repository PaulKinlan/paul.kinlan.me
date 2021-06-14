---
slug: bcd-a-hidden-web-compat-gem
date: 2021-06-13T01:30:29.419Z
title: "Browser Compat Data - developer gold"
summary: 
tags: ["web compat", compatibility, bcd]
draft: true
---

Every year developers tell us that Web Compat is their top developer frustration. It's great to see my team spin up projects like [Compat 2021](https://web.dev/compat2021/) which help address the pain points developers have day to day, but is the situation getting better?

I'm dedicating a lot of my time and my teams time to helping out. I know it's the correct thing to do, but at some point you have to justify you and your teams investments. I'm currently in that phase, and I'm deep in the weeds of trying to understand if broadly the web is becoming more compatible.

I think it is... but, I don't actually know if it is. We need data.

I've spent a lot of time looking at [wpt.fyi](https://wpt.fyi/) and it's incredible. Web Platform Tests is a common test suite based that is run across a range of browsers and it let's you see if the engines are broadly conforming to what is described in the Specs.  The test suite is huge, it even has it's own query language, but it's not really meant for the typical web developer, it's intended use is for the creators of Browser Engines to help them see where they are as compared to other browsers.

A more web developer consumable resource that we are more familiar with is [https://caniuse.com](caniuse.com). It's an incredible resource that let's you quickly search for an API and see if you should use it or not.

 (I've build tools that use's it's data - [I want to use](https://iwanttouse.com/)).

It turns out that Mozilla, when they were building their Compat tables created "[Browser Compat Data"](https://github.com/mdn/browser-compat-data
) that they integrated into each article did a lot of the heavy lifting to work out the browser support.

[The project is active too](https://github.com/mdn/browser-compat-data/pulse/monthly)

The data is also accessible.

I have lots of questions about the state of the web.

* What was the latest browser versions at the end of 2020
  * What API's did they have?
  * 

I'd love to see more tools such as Chrome DevTools integrate this data to help developers quickly understand how well supported their sites will be.

---

Vinyl, if you are reading this, thank you.
