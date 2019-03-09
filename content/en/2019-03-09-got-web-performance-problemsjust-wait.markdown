---
slug: got-web-performance-problemsjust-wait
date: 2019-03-09T08:10:52.804Z
title: 'Got web performance problems? Just wait...'
link: 'https://twitter.com/kosamari/status/1104021989881270272'
tags: [links, performance, developing markets]
---
I saw a tweet by a good chum and colleague, [Mariko](https://twitter.com/kosamari), about testing on a range of low end devices keeping you really grounded.

The context of the tweet is that we are looking at what Web Development is like when building for users who live daily on these classes of devices.

<figure>
  <img src="/images/2019-03-09-got-web-performance-problemsjust-wait.jpeg">
</figure>

The team is doing a lot of work now in this space, but I spent a day build a site and it was incredibly hard to make anything work at a even slightly reasonable level of performances - here are some of the problems that I ran into:

* Viewport oddities, and mysterious re-introduction of 300ms click-delay (can work around).
* Huge repaints of entire screen, and it's slow.
* Network is slow
* Memory is constrained, and subsequent GC's lock the main thread for multiple seconds
* Incredibly slow JS execution
* DOM manipulation is slow

For many of the pages I was building, even on a fast wifi connection pages took multiple seconds to load, and subsequent interactions were just plain slow. It was hard, it involved trying to get as much as possible off the main thread, but it was also incredibly gratifying at a technical level to see changes in algorithms and logic that I wouldn't have done for all my traditional web development, yield large improvements in performance.

I am not sure what to do long-term, I suspect a huge swathe of developers that we work with in the more developed markets will have a reaction 'I am not building sites for users in [insert country x]', and at a high-level it's hard to argue with this statement, but I can't ignore the fact that 10's of millions of new users are coming to computing each year and they will be using these devices and we want the web to be *the* platform of choice for content and apps lest we are happy with the [rise of the meta platform](https://paul.kinlan.me/rise-of-the-meta-platforms/).

We're going to need to keep pushing on performance for a long time to come. We will keep creating tools and guidance to help developers load quickly and have smooth user interfaces :)
