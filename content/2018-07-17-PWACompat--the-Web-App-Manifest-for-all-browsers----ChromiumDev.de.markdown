---
slug: pwacompat--the-web-app-manifest-for-all-browsers----chromiumdev
date: 2018-07-17T07:45:28.391Z
title: 'PWACompat: the Web App Manifest for all browsers - @ChromiumDev'
link: https://developers.google.com/web/updates/2018/07/pwacompat
tags: [links, pwa, manifest]
---
[Sam Thorogood](https://dev.to/samthor) von unserem Team schreibt:

> You've designed a webapp, built its code and service worker, and finally added the Web App Manifest to describe how it should behave when 'installed' on a user's device. This includes things like high-resolution icons to use for e.g. a mobile phone's launcher or app switcher, or how your webapp should start when opened from the user's home screen.
> 
> And while many browsers will respect the Web App Manifest, not every browser will load or respect every value you specify. Enter PWACompat, a library that takes your Web App Manifest and automatically inserts relevant meta or link tags for icons of different sizes, the favicon, startup mode, colors etc.


[Vollständigen Beitrag lesen](https://developers.google.com/web/updates/2018/07/pwacompat).

Ich war erstaunt über diese Bibliothek, und ich bin froh, dass sie ein bisschen mehr Aufmerksamkeit bekommt. Es war das erste Mal, dass ich den Splash Screen auf iOS-Geräten in den letzten 5 Jahren gesehen habe, und er erzeugt sie auf eine sehr nette Art und Weise - er generiert das Bild auf der Basis der exakten Bildschirmgröße des Geräts und base64 kodiert das Bild ... füllt es auch den Rest der Lücken in der Geschichte von Safari Add To Homescreen aus.

Wenn Sie ein PWA bauen, würde ich es einschließen.
