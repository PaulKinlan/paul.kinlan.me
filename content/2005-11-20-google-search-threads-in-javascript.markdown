---
date: 2005-11-20
published: true
slug: google-search-threads-in-javascript
summary: I've had people come to my blog searching for how to do threading in JavaScript.  Unfortunately,
  I haven't found a way to do true threading in JavaScript.  The closest solution
  I've found involves creating queues that hold work items.  Every 250ms (or a developer-defined
  interval), the queue checks if work needs to be done and starts a task if none is
  already running. This approach mimics threading. Check out my AJAX Tagger 2.0 for
  a working example.  If you have any insights on true threading in JavaScript, I'd
  love to hear them!
tags:
- javascript
- threading
- queues
- ajax
- asynchronous programming
- multitasking
- pseudo-threads
- javascript-concurrency
title: 'Google Search: threads in javascript'

---
One of the searches that came in to my blog was "threads in javascript".  I have writte about this previously on my blog.  Basically, I couldn't find anything that would allow "threading" in JavaScript. <p />The closest I could come up with was to create a set of queues (that mimic threads).  These queues hold items of work that need to be carried out and once every 250ms or a developer configured amount, the queue will ask a worker object to find out what work needs to be carried out.  If there is work to do then it will start the task, if work is already being executed from the queue, then the work will not initiate the task.<p />Check out my AJAX Tagger 2.0 and see psuedo threads in action.<p />If someone else has any ideas about threading in Javscript I would love to hear it.<p />

