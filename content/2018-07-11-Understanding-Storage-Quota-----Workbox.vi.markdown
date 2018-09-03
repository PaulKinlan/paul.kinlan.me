---
slug: understanding-storage-quota-----workbox
date: 2018-07-11T22:04:10.808Z
title: Understanding Storage Quota | Workbox
link: https://developers.google.com/web/tools/workbox/guides/storage-quota
tags: ['link', 'pwa', 'service worker', 'storage']
---
Jeff Posnick viết, wrt để Workbox

> A common source of unexpectedly high quota usage is due to runtime caching of opaque responses, which is to say, cross-origin responses to requests made without CORS enabled.
> 
> Browsers automatically inflate the quota impact of those opaque responses as a security consideration. In Chrome, for instance, even an opaque response of a few kilobytes will end up contributing around 7 megabytes towards your quota usage.


[Đọc toàn bộ bài đăng](https://developers.google.com/web/tools/workbox/guides/storage-quota).

Công nhân dịch vụ là một phần tuyệt vời và không thể tách rời của hệ sinh thái web, nhưng vẫn còn khá nhiều người bị mắc kẹt - và đây là một trong số họ có thể cắn bạn nếu bạn không biết điều này trước thời hạn.

Thật tuyệt khi thấy các công cụ như Workbox có thể xử lý việc này và thông báo cho bạn để bạn biết điều gì sẽ xảy ra.


