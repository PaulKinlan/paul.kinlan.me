---
date: 2015-03-10
description: Some quick thoughts about not using CSP when you have a Service Worker.
slug: imperative-content-security-policy-with-service-worker
summary: I explored ways to detect content injection on websites, primarily focusing
  on HTTPS and Content Security Policy (CSP).  While these are good solutions, CSP
  suffers from low adoption due to a poor developer experience.  CSP is a declarative
  language which can be tricky to use. I'm wondering if Service Workers might offer
  a simpler, more imperative approach to content security, potentially improving developer
  experience and adoption.
tags:
- Content Security Policy
- CSP
- HTTPS
- Security
- Web Development
- Service Worker
- Declarative Programming
- Imperative Programming
- Content Injection
title: Imperative Content Security Policy with Service Worker

---

I wrote up my thoughts on detecting content injection into sites.  It came down to:

* Use HTTPS
* Use Content Security Policy (CSP)

The issue being CSP has low adoption with a poor developer experience.  It got me thinking about how it could be improved and fit into a model that I think is more amiable to most developers.  A little bit of back story.

CSP is a declarative language that describes to the browser how it should manage requests made by a page to the network.

There is nothing inheritnelty wrong with this, it's just that I find the syntax hard.

Will we get imperative Content Security Policy with Service Worker for free.  