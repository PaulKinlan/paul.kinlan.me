---
slug: understanding-storage-quota-----workbox
date: 2018-07-11T22:04:10.808Z
title: Understanding Storage Quota | Workbox
link: https://developers.google.com/web/tools/workbox/guides/storage-quota
tags: ['link', 'pwa', 'service worker', 'storage']
---
Jeff Posnick எழுதுகிறார், Workbox க்கு எழுதவும்

> A common source of unexpectedly high quota usage is due to runtime caching of opaque responses, which is to say, cross-origin responses to requests made without CORS enabled.
> 
> Browsers automatically inflate the quota impact of those opaque responses as a security consideration. In Chrome, for instance, even an opaque response of a few kilobytes will end up contributing around 7 megabytes towards your quota usage.


[முழு இடுகையைப் படிக்கவும்](https://developers.google.com/web/tools/workbox/guides/storage-quota).

சேவை தொழிலாளர்கள் வலை சுற்றுச்சூழல் ஒரு அற்புதமான மற்றும் ஒருங்கிணைந்த பகுதியாக உள்ளது, ஆனால் இன்னும் சில gotchas உள்ளன - இந்த நீங்கள் முன்னர் இது தெரியாது என்றால் நீங்கள் கடித்து அவர்களுக்கு ஒன்றாகும்.

Workbox போன்ற கருவிகளைக் கையாளவும் உங்களுக்கு என்ன நடக்கிறது என்று உங்களுக்குத் தெரியப்படுத்தவும் இது போன்ற கருவிகளைக் காண இது நல்லது.


