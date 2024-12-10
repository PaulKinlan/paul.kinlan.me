---
date: 2015-08-31
description: 'I learnt a lot of things in India. 1: Proxy browsers don''t work'
image_header: /images/india1_title.jpg
slug: the-web-in-india-anecdote-1
summary: During my work trip to India, I learned about challenges with proxy browsers
  like UC Mini and Opera Mini. Developers reported low conversion rates, especially
  with payments, due to JavaScript issues and incompatibility with 2FA required by
  Indian banks.  I'm interested in hearing about others' experiences and solutions
  for these browsers.
tags:
- india
- proxy browsers
- UC Mini
- Opera Mini
- mobile web
- payments
- conversion rates
- 2FA
- JavaScript
- web development
title: 'The Web in India: Anecdote 1 - Proxy browsers don''t work'

---
 
I had the good fortune to work from India for a week to do a presentation about Performance and run two codelabs
with leading developers in Bangalore and across Inida. I also met up with many companies who are doing interesting
things on the web and on native. I learnt a lot about the state of the web from some of the companies in this market 
and I intend this to be a little series of anecdotes that I heard from developers.  

As with all anecdotes, these were taken from a relatively small number of developers but who had data to back it up. 
These will need more research to see if they are pervasive (I think they are) and I am looking for feedback.

One consistent theme that I heard from developers is that proxy browsers, specifically UC Mini and Opera Mini
"don't work", they have such a low level of conversions for users on those apps that businesses are choosing to 
try as hard as they can to move users of these browsers in to their apps.

Digging into what doesn't work, it is specifically around payments. 

1. Most forms require JS or other logic and the proxy browsers fail on this,
2. Even if the user gets past this, the Indian government requires all payments on the web 
   to be 2nd factor authenticated. It is these 2nd factor auth pages provided by the banks that don't work
   well on mobile web and not at all on proxy browsers (normally due to JS requirements)

Do you have a different experience?  Do you cater for proxy browsers such as Opera Mini and UC Mini?  If so, how?
