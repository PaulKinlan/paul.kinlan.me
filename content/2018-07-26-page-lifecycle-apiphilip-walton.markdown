---
slug: page-lifecycle-apiphilip-walton
date: 2018-07-26T23:10:28.198Z
title: 'Page Lifecycle API - Philip Walton'
link: https://developers.google.com/web/updates/2018/07/page-lifecycle-api
tags: [links, lifecycle, pwa]
---
Philip Walton has an awesome deep dive into a new API the Chrome team has been working on to give you (the developer) control over how to respond when the browser unloads your tabs.

> Application lifecycle is a key way that modern operating systems manage resources. On Android, iOS, and recent Windows versions, apps can be started and stopped at any time by the OS. This allows these platforms to streamline and reallocate resources where they best benefit the user.
> 
> On the web, there has historically been no such lifecycle, and apps can be kept alive indefinitely. With large numbers of web pages running, critical system resources such as memory, CPU, battery, and network can be oversubscribed, leading to a bad end-user experience.
> 
> While the web platform has long had events that related to lifecycle states &#x2014; like load, unload, and visibilitychange &#x2014; these events only allow developers to respond to user-initiated lifecycle state changes. For the web to work reliably on low-powered devices (and be more resource conscious in general on all platforms) browsers need a way to proactively reclaim and re-allocate system resources.
> 
> In fact, browsers today already do take active measures to conserve resources for pages in background tabs, and many browsers (especially Chrome) would like to do a lot more of this &#x2014; to lessen their overall resource footprint.
> 
> The problem is developers currently have no way to prepare for these types of system-initiated interventions or even know that they're happening. This means browsers need to be conservative or risk breaking web pages.
> 
> The Page Lifecycle API attempts to solve this problem by:
> 
> * Introducing and standardizing the concept of lifecycle states on the web.
> * Defining new, system-initiated states that allow browsers to limit the resources that can be consumed by hidden or inactive tabs.
> * Creating new APIs and events that allow web developers to respond to transitions to and from these new system-initiated states.
> * This solution provides the predictability web developers need to build applications resilient to system interventions, and it allows browsers to more aggressively optimize system resources, ultimately benefiting all web users.
> 
> The rest of this post will introduce the new Page Lifecycle features shipping in Chrome 68 and explore how they relate to all the existing web platform states and events. It will also give recommendations and best-practices for the types of work developers should (and should not) be doing in each state.

[Read full post](https://developers.google.com/web/updates/2018/07/page-lifecycle-api).

My first comment is that you should read Philips post. It's incredible.

On mobile, Chrome can be pretty aggressive at backgrounding (freezing or discarding) the page to conserve resources when the user is not using it (for example, when you swap tabs or move from the Chrome app on Android), when the browser backgrounds your page as a developer you traditionally have no knowledge of when this happens so you can't easily persist state or even close down open resources and just as importantly when you're app is back re-hydrate the state cleanly. When developers have control they can make more informed choices, which also means that the browser can be more aggressive in conserving resources in the future without severely impacting user or developer experience.

Finally, the below diagram explains it all pretty darn well.

<figure>
  <img src="https://developers.google.com/web/updates/images/2018/07/page-lifecycle-api-state-event-flow.png" />
  <figcaption><a href="https://developers.google.com/web/updates/images/2018/07/page-lifecycle-api-state-event-flow.png">Page Lifecycle API</a></figcaption>
</figure>

