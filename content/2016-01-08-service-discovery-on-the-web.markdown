---
slug: service-discovery-on-the-web
date: 2016-01-08T11:20:31+01:00
title: "Service discovery and app interactions on the web"
description: "It's not a pretty picture, but we have some solutions"
---

Interactions between web and web, web and apps, and apps and web is something that 
many of you may know that [I am passionate about](https://en.wikipedia.org/wiki/Web_Intents). 

There are many different ways that you can communicate between sites, apps and services:

* Requests be it One way, Bi-Directional
* Channels and Sockets for more peristent conversations

The method of communication is relatively mundane, but there is a common issue shared 
amoungst these tools: Discovery of services.

Inter-application communication on the web sucks. We have the tools for pushing bits about the 
place: HTTP, postMessage and even Web RTC for example. The problem with all of these is the 
discovery phase, without a late-bound system in place we as developers are forced
to tightly couple our site with other services on a hope that we have chosen what the user prefers.

Schemes and protocol handlers such as `mailto` work as a basic way to do late-binding. It
has always been a relative weak method with little flexibility for a number of reasons: 

* It offers no ability to control selection services, 
* Communication is one way (yes opener.postMessage exists but you can't rely on the app speaking the same protocol over that channel)
* The ecosystem is incredibly poorly standardised - there is no registry of services that exists or is 
maintained that has a list of all the endpoints for an scheme and the parameters that you can send to it.
* There is no fallback, if there is no app installed the link doesn't work.  
* It is incredibly one-sided. If I am a web site and I want my site to be able to handle a protocol
such as `pandaora:` I can't do it because the `registerProtocolHandler` API has been hobbled to require a `web+` prefix.

I do have hope though, with the introduction of Service Worker it should be possible to solve my biggest 
issue: `registerProtocolHandler` would not work offline with AppCache because each Query String parameter and value
would be classed as a unique URL meaning a [new master entry in the AppCache](https://paul.kinlan.me/dear-appcache/) 
and thus would not be cached.

All this being said, how do we solve the problems that we have today, especially in 
a world of Progressive Web Apps where the experiences should be able to integrate
with the user's device but also work progressively everywhere?  

I believe an ideal solution would:

* Give the user choice of the service they want to use either on the web or native
* Let the developer target a service but fallback to the generic system
* Support a variety of differnt data transport mechanisms depending on the service
* Allow web sites to register with the system so that they can be opened from triggered
* Function Online and Offline.

A popular feature of the Android platform are Intents. A very little known ability
is to that you can construct an intent in the browser and use it to send data to an
app that is installed on the device.  The Intent syntax is pretty simple to understand and
is very webby (it is just a url)

I have written about it a bit in the past if you want to read more about it in the context
of the web:

* [Android Intents with Chrome](https://developer.chrome.com/multidevice/android/intents)
* [Triggering a native Share intent on Android from the web](https://paul.kinlan.me/sharing-natively-on-android-from-the-web/)
* [Deep app linking and changes to Chrome on Android](https://paul.kinlan.me/deep-app-linking-on-android-and-chrome/)
* [Parsing Screenshot from Chrome on Android](https://paul.kinlan.me/parsing-screenshot-from-Chrome-for-Android-send-intent/)
* [What happened to Web Intents](https://paul.kinlan.me/what-happened-to-web-intents/)

But why Intents? The best way to think about what an intent is that is an abstract description 
of an operation to be performed by the user. It is an Android feature so whilst it is not
directly portable to other platforms it sits as a layer above what we have on the web, that is
it by default is agnostic to "scheme" and data types, but can be made to be more specific depending
on the needs of your application.

A specific way to think of this is the Share Intent (or [ACTION_SEND](http://developer.android.com/reference/android/content/Intent.html#ACTION_SEND) on Android).
There isn't a "share:" url scheme defined or used on the web or native, instead we have a "whatsapp:" scheme,
a "twitter:" scheme, a "facebook:" scheme that allow us to have apps installed on the device that can
be opened from the web, but the problems are numerous: if the app isn't installed then users click will fail;
any app can hijack any of the custom schemes and take over the link; we need many links on the page to handle 
what is essentially the same task &mdash; share; and finally we don't have the ability to filter service that 
the user might want to connect with &mdash; Share an Image is a good example, you would only want to see services that you can share an image with, sharing to a
text only service is useless.

I think the "Intent URL" syntax is incredibly powerful, it allows you to control how you find services. If you want to target a specific
app or service you add a package filter in, if you want to find any service that supports the Intent of your user's action (Share, Edit, Call)
you can do that by adding in the appropriate Action, and you can also then filter services even further by data types.  

The big big issue is that it is not portable at the moment in its current incarnation, 
but I believe we can polyfill a good chunk of it using our current technology: registerProtocolHandler. I need to play with the ideas a little more but 
I think we can combine Android's Intent syntax and make it more portable across browsers.

If you have any suggestions I am very keen to hear them.
