---
slug: paul.kinlan.me
date: 2010-04-15T13:20:31+01:00
title: "paul.kinlan.me"
tags: ['pwa', 'site']
description: "This blog"
---

I created this blog originally on www.kinlan.co.uk - it was horrendous, but it
got me blogging and talking about tech and other things. Whilst that site still
exists, I moved all of the content first to posterous and then on to this home
and it's gone through a number of changes in that time, first to use Jekyll
which for me became too slow to use, and now on [Hugo](https://gohugo.io) which
fits my needs very well, primarilly because of it's speed.

The tech and decisions I've made that power this site is:

* Static hosting on [zeit.co](https://zeit.co) - I've used it for a lot of other
  projects and the deployment process fits my needs well, as does the auto SSL
  management. I used to be on Google Cloud (which was fine), but managing SSL
  certs became a nightmare for such a simple site.
* Hugo - I use the Hugo 'CMS' - it's incredibly fast and allows me to have a
  quick edit and update cycle, and I can deploy from anywhere in the world.
* Service Worker - I like to use this as a reference example of why service
  workers on a blog make sense. It's not perfect, but as you browse the site the
  content is cached so that if you visit a page again it loads instantly and is
  always avaialble.

I'll keep adding more to this page.