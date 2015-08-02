---
slug: slice-the-web
publishDate: 2015-08-15
date: 2015-07-31
title: "SLICE: The Web"
description: "Principles of the web."
---

There have been a lot of conversation about all the issues of the web over the
last couple of weeks and they broadly group themselves into the following 
categories:

* Performance
* Lumpy inconsistent browsers
* Rapidly expanding feature landscape.

I want to put these to the side for a couple of minutes to quickly talk about one of 
terms that we have used in Google to quickly describe the positive aspects of the web 
as a platform for users and developers: **SLICE**.

I can't find an original reference for it, but the underlying points that I will go into are
well known.  SLICE was mentioned at the first [Chrome Dev Summit](https://developer.chrome.com/devsummit) 
by Linus Upson in the 2013 keynote. When Linus talked about the properties of the web
it wasn't in the correct order for naming but I do encourage you to watch this
video.  _Note_: Brett Cannon, a Microsofter (formely a Googler) also recently mentioned it and it's a
[good read](http://nothingbutsnark.svbtle.com/going-allin-on-the-mobile-web) and has 
broadly similar conclusions to my post about
 [Living with Web Apps](https://paul.kinlan.me/living-with-web-apps/)

<iframe 
	width="854" height="510" 
	src="https://www.youtube.com/embed/20fGtfnxJuo" 
	frameborder="0" allowfullscreen></iframe>

<br>
	
I think it covers a lot of good points:

* __S__ecure - All domains are sand-boxed from each other and sites are sand-boxed away
  from the users machine. The user can go to any site and know they are safe.
* __L__inkable - You can point to any page or piece of content just by sharing a URL
* __I__ndexable - Because you can link to anything, if public it can be discovered by any person
  or machine that can index it to make it universally discoverable to everyone.
* __C__omposable - Iframes and JavaScript allow us to quickly compose and embed new sites, apps and services
  just by dropping in some JS and hooking things together.
* __E__phemeral - There is nothing to install, you go to the page and interact with it,
  leave the page and when you do it stops taking up resources.
  
**SLICE**.

As a set of abilities that the web encapsulates SLICE principles are well known yet frequently forgotten
when considering the competition of native platforms. 

As a term, I find that **SLICE** is a great way to quickly address benefits of the web today. It misses out
 a couple of benefits of the web such as the ability to deploy updates 
 instantly &mdash; **SLUICE** isn't a great acronym  &mdash; but that is ok, 
 **SLICE** as an acronym works well.

I use the **SLICE** model as a baseline for where we are going with the *future of the web* and the 
challenges we face and need to overcome to get there.

* __S__ecure - The web should remain sand-boxed and it should be end-to-end encrypted. 
  We also need to work out what the model is for ensuring the user is in control and aware 
  of how permissions to advanced API's.. For example, we recently started to ship a 
  [Bluetooth API](https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web?hl=en)
  how do you give users the confidence that it is secure to use.
* __L__inkable - I started this with Web Intents and although it ended early, I believe we are due
  for another generation of linking content, sites, apps and native experiences. Some of it requires
  new technology some of it requires education.
   * Linking in to Web Apps: I am going to dive in to this another time. TL;DR - product landing pages and log in pages
     don't help us link to web apps.
   * Deep linking into media: browsers for a long time have been able to link to any part of a file
     yet no one seems to do it.
   * Deeper linking in to text: The first time I saw this was Dave Winer's blog where you could link to
     any paragraph, more recently Medium are giving every paragraph a deep link.
* __I__ndexable - The headless web, i.e, the parsers and indexes are getting more advanced.
   * Media does not have a huge amount of meta data exposed in a public format.
   * Apps: Web Intent's tried to be a way that described what a web app could do.  We don't have that any more
     and we are missing a massive way to describe the capabilites of what a web app can do.  Take my 
     [airhorn app](https://airhorner.com/) as an example, even though I expect no one to need horn
     functionality in their app, there is no way to find it other than to search for metadata and it is one
     of the reasons why we have product landing pages on the web.
* __C__omposable - It would be easy to mention Web Components, but really we are talking about [todo]
   
* __E__phemeral - Two words: Service Worker.
  * 

**So what are we missing?** I am going to leave that for you to tell me and also a 
set of follow up posts where I will talk about how native platforms are taking a 
piece out of SLICE model for themselves as a way to entrench native apps further in to the
everyday lives of users and how the web can differentiate even further.