---
slug: quick-logcatdebugging-android-from-the-web
date: 2019-03-30T10:32:48.943Z
title: 'Quick Logcat - debugging android from the web'
link: 'https://quick-logcat.glitch.me/'
tags: [links, kaios, android, adb]
---
I was on the flight to Delhi this last week and I wanted to be able to [debug my KaiOS device](https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/) with Chrome OS - I never quite got to the level that I needed for a number of reasons (port forwarding didn't work - more on that in another post), but I did get to build a simple tool that really helps me build for the web on Android based devices.

I've been using [WebADB.js](https://github.com/webadb/webadb.js) for a couple of side projects, but I thought I would at least release one of the tools I made last week that will help you if you ever need to debug your Android device and you don't have `adb` installed or any other Android system tools.

[Quick LogCat](https://quick-logcat.glitch.me/) is just that. It can connect to any Android device that is in developer mode and has USB enabled, is connected to your machine over USB and most importantly you grant access from the web page to connect to the device, and once that is all done it just runs `adb shell logcat` to create the following output.

<figure>
  <img src="/images/2019-03-30-quick-logcatdebugging-android-from-the-web.jpeg">
</figure>

Checkout the [source over on my github account](https://github.com/PaulKinlan/QuickLogcat), specifically [the logger class](https://github.com/PaulKinlan/QuickLogcat/blob/master/app/scripts/main.mjs) that has the brunt of my logic - note a lot of this code is incredibly similar to the demo over at [webadb.github.io](https://webadb.github.io/), but it should hopefully be relatively clear to follow how I interface with the WebUSB API (which is very cool). The result is the following code that is in my index file: I instantiate a controller, connect to the device which will open up the USB port and then I start the `logcat` process and well, `cat` the log, via `logcat`.

It even uses .mjs files :D

```html
 <script type="module">
    import LogcatController from "/scripts/main.mjs";
    onload = () => {
      const connect = document.getElementById("connect");
      const output = document.getElementById("output");
      let controller = new LogcatController();
      connect.addEventListener("click", async () => {
        await controller.connect();
        controller.logcat((log) => {
          output.innerText += log;
        })
      });
    };
  </script>
```
ADB is an incredibly powerful protocol, you can read system files, you can write over personal data and you can even easily side-load apps, so if you give access to any external site to your Android device, you need to completely trust the operator of the site.

This demo shows the power and capability of the [WebUSB](https://developers.google.com/web/updates/2016/03/access-usb-devices-on-the-web) API, we can interface with hardware without any natively installed components, drivers or software and with a pervasive explicit user opt-in model that stops drive-by access to USB components.

I've got a couple more ideas up my sleeve, it will totally be possible to do firmware updates via the web if you so choose. One thing we saw a lot of in India was the ability side-load APK's on to user's new phones, whilst I am not saying we must do it, a clean web-interface would be more more preferable to the software people use today.

What do you think you could build with `Web USB` and `adb` access?
