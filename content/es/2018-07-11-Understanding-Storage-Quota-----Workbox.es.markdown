---
slug: understanding-storage-quota-----workbox
date: 2018-07-11T22:04:10.808Z
title: Understanding Storage Quota | Workbox
link: https://developers.google.com/web/tools/workbox/guides/storage-quota
tags: ['link', 'pwa', 'service worker', 'storage']
---
Jeff Posnick escribe, wrt a Workbox

> A common source of unexpectedly high quota usage is due to runtime caching of opaque responses, which is to say, cross-origin responses to requests made without CORS enabled.
> 
> Browsers automatically inflate the quota impact of those opaque responses as a security consideration. In Chrome, for instance, even an opaque response of a few kilobytes will end up contributing around 7 megabytes towards your quota usage.


[Leer publicación completa](https://developers.google.com/web/tools/workbox/guides/storage-quota).

Los trabajadores de servicio son una parte increíble e integral del ecosistema web, pero todavía hay bastantes inconvenientes, y este es uno de ellos que puede morderlo si no lo sabe antes de tiempo.

Es genial ver que herramientas como Workbox puedan manejar esto y le informen para que sepa lo que sucede.


