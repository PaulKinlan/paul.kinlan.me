---
layout: post
title: "What do people want from a news experience?"
date: 2014-12-08 17:15
categories: browsers mobile news
---

One thing that I am working on at the moment is breaking up each of the verticals
that define an app (News, Retail, Games, Travel, Media etc) and working out
what use-cases they need and how web technology can solve them.  

An area that I am really interested in is News apps, many organisations report that the only
place that they are seeing growth in engagment and revenue is on Mobile,
specifically Mobile Apps.

In Developer Relations we often think of what cool demo can we build with a
new API.  This time I have decided that rather than start with what I think a
developer wants (i.e, shiney demo), I would instead start by asking users what
they want from a "News experience" and then tailor our developer message
accordingly.

I posit that users want (in order of priority):

*  Notifications of important news as it happens
*  An icon on the launcher so it can be loaded like an app
*  News available to them offline (i.e, when they are in the tube)
*  A fast site


My own intuition of an industry I am not too heavily involved in probably can't
be trusted as much as I think it can, so I sent out a terrbily worded Tweet.

<blockquote class="twitter-tweet" lang="en"><p>What to Native News paper apps do that you can&#39;t do on the web?</p>&mdash; Paul Kinlan (@Paul_Kinlan) <a href="https://twitter.com/Paul_Kinlan/status/539737443055185921">December 2, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

This got a number of interesting replies:

<blockquote class="twitter-tweet" lang="en"><p><a href="https://twitter.com/Paul_Kinlan">@paul_kinlan</a> Offline caching &amp; UX speed, mostly. Compare <a href="http://t.co/9W28fXbyvB">http://t.co/9W28fXbyvB</a> with WSJ iPad app. And, v important, one-tap iTunes payment</p>&mdash; Benedict Evans (@BenedictEvans) <a href="https://twitter.com/BenedictEvans/status/540027507488346112">December 3, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

In the entire thread it boiled down to:

*  Performance, apps are percieved to be faster and smoother
*  Access to content offline
*  Content synced and available
*  Notifications of new content
*  Efficient payments
*  and icon in the launcher.

It's not that I didn't believe this (it is broadly what I have in our 2015
plans) but I wanted to try and validate the results. I decided to try
[Google Consumer Surveys](http://www.google.com/insights/consumersurveys/)
(other good survey tools might exist but I think it is rather awesome), it seemed
like an awesome tool to do the analysis and had a decent sized user base.

My goal was to find out: of the people who prefer to read their news in an App,
what do they prefer about it? The sample was constrained to US users of an
Android Smartphone, the prime audience of App using News consumers if reports
are accurate.

The first question: How do you prefer to consume the news? Is a filter and offers 
"In an app", on the "web" or "Other" (Other is a mandatory escape hatch).  If the user
selected "in an app" they were taken to a 2nd set of questions to learn more
about what they value in a News App experience.

The second question was: What features do you want from a news experience?  This was a multi-choice question
so you had the option of select as many features as you wanted from the list:

*  Notifications for new content
*  News automatically available in the morning
*  News available offline
*  An icon on the homescreen
*  Smooth navigation

The results were interesting. Of the people surveyed, [most preferred to
consume the news on the web](http://www.google.com/insights/consumersurveys/view?survey=xqnkc3hqtrucy&question=1).

![Web vs Native](/images/news-web-vs-app.png)

It might be worth following up this survey in a couple of months or a year to
see what the trajectory is.  Maybe that 30% of people who prefer an app for
reading the news is up from 5% last year. Who knows?

Whilst this was an interesting aside the most important thing is to understand
what in the App world people really like.

The results of the features that people want from a News reading experience
did suprise me.

![App features](/images/news-app-features.png)

The [vast majority of App users preferred speed and smoothness](http://www.google.com/insights/consumersurveys/view?survey=xqnkc3hqtrucy&question=2) in
their reading experience and they want the news available in the morning.

Why is this a suprise? 

Performance is a given.  My suprise was that if you make it fast and make the content 
available in the morning you would make 90% of users happy.  

If you look at the what the Chrome team and standards bodies are building - the Push API in particular - having a News Web experience integrate the API will only increment the user satisfaction a small amount.

This is not what my intuition suggested.  Are we working on the wrong priorities?

So what now?  It is clear that we need to do more research when understanding
how we tell developers to integrate our platform features.  With regards to
News I do want to tailor our developer messaging to a number of important areas
with News being one of them, I just need to work out how to do it. Some thoughts:

*  It is clear that we need to drive it home to developers that it is possible
to build fast and smooth experiences on the web and show them how to do it.
*  Show developers how to build experiences that install, work offline and sync
when users want them to.

*TL;DR* We need to show developers how to build great apps on the web in the contexts they expect.

All the results are available for [everyone to read](http://www.google.com/insights/consumersurveys/view?survey=xqnkc3hqtrucy&question=1). 

I would love your feedback.
