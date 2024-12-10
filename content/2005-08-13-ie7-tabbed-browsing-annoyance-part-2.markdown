---
date: 2005-08-13
published: true
slug: ie7-tabbed-browsing-annoyance-part-2
summary: IE7's synchronous XmlHttpRequest locks up all browser tabs during long requests,
  not just the active tab. Is this behavior expected or a bug?  If you've encountered
  this problem, please email me so I can investigate further.
tags:
- IE7
- Internet Explorer 7
- XmlHttpRequest
- AJAX
- Tabbed Browsing
- Browser
- JavaScript
- Web Development
- Usability
title: IE7 Tabbed Browsing Annoyance Part 2

---
This is just a quick post.  It concerns how IE7 (Internet Explorer 7 Beta 1) deals with XmlHttpRequest Object (commonly used for AJAX based applications) and multiple windows.  If I construct a request in IE7 that is not asynchronous it naturally will stop the browser from responding until it is completed.  In IE7, if you have multiple tabs open and perform a long XmlHttpRequest that is synchronous in nature, it stops all the other tabs from responding.  I would expect that what it should do is to lock the current tab and nothing else?  Is my thinking correct<p />Has anyone else experienced this?  If so email me: <a href="mailto:paul.kinlan@gmail.com">paul.kinlan@gmail.com</a> and I can write a bit more about it.<p />

