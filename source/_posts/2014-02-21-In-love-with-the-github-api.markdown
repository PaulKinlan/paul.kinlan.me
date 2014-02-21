---
layout: post
title: "In love with the Github API"
date: 2014-02-21 12:15
comments: true
draft: true
published: false
categories: webapps
---

It is no secret that Github is amazing.  I don't think it is widely known that they also have a **very** comprehnsive [Developer Platform](http://developer.github.com/).

![Developer Landing Page](/images/developer-github.png)

I admit it.  **I love the API**.  It's an amazing example of how to build a platform.

Rather than fawning over Github, I really want to talk about the projects that I have worked on recently that take advantage of the API and roughly how we utilised this platform to optimise our workflows and experiences.

The first is [HTML5 Rocks](http://www.html5rocks.com/).  It is a resource that we manage for web developers.  It is entirely open source and the content licenced under Creative Commons.  We host the site on AppEngine and the code on Github.  Admittedly it is not obvious how we could use the API to help us.

The original process for deploying to HTML5Rocks was for a weekly "Sheriff" to monitor Github for any commit from the team or pull-request, `git pull` to a local repository, check the changes locally, run the site through a compressor and finally upload it to AppEngine.

This process was tedious and could often be error prone.


