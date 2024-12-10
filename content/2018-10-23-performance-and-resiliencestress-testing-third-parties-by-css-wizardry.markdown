---
date: 2018-10-23 09:53:10.359000+00:00
link: https://csswizardry.com/2017/07/performance-and-resilience-stress-testing-third-parties/
slug: performance-and-resiliencestress-testing-third-parties-by-css-wizardry
summary: 'My QRCode scanner app in China ran into an issue offline: the camera wouldn''t
  start due to a Google Analytics request hanging in the onload event.  This highlighted
  a broader problem of render-blocking third-party assets.  If these assets (like
  scripts) are critical, a slow or failed connection can prevent the page from rendering
  for over a minute while the browser waits for a timeout.  This results in a blank
  screen for the user. This post explores the impact of render-blocking third-party
  resources on performance and how optimizing their integration can drastically improve
  the user experience, particularly in unreliable network conditions.'
tags:
- performance
- web development
- third-party scripts
- render-blocking
- user experience
- resilience
- offline
- network optimization
- analytics
- QR code
title: 'Performance and Resilience: Stress-Testing Third Parties by CSS Wizardry'

---
I was in China a couple of weeks ago for the Google Developer Day and I was showing everyone my [QRCode scanner](https://qrsnapper.com), it was working great until I went offline. When the user was offline (or partially connected) the camera wouldn't start, which meant that you couldn't snap QR codes. It took me an age to work out what was happening, and it turns out I was mistakenly starting the camera in my `onload` event and the Google Analytics request would hang and not resolve in a timely manner. It was [this commit that fixed it](https://github.com/PaulKinlan/qrcode/commit/e3b58c6821fd97defcd959f7d7f3de10ea4f4b12#diff-4a23ac1286faa3273c8cdc9b4bb5078dR578). 

> Because these types of assets block rendering, the browser will not paint anything to the screen until they have been downloaded (and executed/parsed). If the service that provides the file is offline, then that&#x2019;s a lot of time that the browser has to spend trying to access the file, and during that period the user is left potentially looking at a blank screen. After a certain period has elapsed, the browser will eventually timeout and display the page without the asset(s) in question. How long is that certain period of time?
> 
> It&#x2019;s 1 minute and 20 seconds.
> 
> If you have any render-blocking, critical, third party assets hosted on an external domain, you run the risk of showing users a blank page for 1.3 minutes.
> 
> Below, you&#x2019;ll see the DOMContentLoaded and Load events on a site that has a render-blocking script hosted elsewhere. The browser was completely held up for 78 seconds, showing nothing at all until it ended up timing out.

[Read full post](https://csswizardry.com/2017/07/performance-and-resilience-stress-testing-third-parties/).

I encourage you to read the post because there is a lot of great insight.
