---
slug: page-lifecycle-apiphilip-walton
date: 2018-07-26T23:10:28.198Z
title: 'Page Lifecycle API - Philip Walton'
link: https://developers.google.com/web/updates/2018/07/page-lifecycle-api
tags: [links, lifecycle, pwa]
---
Philip Walton a une formidable plongée dans une nouvelle API sur laquelle l’équipe Chrome a travaillé pour vous donner (le développeur) le contrôle de la réponse lorsque le navigateur décharge vos onglets.

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


[Lire l'article complet](https://developers.google.com/web/updates/2018/07/page-lifecycle-api).

Mon premier commentaire est que vous devriez lire l'article de Philips. C'est incroyable.

Sur mobile, Google Chrome peut être assez agressif pour la mise en arrière-plan (gel ou suppression) de la page afin d’économiser des ressources lorsque l’utilisateur ne l’utilise pas (par exemple, lorsque vous changez d’onglet ou que vous quittez l’application Chrome sur Android). page En tant que développeur, vous n’avez généralement aucune connaissance de ce qui se passe, de sorte que vous ne pouvez pas facilement conserver l’état ou même fermer des ressources ouvertes. Lorsque les développeurs ont le contrôle, ils peuvent faire des choix plus éclairés, ce qui signifie également que le navigateur peut être plus agressif en ce qui concerne la conservation des ressources à l’avenir sans avoir d’impact majeur sur l’expérience des utilisateurs ou des développeurs.

Enfin, le diagramme ci-dessous explique tout cela très bien.

<figure><img src="https://developers.google.com/web/updates/images/2018/07/page-lifecycle-api-state-event-flow.png" /><figcaption> <a href="https://developers.google.com/web/updates/images/2018/07/page-lifecycle-api-state-event-flow.png">API de cycle de vie de page</a> </figcaption></figure>


