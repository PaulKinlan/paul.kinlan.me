---
slug: understanding-storage-quota-----workbox
date: 2018-07-11T22:04:10.808Z
title: Understanding Storage Quota | Workbox
link: https://developers.google.com/web/tools/workbox/guides/storage-quota
tags: ['link', 'pwa', 'service worker', 'storage']
---
Джефф Поскик пишет: «Ответ на рабочий стол»

> A common source of unexpectedly high quota usage is due to runtime caching of opaque responses, which is to say, cross-origin responses to requests made without CORS enabled.
> 
> Browsers automatically inflate the quota impact of those opaque responses as a security consideration. In Chrome, for instance, even an opaque response of a few kilobytes will end up contributing around 7 megabytes towards your quota usage.


[Читать полный пост](https://developers.google.com/web/tools/workbox/guides/storage-quota).

Служащие службы являются удивительной и неотъемлемой частью веб-экосистемы, но есть еще немало ошибок - и это один из них, который может вас укусить, если вы этого заранее не знаете.

Приятно видеть, что инструменты, такие как Workbox, способны справиться с этим и сообщают вам, чтобы вы знали, что происходит.


