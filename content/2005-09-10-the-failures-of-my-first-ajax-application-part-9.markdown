---
date: 2005-09-10
published: true
slug: the-failures-of-my-first-ajax-application-part-9
summary: In this final part of \"The Failures of my First AJAX Application\" series,
  I reflect on the cross-browser compatibility issues I encountered.  Focusing on
  Internet Explorer during development led to problems in Firefox, particularly with
  security errors (cross-domain data retrieval) and differences in the XML DOM model.  The
  key takeaway is to consider cross-browser support from the outset, anticipating
  discrepancies between browsers and coding around missing features, similar to CSS
  development.  The next version will prioritize cross-browser compatibility, potentially
  including Safari. This series has been invaluable for shaping the requirements of
  the upcoming version.
tags:
- ajax
- javascript
- cross-browser
- firefox
- internet explorer
- xml
- dom
- web development
- application development
title: 'The Failures of my First AJAX Application: Part 9'

---
This is the 9th an Final part of my Failures of my First AJAX application series.  This is titled: "It accomodated the lowest common denominator in web browsers, therefore it was not as client (as in browser) as I wanted."<p />Hmm, looking at that I am trying to remember exactly what it meant.<p />Ahh, now I remember. <p />I am used to developing in Internet Explorer, so whilst coding and testing the App, I didn't give much notice to Firefox.  I kind of just assumed it would work. <p />The first time I tested in Firefox, I got a lot of security errors (Cross domain data retrieval).  Once I had sorted that out by creating proxy scripts I tried it again.  This time the errors revolved around the fact that XML DOM model is slightly different in both browsers and requires a little bit more effort in the JavaScript to have the same code that IE and Firefox can both use to process XML nodes.<p />So basically the moral of the story is that you should always think about cross browser support before you start to develop, it will save you a lot of time in the long run.   Think about features that one browser has that the other doesn't.  If you do this correctly then you should be able to code around the missing features, much like CSS developers do.<p />The next version of the application will be completly cross-browser compatible, I might even consider testing it in Safari and the like [I need you, the reader to help me here :)].<p />That pretty much concludes the Success and Failures series, and it has been a great help to work out the requirements for my next version of the application.<p />Hopefully one of tomorrows entries will contain the start of formalising some requirements. :)<p />

