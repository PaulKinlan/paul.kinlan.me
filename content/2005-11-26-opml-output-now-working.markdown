---
slug: opml-output-now-working
date: 2005-11-26
 
title: OPML Output now working
published: true
---
For the people who use my <a href="http://www.kinlan.co.uk/AjaxExperiments/AjaxTag2">AJAXTagger</a>, OPML Support is fixed. There was a problem with my instanceof method of javascript which would mean that it would not work in IE6 and IE7. This all stemmed from the fact that Internet Explorer doesn't support __proto__ javascript construct. This is a bit of a problem because I don't know how to workout what an object in JavaScripts parent "type" is.<p />

