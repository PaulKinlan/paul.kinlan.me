--- 
layout: post
title: "This is the web platform?"
published: false
date: 2014-02-24 17:15
categories: browsers mobile
---

Last year I built [I Want to Use](http://iwanttouse.com) to make it easier to understand the impact that your decisions on features in your web projects has on the reach you will have with your users.

The project is pretty simple.  It is a projection of the data on [CanIUse](http://caniuse.com). For a given feature it looks for the earliest version on a platform that it was supported on and sums the "usage".  

I am a huge proponent of developing for the mobile web, so I split the feature set by [Mobile](http://onmobile.iwanttouse.com) and [Desktop](http://ondesktop.iwanttouse.com).

Two things that fell out of this: 
*  **Features for Free**.  If I choose [Web Audio](http://www.iwanttouse.com/#audio-api) (43% on mobile) I can also safely use other features such as [Server-sent DOM Events](http://www.iwanttouse.com/#eventsource) because all browsers that support the former support the latter. (Note: the inverse relationship is not always true)
*  **Ubiquitous Platform features**.  As above but platform features that we can rely on being present in all browsers with any significant share.

## This is the web platform

|Feature|Available across Desktop|Available across Mobile|
|-------|--------------------|-------------------|
|PNG alpha transparency|Yes|Yes|
|querySelector/querySelectorAll||Yes|
|getElementsByClassName||Yes|
|CSS3 Multiple backgrounds||Yes|
|CSS3 Background-image options||Yes|
|CSS Table display||Yes|
|CSS Generated content||Yes|
|CSS 2.1 selectors|Yes|Yes|
|CSS3 selectors||Yes|
|CSS3 Text-shadow||Yes|
|CSS3 Colors||Yes|
|CSS3 Box-sizing||Yes|
|CSS3 Media Queries||Yes|
|CSS3 Multiple column layout||Yes|
|Canvas (basic support)||Yes|
|Cross-document messaging||Yes|
|Data URIs||Yes|
|XHTML served as application/xhtml+xml||Yes|
|CSS3 Opacity|Yes|Yes|
|JSON parsing||Yes|
|CSS3 Text-overflow||Yes|
|CSS3 Overflow-wrap|Yes|Yes|
|CSS min/max-width/height|Yes|Yes|
|CSS inline-block|Yes|Yes|
|dataset & data-* attributes|Yes|Yes|
|CSS Counters||Yes|
|getComputedStyle||Yes|
|contentEditable|Yes||
|Drag and Drop|Yes||

Pretty damning.

Ok, this is actually a little misleading if you are [willing to miss out on 1% extra reach for your desktop](http://ondesktop.iwanttouse.com/#cors) audience then you can get similar feature parity.

## How do we improve the web platform?




