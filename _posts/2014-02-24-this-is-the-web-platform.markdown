--- 
layout: post
title: "This is the web platform"
description: "This is the web platform"
published: true
date: 2014-02-24 17:15
categories: browsers mobile
---

Feature | On Desktop | On Mobile 
------- | ---------- | ---------
PNG alpha transparency | Yes | Yes
querySelector/querySelectorAll | | Yes
getElementsByClassName | | Yes
CSS3 Multiple backgrounds | | Yes
CSS3 Background-image options | | Yes
CSS Table display | | Yes
CSS Generated content | | Yes
CSS 2.1 selectors | Yes | Yes
CSS3 selectors | | Yes
CSS3 Text-shadow | | Yes
CSS3 Colors | | Yes
CSS3 Box-sizing | | Yes
CSS3 Media Queries | | Yes
CSS3 Multiple column layout | | Yes
Canvas (basic support) | | Yes
Cross-document messaging | | Yes
Data URIs | | Yes
XHTML served as application/xhtml+xml | | Yes
CSS3 Opacity | Yes | Yes
JSON parsing | Yes | Yes
CSS3 Text-overflow | | Yes
CSS3 Overflow-wrap | Yes | Yes
CSS min/max-width/height | Yes | Yes
CSS inline-block | Yes | Yes
dataset & data-* attributes | Yes | Yes
CSS Counters | | Yes
getComputedStyle | | Yes
contentEditable | Yes |
Drag and Drop | Yes |

Pretty damning.

At "100%" coverage of features that are in all browsers split by Mobile and Desktop then this is all we have to play with.

