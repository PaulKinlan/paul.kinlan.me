---
slug: understanding-storage-quota-----workbox
date: 2018-07-11T22:04:10.808Z
title: Understanding Storage Quota | Workbox
link: https://developers.google.com/web/tools/workbox/guides/storage-quota
tags: ['link', 'pwa', 'service worker', 'storage']
---
Jeff Posnick menulis, wrt to Workbox

> A common source of unexpectedly high quota usage is due to runtime caching of opaque responses, which is to say, cross-origin responses to requests made without CORS enabled.
> 
> Browsers automatically inflate the quota impact of those opaque responses as a security consideration. In Chrome, for instance, even an opaque response of a few kilobytes will end up contributing around 7 megabytes towards your quota usage.


[Baca pos lengkap](https://developers.google.com/web/tools/workbox/guides/storage-quota).

Pekerja Layanan adalah bagian yang luar biasa dan integral dari ekosistem web, tetapi masih ada beberapa gotchas - dan ini adalah salah satu dari mereka yang dapat menggigit Anda jika Anda tidak mengetahui hal ini sebelumnya.

Sangat menyenangkan melihat alat seperti Workbox dapat menangani ini dan memberi tahu Anda sehingga Anda tahu apa yang terjadi.


