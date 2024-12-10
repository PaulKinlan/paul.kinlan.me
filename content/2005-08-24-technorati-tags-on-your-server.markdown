---
date: 2005-08-24
published: true
slug: technorati-tags-on-your-server
summary: I discovered my Apache server doesn't require file extensions for URLs, meaning
  both www.kinlan.co.uk/AjaxExperiments/AjaxTag and www.kinlan.co.uk/AjaxExperiments/AjaxTag.html
  lead to the same resource.  This is convenient for using Technorati tags, which
  often omit extensions.
tags:
- Apache
- Technorati
- tags
- server
- URL
- file extension
- Ajax
title: Technorati Tags on Your Server

---
I was playing aroung with my server the other day, and on the off chance I noticed that <a href="http://www.kinlan.co.uk/AjaxExperiments/AjaxTag">www.kinlan.co.uk/AjaxExperiments/AjaxTag</a> and <a href="http://www.kinlan.co.uk/AjaxExperiments/AjaxTag.html">www.kinlan.co.uk/AjaxExperiments/AjaxTag.html</a> go to the same place.  (These are some of my Ajax experiments)<p />Since when did Apache no longer worry about the file extension? it complains about the case of the file all the time.<p />I am not too sure if Apache is re-writing the URL's because I don't have root access or anything.  It is just a Virtual Host.<p />This is good news for me because I can post URL's in Technorati Tag Form.<p />

