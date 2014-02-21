---
layout: post
title: "Add to home screen is not what the web needs.  Is it?"
date: 2014-02-21 12:15
comments: true
published: true
categories: webapps
---

There has been a lot of great discussion about standardising the "[Add to Homescreen](https://developers.google.com/chrome/mobile/docs/installtohomescreen)" functionality across browsers.

Before I dive in, catch up with the latest thinking:

*  The [W3C manifest](https://github.com/w3c/manifest) thoughts on manifests and apps 
*  Marcos Caceres - [thoughts on standarising](https://twitter.com/marcosc/status/436522185641824256) the promo to install
*  PPK's [thoughts on Installable Web Apps](http://www.quirksmode.org/blog/archives/2014/02/installable_web.html)

We have an obsession with Apps and the deployment models that they present:  Upload to a store, drive the user to go to the store, download and install.

Web Developers want installable web apps.  They want a place on the homescreen eschewing the need for the (App|Play|*) model for App delivery.  I get it.

We have had this on iOS for a long time via `<meta name="apple-mobile-web-app-capable" content="yes">` &mdash; if I remember correctly this has been here since the first version of iOS &mdash; it was the only way to get apps on to your device.  Developers even made promo widgets that let users know they can "install" the web app.  Yet it wasn't enough, developers and users didn't actually want this, they wanted more capable installable apps.  Installing a web page?  Are you nuts.

We (web developers) pushed and pushed for installable web apps from the browser even more.  It landed in Chrome for Android and developers loved the idea.  Not many people have implemented it (even including the Apple syntax).  Not many people use it.  

When was the last time you added an App to the homescreen?  When was the last time you saw any site mention installing a web-app?  Thought so.

I am not opposed to making web-apps more integrated with the systems on which they live but **we are focusing on the wrong solution to the problem**.  Ideally you should never be able to tell if you are usage a web page, or using an installed app. But ...

No one has made the case that on mobile **users** want the ability to install web apps to the home screen.  Seriously.  Apple has had this feature yet users and developers wanted native apps, so they made a new platform whilst solving a huge number of other problems developers were facing that the web never solved:  Simple payments and monetisation, better discovery, offline usage (in theory), perfomance and features.

Add to Homescreen is us trying to play in the "apps" league.  A league we won't be able to compete in.

I want to see something much more fundamental.  The web offers something far richer: it encourages lightweight usage with no required installation and interaction with on-demand permissions.  I never want to see an install button or the requirement to understand all the potential permissions requried before trying the app.  The system should understand that I am using an app and how frequently that I use it and it should then automatically integrate with the launch points in the OS.  

I don't have the answer at the moment. Products like [Aviate](http://getaviate.com/) are starting to move to this model.  I could have sworn that Firefox OS was doing something similar to this as one facet of their system.

I am goung to write a follow up post about abuse of the "Add to Homescreen" which is an area entirely.
