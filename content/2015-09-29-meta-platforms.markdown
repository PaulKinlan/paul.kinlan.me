---
slug: rise-of-the-meta-platforms
date: 2015-09-28T12:20:31+01:00
title: "Rise of the meta-platforms and the new 'web browser'"
image_header: "/images/future-of-web-on-mobile/37.jpg"
description: "Web Developers. It's a long road ahead"
---

[The Web is a platform](/this-is-the-web-platform/), [not everyone agrees](https://adactio.com/journal/6692).  

I go one step further and classify the web as a 'meta-platform' &mdash; A platform on one or many 
platforms. 

A meta-platform can only be used and consumed by using another platform and in most cases it is not a purely 
first-class citizen on those platforms: iOS and Android; Windows and Linux.  Yes, 
HTML with CSS and JavaScript have all be used as tools for creating apps 
that are 'native' and 'one' with the underlying hardware (ChromeOS and FirefoxOS both
spring to mind) but fundamentally the way we consume the web is on the back
of other platforms.

I have been thinking a lot recently about how meta-platforms operate and how they 
enable reach and scale that are unavailable just by building for individual platforms, but 
to get there there are trade-offs and there _is massive competition_ that we as Web Developers 
need to be aware of.

Every single platform **has** to have a good web browser, on Desktop Microsoft [reported that the
Browser was the most used application](http://www.slideshare.net/thebeebs/ie9-the-story-so-far/4), on Mobile, the iPhone was sold partly on [being a web surfing 
device of desktop class](http://www.apple.com/pr/library/2007/01/09Apple-Reinvents-the-Phone-with-iPhone.html). We as web developers have grown up used to this fact and I think a 
little complacent.

<figure>
  <img src="/images/future-of-web-on-mobile/37.jpg" />
  <figcaption>How web developers see the world</figcaption>
</figure>

Assume there are two billion mobile devices, all with at least one browser. Then it looks
like a pretty compelling place to deploy content, news, apps and services...

However looking at the other apps, specifically messaging apps, then it becomes a lot
more interesting.

* _Facebook_: Over 1 billion users DAU, [over 844 million mobile DAU](http://newsroom.fb.com/company-info/).
* _WhatsApp_: [900million MAU](http://www.statista.com/statistics/260819/number-of-monthly-active-whatsapp-users/)
* _WeChat_: [600 million MAU](https://www.techinasia.com/wechat-monthly-active-users-q2-2015/).
* _Line_: [211 million MAU](http://www.statista.com/statistics/327292/number-of-monthly-active-line-app-users/)
* _Kakao_: [48 million MAU](http://www.statista.com/statistics/278846/kakaotalk-monthly-active-users-mau/)

<figure>
  <img src="/images/future-of-web-on-mobile/38.jpg">
  <figcaption>The mobile meta-platforms</figcaption>
</figure>

The question is: Why do I classify these as meta-platforms? And why do I think they are important?

Good question. They all have overt or nascent content and app platforms. These platforms
allow for discovery and now importantly, hosting.

Looking at Content, it is interesting to look at how this is currently playing out.  Many of the platforms
on mobile are choosing to host content within their own app experience and this is interesting for many
reasons, and in my opinion a direct and compelling threat to the web.

<figure>
  <img src="/images/future-of-web-on-mobile/40.jpg">
  <figcaption>Content meta-platforms</figcaption>
</figure>

I've quickly added Apple News in here as well which right now is an unknown quantity 
in terms of both usage and traffic, but if it takes off, nearly the entirety of the Apple mobile
ecosystem will have it available and at that point it is a significant player.

But what do these platforms offer over the web?

* Access to an active and engaged user-base
* Instant loading of content
* Monetization and ads.
* Pervasive availability (offline access).

They all seem to centralize on one core theme and target a failing of the web and web developers.

<figure>
  <img src="/images/future-of-web-on-mobile/41.jpg">
  <figcaption>It's all about performance</figcaption>
</figure>

Performance is the number one selling point for each of these new content platforms. Each 
offering services that make it easy to load instantly for the user whilst
offloading the technical constraints and work that hosting on the web entails
but still offering compelling monetization options.

Try Facebook Instant articles and tell me that the performance doesn't feel better.

<figure>
  <img src="/images/future-of-web-on-mobile/42.jpg">
  <figcaption>Where is the fast web?</figcaption>
</figure>

We can make sites and apps fast, and it is not crazy hard to do.  Granted, 
it is not easy either.  I am not actually sure where the issue is but we see so many
sites and apps not caring about the basics of performance.

Performance isn't the only focus of these platforms, many of the messaging apps are also starting to
become richer application platforms.

Currently if you look at [Facebook's Messanger App platform](https://developers.facebook.com/products/messenger), 
it requires an install from the Play Store or App Store to get the integrated (albeit simple 'Replies')
app running. But will it for ever?

I am would happily wager that React is a long-term bet to enable a consistent platform
for app delivery through the Facebook platform, and here is why:

1. [Apple](http://adcdownload.apple.com/Documentation/License_Agreements__Apple_Developer_Program/Apple_Developer_Program_Agreement_20150909.pdf) now allow apps to 
   dynamically update their JS so long as it doesn't significantly change
   the functionality of their apps. <img src="/images/apple-js-tos.png" style="max-width: 100%">
2. React and [React Native](https://facebook.github.io/react-native/) are starting to abstract the structure and rendering of components on platforms away from the
   developer.
3. [React-CSS](http://reactcss.com/) and [React-Style](https://github.com/js-next/react-style) have started 
   to abstract CSS and styling away from the developer.

That leaves us with JavaScript and an abstract rendering platform that optimizes natively for 
the device the user is on.  Write once, run natively anywhere on Facebook.

If that is not happening already, I would be trying to make it happen.

[WeChat](open.weixin.qq.com) is another example of a lot of activity in this area and whilst I find 
it hard to follow due to language constraints, their API access for China is quite comprehensive.

Yes, a lot of these platforms are nascent but they offer features that we don't yet have
available in the browser.  Each of these platforms offer different and non-standard API's, 
tools and capabilities, but they all are very applicable to platform that they run on.

If you look across FB, Kik and others you will see that Identity (obviously) 
plays a strong role (i.e, understanding who the user is) and Messaging and Social (again, makes total sense)
but there are other areas where capabilities are being expanded: Payments is a big potential area ([WeChat in 
China has this covered](https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419317784&token=&lang=zh_CN)), 
Device Access (the host app grants access once to a feature and then all apps in their 
platform can use it).

Admittedly the cost of business development might be high to run your own store, but 
if you have the active and engaged users and a compelling way to either drive traffic
or make money for the developer then it is an enticing opportunity.

<figure>
  <img src="/images/future-of-web-on-mobile/46.jpg">
  <figcaption>Where is the Web?</figcaption>
</figure>

No, seriously.  Where is the Web?  

The web is incredibly lumpy. There are humps and bumps as each browser supports different features 
and capabilities at different times based on their own internal priorities.  This is both
a blessing (tremendous reach) and a curse as it we need to (rightly) employ progressive 
enhancement techniques so that we can cater for every user in the world.

If you are a business and you have to make a choice, it is now not just iOS or Android
and maybe Web, but now Facebook (and others), who have a Billion Daily Active Users on their 
platform across iOS and Android (and desktop) pretty much guaranteeing a steady 
and consistently stable platform. What is your choice? I don't think it is clear any more.

<figure>
  <img src="/images/future-of-web-on-mobile/47.jpg">
  <figcaption>Everyone wants to be the next web browser</figcaption>
</figure>

### What is the web to do?

It's a long-term game.  

For hosting plain content I believe there is an open battle now on between "platforms"
 (Apple News, Facebook etc) and the Web as we know it.  We as web
developers need to adapt and adapt quickly if we want to ensure that content is created
and consumed on the web.

For apps, this area is nascent at the moment and there are a lot of popular apps
that have billions of users that can build compelling integrations that give developers
and businesses access to all their engaged users.  Time will tell how this plays out,
but if the ability to deploy instantly and manage payments comes to Facebook, like WeChat
 in China I think there is a very real threat to the web as an app platform.
 
Today, we who deploy on the web need to deeply focus on:

* Performance - everything should be instant
* Frictionless engagement - take the link and give user value
* Presence on the device - make apps feel like apps.

For the future of app platforms, especially around messaging platforms, I am not sure what
the future holds.

I have more thoughts that I will share in upcoming posts.