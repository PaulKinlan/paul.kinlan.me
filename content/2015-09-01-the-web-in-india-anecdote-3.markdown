---
slug: the-web-in-india-anecdote-3
date: 2015-09-01T12:20:31+01:00
title: "The Web in India: Anecdote 3 - 2G is still massive"
description: "I learnt a lot of things in India. 3: 2G is still a big thing and web developers can't do anything about it"
image_header: "/images/india3_title.jpg"
tags: ['india']
---

I had the good fortune to work from India for a week to do a presentation about Performance and run two codelabs 
with leading developers in Bangalore and across Inida. I also met up with many companies who are doing interesting 
things on the web and on native. I learnt a lot about the state of the web from some of the companies in this market 
and I intend this to be a little series of anecdotes that I heard from developers.

As with all anecdotes, these were taken from a relatively small number of developers but who had data to back it up. 
These will need more research to see if they are pervasive (I think they are) and I am looking for feedback.

2G is still massive, I naively thought that 3G is the solution, however I quickly learnt there are two types of 3G:

* Working 3G
* Over-subscribed 3G cell towers which are slower than 2G.

Many of the developers I spoke to know that 2G is massive for them, but they have no way of knowing what type of 
network that the user is on.  My first thought was that the NetInfor API will help, but there are several serious
issues that make it not a viable solution:

1.  The NetInfo API only reports 'cellular', 'wifi', 'wired' as the connection information.  Not the actually type
    of network state the Radio is currently in. Which is useless for this usecase.
2.  The NetInfo API is clientside only and is not available on first request to a page when a developer is likely to 
    need it.

Interestingly, [UC Mini reports](http://www.ucweb.com/download/UCBrowser_User_Agent_en.pdf) interesting information
on page request via the User Agent string.  Network connection type is one of those values (i.e, WAP, Cell etc.)

     pf(Java);er(U);la(zh-CN);up(U2/1.0.0);re(U2/1.0.0);dv(Nokia6300);pr(UCBrowser/8.3.0.182);ov(S40V3);pi(320*240);ss(320*240);pm(1);bv(1);nm(0);im(1);sr(2);

Many of the developers I spoke with are investigating [Twin Prime](http://www.twinprime.com/) because they
can optimize for the 'last mile' and change the responses to network request based on network type and quality, for 
example they might suggest to only send 3 search results instead of 5 or 10.  We don't seem to have this on the web.

I also learnt that Facebook have an API for native apps that assesses the quality of the [Network Connection](https://github.com/facebook/network-connection-class)
that looks at latency, downstream bandwidth and then gives you information so that you can decide how to optimize
the experience for users (i.e, show fewer or display lower quality images).

I feel more strongly than ever that we need to be able to send the network quality or type on the HTTP request header
so that developers can optimize acordingly and also in the browser.  One area that I think we can get some data
is to use the `window.performance` API in the browser to estimate bandwidth and latency of already loaded pages.
