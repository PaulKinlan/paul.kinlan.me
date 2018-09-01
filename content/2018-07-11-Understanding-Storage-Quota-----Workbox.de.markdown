---
slug: understanding-storage-quota-----workbox
date: 2018-07-11T22:04:10.808Z
title: Understanding Storage Quota | Workbox
link: https://developers.google.com/web/tools/workbox/guides/storage-quota
tags: ['link', 'pwa', 'service worker', 'storage']
---
Jeff Posnick schreibt in Workbox

> A common source of unexpectedly high quota usage is due to runtime caching of opaque responses, which is to say, cross-origin responses to requests made without CORS enabled.
> 
> Browsers automatically inflate the quota impact of those opaque responses as a security consideration. In Chrome, for instance, even an opaque response of a few kilobytes will end up contributing around 7 megabytes towards your quota usage.


[Vollständigen Beitrag lesen](https://developers.google.com/web/tools/workbox/guides/storage-quota).

Service-Mitarbeiter sind ein erstaunlicher und integraler Bestandteil des Web-Ökosystems, aber es gibt immer noch einige Fehler - und das ist einer von denen, die Sie beißen können, wenn Sie dies nicht im Voraus wissen.

Es ist großartig, Tools wie Workbox zu sehen, die damit umgehen und Sie informieren können, damit Sie wissen, was passiert.


