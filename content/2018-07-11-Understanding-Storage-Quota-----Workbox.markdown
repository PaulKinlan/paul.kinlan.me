---
date: 2018-07-11 22:04:10.808000+00:00
link: https://developers.google.com/web/tools/workbox/guides/storage-quota
slug: understanding-storage-quota-----workbox
summary: Workbox helps developers understand and manage storage quota issues, particularly
  those related to runtime caching of opaque responses.  Opaque responses, which are
  cross-origin responses without CORS enabled, consume a disproportionately large
  amount of storage quota due to browser security measures.  This can lead to unexpected
  quota issues for developers.  Workbox addresses this problem by informing developers
  about the impact of opaque responses on storage, enabling them to optimize their
  service worker caching strategies.
tags:
- Workbox
- Service Workers
- Storage Quota
- Opaque Responses
- CORS
- Caching
- PWA
title: Understanding Storage Quota | Workbox

---
Jeff Posnick writes, wrt to Workbox

> A common source of unexpectedly high quota usage is due to runtime caching of opaque responses, which is to say, cross-origin responses to requests made without CORS enabled.
> 
> Browsers automatically inflate the quota impact of those opaque responses as a security consideration. In Chrome, for instance, even an opaque response of a few kilobytes will end up contributing around 7 megabytes towards your quota usage.

[Read full post](https://developers.google.com/web/tools/workbox/guides/storage-quota).

Service Workers are an amazing and integral part of the web ecosystem, but there are still quite a few gotchas - and this is one of them that can bite you if you don't know this ahead of time.

It's great to see tools like Workbox being able to handle this and inform you so that you know what happens.

