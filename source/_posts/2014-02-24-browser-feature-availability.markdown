--- 
layout: post
title: "This is the web platform?"
published: false
date: 2014-02-24 17:15
categories: browsers mobile
---

Last year I built [I want to use](http://iwanttouse.com) to make it easier to understand the impact that your decisions on features in your web projects has on the reach you will have with your users.

The project is pretty simple.  It is a projection of the data on [CanIUse.com](http://caniuse.com). For a given "feature" it looks for the earliest version on a platform that it was supported on and sums the "usage".  

I am a huge proponent of developing for the mobile web, so I split the feature set by [Mobile](http://onmobile.iwanttouse.com) and [Desktop](http://ondesktop.iwanttouse.com).

Two things that fell out of this: 
*  **Features for Free**.  If I choose [Web Audio](http://www.iwanttouse.com/#audio-api) (43% on mobile) I can also safely use other features such as [Server-sent DOM Events](http://www.iwanttouse.com/#eventsource) because all browsers that support the former support the latter. (Note: the inverse relationship is not always true)
*  **Ubiquitous Platform features**.  As above but platform features that we can rely on being present in all browsers with any significant share.

## This is the web platform

At "100%" coverage of features that are in all browsers split by Mobile and Desktop then this is what you have to play with. 

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

Ok, this is actually a little misleading if you are [willing to miss out on 1% extra reach for your desktop](http://ondesktop.iwanttouse.com/#cors) audience then you can get similar feature parity.  But still the feature support that is ubiquitous across the web is actually pretty small especially if you are supporting IE8.

## How do we improve the web platform?

The web feels like a pirate ship, everyone is hacking and slashing in different directions and we are just lucky enough that the ship goes forwards.  Slowly.  How do we become [Ben Ainslie](http://en.wikipedia.org/wiki/Ben_Ainslie) Americas cup winning Yacht.... (Ack, I can't believe I said that).  Point is, how can we increase the platform feature set.

1.  Wait.  This chart is will change as we move people off the platforms that are stopping from progressing.
2.  Ignore the old browsers. 
3.  Push for consitency

|Feature|iOS Safari 7.0|Android Browser 4.4|Opera Mobile 16.0|Blackberry Browser 10.0|Chrome for Android 32.0|Firefox for Android 26.0|IE Mobile 10.0
|-------|-------|-------|-------|-------|-------|-------|-------|
|XHTML served as application/xhtml+xml|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|XMLHttpRequest 2|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|WOFF - Web Open Font Format|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|Web Workers|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|Web Sockets|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|Video element|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|ECMAScript 5 Strict Mode|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|Typed Arrays|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS3 Transforms|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS3 Text-overflow|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|SVG in HTML img element|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|Inline SVG in HTML5|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|SVG filters|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|SVG in CSS backgrounds|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|SVG (basic support)|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|defer attribute for external scripts|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|async attribute for external scripts|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|requestAnimationFrame|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|rem (root em) units|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|querySelector/querySelectorAll|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|PNG alpha transparency|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|Page Visibility|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS outline|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|Offline web applications|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|Web Storage - name/value pairs|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS3 Multiple backgrounds|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS min/max-width/height|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|matchMedia|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|JSON parsing|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|Range input type|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|input placeholder attribute|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS inline-block|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|sandbox attribute for iframes|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|New semantic elements|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|Session history management|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|Hashchange event|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|getElementsByClassName|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|getComputedStyle|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|Geolocation|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|@font-face Web fonts|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|FileReader API|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS3 Colors|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS3 Transitions|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS3 Text-shadow|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS Table display|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS3 selectors|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS 2.1 selectors|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS Repeating Gradients|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS3 Opacity|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS3 Media Queries|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS Gradients|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS Generated content|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS Counters|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS3 Box-shadow|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS3 Animation|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|Cross-Origin Resource Sharing|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|contenteditable attribute (basic support)|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|classList (DOMTokenList )|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|Text API for Canvas|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|Canvas (basic support)|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|calc() as CSS unit value|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS3 Border-radius (rounded corners)|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|CSS3 Background-image options|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|Audio element|Yes|Yes|Yes|Yes|Yes|Yes|Yes
|Cross-document messaging|Yes|Yes|Yes|Yes|Yes|Yes|Partial
|CSS3 3D Transforms|Yes|Yes|Yes|Yes|Yes|Yes|Partial
|MPEG-4/H.264 video format|Yes|Yes|Yes|Yes|Yes|Partial|Yes
|Data URIs|Yes|Yes|Yes|Yes|Yes|Yes|Partial
|dataset & data-* attributes|Yes|Yes|Yes|Yes|Yes|Yes|Partial
|CSS position:fixed|Partial|Yes|Yes|Yes|Yes|Yes|Yes
|Content Security Policy|Yes|Yes|Yes|Yes|Yes|Yes|Partial
|Blob constructing|Yes|Partial|Yes|Yes|Yes|Yes|Yes
|CSS3 Overflow-wrap|Yes|Yes|Yes|Yes|Yes|Partial|Partial
|Progress & Meter|Partial|Yes|Yes|Yes|Yes|Yes|Partial
|Flexible Box Layout Module|Yes|Yes|Yes|Yes|Yes|Partial|Partial


Am I wrong?  [Let me know](https://twitter.com/intent/tweet?text=.%40Paul_Kinlan+you+are+wrong+about+the+web+because+....)

