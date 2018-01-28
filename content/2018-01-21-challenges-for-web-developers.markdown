---
slug: challenges-for-web-developers
date: 2018-01-21T13:20:31+01:00
title: "Challenges for web developers"
description: "Summary of the challenges that I beleive we developers face every day."
---

I originally wrote this to articulate the challenges of the wider developer
ecosystem that my team (Chrome and Web Developer Relations) need to address so
that we can help the industry thrive, so that we can help more people build on
the web, and to help developers build experiences that more people love to use.

After sharing the [Web and Chrome DevRel
manifesto](/web-developer-relations-manifesto/) I wanted to keep up the pace of
share my thoughts in some of the challenges that we want help developers solve.

I didn't actually ship this article, but now that I've had some time and it's
the new year I thought it would be a good time to actually share this.

Understanding the challenges that developers face every day help me work out how
we can change the way we work to help as many developers as possible.

I would love your feedback. Am I wrong? Do you see any broader ecosystem issues 
that I have missed?

I will be making deeper articles out of many of these issues.

## Web Development is easy to start, but hard to make progress and master

* Variable API support and vendor priorities make building a consistent 
  experience hard or impossible to build.
* Legacy considerations, e.g. old CMS, existing implementations mean that there 
  is a huge momentum that needs to be overcome.
* Platform quirks and compat problems cause a huge amount of frustration and
  needless amounts of extra testing.
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
  Desktop etc) and this is a simple reason about why to not adopt it.
* It's nearly impossible to build an "exemplary PWA" and no one really cares
  that they should.
* Developers frequently have to start again and don't migrate their existing 
  experiences.
* Developers and Businesses don't know why they should build a progressive web 
  app.
* Findability of existing web apps is a massive problem.
* "Progressive" is not valued. Hard to offer a consistent experience/features 
  missing from different web browsers/operating systems
* The progressive web apps that are being built are not responsive and thus 
  increase maintenance costs since you have to look after a separate desktop 
  site

## It is too hard to build a well functioning experience (UI/UX)

* The Good-enough bar for developers is way too low. What is good? Why is it 
  important? How do you get there?
* It is easy to be a bad actor when building components, A11Y, layout and 
  performance are hard to build and not prioritized by developers.
* Developers don't see the value in web components and platform tools to help 
  them build quickly.
* Many framework authors don't believe that web components should be used and
  this may or may not be correct - it's just not clear to developers.
* Developers want a UI framework like Bootstrap to take away the UI pains and 
  lets them focus on the product
* The primitives for many experiences are too hard to build and build well: 
  menus, nav, transitions, takeovers, data-binding, views, controllers
* It is hard to build performant experiences - Primitives are an issue (the
  platform doesn't have what developers need, or they are there but no one knows
  or cares)
* Uneven support for API's like animations make it impossible for developers to 
  adopt new platform primitives - primitves are normally fundamental and nearly 
  impossible to polyfil

## It's too hard to build a fast site

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
  everyone can use LetsEncrypt. Large and small sites are having to pay a lot 
  more for the priviledge.
* Developers don't understand the value of "Secure technologies" such as CSP and 
  they are seeing low adoption

## Businesses and Developers don't know why they should "Web"

* Converting a user on mobile web is difficult so making money is hard
* Business cases and needs vary by region, vertical, and audience so are hard to
  apply in a meaningful way without putting a lot more investment in
* Apparent lack of capabilities mean that it feels like you should not use the 
  web
* Web is just moving to an app model so why not just do the 'app'
* Lack of cross browser support for key API's makes it hard for businesses to 
  justify their investments
* It's not clear the value of the web when there are so many competing platforms

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

* There is a huge amount of opinion being generated each day and also best 
  practice being defined that is neither accurate or exhaustive and developers 
  are looking to Google and others to present a unified guide.
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
* Many western developers are seeing the crop of 'Lite' experiences as 'emerging
  market only' and that they are not high-fidelity.

### Updates
Edit 1 (23-Jan-2018): Adding a note at the top of the page.

Edit 2 (28-Jan-2018): Cleaning up some bits.
