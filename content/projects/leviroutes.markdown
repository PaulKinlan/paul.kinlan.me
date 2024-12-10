---
date: 2011-06-01 09:00:00+00:00
description: A simple Express like
slug: levi-routes
summary: 'Levi Routes, a simple Express-like URL routing framework, was initially
  created for a Google I/O 2011 project with Mike Mahemoff.  Its creation was indirectly
  inspired by a leak of early Android UI screenshots, hidden amongst photos I was
  trying to share. The library allowed our I/O Reader application to utilize \"real\"
  URLs and respond to PushState events for seamless UI updates.  A fun fact: working
  with this library led to my first WebKit commit, addressing the inability to create
  ''PushStateEvent''s for unit testing.  Although my code is now on countless devices,
  I remain its sole user. In 2018, I updated Levi Routes for Service Worker compatibility.'
tags:
- javascript
- routing
- express
- pushstate
- webkit
- service worker
- google i/o
- android
- leak
title: Levi Routes

---


> Malte Ubl: 'Did you mean to do that?'
> Me: 'Yes, of course.'
> Malte: 'You meant to leak screenshots of Holo Android UI'
> Me: '........... Shit. No of course not.'
> Me: *10 hours of panicing and working with the PR team.*

I'm not sure Malte remembers this, but I do because it's the genesis of
[LeviRoutes](https://github.com/PaulKinlan/LeviRoutes) as a project. Well not
really, I had made it for a project at Google IO in 2011 with Mike Mahemoff,
however just after that I attempted to post some photos of myself with a pack
Levi Roots Reggae Reggae sauce peanuts (I'm good with puns), the early version
of Android that I was using selected photos as you swiped through the list of
photos and my thumb must have caught a couple of screenshots.

Levi Routes is a simple Express-like URL routing framework. It was built so that
our IO Reader application could use 'real' URLs (those that don't use "#"
syntax) from the address bar and respond to PushState events so that we can
update the UI without hitting the server.

Fun fact: This library was responsible for my first ever commit to WebKit. It
turned out that WebKit didn't let you create 'PushStateEvent's so I couldn't
Unit Test the library... now my code is on billions of devices, but only ever
used by me.

Later in 2018, I updated Levi Routes to also work inside a Service Worker.