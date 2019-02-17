---
slug: page-lifecycle-apiphilip-walton
date: 2018-07-26T23:10:28.198Z
title: 'Page Lifecycle API - Philip Walton'
link: https://developers.google.com/web/updates/2018/07/page-lifecycle-api
tags: [links, lifecycle, pwa]
---
Philip Walton tiene una profunda inmersión en una nueva API en la que el equipo de Chrome ha estado trabajando para darle a usted (el desarrollador) el control sobre cómo responder cuando el navegador descarga sus pestañas.

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


[Leer publicación completa](https://developers.google.com/web/updates/2018/07/page-lifecycle-api).

Mi primer comentario es que deberías leer la publicación de Philips. Es increíble.

En dispositivos móviles, Chrome puede ser bastante agresivo al generar fondos (congelar o descartar) la página para conservar recursos cuando el usuario no la está usando (por ejemplo, cuando intercambias pestañas o te mueves desde la aplicación Chrome en Android), cuando el navegador Como desarrollador, usted tradicionalmente no tiene conocimiento de cuándo sucede esto, por lo que no puede mantener fácilmente el estado o incluso cerrar los recursos abiertos, y lo que es más importante cuando su aplicación vuelve a hidratar el estado limpiamente. Cuando los desarrolladores tienen el control, pueden tomar decisiones más informadas, lo que también significa que el navegador puede ser más agresivo en la conservación de recursos en el futuro sin afectar severamente la experiencia del usuario o desarrollador.

Finalmente, el diagrama a continuación explica todo bastante bien.

<figure><img src="https://developers.google.com/web/updates/images/2018/07/page-lifecycle-api-state-event-flow.png" /><figcaption> <a href="https://developers.google.com/web/updates/images/2018/07/page-lifecycle-api-state-event-flow.png">API de página de Lifecycle</a> </figcaption></figure>