Ok, this is actually misleading.  If you are [willing to miss out on 1% extra reach for your desktop](http://ondesktop.iwanttouse.com/#cors) audience then you can get similar feature parity with mobile.  But still the feature support that is ubiquitous across the web is actually pretty small especially if you are supporting IE8.

## How do I know what the web platform is?

Last year I built [iwanttouse.com](http://iwanttouse.com) to make it easier for you to determine the cost on your userbase supporting certain features will have.  *If I support X, I can only reach Y% of the web's users*

The project is pretty simple.  It is a projection of the data on [CanIUse.com](http://caniuse.com). For a given "feature" it looks for the earliest version on a platform that it was supported on and sums the "usage".  

I split the feature set by [Mobile](http://onmobile.iwanttouse.com) and [Desktop](http://ondesktop.iwanttouse.com) and it gives you some pretty interesting nuggets of data.

Two things that fell out of this: 

*  **Features for Free**.  If I choose [Web Audio](http://www.iwanttouse.com/#audio-api) (43% on mobile) I can also safely use other features such as [Server-sent DOM Events](http://www.iwanttouse.com/#eventsource) because all browsers that support the former support the latter. (Note: the inverse relationship is not always true)
*  **Ubiquitous Platform features**.  As above but platform features that we can rely on being present in all browsers with any significant share.

I want to focus on **Ubiquitous Platform features**.

## How do we improve the web platform?

As a web developer today I face a couple of problems: Legacy browsers that aren't updated and inconsistent implementation across browsers.  

The web feels like a pirate ship, everyone is hacking and slashing in different directions and we are lucky enough that the ship goes forwards.  Slowly.  How do we become a [Ben Ainslie](http://en.wikipedia.org/wiki/Ben_Ainslie) America's Cup winning yacht?... (Ack, I can't believe I said that).  Point is, how can we improve the modern mobile web consistently if there are multiple large players in the eco-system?

1.  Wait it out and let the Browser vendors do their thing.  This will change over time as people move off the platforms that have stopped progressing as their devices are renewed.
2.  Ignore the old browsers and the users that use them and go for it.
3.  Push for consistency across the platform.

My preference is for 2 and 3.  But actually 1 is what we *really* **really** need to solve.

I like to solve level 1 problems &mdash; problems with a technical solution &mdash; they're the things I can fix.  I can meet developers and work with them on their sites to measurably make the web better one large site at a time, but it is all small scale...

I decided to take a peek at the features that are supported across the latest mobile browsers and the reach that will have:  **[44%](http://onmobile.iwanttouse.com/#geolocation,flexbox)**.  We can't honestly say to a business that you should build experiences for 44% of your potential user base (well, it depends who you want to sell or attract - your demographics might be highly skewed - i.e.. Government legislation, Business demands.)

If you look at the  head of the mobile web (44%) there is a compelling feature set.  You can build some amazing applications with it.

Feature|Android Browser 4.4|iOS Safari 7.0|Chrome for Android 32.0|IE Mobile 10.0|Opera Mobile 16.0|Firefox for Android 26.0|Blackberry Browser 10.0
-------|-------|-------|-------|-------|-------|-------|-------
XHTML served as application/xhtml+xml|Yes|Yes|Yes|Yes|Yes|Yes|Yes
XMLHttpRequest 2|Yes|Yes|Yes|Yes|Yes|Yes|Yes
WOFF - Web Open Font Format|Yes|Yes|Yes|Yes|Yes|Yes|Yes
Web Workers|Yes|Yes|Yes|Yes|Yes|Yes|Yes
Web Sockets|Yes|Yes|Yes|Yes|Yes|Yes|Yes
Video element|Yes|Yes|Yes|Yes|Yes|Yes|Yes
ECMAScript 5 Strict Mode|Yes|Yes|Yes|Yes|Yes|Yes|Yes
Typed Arrays|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS3 Transforms|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS3 Text-overflow|Yes|Yes|Yes|Yes|Yes|Yes|Yes
SVG in HTML img element|Yes|Yes|Yes|Yes|Yes|Yes|Yes
Inline SVG in HTML5|Yes|Yes|Yes|Yes|Yes|Yes|Yes
SVG filters|Yes|Yes|Yes|Yes|Yes|Yes|Yes
SVG in CSS backgrounds|Yes|Yes|Yes|Yes|Yes|Yes|Yes
SVG (basic support)|Yes|Yes|Yes|Yes|Yes|Yes|Yes
defer attribute for external scripts|Yes|Yes|Yes|Yes|Yes|Yes|Yes
async attribute for external scripts|Yes|Yes|Yes|Yes|Yes|Yes|Yes
requestAnimationFrame|Yes|Yes|Yes|Yes|Yes|Yes|Yes
rem (root em) units|Yes|Yes|Yes|Yes|Yes|Yes|Yes
querySelector/querySelectorAll|Yes|Yes|Yes|Yes|Yes|Yes|Yes
PNG alpha transparency|Yes|Yes|Yes|Yes|Yes|Yes|Yes
Page Visibility|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS outline|Yes|Yes|Yes|Yes|Yes|Yes|Yes
Offline web applications|Yes|Yes|Yes|Yes|Yes|Yes|Yes
Web Storage - name/value pairs|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS3 Multiple backgrounds|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS min/max-width/height|Yes|Yes|Yes|Yes|Yes|Yes|Yes
matchMedia|Yes|Yes|Yes|Yes|Yes|Yes|Yes
JSON parsing|Yes|Yes|Yes|Yes|Yes|Yes|Yes
Range input type|Yes|Yes|Yes|Yes|Yes|Yes|Yes
input placeholder attribute|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS inline-block|Yes|Yes|Yes|Yes|Yes|Yes|Yes
sandbox attribute for iframes|Yes|Yes|Yes|Yes|Yes|Yes|Yes
New semantic elements|Yes|Yes|Yes|Yes|Yes|Yes|Yes
Session history management|Yes|Yes|Yes|Yes|Yes|Yes|Yes
Hashchange event|Yes|Yes|Yes|Yes|Yes|Yes|Yes
getElementsByClassName|Yes|Yes|Yes|Yes|Yes|Yes|Yes
getComputedStyle|Yes|Yes|Yes|Yes|Yes|Yes|Yes
Geolocation|Yes|Yes|Yes|Yes|Yes|Yes|Yes
@font-face Web fonts|Yes|Yes|Yes|Yes|Yes|Yes|Yes
FileReader API|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS3 Colors|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS3 Transitions|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS3 Text-shadow|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS Table display|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS3 selectors|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS 2.1 selectors|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS Repeating Gradients|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS3 Opacity|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS3 Media Queries|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS Gradients|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS Generated content|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS Counters|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS3 Box-shadow|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS3 Animation|Yes|Yes|Yes|Yes|Yes|Yes|Yes
Cross-Origin Resource Sharing|Yes|Yes|Yes|Yes|Yes|Yes|Yes
contenteditable attribute (basic support)|Yes|Yes|Yes|Yes|Yes|Yes|Yes
classList (DOMTokenList )|Yes|Yes|Yes|Yes|Yes|Yes|Yes
Text API for Canvas|Yes|Yes|Yes|Yes|Yes|Yes|Yes
Canvas (basic support)|Yes|Yes|Yes|Yes|Yes|Yes|Yes
calc() as CSS unit value|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS3 Border-radius (rounded corners)|Yes|Yes|Yes|Yes|Yes|Yes|Yes
CSS3 Background-image options|Yes|Yes|Yes|Yes|Yes|Yes|Yes
Audio element|Yes|Yes|Yes|Yes|Yes|Yes|Yes
Cross-document messaging|Yes|Yes|Yes|Partial|Yes|Yes|Yes
CSS3 3D Transforms|Yes|Yes|Yes|Partial|Yes|Yes|Yes
MPEG-4/H.264 video format|Yes|Yes|Yes|Yes|Yes|Partial|Yes
Data URIs|Yes|Yes|Yes|Partial|Yes|Yes|Yes
dataset & data-* attributes|Yes|Yes|Yes|Partial|Yes|Yes|Yes
CSS position:fixed|Yes|Partial|Yes|Yes|Yes|Yes|Yes
Content Security Policy|Yes|Yes|Yes|Partial|Yes|Yes|Yes
Blob constructing|Partial|Yes|Yes|Yes|Yes|Yes|Yes
CSS3 Overflow-wrap|Yes|Yes|Yes|Partial|Yes|Partial|Yes
Progress & Meter|Yes|Partial|Yes|Partial|Yes|Yes|Yes
Flexible Box Layout Module|Yes|Yes|Yes|Partial|Yes|Partial|Yes



But like I said. *44%*.  It's a big head but not a feasible platform for the vast majority of companies.  I produced the following breakdown of features that we should get Chrome and other vendors to fix feature support at a tactical level to make for a more consistent web and make developers lives easier.  The problem is we are only fixing it for _44%_ of the web's users.  *Documented below for consistency*


Feature|Android Browser 4.4|iOS Safari 7.0|Chrome for Android 32.0|IE Mobile 10.0|Opera Mobile 16.0|Firefox for Android 26.0|Blackberry Browser 10.0
-------|-------|-------|-------|-------|-------|-------|-------
TTF/OTF - TrueType and OpenType font support|Yes|Yes|Yes|Unknown|Yes|Yes|Yes
Touch events|Yes|Yes|Yes|No|Yes|Yes|Yes
Navigation Timing API|Yes|No|Yes|Yes|Yes|Yes|Yes
Mutation Observer|Yes|Yes|Yes|No|Yes|Yes|Yes
Intrinsic & Extrinsic Sizing|Yes|Yes|Yes|No|Yes|Yes|Yes
Font feature settings|Yes|Yes|Yes|No|Yes|Yes|Yes
File API|Yes|Yes|Yes|No|Yes|Yes|Yes
Server-sent DOM events|Yes|Yes|Yes|No|Yes|Yes|Yes
CSS3 tab-size|Yes|Yes|Yes|No|Yes|Yes|Yes
Channel messaging|Yes|Yes|Yes|Yes|Yes|No|Yes
CSS3 Border images|Yes|Yes|Yes|No|Yes|Yes|Yes
Blob URLs|Yes|Yes|Yes|No|Yes|Yes|Yes
Viewport units: vw, vh, vmin, vmax|Yes|Partial|Yes|Partial|Yes|Yes|Partial
SVG SMIL animation|Yes|Partial|Yes|No|Yes|Yes|Yes
IndexedDB|Yes|No|Yes|Yes|Yes|Yes|Partial
CSS3 word-break|Partial|Partial|Partial|Yes|Partial|Yes|Partial
SVG fonts|Yes|Yes|Yes|No|Yes|No|Yes
Download attribute|Yes|No|Yes|No|Yes|Yes|Yes
Details & Summary elements|Yes|Yes|Yes|No|Yes|No|Yes
CSS Filter Effects|Yes|Yes|Yes|No|Yes|No|Yes
CSS3 Multiple column layout|Partial|Partial|Partial|Yes|Partial|Partial|Partial
Date/time input types|Yes|Yes|Yes|No|Partial|No|Yes
HTML5 form features|Partial|Yes|Partial|Partial|Partial|Partial|Partial
Form validation|No|No|Yes|Partial|Yes|Yes|Yes
CSS3 Box-sizing|Partial|Partial|Partial|Partial|Partial|Yes|Partial
WAI-ARIA Accessibility features|Partial|Partial|Partial|Yes|Partial|Yes|No
SVG effects for HTML|Partial|Partial|Partial|No|Partial|Yes|Yes
matches() DOM method|Partial|Partial|Partial|Partial|Partial|Partial|Partial
HTML templates|Yes|No|Yes|No|Yes|Yes|No
Strict Transport Security|Yes|Unknown|Yes|No|Yes|Yes|No
getUserMedia/Stream API|No|No|Yes|No|Yes|Yes|Yes
Color input type|Yes|No|Yes|No|Yes|No|Yes
CSS Feature Queries|Yes|No|Yes|No|Yes|Yes|No
Clipboard API|Partial|Partial|Partial|No|Partial|Yes|Partial
Canvas blend modes|Yes|Yes|Yes|No|No|Yes|No
Ruby annotation|Partial|Partial|Partial|Partial|Partial|No|Partial
Number input type|Partial|Partial|Partial|Partial|Partial|No|Partial
DeviceOrientation events|Partial|Partial|Partial|No|Partial|Partial|Partial
WebGL - 3D Canvas graphics|No|No|Partial|No|Yes|Partial|Yes
Web Notifications|Partial|No|No|No|Partial|Yes|Yes
Full Screen API|No|No|Yes|No|Yes|Partial|Partial
WebP image format|Yes|No|Yes|No|Yes|No|No
SVG fragment identifiers|No|No|No|Yes|No|Yes|Yes
Shadow DOM|Yes|No|Yes|No|Yes|No|No
WebRTC Peer-to-peer connections|No|No|Yes|No|Yes|Yes|No
MathML|No|Yes|No|No|No|Yes|Yes
Filesystem & FileWriter API|No|No|Yes|No|Yes|No|Yes
CSS Masks|Partial|Partial|Partial|No|Partial|No|Partial
Web Audio API|No|Yes|Yes|No|No|Yes|No
WebM video format|Partial|No|Yes|No|Partial|Partial|No
Datalist element|No|No|No|No|No|Yes|Yes
CSS Hyphenation|No|Yes|No|No|No|Yes|No
CSS Regions|No|Yes|No|Partial|No|No|No
Promises|No|No|Partial|No|No|Partial|No
Scoped CSS|No|No|No|No|No|Yes|No
Shared Web Workers|No|No|No|No|No|No|Yes
Opus|No|No|No|No|No|Yes|No
Ogg/Theora video format|No|No|No|No|No|Yes|No
JPEG XR image format|No|No|No|Yes|No|No|No
Drag and Drop|No|No|No|Yes|No|No|No
CSS resize property|No|No|No|No|No|Yes|No
CSS Grid Layout|No|No|No|Yes|No|No|No
Pointer events|No|No|No|Partial|No|No|No
CSS3 object-fit/object-position|No|No|No|No|No|No|No
Toolbar/context menu|No|No|No|No|No|No|No
CSS Variables|No|No|No|No|No|No|No
Blending of CSS image|No|No|No|No|No|No|No

Getting these features implemented would be cool but there is no additional reach at all. More users will not be affected by these new features.  We didn't increase the size of the user base.  Yes we might get an amazing WebGL based WebComponents app that people use  but will they upgrade their browser or phone to be able to use it?  Probably not.

## So what do we do?

How do we move the web platform forward in a meaningful way?  

It is hard.

Do we want to get back to a world where this is a thing?

![best viewed in](/images/ienetscape.jpg)

Maybe.???

At a minimum we should:

*  [Build for the 90%](http://www.iwanttouse.com/#css-boxshadow) and get your partners and customers to see at a minimum the experience that you can build with a huge amount of reach.
*  [Understand the choices](http://caniuse.com) you make and the [impact they have](http://iwanttouse.com). Push your customers and partners to use progressive enchancement.  Don't exclude a huge number of users for a single feature.
*  Push for consistency over new platform features across all browser vendors.

[Tell me I am wrong](https://twitter.com/intent/tweet?text=.%40Paul_Kinlan+you+are+wrong+about+the+web+because...)
