---
slug: pwacompat--the-web-app-manifest-for-all-browsers----chromiumdev
date: 2018-07-17T07:45:28.391Z
title: 'PWACompat: the Web App Manifest for all browsers - @ChromiumDev'
link: https://developers.google.com/web/updates/2018/07/pwacompat
tags: [links, pwa, manifest]
---
[सैम थोरोगूड](https://dev.to/samthor) हमारी टीम से लिखते हैं:

> You've designed a webapp, built its code and service worker, and finally added the Web App Manifest to describe how it should behave when 'installed' on a user's device. This includes things like high-resolution icons to use for e.g. a mobile phone's launcher or app switcher, or how your webapp should start when opened from the user's home screen.
> 
> And while many browsers will respect the Web App Manifest, not every browser will load or respect every value you specify. Enter PWACompat, a library that takes your Web App Manifest and automatically inserts relevant meta or link tags for icons of different sizes, the favicon, startup mode, colors etc.


[पूर्ण पोस्ट पढ़ें](https://developers.google.com/web/updates/2018/07/pwacompat)।

मैं इस पुस्तकालय से चकित था, और मुझे यह देखने में खुशी हुई कि यह थोड़ा अधिक ध्यान दे रहा है। यह पहली बार था जब मैंने वास्तव में पिछले 5 वर्षों में आईओएस काम पर स्पलैश स्क्रीन देखी और वह उन्हें वास्तव में साफ तरीके से उत्पन्न करता है - वह डिवाइस के सटीक स्क्रीन आकार के आधार पर फ्लाई पर छवि उत्पन्न करता है और बेस 64 छवि को एन्कोड करता है ... यह सफारी ऐड टू होमस्क्रीन कहानी में शेष अंतराल में भी भर जाता है।

यदि आप पीडब्ल्यूए बना रहे हैं तो मैं इसे शामिल करूंगा।
