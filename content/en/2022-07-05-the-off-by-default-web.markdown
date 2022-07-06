---
title: The off by default web
date: 2022-07-05T08:50:56.817Z
draft: true
summary: Some musing on the model of API permissions on the web.
slug: the-off-by-default-web
---
I while back [R](https://www.imdb.com/name/nm1412348/)[owan Merewood](https://twitter.com/rowan_m) and I were idly musing about the state of permissions and how little the [Feature Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy) system (now [Permissions Policy](https://developer.chrome.com/en/docs/privacy-sandbox/permissions-policy/) <- great primer by [Kevin K Lee](https://twitter.com/kevinkiklee)) is understood or used. As we were discussing what people chose to disable and it got me thinking that maybe that the default way the industry thinks about permissions on the web is not quite right. Maybe it's too permissive. We demand the developer asks the question "what should I turn off?", but it would be better to instead think about "what should I enable?".

Essentially, we were discussing [The Principle of Least Privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege).

When I speak to people about the Feature Policy system, the broad consensus is that it's "the first I've heard of it", and for people in the know, the feedback is usually: "Oh it's when I don't want an iframe to do this thing". It's rarely thought about in a first person context (as in what can be used on my site directly). And a query of HTTPArchive suggests that < 7000 sites out of approximately 10 million control their `feature-policy` or `permissions-policy` (queries [here](/queries-used-for-feature-policy-post/)) show that to be the case.

Speaking for myself, the cognitive load about thinking of permissions has been deferred to the 'user gesture' protection and I know from experience that it's a similar process for the developers broadly. The default assumption is that "permissions" require the user to grant them so it's safe. However, there are a number of different models to think about, such as:

* User Agent default-allow - the Browser vendor deems it safe for a script to access an API without any user gesture. API's such as autoplay (in some cases), devicemotion & Accelerometer, gamepad, clipboard-write fall in to this bucket.
* Requires User Gesture - the Browser wants the user to explicitly opt-in to using the API such as your Camera, MIDI's, USB, etc
* Developer Controlled - the owner of a site can block access to features on their site, or any resource such as an iframe that might be embedded on the site.

Looking at the feature policy page, there are [29 (as of July 2022) standardised permissions](https://github.com/w3c/webappsec-permissions-policy/blob/main/features.md), and 49 in Chrome when I run `document.featurePolicy.features()`) that you as a developer can control and that's a lot to think about.

I believe that as an industry we should be more intentional about the permission surfaces we make accessible to scripts.

Take the camera for example, the API is gated behind a user-gesture so it's not like a page can grab access to the camera without the user knowing, but if your site never accesses the Camera or microphone, would it be better to never allow access to it?

If you are confident about all your dependencies on your site then it might not actually be an issue, but if you have to embed 3rd party scripts into your site like many of us have to, then I think it should be default practice to turn off everything and then enable the permission for the feature as it's needed.

This 'deny-all' and enable incrementally approach has a number of benefits:

* Reduced surface area for abuse. 3rd party scripts and extensions will not be able to take advantage of these APIs on your site if they are disabled; This is specifically important for APIs that don't require a user-gesture to active.
* You understand the surface area of your site and can audit it more effectively;
* Your team will have to have an intentional approach to using new Web platform APIs - If your app needs access to 'geolocation' then you have a site-wide or a page specific policy to that API. It's a healthy conversation to have;
* You can have a meaningful conversation with your management about the needs of 3rd party scripts - if one breaks, you can ask why it needs access to certain APIs

A drawback could be that it might slow down your development because you have to plan and think more about the services that you need on your page.

This way of thinking is certainly not prevalent across the industry. Looking at the data in the HTTP Archive it's not a surprise, but there are shockingly few sites that control their permissions, and even fewer still who disable features.  

How could you do it today?

Today, while it's not technically complex, it's certainly cumbersome to move to this 'deny-all' Permissions/Feature Policy. In Chrome it would look like this:

```
permissions-policy: accelerometer=(), autoplay=(), camera=(), ch-device-memory=(),
  ch-downlink=(), ch-dpr=(), ch-ect=(), ch-prefers-color-scheme=(), ch-rtt=(), 
  ch-save-data=(), ch-ua=(), ch-ua-arch=(), ch-ua-bitness=(), 
  ch-ua-full-version=(), ch-ua-full-version-list=(), ch-ua-mobile=(), 
  ch-ua-model=(), ch-ua-platform=(), ch-ua-platform-version=(), ch-ua-wow64=(), 
  ch-viewport-width=(), ch-width=(), clipboard-read=(), clipboard-write=(), 
  cross-origin-isolated=(), display-capture=(), document-domain=(), 
  encrypted-media=(), fullscreen=(), gamepad=(), geolocation=(), 
  gyroscope=(), hid=(), idle-detection=(), keyboard-map=(), 
  local-fonts=(), magnetometer=(), microphone=(), midi=(), otp-credentials=(), 
  payment=(), picture-in-picture=(), publickey-credentials-get=(), 
  screen-wake-lock=(), serial=(), sync-xhr=(), usb=(), window-placement=(), 
  xr-spatial-tracking=()
```
Complex, right? Not to mention an increase in your request size and the fact Permission Policy is only available in Chromium based browsers. So you also have to add a Feature Policy:

```
feature-policy: accelerometer 'none'; autoplay 'none'; camera 'none'; 
  ch-device-memory 'none'; ch-downlink 'none'; ch-dpr 'none'; ch-ect 'none'; 
  ch-prefers-color-scheme 'none'; ch-rtt 'none'; ch-save-data 'none'; 
  ch-ua 'none'; ch-ua-arch 'none'; ch-ua-bitness 'none'; 
  ch-ua-full-version 'none'; ch-ua-full-version-list 'none'; ch-ua-mobile 'none'; 
  ch-ua-model 'none'; ch-ua-platform 'none'; ch-ua-platform-version 'none'; 
  ch-ua-wow64 'none'; ch-viewport-width 'none'; ch-width 'none'; 
  clipboard-read 'none'; clipboard-write 'none'; cross-origin-isolated 'none'; 
  display-capture 'none'; document-domain 'none'; encrypted-media 'none'; 
  fullscreen 'none'; gamepad 'none'; geolocation 'none'; gyroscope 'none';
  hid 'none'; idle-detection 'none'; keyboard-map 'none'; local-fonts 'none'; 
  magnetometer 'none'; microphone 'none'; midi 'none'; otp-credentials 'none'; 
  payment 'none'; picture-in-picture 'none'; publickey-credentials-get 'none'; 
  screen-wake-lock 'none'; serial 'none'; sync-xhr 'none'; usb 'none'; 
  window-placement 'none'; xr-spatial-tracking 'none'
```

But that's not all. Browser vendors don't support all the same permissions. What is above, I believe will work in Safari and Firefox, but those browsers might have a permission that Chrome doesn't.

The Guardian is a good example:

```
feature-policy: camera 'none'; microphone 'none'; midi 'none'; 
  geolocation 'none'
permissions-policy: camera=(), microphone=(), midi=(), geolocation=(), 
  interest-cohort=()
```

They appear (I've don't want to put words in their mouth) to have been intentional about what they want to deny access to, presumably because there is a potential for 3rd-party scripts to run on their page, however the rest of the API surface area is still available for scripts to run.

Hmmm.

The web is too far along to move to an off-by-default model for permissions, so we will always probably have to manage it ourselves which opens up a big issue: when a new API is introduced on the web *you* as a developer **have to disable it**. And this is the crux of some of my issue: 1) The web will keep growing in API surface area, and 2) as we learn more, Browser vendors will put APIs more behind permissions systems like this to give developers and users more control.

