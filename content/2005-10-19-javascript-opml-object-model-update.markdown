---
date: 2005-10-19
published: true
slug: javascript-opml-object-model-update
summary: I'm working on a JavaScript Object Model for OPML and have found areas for
  improvement.  I initially misunderstood the OPML spec, particularly regarding the
  attributes of the outline element, which are more flexible than I realized.  This
  is important for handling things like files, links, HTML, and RSS.  The current
  model has issues with proper quoting of characters like quotes and ampersands, but
  otherwise, the generated OPML XML seems good.  I'll be updating the model to handle
  these attributes soon and will post more about the specific attributes in a future
  post.
tags:
- javascript
- opml
- object model
- ajax
- xml
- attributes
- specification
title: JavaScript OPML Object Model Update

---
It has been pretty interesting designing this Object Model in JavaScript for OPML.  Mainly because I have found several flaws in the design that if fixed will make it a lot better to use.  I discovered them because I am using the Object Model directly in AJAX Tagger version 2.0.<p />The basic problem is that I didn't completly understand the OPML specification and I started to implement the mini API before I knew more about it.  The area that I need to extend in the object model is around the attributes of the outline element.  I only thought you had a type and text, but it turns out the specification is quite loose around the attributes that you can have, but there are several well used attributes that hook up with files, links, html and rss etc.  I will document them some other time.<p />Other than that the OPML XML that it generates seems to be good, apart from the quoting of " and the &amp;'s :)<p />

