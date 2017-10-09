---
slug: challenges-for-web-developers
date: 2017-07-28T13:20:31+01:00
title: "Challenges for web developers"
description: ""
draft: true
---

After sharing the [Web and Chrome DevRel manifesto](/web-developer-relations-manifesto) I 
wanted to keep up the pace of share my thoughts in some of the challenges
that we want help developers solve.

Understanding the challenges that developers face every day help me work out how 
we can change the way we work to help as many developers as possible.

I would love your feedback.

## Web Development is easy to start, but hard to make progress and master

* Variable API support and vendor priorities make building a consistent 
  experience hard or impossible to build.
* Legacy considerations, e.g. old CMS, existing implementations mean that there 
  is a huge momentum that needs to be overcome.
* Platform quirks and compat problems 
* There are a large number of abstractions being created that take developers 
  away from an understanding of the platform.
* Lack of platform-level primitives for app-like interactions: views, models, 
  controllers, recyclers, hero transitions, view transitions.
* Web Developers have to be good at everything: Offline, Accessibility, 
  Localisation, Performance, Security...

## Developers are getting excited about PWA, but they can be hard to build and hard to do well

* Lack of main browser support for PWAs makes it hard to justify building one
* End to end it's too hard to build a progressive web app. HTTPS, Service 
  Workers are all hard to get started with.
* The value of PWA is not clearly articulated especially across OS's (Safari, 
  Desktop etc)
* It's nearly impossible to build an "exemplary PWA" and no one really cares
* Developers frequently have to start again and don't migrate their existing 
  experiences
* Developers and Businesses don't know why they should build a progressive web 
  app
* Findability of existing web apps
* "Progressive" is not valued. Hard to offer a consistent experience/features 
  missing from different web browsers/operating systems
* The progressive web apps that are being built are not responsive and thus 
  increase maintenance costs since you have to look after a separate desktop 
  site

## It is too hard to build a well functioning experience (UI/UX)

* The Good-enough bar for developers is way too low. What is good? Why is it 
  important? How do you get there?
* It is easy to be a bad actor when building components, A11Y, layout and 
  performance are hard to build and not prioritised by developers
* Developers don't see the value in web components and platform tools to help 
  them build quickly
* Framework authors don't believe that web components should be used
* Developers want a UI framework like Bootstrap to take away the UI pains and 
  lets them focus on the product
* The primitives for many experiences are too hard to build and build well: 
  menus, nav, transitions, takeovers, data-binding, views, controllers
* It is hard to build performant experiences - Primitives are an issue 
* Uneven support for API's like animations make it impossible for developers to 
  adopt new platform primitives

## It's too hard to build a performant site

* Web Developers are building slow experiences that have terrible UX and are not 
  accessible. They want to do better but they don't know how.
* Developers and Businesses don't prioritize performance because there is no new 
  clear guidance about the impact it can have on their business
* Developers don't understand why a site is slow
* It is too hard to build a fast loading site - there are many footguns and many 
  browsers.
