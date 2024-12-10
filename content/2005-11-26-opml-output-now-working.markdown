---
date: 2005-11-26
published: true
slug: opml-output-now-working
summary: The OPML output functionality in my AJAXTagger is now fixed!  There was a
  bug caused by Internet Explorer's lack of support for the `__proto__` construct,
  affecting how the script determined an object's type.  This fix resolves the issue,
  ensuring compatibility with IE6 and IE7.
tags:
- ajax
- javascript
- opml
- bugfix
- internet explorer
- ie6
- ie7
- ajaxtagger
- __proto__
title: OPML Output now working

---
For the people who use my <a href="http://www.kinlan.co.uk/AjaxExperiments/AjaxTag2">AJAXTagger</a>, OPML Support is fixed. There was a problem with my instanceof method of javascript which would mean that it would not work in IE6 and IE7. This all stemmed from the fact that Internet Explorer doesn't support __proto__ javascript construct. This is a bit of a problem because I don't know how to workout what an object in JavaScripts parent "type" is.<p />

