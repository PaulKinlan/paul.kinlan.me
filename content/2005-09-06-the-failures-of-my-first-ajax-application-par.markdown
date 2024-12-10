---
date: 2005-09-06
published: true
slug: the-failures-of-my-first-ajax-application-par
summary: In this part of my series on my first AJAX application, I discuss how my
  initial hopes for AJAX as a solution to bandwidth and UI problems, and for speed
  improvements, weren't fully realized. The first version, which incorporated Technorati
  stats and Yahoo's TermExtraction API, was slow due to sequential queries and Technorati's
  performance.  I removed these features because I wanted a fully rendered page, which
  negated AJAX benefits. The next version will be fully asynchronous, with a request
  manager for trickle filling and background processing.  Check out my AJAX Technorati
  Tagger to see what I'm aiming for.
tags:
- AJAX
- JavaScript
- Asynchronous
- Web Development
- Performance
- UI
- Technorati
- Yahoo
- TermExtraction API
title: 'The Failures of my First AJAX application: Part 4'

---
When I first started investigating AJAX as a potential methodolgy for creating a really cool website, I thouhgt that it would solve all my problems, [my bandwidth problems](http://www.kinlan.co.uk/2005/09/failures-of-my-first-ajax-application.html), my [UI problems](http://www.kinlan.co.uk/2005/09/failures-of-my-first-ajax-application_05.html) and that it would be really really really quick.<p />But it didn't.<p />This entry is entitled "It didn't work to quickly (but it did lead to success number [1](http://www.kinlan.co.uk/2005/08/successes-of-my-first-ajax-application.html), [2](http://www.kinlan.co.uk/2005/08/successes-of-my-first-ajax-application_14.html), [3](http://www.kinlan.co.uk/2005/08/successes-of-my-first-ajax-application_15.html), [4](http://www.kinlan.co.uk/2005/08/successes-of-my-first-ajax-application_16.html), [5](http://www.kinlan.co.uk/2005/08/successes-of-my-first-ajax-application_17.html) ..... :))"<p />The very first iteration of the application included some Technorati Stats for each tag, so you knew whether it was worth creating or not and also related searches for each of the tags provided by the [TermExtraction API](http://developer.yahoo.net/).<p />Each of the above two proccesses where Sequential (thus only JAX and not AJAX). For each Tag it would perform two queries, thus meaning that the overall speed of my application was limited to:<p />(time of technorati request + time of yahoo related searches) * number of keywords selected by the TermExtraction API.<p />Yahoo was pretty quick; Technorati's performance was diabolical.<p />I eventually pulled the Technorati API, and stopped using the Yahoo related searches. The reason I pulled them rather than reworking the app is at the time I didn't want portions of the page to be trickle filled, I wanted the page to be fully completed before the user viewed the results. Having a fully rendered page negates the benefits of AJAX principals, I might as well have had the server generate the complete page.<p />The next version of the app, will be fully async, because there will be a built in request manager. Thus the results will trickle in and be parsed and displayed as they arrive. When one result is in, it may trigger other queries that will be completly managed in the background.<p />To see what I mean, play around with my [AJAX Technorati Tagger](http://www.kinlan.co.uk/AjaxExperiments/AjaxTag):  Simply enter some text, maybe a news article or one of your journals and see what happens.<p />

