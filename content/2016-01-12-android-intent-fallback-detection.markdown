---
date: 2016-01-12 13:20:32+00:00
description: ''
image_header: /images/android_intents.jpg
slug: android-intent-fallback-detection
summary: This post explores how to use Android Intents to detect if a native app is
  installed. This technique is useful for web apps that also have a native app version,
  especially for managing push notifications.  It allows developers to seamlessly
  redirect users to the app if it's installed or fall back to the web experience.  The
  method involves creating a special intent URL that opens the app if present, or
  redirects to a specific URL with a hash fragment. By monitoring the hash change
  in the browser, the web app can detect if the app launch failed and proceed with
  web-based push notification registration. While helpful, this approach highlights
  the complexity of managing push notifications across web and native apps, reinforcing
  the argument for web-only solutions.
tags:
- android
- intents
- web push
- push notifications
- native apps
- web apps
- fallback
- app detection
- javascript
- mobile web
title: Inline web-page Android intent fallback detection

---

Web Push is great, however if the user already has an app installed that does Push notifications the 
developer needs to reasonably be able to stop either the app or the web sites notification.  However there
is no shared ID between site and app (for obvious reasons).

There are a couple of strategies that we are experimenting with right now. One of strategy is to try and launch
an app and if it is not installed use the web experience.

Android Intents to the rescue. You can make an intent URI that will launch an app and if not there navigate
to a page of the developer's choice. One such URL is:

    intent:#Intent;package=com.kinlan.sup;S.browser_fallback_url=https%3A%2F%2Fpaul.kinlan.me
    
This is cool and it works well, however it causes a full on page refresh if you are not careful.  Luckily
document fragment identifiers work well, so you can just add the following into your page (changing all the
parameters for your use case)

```html
<a href="intent:#Intent;package=com.kinlan.sup;S.browser_fallback_url=https%3A%2F%2Fpaul.kinlan.me%2Fandroid-intent-fallback-detection%2F%23noapp;end">Try to open app, but fallback</a>

<script>
  window.onhashchange = function() {
    // If this event fires the app is not installed on the user’s device.
    if(window.location.hash == "#noapp") {
      // Check the hash is what we expect it to be   
    }
  }
</script>
```

**Note: this will only work on Android**. Now you can try to launch the app and then start your browser-side 
Web Push registration logic.

<a href="intent:#Intent;package=com.kinlan.sup;S.browser_fallback_url=https%3A%2F%2Fpaul.kinlan.me%2Fandroid-intent-fallback-detection%2F%23noapp;end">Try to open Android app, but fallback</a>

<script>
  window.onhashchange = function() {
    // If this event fires the app is not installed on the user’s device.
    if(window.location.hash == "#noapp") {
      alert('The app didn\'t launch');
    }
  }
</script>

This is just one step of what you need to do to manage Push Notification in your Web App if you have a complimentary
native app.  We will be documenting them shortly.  Personally I think it is all the more reason just
to go web-only.... But I think I am in a minority at the moment :)
