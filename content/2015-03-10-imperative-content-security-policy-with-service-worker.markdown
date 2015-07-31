---
date: 2015-03-10
layout: post
title: "Imperative Content Security Policy with Service Worker"
description: ""
categories: security csp serviceworker
published: false
---

I wrote up my thoughts on detecting content injection into sites.  It came down to:

* Use HTTPS
* Use Content Security Policy (CSP)

The issue being CSP has low adoption with a poor developer experience.  It got me thinking about how it could be improved and fit into a model that I think is more amiable to most developers.  A little bit of back story.

CSP is a declarative language that describes to the browser how it should manage requests made by a page to the network.

There is nothing inheritnelty wrong with this, it's just that I find the syntax hard.

Will we get imperative Content Security Policy with Service Worker for free.  