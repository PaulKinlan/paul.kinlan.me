---
date: 2005-09-21
published: true
slug: worker-threads-in-javascript-
summary: I'm exploring ways to implement continuous polling of a resource and event
  dispatching based on its state in JavaScript.  Are worker threads, or something
  similar, achievable in JavaScript?  Currently, timer-based triggers seem like the
  most viable option.  Is this an acceptable approach, or are there more efficient
  and appropriate alternatives?
tags:
- javascript
- worker threads
- polling
- timers
- events
- asynchronous programming
title: Worker Threads in JavaScript?

---
Does anyone know if it is possible to simulate worker threads in JavaScript.  I need a method of constantly polling a particular resource and dispatching events based on conditions in that resource.<p />Currently I am thinking that I will have to have methods triggered off timers.  Is this acceptable?<p />

