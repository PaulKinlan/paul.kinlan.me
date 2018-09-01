---
slug: understanding-storage-quota-----workbox
date: 2018-07-11T22:04:10.808Z
title: Understanding Storage Quota | Workbox
link: https://developers.google.com/web/tools/workbox/guides/storage-quota
tags: ['link', 'pwa', 'service worker', 'storage']
---
जेफ पॉसनिक लिखते हैं, वर्कबॉक्स पर wrt

> A common source of unexpectedly high quota usage is due to runtime caching of opaque responses, which is to say, cross-origin responses to requests made without CORS enabled.
> 
> Browsers automatically inflate the quota impact of those opaque responses as a security consideration. In Chrome, for instance, even an opaque response of a few kilobytes will end up contributing around 7 megabytes towards your quota usage.


[पूर्ण पोस्ट पढ़ें](https://developers.google.com/web/tools/workbox/guides/storage-quota)।

सेवा श्रमिक वेब पारिस्थितिक तंत्र का एक अद्भुत और अभिन्न हिस्सा हैं, लेकिन अभी भी कुछ गॉथस हैं - और यह उनमें से एक है जो आपको समय से पहले नहीं जानता है, जो आपको काट सकता है।

यह देखना बहुत अच्छा है जैसे वर्कबॉक्स इसे संभालने में सक्षम है और आपको सूचित करता है ताकि आप जान सकें कि क्या होता है।


