---
date: 2018-12-07 05:42:30.968000+00:00
link: https://developers.google.com/web/updates/2018/12/web-share-target?utm_source=feed&utm_medium=feed&utm_campaign=updates_feed
slug: registering-as-a-share-target-with-the-web-share-target-api
summary: The Web Share Target API is now available as an origin trial in Chrome, bridging
  the gap between web and native apps.  Previously, only native apps could register
  as share targets, limiting the web's ability to seamlessly integrate with system-level
  sharing functionalities.  This new API empowers installed web apps to receive shared
  content, opening up exciting possibilities for web developers.  The API's potential
  is highlighted by Twitter's early adoption and my own experimentation with a custom
  manifest.json file.  While file support is still pending, the future looks bright
  for effortless content sharing between web and native environments.
tags:
- Web Share Target API
- Chrome
- Origin Trial
- Native Sharing
- Web Apps
- Progressive Web Apps
- manifest.json
- Twitter
- Content Sharing
title: Registering as a Share Target with the Web Share Target API

---
Pete LePage introduces the Web Share Target API and the the availability in Chrome via an origin trial

> Until now, only native apps could register as a share target. The Web Share Target API allows installed web apps to register with the underlying OS as a share target to receive shared content from either the Web Share API or system events, like the OS-level share button.

[Read full post](https://developers.google.com/web/updates/2018/12/web-share-target?utm_source=feed&utm_medium=feed&utm_campaign=updates_feed).

This API is a game changer on the web, it opens the web up to something that was only once available to native apps: Native Sharing. Apps are silos, they suck in all data and make it hard to be accessible across platforms. Share Target starts to level the playing field so that the web can play in the same game.

The Twitter Mobile experience has Share Target [already enabled](https://mobile.twitter.com/manifest.json). This post was created using the Share Target I have defined in my sites 'admin panel' [manifest.json](https://paul.kinlan.me/share/share-manifest.json) - it works pretty well, and the minute they land file support I will be able to post any image or blob on my device to my blog.

Very exciting times.

Read the linked post to learn more about the time-lines for when this API should go live and how to use the API.
