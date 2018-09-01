---
slug: pwacompat--the-web-app-manifest-for-all-browsers----chromiumdev
date: 2018-07-17T07:45:28.391Z
title: 'PWACompat: the Web App Manifest for all browsers - @ChromiumDev'
link: https://developers.google.com/web/updates/2018/07/pwacompat
tags: [links, pwa, manifest]
---
[Sam Thorogood](https://dev.to/samthor) de notre équipe écrit:

> You've designed a webapp, built its code and service worker, and finally added the Web App Manifest to describe how it should behave when 'installed' on a user's device. This includes things like high-resolution icons to use for e.g. a mobile phone's launcher or app switcher, or how your webapp should start when opened from the user's home screen.
> 
> And while many browsers will respect the Web App Manifest, not every browser will load or respect every value you specify. Enter PWACompat, a library that takes your Web App Manifest and automatically inserts relevant meta or link tags for icons of different sizes, the favicon, startup mode, colors etc.


[Lire l'article complet](https://developers.google.com/web/updates/2018/07/pwacompat).

J'ai été émerveillé par cette bibliothèque et je suis ravi de voir que cela attire un peu plus l'attention. C'était la première fois que je voyais l'écran Splash sur iOS au cours des 5 dernières années et il les générait d'une manière vraiment soignée - il génère l'image à la volée en fonction de la taille d'écran exacte de l'appareil et base64 encode l'image ... il comble également le reste des lacunes de l'histoire de Safari Add To Homescreen.

Si vous construisez une PWA, je l'inclurais.
