---
date: 2022-10-10 14:25:01+00:00
draft: true
slug: not-yet-stable
summary: This post explores browser compatibility data, focusing on features present
  in some browsers but not others.  I've created a tool, \"Not yet Stable,\" to visualize
  these differences and help developers understand the current web platform landscape.  While
  high-level comparisons are interesting, the real value lies in identifying smaller,
  unexpected compatibility issues that can cause frustration. The tool allows for
  granular comparisons between specific browsers (e.g., Chrome vs. Firefox, Safari
  vs. Firefox) to pinpoint these inconsistencies.  I've observed significant discrepancies
  in media-related features, such as Web Codecs API, Picture-in-Picture, and MediaStreams.  The
  goal is to leverage this data for better understanding and ultimately improve web
  compatibility.
tags:
- browser compatibility
- web development
- cross-browser testing
- interop
- BCD
- platform fragmentation
- media APIs
title: Not yet stable

---
If you are a regular reader of this site then you will have seen recently that I have an eye on Browser Compat Data. I believe that understanding the shape of the platform that developers can build for helps everyone. It helps developers because they know what is reasonably available and can rely on in their sites and apps. It helps framework authors for the same reasons, and it helps Browser vendors because they can use this intelligence to work out where they can put some of their efforts.

As I've been looking at [what is new on the web](https://paul.kinlan.me/what-is-new-on-the-web/) (the set of features available across browsers), I thought it would be interesting to look at what is **not** yet available across the web. Why? Many reasons:

* There is a lot of rhetoric about browsers pushing too hard and causing issues and there is a similar amount of frustration that there are browsers that are holding back the web - is it accurate? and if so where?
* If you are looking at projects such as [Interop 2022](https://web.dev/interop-2022/) and trying to work out where the vendors should improve interoperability of their browsers, there is a clear list (ignoring priority)

I created "[Not yet Stable](https://time-to-stable.deno.dev/not-stable?browser-chrome=on&browser-firefox=on&browser-safari=on&feature-api=on&feature-css=on&feature-html=on&feature-javascript=on)" to help you look at this question. It will let you get information on the features that are in at least one of your selected browsers but not available across all of them.

![A summary of the number of features available in at least one browser](/static/2022-10-10-screen-shot-2022-10-10-at-15-40-33.png "Not yet stable")

**Caveat**: This site relies on data that is curated by people and as such might have errors in the source (you can check and edit [here](https://github.com/mdn/browser-compat-data)). The [algorithm](https://github.com/PaulKinlan/time-to-stable) that parses the data might also contain errors.

When you look at the above data it might look like that either Chrome is pushing ahead too much - both Firefox and Safari are equally behind in that regard, or another way to look at it is that Chrome is pushing to far. But it's interesting to see that Chrome is trying to keep up with Safari, but hasn't been able to do as much when looking at Firefox.

At a high-level it's fun to poke at this, but it's more meaningful to look at the areas where. As mentioned in [The Lumpy Web](https://paul.kinlan.me/the-lumpy-web/) - the big gaps in the platform you can see and know to avoid (or work with), it's the smaller areas where you expect things to just work that cause you a lot of frustration and wasted time.

To that end, you might want to inspect a little closer. For example, you can look at just [Chrome against Firefox](https://time-to-stable.deno.dev/not-stable?browser-chrome=on&browser-firefox=on&feature-api=on&feature-css=on&feature-html=on&feature-javascript=on) or [Safari compared to Firefox](https://time-to-stable.deno.dev/not-stable?browser-firefox=on&browser-safari=on&feature-api=on&feature-css=on&feature-html=on&feature-javascript=on) and see the parts of the platform where you will.

One thing that I've noted is that there is a lot of inconsistency in anything related to Media - Chrome has Web Codecs API but Firefox and Safari don't. PIP seems to be in Safari and Chrome but not Firefox, MediaStreams and MediaTracks seem to have different API surfaces.

TIL [taintEnabled](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/taintEnabled) and [RemotePlayback](https://developer.mozilla.org/en-US/docs/Web/API/RemotePlayback)

What is important is that the data is available and we can start to tell interesting and hopefully accurate stories with that data.