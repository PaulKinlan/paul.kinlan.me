---
slug: understanding-storage-quota-----workbox
date: 2018-07-11T22:04:10.808Z
title: Understanding Storage Quota | Workbox
link: https://developers.google.com/web/tools/workbox/guides/storage-quota
tags: ['link', 'pwa', 'service worker', 'storage']
---
Jeff PosnickがWorkboxに書き込みます

> A common source of unexpectedly high quota usage is due to runtime caching of opaque responses, which is to say, cross-origin responses to requests made without CORS enabled.
> 
> Browsers automatically inflate the quota impact of those opaque responses as a security consideration. In Chrome, for instance, even an opaque response of a few kilobytes will end up contributing around 7 megabytes towards your quota usage.


[全文を読む](https://developers.google.com/web/tools/workbox/guides/storage-quota)

サービスワーカーは、Webエコシステムの驚くべきで不可欠な部分ですが、まだかなりの問題があります。これは、事前にこれを知っていなければ、あなたを噛む可能性があります。

Workboxのようなツールを見て、これを処理して何が起こるかを知ることができるようになることは素晴らしいことです。