* Developers don't know what the goals that they need to aim for are
* Developers don't have the guidance they need to reach the goals set to them 
  (PRPL pattern, route-based chunking, streaming are fringe concerns at the 
  moment and don't have concrete docs etc)
* Developer tooling and frameworks are not fast by default and developers don't 
  know or care - bundling is a huge issue - DX &gt; UX.
* Developers don't test on the hardware that their users run on and thus it 
  feels "good enough"
* Developers don't have all the information about their user base and the impact 
  that their decisions have on them
* Developers prioritize load performance more than they prioritize "in page" 
  performance
* It is too hard to get your site UI to operate smoothly across all devices
* Public Perf shaming is increasing and is putting developers-off from caring
* Developers feel like we are beating them over the head all the time and thus 
  turn-off.

## It is too hard to build a secure site

* Migration to HTTPs is a blocker for adoption of many new pieces of tech
* Developers and businesses don't see the need in making their sites secure 
  (i.e, why do I need this for a news site)
* It is hard to set up HTTPS
* It can still be expensive for developers to set up an HTTPS site - not 
  everyone can use LetsEncrypt. Large and Small sites are having to pay a lot 
  more for the priviledge.
* Developers don't understand the value of "Secure technologies" such as CSP and 
  they are seeing low adoption

## Businesses and Developers don't know why they should "Web"

* Converting a user on mobile web is difficult so making money is hard
* Business cases and needs vary by region, vertical, and audience so are hard to 
  apply in a meaningful way.
* Apparent lack of capabilities mean that it feels like you should not use the 
  web
* Web is just moving to an app model so why not just do the 'app'
* Lack of cross browser support for key API's makes it hard for businesses to 
  justify their investments

## The web is lumpy and causes developers a lot of pain

* Browsers are frequently changing either via additions or tactical removals of 
  the web platform and they don't know what is happening, how to stay up to date 
  or how to change. This causes developers pain.
* Chrome is constantly breaking the platform with their "interventions"
* Browser update cycles create uncertainty and "shifting sands"
* The platform players are not all aligned. Safari, UC, Edge and have different 
  priorities
* Developers have to make everything work everywhere (from iOS to UC Browser) 
  and they have the tools, guidance or data to back up their decisions.

## The web is a vibrant ecosystem, but noisy

_[PK: meta comment - consistency in narrative, one voice, strong guiding hand.]_

* There is a huge amount of opinion being generated each day and also best 
  practice being defined that is neither accurate or exhaustive and developers 
  are looking to Google to present a unified and opinionated guide.
* There are a huge number of tools, libraries and frameworks being built and 
  developers don't know what to choose.
* Google has a large number of frameworks and developers aren't sure what to 
  use.
* We create a lot of content and it is not presented uniformly.
* Lots of competing tools and developers don't know which they should use
* Lots of competing frameworks and developers don't know which they should use
* Lots of competing advice and developers don't know which they should follow or 
  trust

## The web is global

* Developers are not just English speaking. Many developers are coming from 
countries we have never targeted: China, India, Indonesia, Thailand, Pakistan 
etc; and we need to help them.

----  
**Lewis scratch area:**

1. **The business case for building on the web is poor or insufficient**
    1. The web is not seen as "the cool option". (Native's appeal is 
       increasingly hard to realize, i.e. few lottery winners).
    1. Business cases and needs vary by region, vertical, and audience so are 
       hard to apply in a meaningful way.
1. **The web is easy to begin with, hard to master**
    1. Variable API support and vendor priorities.
    1. Legacy considerations, e.g. old CMS, existing implementations.
    1. Platform quirks and compat problems.
    1. Lack of platform-level primitives for app-like interactions: views, 
       models, controllers, recyclers, hero transitions, view transitions.
1. **Tooling and frameworks are not geared towards the web as a streaming 
   application platform**
    1. View-based chunking, loading, unloading and management remain "at-large" 
       issues.
    1. Frameworks compete on developer ergonomics, not the shipped code (beyond 
       trivial bytes-over-the-wire).
    1. Developer tooling does not make it abundantly clear what success looks 
       like across a range of metrics e.g. performance, a11y, security, UX, nor 
       intervenes during development to dissuade implementations that veer from 
       that path of success.
1. **The web is a vibrant ecosystem, but noisy**
    1. Lots of competing tools.
    1. Lots of competing frameworks.
    1. Lots of competing advice.
    1. Browser update cycles create uncertainty and "shifting sands".

--

Addy random thoughts:

1. **Frameworks and their toolchains are not yet offering an out-of-the-box PWA. 
   Most were written with a desktop audience in mind & are still playing 
   catch-up.**
    1. "Baseline support"
        1. Most of the popular ones (including React as of last week) have 
           committed to trying to support PWAs via their CLIs. We're making 
           progress but it will take at least a quarter - we also need to get 
           them shipping far less code. 
        1. Most frameworks are still chasing hitting our performance targets on 
           mobile & need work to slim down startup times. React are punting this 
           to React Fiber. Angular will hit it post Angular 4.x (AoT, new view 
           compiler, SW support by default). Vue, Preact, Inferno already have 
           small bundles. Ember are experimenting with reducing their bundle 
           sizes.
        1. Most frameworks do not yet have an official PWA page on their sites. 
           We're working on fixing this but it's another thing missing. 
    1. "Exemplary"
        1. Support for the PRPL pattern, route-based chunking, streaming etc is 
           still a fringe concern that only advanced developers have been 
           exploring. We _need_ to make it easier to use these patterns. Whether 
           it's by creating better reference examples in each framework or 
           creating 
           [plugins](https://github.com/GoogleChrome/preload-webpack-plugin) 
           that ease the trickier parts.
        1. There are only a handful of sites that have shipped PRPL support - 
           Twitter, Housing, Flipkart. We could make a bigger deal of the wins 
           seen by investing in route-based chunking patterns by writing up case 
           studies of this work in the same way we have business case studies 
           for PWAs. 
        1. More technical case studies around exemplary PWAs in general would 
           also be welcome.
1. **Adding to Paul L's "business case for building on the web is insufficient 
   or poor"**
    1. Many of the mobile web experiences I visit will throw up a bar saying 
       their native experience is significantly faster and more feature-rich 
       (e.g Reddit)
        1. We've talked to a lot of our own apps PAs this quarter (GMail, 
           Drive/Docs, etc) - most eng teams wanted to invest in PWA. Most of 
           their decision makers haven't supported because they already have the 
           native app, a team staffed to work on it and Play Store integration. 
           If we can tell more stories (like Flipkarts) around the value of 
           switching back to just shipping on the web and not maintaining 
           umpteen codebases that could be useful. WebAPKs coming to the Play 
           store can't come soon enough :/
        1. I feel we could do a better job showing high-performance UX can be 
           accomplished on the web today - e.g &lt;iron-list&gt; for infinite 
           scrolling a la recycler-view is gold. Beyond the Fizz/Capabilities 
           team backlog, do we have a list of other gaps keeping folks in native 
           land? 
1. **It's perceived (even if incorrectly) that we ignore the elephant in the 
   room**
    1. We could do a better job of expanding on what mobile-specific UX and 
       offline considerations are still possible on Safari for a 'lightweight' 
       PWA experience. Doesn't have to talk about AppCache.
    1. Internally, many have said if they were a startup they'd go for PWA on 
       Android and still a native app for iOS. It's unclear that this is a 
       position we think is fair externally. "But, progressive enhancement!" 
       isn't always viable to businesses when their CTOs are unable to get the 
       PWA experience on their iPhone.
1. **Google doesn't offer great insight into the value proposition of optimising 
   for the metrics our team pitch in the PWA space (time-to-interactive, 
   first-meaningful-paint etc)**
    1. UKM + transparency reports may help here. e.g you're in the News 
       vertical, your competitions are doing X better at TTI on mobile.
    1. There have been few, if any studies, that show optimising for 
       interactivity leads to higher conversion rates or better user retention. 
       We generally just call out poor load times === user less likely to stay, 
       perceived perf being important.
        1. Facebook & Flipkart optimize for TTI specifically. Perhaps we can get 
           more data about the wins of doing this out. 