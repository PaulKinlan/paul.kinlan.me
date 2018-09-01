---
slug: understanding-storage-quota-----workbox
date: 2018-07-11T22:04:10.808Z
title: Understanding Storage Quota | Workbox
link: https://developers.google.com/web/tools/workbox/guides/storage-quota
tags: ['link', 'pwa', 'service worker', 'storage']
---
Jeff Posnick écrit, à propos de Workbox

> A common source of unexpectedly high quota usage is due to runtime caching of opaque responses, which is to say, cross-origin responses to requests made without CORS enabled.
> 
> Browsers automatically inflate the quota impact of those opaque responses as a security consideration. In Chrome, for instance, even an opaque response of a few kilobytes will end up contributing around 7 megabytes towards your quota usage.


[Lire l'article complet](https://developers.google.com/web/tools/workbox/guides/storage-quota).

Les travailleurs du service font partie intégrante de l’écosystème Web, mais il ya encore beaucoup de pièges - et c’est l’un d’eux qui peut vous mordre si vous ne le savez pas à l’avance.

C'est génial de voir des outils comme Workbox en mesure de gérer cela et de vous informer pour savoir ce qui se passe.