The proactiveness needed to keep the permissions restrictions up to date is an issue. We know from our Developer Surveys that developers can't keep up with the changes to the Web Platform, so I believe we should look a little harder into how we manage permissions especially we want a world where a browser update doesn't accidentally enable a new primitive that the developer has not yet reasoned about if they want to enable. 

<aside>
Interestingly on a related note, people working with CSP have had similar issues  and where over time [we've moved away from](https://research.google/pubs/pub45542/) the [allow-list approach with CSP](https://web.dev/strict-csp/) for similar reasons to the suggestion here. Now CSP and Permissions-Policy are two different areas, so an apples to apples comparison might not be fair.
</aside>

It does feel like there is room for improvements to the declarative model for permission, for example a simple shortcut for a 'deny-all' such as
`permissions-policy: all=()` or `permissions-policy: ()` would make this a lot easier to reason. Especially if I want to enable just the camera, I could: `permissions-policy: all=(), camera=(self)`.

In lieu of a specification change, build tooling might be able to help set up the default policies. Recommended best-practice guidance might help along with warnings in introspection software like Lighthouse.

Intentionality is important. I think there is a strong case for sites to disable all access to APIs by default and selectively turn features on if it's needed for the site to function, but it would require a massive shift in how we think about building web sites.

I'd love to learn about what you think in this space, so please leave a comment below.

---
While I've got my head up in the clouds, I did always like the idea that because a developer can declare what features are needed at the start of a request the browser might be able to use that information to decide not to active certain subsystem for the page in memory. 'Oh the user disabled USB, don't load that part of Chrome...' - But unfortunately I don't know enough about the internals of browsers.

---

Thanks to Rowan for the thought provoking conversation and ideas.


