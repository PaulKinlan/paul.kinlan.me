---
date: 2018-07-17 07:45:28.391000+00:00
link: https://developers.google.com/web/updates/2018/07/pwacompat
slug: pwacompat--the-web-app-manifest-for-all-browsers----chromiumdev
summary: PWACompat is a JavaScript library that helps web developers make their Progressive
  Web Apps (PWAs) compatible across different browsers. It takes the existing Web
  App Manifest and generates the necessary meta and link tags for features like icons,
  favicons, startup mode, and colors, ensuring a consistent experience across browsers,
  even those with less complete PWA support, like Safari on iOS.  PWACompat simplifies
  cross-browser compatibility for PWAs, handling things like splash screens and other
  add-to-homescreen features, making it a valuable tool for PWA developers.
tags:
- pwa
- web app manifest
- cross-browser compatibility
- javascript
- library
- progressive web apps
- safari
- ios
- splash screen
- add to homescreen
title: 'PWACompat: the Web App Manifest for all browsers - @ChromiumDev'

---
[Sam Thorogood](https://dev.to/samthor) from our team writes:

> You've designed a webapp, built its code and service worker, and finally added the Web App Manifest to describe how it should behave when 'installed' on a user's device. This includes things like high-resolution icons to use for e.g. a mobile phone's launcher or app switcher, or how your webapp should start when opened from the user's home screen.
> 
> And while many browsers will respect the Web App Manifest, not every browser will load or respect every value you specify. Enter PWACompat, a library that takes your Web App Manifest and automatically inserts relevant meta or link tags for icons of different sizes, the favicon, startup mode, colors etc.

[Read full post](https://developers.google.com/web/updates/2018/07/pwacompat).

I was amazed by this library, and I'm glad to see it getting a bit more attention. It was the first time I actually saw the Splash Screen on iOS work in the last 5 years and he generates them in a really neat way - he generates the image on the fly based on the exact screen size of the device and base64 encodes the image... it also fills in a lot of the rest of the gaps in the Safari Add To Homescreen story.

If you're building a PWA I would include it.
