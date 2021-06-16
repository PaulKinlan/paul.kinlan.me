---
slug: bcd-a-hidden-web-compat-gem
date: 2021-06-13T01:30:29.419Z
title: "Browser Compat Data - developer gold"
summary: 
tags: ["web compat", compatibility, bcd]
draft: true
---

Every year developers tell us that Web Compat is their top developer frustration. It's great to see my team spin up projects like [Compat 2021](https://web.dev/compat2021/) which help address the pain points developers have day to day, but is the situation getting better?

I'm dedicating a lot of my time and my teams time to helping improve Compatibility. I know it's the correct thing to do, but at some point you have to justify you and your teams investments. I'm currently in that phase, and I'm deep in the weeds of trying to understand if broadly the web is becoming more compatible.

I *think* web is getting more compatible... but, I don't actually know if it is. Is it an incorrect perception? Is my thesis about the [lumpy web](https://paul.kinlan.me/the-lumpy-web/#:~:text=In%20no%20uncertain%20terms%20the,user%20can%20use%20the%20Web.) correct? We need data.

Since the Lumpy Web post, a lot more data is available to Web Developers and I am hoping that *this* post can shine some light on the work being done to help us all understand the shape of the web platform.

[https://caniuse.com](caniuse.com) is awesome and it's still the primary resource for many web developers when understanding the web. It's an incredible tool that let's you quickly search for an API and see if you feel comfortable using it given it's level of support. It even has data available for you to query - I've build tools that use's it's data ([I want to use](https://iwanttouse.com)). I don't envy [Alexis](https://github.com/Fyrd/caniuse) though, it's incredibly hard to keep up to date 1) Because the web platform is massive, and 2) it changes frequently with additions and removals of APIs.

There is one true source of Web Compat data, at least as I understand it: Web Platform Tests (https://wpt.fyi/). Web Platform Tests is a common test suite that is run across a range of browsers and it let's you see if the engines are broadly conforming to what is described in the Specs.

I've spent a lot of time looking at [wpt.fyi](https://wpt.fyi/) and it's incredible. The test suite is huge (it  even has it's own query language), but it's not really meant for the typical web developer. It's intended use is for the creators of Browser Engines to help them see where they are as compared to other browsers.

It turns out that Mozilla created a middle-ground: Something between the raw data needed for caniuse and a comprehensive but consumable view of the data from WPT called "[Browser Compat Data"](https://github.com/mdn/browser-compat-data)(BCD). The MDN team did a lot of the [heavy lifting to work out the browser support for each API](https://github.com/mdn/browser-compat-data/blob/main/docs/contributing.md#finding-browser-version-numbers-for-features) and integrate it into MDN compatibility tables.

[The project is active too](https://github.com/mdn/browser-compat-data/pulse/monthly), with a lot of work done by the Open Web Docs team and includes a comprehensive [Governance](https://github.com/mdn/browser-compat-data/blob/main/GOVERNANCE.md) model. Even better, the data is [accessible](https://www.npmjs.com/package/@mdn/browser-compat-data).

I have lots of questions about the state of the web.

* What was the latest browser versions at the end of 2020
  * What API's did they have?
  * 

I'd love to see more tools such as Chrome DevTools integrate this data to help developers quickly understand how well supported their sites will be.

---

Vinyl, if you are reading this, thank you.
