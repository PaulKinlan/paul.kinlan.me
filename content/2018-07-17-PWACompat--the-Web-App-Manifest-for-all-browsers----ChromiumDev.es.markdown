---
slug: pwacompat--the-web-app-manifest-for-all-browsers----chromiumdev
date: 2018-07-17T07:45:28.391Z
title: 'PWACompat: the Web App Manifest for all browsers - @ChromiumDev'
link: https://developers.google.com/web/updates/2018/07/pwacompat
tags: [links, pwa, manifest]
---
[Sam Thorogood](https://dev.to/samthor) de nuestro equipo escribe:

> You've designed a webapp, built its code and service worker, and finally added the Web App Manifest to describe how it should behave when 'installed' on a user's device. This includes things like high-resolution icons to use for e.g. a mobile phone's launcher or app switcher, or how your webapp should start when opened from the user's home screen.
> 
> And while many browsers will respect the Web App Manifest, not every browser will load or respect every value you specify. Enter PWACompat, a library that takes your Web App Manifest and automatically inserts relevant meta or link tags for icons of different sizes, the favicon, startup mode, colors etc.


[Leer publicación completa](https://developers.google.com/web/updates/2018/07/pwacompat).

Me sorprendió esta biblioteca y me alegra ver que recibe un poco más de atención. Fue la primera vez que vi la pantalla Splash en iOS en los últimos 5 años y él los genera de una manera muy clara: genera la imagen sobre la marcha basándose en el tamaño de pantalla exacto del dispositivo y base64 codifica la imagen ... también llena una gran cantidad del resto de las lagunas en la historia de Safari Add To Homescreen.

Si estás construyendo un PWA lo incluiría.
