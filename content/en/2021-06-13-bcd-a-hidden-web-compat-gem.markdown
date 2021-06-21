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

I _think_ web is getting more compatible... but, I don't actually know if it is. Is it an incorrect perception? Is my thesis about the [lumpy web](https://paul.kinlan.me/the-lumpy-web/#:~:text=In%20no%20uncertain%20terms%20the,user%20can%20use%20the%20Web.) correct? We need data.

Since the Lumpy Web post, a lot more data is available to Web Developers and I am hoping that _this_ post can shine some light on the work being done to help us all understand the shape of the web platform.

[https://caniuse.com](caniuse.com) is awesome and it's still the primary resource for many web developers when understanding the web. It's an incredible tool that let's you quickly search for an API and see if you feel comfortable using it given it's level of support. It even has data available for you to query - I've build tools that use's it's data ([I want to use](https://iwanttouse.com)). I don't envy [Alexis](https://github.com/Fyrd/caniuse) though, it's incredibly hard to keep up to date 1) Because the web platform is massive, and 2) it changes frequently with additions and removals of APIs.

There is one true source of Web Compat data, at least as I understand it: Web Platform Tests (https://wpt.fyi/). Web Platform Tests is a common test suite that is run across a range of browsers and it let's you see if the engines are broadly conforming to what is described in the Specs.

I've spent a lot of time looking at [wpt.fyi](https://wpt.fyi/) and it's incredible. The test suite is huge (it even has it's own query language), but it's not really meant for the typical web developer. It's intended use is for the creators of Browser Engines to help them see where they are as compared to other browsers.

It turns out that Mozilla created a middle-ground: Something between the raw data needed for caniuse and a comprehensive but consumable view of the data from WPT called "[Browser Compat Data"](https://github.com/mdn/browser-compat-data)(BCD). The MDN team did a lot of the [heavy lifting to work out the browser support for each API](https://github.com/mdn/browser-compat-data/blob/main/docs/contributing.md#finding-browser-version-numbers-for-features) and integrate it into MDN compatibility tables.

[The project is active too](https://github.com/mdn/browser-compat-data/pulse/monthly), with a lot of work done by the Open Web Docs team and includes a comprehensive [Governance](https://github.com/mdn/browser-compat-data/blob/main/GOVERNANCE.md) model. Even better, the data is [accessible](https://www.npmjs.com/package/@mdn/browser-compat-data).

I have lots of questions about the state of the web.

- What was the latest browser versions at the end of 2020 and what APIs did they have?
- What APIs can I use if I target WebKit, Gecko and Blink?
- What APIs are in Safari, but not in Blink? i.e, What is in X but not in Y?
- How compatible is the web?
- etc.

It would be great if you could query that data. Well, it turns out you can.

BCD has an NPM module that contains all that data.

So I built a simple of Demo: [The Web Of ...](https://the-web-of.glitch.me/) - it takes the BCD data and for any given date it will work out what browser versions were available filtered by your preferred set of browsers (i.e, Chrome, Safari, Firefox etc - defaulting to all measured browsers) and then filtered by the area of the web platform you care about the most (APIs, HTML, CSS etc.)

<picture>
  <source 
    type="image/avif"
    sizes="100vw"
    srcset="/the-web-of-bcd/the-web-of-bcd-2470.avif 2470w, 
		/the-web-of-bcd/the-web-of-bcd-1235.avif 1235w, 
		/the-web-of-bcd/the-web-of-bcd-824.avif 824w, 
		/the-web-of-bcd/the-web-of-bcd-618.avif 618w, 
		/the-web-of-bcd/the-web-of-bcd-494.avif 494w, 
		/the-web-of-bcd/the-web-of-bcd-412.avif 412w, 
		/the-web-of-bcd/the-web-of-bcd-353.avif 353w, 
		/the-web-of-bcd/the-web-of-bcd-309.avif 309w">
  <img 
    alt="The author should add a description of what appears in the image."
    src="the-web-of-bcd.png" 
    srcset="the-web-of-bcd-2470.png 2470w, 
		/the-web-of-bcd/the-web-of-bcd-1235.png 1235w, 
		/the-web-of-bcd/the-web-of-bcd-824.png 824w, 
		/the-web-of-bcd/the-web-of-bcd-618.png 618w, 
		/the-web-of-bcd/the-web-of-bcd-494.png 494w, 
		/the-web-of-bcd/the-web-of-bcd-412.png 412w, 
		/the-web-of-bcd/the-web-of-bcd-353.png 353w, 
		/the-web-of-bcd/the-web-of-bcd-309.png 309w"
    sizes="100vw"
    loading="lazy"
    decoding="async"
    height="2064"
    width="2470"
    style="content-visibility: auto; max-width: 100%; height: auto;">
</picture>

This is just a simple demo of what is possible once you have the data at your finger tips. The source code is [here](https://github.com/PaulKinlan/the-web-of.

I'd love to see more tools such as Chrome DevTools integrate this data to help developers quickly understand how well supported their sites will be.

---

Vinyl, if you are reading this, thank you.
