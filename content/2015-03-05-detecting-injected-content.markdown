---
slug: detecting-injected-content
date: 2015-03-05
layout: post
title: "Detecting injected content from third-parties on your site"
description: "Do you know if any ISP's are injecting Ads or anything else in to your site? No. I thought not."
categories: security csp
---

Is your site on HTTPS? No? Do you know if any ISP's or other services are injecting Ads or anything else in to your site? No. I thought not. I don't either... well, maybe until now.

## TL;DR 

> It's incredibly hard to detect if an ISP is manipulating your site, however it is relatively easy to aggregate many of the content injections occurring across your site.

> As a publisher of content you should be concerned with what people are doing with your output, the only way that you can understand the impact is to first measure it.  You should be moving to HTTPS as quickly as possible.

If you can enable CSP reporting for your site, enable it.  If you can't use CSP reporting then consider a script like the one in this article to enable you to track what goes on in your site more effectively.

I started this post *only* concerned about giving you the tools to detect if an ISP has injected content or ads into your site because you were not on HTTPS.  After creating some simple tools in my own blog, I have found that a lot more goes on my pages that I don't know about and for me it is quite disconcerting.

With the introduction of Service Worker and more specifically Push Messaging, the web is getting more
capabilities that allow us to create things that we have never seen before. There is one major caveat: your site needs to be running on HTTPS. 

One part of my role in Developer Relations is to work out strategies to try and change the industry at scale.  I believe Push Messaging is a tool that will change the way that users experience sites and will give developers the opportunity to not build a native app just to maintain engagement with their users.  Outside of communications apps, I believe that an unbelievable strong use-case is for publishers and news sites to engage with their audience via notifications for new or important content that the user has subscribed to. 

However, if you look at nearly all of the News sites, they are ostensibly not on HTTPS. To see a change in the industry, we need HTTPS to be supported more broadly across the web.

I think we all know that adding HTTPS to any site is a major hurdle to straddle, but it is a valid and 
worthwhile one.  I recently added support for SSL on this blog and it took all of 20 minutes to set up.  However, I am only a small site, large sites have very real concerns when moving their entire site to HTTPS:

*  Why do we need to add HTTPS/TLS for my content only site?
*  My site is considered a different origin, will I get lose out in search when my competitors don't move?
*  SSL is slow.

All valid concerns without context. I will only deal with "Why do we need to add HTTPS/TLS for my content only site?" in this post.

If you are a publisher you need to care about HTTPS on your site, not because of new features (although it helps) but because if you are not using SSL, you can't for certain say that someone in between you and your reader has not manipulated your content.  Depending on your organization this is important for a variety of reasons: Editorial integrity and independence; Revenue &mdash; is someone intermediate adding ads to your content?; Or both. Unless you are looking for it you won't know.

HTTPS is a massively important step. It is not, however, the only tool you need to rely on. Content injection can come in many other places.

## How do you detect content injection?

There is already a technical solution: [Content Security Policy](http://www.html5rocks.com/en/tutorials/security/content-security-policy/). CSP lets you control the third-party domains your site can request content (scripts, images, CSS etc) from; often an XSS attack will inject a script or other asset that will be used to pass on user details to a third-party, or it could be that a network provider intercepts the request and injects their own ads or other content into your site. If you can restrict the outbound requests to a known set of sites then you can mitigate many of these issues because the browser will simply not be able to make the request.

The CSP spec also has another feature that I like: [Reporting](http://www.html5rocks.com/en/tutorials/security/content-security-policy/#reporting). You can configure a reporting URL so that any exception to the CSP rules are sent though to your server.  CSP Reporting lets you debug ahead of time the implications of setting up CSP on your site. It gets even more interesting when you set it up as canary to analyze un-expected requests being made from your page.

In practice, I find CSP a nightmare to deploy and I know a lot of developers feel the same, but after what I have discovered I do think it is important that we all consider 1) HTTPS and 2) Setting up a Content-Security-Policy with reporting to actively detect and prevent unintended access to your site.

In lieu of every site having their own CSP reporting infrastructure I started to think about the problem a little.  How can I make it easier to visualize the effect of content injection on your users?  A huge number of people have Google Analytics, and I know the [browser can give me information about every single request](http://www.html5rocks.com/en/tutorials/webperformance/usertiming/#toc-dataout) it makes (`window.performance.getEntriesByType`)...

I have come up with the following naive script that you can configure to send an event to Google Analytics for every instance of a request that doesn't match a domain that you know about on your site.

<script src="https://gist.github.com/PaulKinlan/5bc2d380b67071ccaea0.js"></script>

There are a lot of caveats to this script:

*  I've only tested this on Chrome. IE11 should work, [Firefox too](https://bugzilla.mozilla.org/show_bug.cgi?id=822480).
*  It requires Google Analytics (you can plug in your own tool easily)
*  If you are not on HTTPS, a service could strip out the logic
*  If your network is actively manipulating your content but not injecting 3rd party resources you won't be able to tell.

After I deployed this script to my site and even with all these caveats, I have found something very  interesting: Many requests are being made from my page's that I didn't explicitly invoke.

Now, I need to be really careful about how I say this as it is not an  there are potentially many reasons why a request was made: An extension might be installed on the users machine; content injection via an ISP; A bookmarklet the user runs; a virus. All I know is that some visitors to my site had some content injected into the page.

Regardless, I found the new data that I was getting in my Google Analytics fascinating:

![Injection or Extension or Virus?](/images/bonkers-injection.png)

Twitter.com is expected, however all these others looks very suspicious.  In some cases, I received a relatively large number of requests

![Extension?](/images/injection-balloon.png)

A large number came from Ballloon.com and after a bit of research I found that it is a Chrome extension that lets you save to the cloud.  Is this a good thing?  Probably not, but a lot of extensions on all platforms do it.

![Unknown?](/images/unknown-injection.png)

Many requests completely flummoxed me.  I can't tell yet what is causing these requests and the only references I can find are from sites suggesting a relationship to software that is a virus.  This really doesn't feel great to me and as a site owner it is something that I want to actively block, especially if it is potentially malware or placing ads on my site.

## What to do?

I am going to keep this running on my site over the next couple of weeks and then I am going to actively turn on CSP to restrict the request that are made from my site, I will then monitor all the change to see if there is the drop in outbound requests (I strongly expect that there will be a reduction).

## Help me

If you can add this script to your site and report the results to me, or if you have done something similar past please let me know.

The only way we will get people to care about this is if we raise the awareness that this is happening on a relatively large scale.

## TL;DR;TL;DR

* Enable HTTPS on your site
* Enable CSP Reporting (or my script ;)
* Enable CSP