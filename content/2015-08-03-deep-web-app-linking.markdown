---
slug: deep-web-app-linking
date: 2015-08-03
title: "Deep Web App Linking"
image_header: "/images/linking.jpg"
---

I am passionate about making web apps discoverable and interlinked.  It is one of the reasons
why I created the very first [Web Intents prototype](http://webintents.com) and then worked
on trying to get it [standarised and implemented as WebIntents](https://webintents.org).

Web Intents as we know it today failed (it still hurts), yet I still think about it a lot.

In my recent post about [SLICE](https://paul.kinlan.me/slice-the-web/) I mentioned that 
inter-app linking is MIA on the web. It's a bit silly really, the web and web developers take
pride in that we have the URL yet we don't actually use them well at all and it is hurting us.

A couple of things happened recently that got me thinking more about this.

* I created a [QR Code reading app](https://qrsnapper.appspot.com/) because I hate installing apps for 
  little things like this.
* My team recently worked on building a simple OTP generator on the web. It's a beauty. In the first demo that I 
saw Eiji had linked to my QR code scanning app because it implemented all the functionality that it needed. __Zero install__.
* I saw a presentation by Stephanie Reiger about the web and apps in Asia Pacific areas and how many
  integrate QR Codes readers directly in to their apps.
  
These three things together really hit home something that I had been mulling for a while: 
**It's impossible to link to a web app and it's our fault.**

Today one of the biggest benefits that we have on the web that native platforms don't _yet_ have 
is the ability to send someone to a link and they can use the thing that is there with zero install.
Effectively we have a __frictionless__ way to do app interop without worrying that the user
doesn't have the app installed.

Sounds absolutely amazing. But we have a huge problem! When was the last time you found a web app
 that let you use it immediately?

Watch the following video and then I will explain more about what I mean.

<iframe width="854" height="510" 
        src="https://www.youtube.com/embed/YpijAhVEshI" 
        frameborder="0" allowfullscreen></iframe>

<br>

This is the simplest case, [3DTin](https://3dtin.com/) let's you use the app immediately and then only requires
you to sign-in when an action such as Save is initiated. TinkerCAD on the other hand requires you to 
read up about their service, fill in a long (and slow) form and then finally once you meet all the
requirements you can.

Product landing pages, Login pages and everything that is in the way of the actual web app is
equivalent to an App Store install page. These pages **kill** what we value most about 
the web: [The L and E in SLICE](https://paul.kinlan.me/slice-the-web/).

I get why we think we need to do it. You want to capture the user and get them registered on your systems 
and you need an "account id" to persist data.

My good friend Mike Mahemoff pointed out to me that this already is a known thing in Native App development
circles. The concept of "tourists" (or "shadow users" as Facebook calls it).  The idea it that
when a user hits your service a proxy account is made that can then be converted into an official user once they sign
up to your service.

Given the scale of the web and the number of users that can casually visit your experience and not have any commitment
to it, "tourist" users might not be a viable solution but fundamentally we need to build sites and 
apps that don't block the user and encourage simple linking and frictionless usage of web apps.

Native Apps are exploring this area with App constellations (groups of interconnected apps) and I 
fear that whilst we have all the tools to do this on the web today we are not interconnecting our apps.

If we want to make our apps linkable then we will need to let the users use the applications instantly.

_Image Credit: [Ruby Gold](https://www.flickr.com/photos/13606325@N08/2416993706/in/photolist-4FzJ2h-4f6pJh-fSg3j-6pp1Et-nL9UEd-8J3PAA-84qBVK-7F1287-j8Q6iB-eSr9GM-8agmNg-4UeUCC-eiXuL7-6RD7ja-rvEFyC-tJNKZK-6xZsut-7oXrP6-6SBHQ2-7F11wU-aCRkMh-3f1a1-m6eYt-gbA7WS-6pt9FJ-mLNHtP-6vodg7-bm5Ny4-kYJjLR-dABgMF-7EW36T-q8a8Kb-ahDuNg-664j55-398e8z-8Tyxt5-mM4PK7-dW9X9R-698NDg-7JYsuX-doRYU3-dbbuB6-ih11BV-8TLHJ5-5UvB9w-r55U3C-8TkrjN-dVGc9m-acRwhX-6NVZdG)_