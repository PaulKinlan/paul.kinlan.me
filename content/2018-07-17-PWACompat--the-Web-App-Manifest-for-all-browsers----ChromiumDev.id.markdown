---
slug: pwacompat--the-web-app-manifest-for-all-browsers----chromiumdev
date: 2018-07-17T07:45:28.391Z
title: 'PWACompat: the Web App Manifest for all browsers - @ChromiumDev'
link: https://developers.google.com/web/updates/2018/07/pwacompat
tags: [links, pwa, manifest]
---
[Sam Thorogood](https://dev.to/samthor) dari tim kami menulis:

> You've designed a webapp, built its code and service worker, and finally added the Web App Manifest to describe how it should behave when 'installed' on a user's device. This includes things like high-resolution icons to use for e.g. a mobile phone's launcher or app switcher, or how your webapp should start when opened from the user's home screen.
> 
> And while many browsers will respect the Web App Manifest, not every browser will load or respect every value you specify. Enter PWACompat, a library that takes your Web App Manifest and automatically inserts relevant meta or link tags for icons of different sizes, the favicon, startup mode, colors etc.


[Baca pos lengkap](https://developers.google.com/web/updates/2018/07/pwacompat).

Saya kagum dengan perpustakaan ini, dan saya senang melihatnya semakin menarik perhatian. Ini adalah pertama kalinya saya melihat Splash Screen di iOS bekerja dalam 5 tahun terakhir dan ia menghasilkannya dengan cara yang sangat rapi - ia menghasilkan gambar dengan cepat berdasarkan ukuran layar yang tepat dari perangkat dan base64 mengkodekan gambar. ... itu juga mengisi banyak sisa celah dalam cerita Safari Add To Homescreen.

Jika Anda membangun PWA saya akan memasukkannya.
