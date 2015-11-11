---
slug: measuring-the-impact-of-apps-on-the-web
date: 2015-10-06T12:20:31+01:00
title: "Measuring the impact of the apps on the web"
description: "."
draft: true
---

Time in the browser on mobile is dropping.  Time on the web on mobile is rising, or dropping... 
The truth is that we don't truely know.

The reason why we don't know is simple. There is no referer information from app to site.

There are several transitions that we don't know and can't easily measure, specifically
traffic driven from an app to a site:

1. In the browser.
2. In the app's embedded WebView
3. In the app's external Web Controller ([Chrome Custom tabs](https://developer.chrome.com/multidevice/android/customtabs) or SFSafariViewController)   

The Chrome team have been working on this and have a solution built in to Marshmallow
and available if you build for it from Lollipop MR2

Any link clicked will have `android-app:` scheme in the HTTP referrer

