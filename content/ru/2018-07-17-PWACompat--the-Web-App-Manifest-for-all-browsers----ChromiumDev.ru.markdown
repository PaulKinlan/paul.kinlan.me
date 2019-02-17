---
slug: pwacompat--the-web-app-manifest-for-all-browsers----chromiumdev
date: 2018-07-17T07:45:28.391Z
title: 'PWACompat: the Web App Manifest for all browsers - @ChromiumDev'
link: https://developers.google.com/web/updates/2018/07/pwacompat
tags: [links, pwa, manifest]
---
[Sam Thorogood](https://dev.to/samthor) из нашей команды пишет:

> You've designed a webapp, built its code and service worker, and finally added the Web App Manifest to describe how it should behave when 'installed' on a user's device. This includes things like high-resolution icons to use for e.g. a mobile phone's launcher or app switcher, or how your webapp should start when opened from the user's home screen.
> 
> And while many browsers will respect the Web App Manifest, not every browser will load or respect every value you specify. Enter PWACompat, a library that takes your Web App Manifest and automatically inserts relevant meta or link tags for icons of different sizes, the favicon, startup mode, colors etc.


[Читать полный пост](https://developers.google.com/web/updates/2018/07/pwacompat).

Я был поражен этой библиотекой, и я рад видеть, что это получает немного больше внимания. Это был первый раз, когда я на самом деле видел Splash Screen на iOS за последние 5 лет, и он генерирует их по-настоящему аккуратно - он генерирует изображение «на лету» на основе точного размера экрана устройства, а base64 кодирует изображение ... он также заполняет многие остатки пробелов в истории Safari Add To Homescreen.

Если вы создаете PWA, я бы включил его.
