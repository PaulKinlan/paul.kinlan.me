---
slug: web-share-target-api
date: 2018-04-15T13:20:31+01:00
title: "Web Share Target API"
tags: ['pwa', 'intents', 'web intents']
description: "Share Target API is now in Chrome breaking down one of the last silos of native platforms"
---

I'm constantly worried that on the web platform we are creating [unintended
silos](/unintended-silos) by making it harder to get data in and out of web
sites and apps, more importantly I worry that the data only flows one way: from
the web to apps, because apps can be in all the places that users expect them to
be on their devices.

I was pretty pleased that Chrome started to work [on the Web Share Target
API](/breaking-down-silos-with-share-target-api) that complements the work on
[navigator.share](/navigator.share). Where `navigator.share` lets you share
information out of your web site to any app on the users device that can
reciveve 'shares' (`Intent.ACTION_SEND` in Android parlance), the Web Share Target
lets your web site (or PWA) say 'I want to play in that game too'.

I'm pretty pleased to say that this work is now available in Chrome on Android.

The Web Share Target API is a small API that you define in your Web App
Manifest. If you have ever used `registerProtocolHandler` you will see that it's
not a million miles away &mdash; you define a URL template that has a number of
variables in that will be substituted when the user invokes the action. 

First you create an 'object' property called `share_target` that contains one
property called `url_template` that has the path that should be opened when the
user chooses our service. On Android, you can use the three substitution names
called:
 
* `{title}` - equivelent to `.title` on navigator.share API, or
  `Intent.EXTRA_SUBJECT` from an Android Intent.
* `{text}` - equivelent to `.text` on navigator.share API, or
  `Intent.EXTRA_TEXT` from an Android Intent.
* `{url}` - equivelent to `.url` on navigator.share API, or the raw data from an
  Android Intent.

You can try this today by installing [Twitter's
PWA](https://mobile.twitter.com/). [Twitter's manifest is
below](https://mobile.twitter.com/manifest.json):

```javascript
{
    ...
    "name": "Twitter Lite",
    "share_target": {
        "url_template": "compose/tweet?title={title}&text={text}&url={url}"
    },
    ...
}
```

Right now there are some limitations:

* You can only have one per manifest, that means in Twitter's case they can't
  have a 'Share to DM'.
* There are some extensions proposed such as a service worker event called
  `navigator.actions` that will be triggered without having to open up a UI
  surface, but they are not implemented yet.
* You can only share 'text', which means if you want to share a Blob of data you
  need to save that with a URL that would then be shared out.
* It only works on Android.
* You have to have the PWA installed, so you can't do a drive by registration of
  a share target. When Chrome generates a 'Web APK' it now looks at the
  `share_target` to see if it should register the native `<intent-filter>`.
* It's not standardised yet as part of the manifest spec. :/

Limitations aside, this is a rather amazing addition to the web platform that is
the start of breaking down the huge barriers that the web has with regards to
integration on the host platforms.

If you want to track updates to this API, check out Chrome
Status](https://chromestatus.com/feature/5662315307335680).
