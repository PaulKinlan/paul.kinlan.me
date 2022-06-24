---
title: Thinking about Web Platform Stability
date: 2022-06-21T07:55:53.888Z
draft: true
summary: I've been thinking a lot about the work that we need to do to help
  developers navigate the changes in the platform and bring a bit more stability
  to how they work.
tags:
  - developerexperience
  - devsat
  - mdn
  - interop
  - compat
slug: thinking-about-web-platform-stability
---
We run a lot of surveys (Quarterly sampled data and via our [Insights community](https://paul.kinlan.me/web-developer-insights-community/)) to try and understand the needs of developers and one of largest and most consistent things that the ecosystem [tells us is that it's too hard to keep up with all of the changes coming to the platform](https://paul.kinlan.me/top-web-developer-pain-points-in-2021/#:~:text=n%3D738-,Keeping%20up%20with%20changes%20to%20the%20web%20platform/web%20standards,-27%25). 

We thought about it a lot on the Chrome Developer Relations team ([all the way back in 2019](https://paul.kinlan.me/thinking-about-developer-satisfaction-and-web-developers/) through to [today](https://web.dev/deep-dive-into-developer-pain-points/)) and I realised that we've never really shared our thinking about what the data tells us and how we chose to respond. There is a lot of complexity and lots of small pieces of work that have happened.

I start with the general hypothesis that when people build for the web they consider all the browser that they have to target. At the same time, Google, Apple, Mozilla and all the other browser vendors have their own priorities for how they decided on which features to land and when.

All of these differing priorities and cadence of fixes and feature releases have made it hard for developers to stay up to date. Not to mention that many developers believe that when we say "Web Platform" they think of the abstractions that they also use in the browser, which includes Frameworks, CMS, libraries and tooling and by extension the ecosystems that these projects live in.

There's just a huge amount that developers have to keep on top of.

I can't control other browsers or abstractions (and have no desire to), I don't control the Chrome browser so we can only work to influence their thinking. I am however, very lucky to have a lot more influence over how we work with developers, how we listen to them, how we support them, and how we communicate with them.

After a lot of analysis in 2018 and 2019 it was clear that there were many opportunities to improve developers experience of web development, specifically in the following areas:

* **Lack of clarity about what is available on the platform** - It was nearly impossible to know what features are available across browsers and when they became available (caniuse has been a great resource)
* **Missing reference documentation** - there are a significant number of missing interface references (anywhere between 1500-2500), there was also a large contingent of Chrome-first features too that were undocumented.
* **Chrome's constant push for new features** that are only available in Chrome either for a significant amount of time (or ever) can be very distracting to developers.
* **Browsers deprecating and removing features** 

So... what have we done?

**Understanding "the Web Platform"** - We realised early on that we don't actually know what is available to developers across the browsers that they have to work with. I was very happy to see that Mozilla started the [Browser Compat Data](https://paul.kinlan.me/bcd-a-hidden-web-compat-gem/) (BCD) project and it's an area that I wanted to make sure that we could invest in more.

It's a hard job that requires a lot of specialist knowledge on how to inspect browser source code and web platform tests, but over the last year or so [Queen Vinyl Da.i'gyu-Kazotetsu](https://www.queengoob.org/) and many others have made [huge strides in getting this data source to be as accurate as possible](https://github.com/mdn/browser-compat-data/graphs/contributors). This data is critical for any team that talks about Web Development to be able to clearly communicate how their work can fit into what is available and it's amazing to see the improvements. I'm excited to see more innovation in the area of developer tooling once we have this data.

Once we (my team) are able to understand the state of the web we can be a lot clearer and more precise when we communicate about the Web Platform.

**Communicating about "the Web Platform"** - One of the areas that I'm happy to see progress on is how we've started to change how we talk about the Web and Chrome's place in that ecosystem. 

Rachel Andrew came on-board to help us create a clear story for developers across our sites and make it easier for developers to focus on holistic web and understand when it's Chrome-first or Chrome-only. It's a harder problem to solve because over the years we've accreted developer sites on to the web: HTML5Rocks, developers.google.com/web, developer.chrome.com, web.dev to name a few and we've not done a good job at delineating them, or having a clear focus for each of these properties. Web.dev in particular was always meant to be "the book on modern web development", and it just kinda accidentally turned in to a place where we talked about all new Chrome features because it was the easiest place to publish too.

web.dev/learn is a lot more aligned to our original intention, and I'm very happy to have been able to bring on a lot of industry experts such as Andy Bell, Jeremy Keith, [Michael Scharnagl](https://twitter.com/justmarkup) and Maximiliano Firtman to focus on CSS, Design, Forms and PWA's. I'm looking forwards to some of the other areas in development such as HTML, Images and Accessibility.

It's also been great to see [New to the Web Platform](https://web.dev/tags/new-to-the-web/) starting to ramp up as we try and make it easier for developers to have one place to follow each month with the latest additions and removals that come to the platform.

Google IO 2022 was a nice moment where we changed how we communicate updates to the web platform as a whole - our goal was to give developers confidence about which features can be used where and when. Jake and Una did a great [keynote session](https://www.youtube.com/watch?v=5b4YcLB4DVI) which was a nice change from our traditional keynote sessions. Rachel Andrew talked about [Bridging the Gap](https://web.dev/bridging-the-gap/) which is a far better summary of what I am talking about right now :D

That all being said, Chrome is still working on features that might not be available broadly across the platform for a long time, but that developer narrative has a clearer place on developer.chrome.com.

**Improving Developer's experience** - It's cool to talk about the issues and some of the narrative tweaks that we've made, but in practice these are only small changes (but useful, I'm told). There are actual real problems that developers have every day building sites and software that run in the browser. Specifically, Compat, Interop and poor reference materials.

It was great to see the Compat 2021 project take off and bring real improvements to some major areas of frustration in the platform, and it was even better to see this morph into the [Interop 2022](https://web.dev/interop-2022/) project that has continued to make meaningful strides in bridging the gap (heh - Rachel!) in the needs of developers and the browsers they have to get their experiences working in.

I believe that a more interoperable and compatible platform that developer can rely on will breed just as much innovation as 

At the same time we started to track MDN - Open Web Docs