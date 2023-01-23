
---
title: Responsible JavaScript 
date: 2022-05-06T20:41:18.107Z
type: entry
slug: responsible-javascript
---
* By [Jeremy Wagner](../../entry/jeremy-wagner)
* Main takeaway is that it's still an incredibly complex space, and one that a developer has to take control of otherwise poor performance will take control of you. There's a lot of strategies, but I'm still left wondering why focusing on performance is not the default for developers or the platform.
* Wasps!
* It was great to see talking about a number of issues that affect performance
  * Thermal Throttling
  * Device Capabilities - Nokia 2 Go ([Android](../../entry/android))
* Developers are ultimately responsible
* The platform is far more capable now - you don't need so many libraries
* Document your architectural choices and hold your projects to them
* Server-first is User-first
* SPA
  * Perceptual improvements to performance
  * However they have to use lot's of JS to replace infrastrutuce the browser already provides
    * Effective [Caching](../../entry/caching) in a [Service Worker](../../entry/service-worker) might be able to help with the same perceived performance benefits
  * Use effective [Caching](../../entry/caching)
    * Mentions `immutable`, but I think this is only supported in [Firefox](../../entry/firefox)
  * [Progressive Enhancement](../../entry/progressive-enhancement)
    * `is` - mentions not in [Safari](../../entry/safari)
    * Some interesting code to enhance a form element. Quite liked the submit button demo
* Metrics
  * [Lab Metrics](../../entry/lab-metrics)
  * [Field Metrics](../../entry/field-metrics)
  * [FP](../../entry/fp), [FCP](../../entry/fcp), [LCP](../../entry/lcp)
  * [CLS](../../entry/cls)
  * [TTI](../../entry/tti), [FID](../../entry/fid), [TBT](../../entry/tbt)
* Tools
  * [Chrome](../../entry/chrome) uses flame charts for tasks, but also has per-frame
  * [Safari](../../entry/safari) bar chart on a per-frame basis.
  * Has a really good explainer of how to use [Chrome DevTools](../../entry/chrome-devtools) for [Loading Performance](../../entry/loading-performance), [Runtime Performance](../../entry/runtime-performance) and how to test on devices
* Responsible feature delivery
  * You should be able to reply in `import` syntax and function
  * Enables good [code-splitting](../../entry/code-splitting) and useful for selectively loading [polyfills](../../entry/polyfills)
  * [Resource hints](../../entry/resource-hints)
    * Add to header or head for critical JS so we get a headstart
  * [Save-Data](../../entry/save-data) header
    * Understand your users might have it set and respond appropriately, can either think about it on the server or the client.
  * [Service Worker](../../entry/service-worker), navigationPreload can help massively improve performance (theres a chart with interesting data)
* Tools
  * [Transpilers](../../entry/transpilers) [Bundlers](../../entry/bundlers) - be careful can add significant code that you might not have been aware of, but they can have a postivie impact by helping you split code and compress etc.
  * Understand your users browsers and you can make better decisions.
* Use the browser feature as much as possible, [HTML](../../entry/html) and [CSS](../../entry/css)
* Oberserver API's to react when the user does something - reaches a certain point, then load more code etc.
* Think about Idle time and do things then, can help stop jank in user interactions.
* 3rd Party JS
  * Can be very bad. Developers should take more control.
  * Can lead on to a lot of non-performant related issues, security etc.

