---
slug: update-to-ajax-tagger-2
date: 2005-09-30
 
title: Update to AJAX Tagger 2
published: true
---
I am still working on the development of AJAX Tagger 2.  Currently I am developing a little framework that will help me query datasources.<p />I have developed a priority queue for AJAX Requests.  There are 5 queues and work is delegated between the queues based on the need of the request.  An urgent request will get placed in the queue that cycles the fastest, a non-urgent request will get placed in a queue which only cycles every once in a while.<p />Take a look at <a href="http://www.kinlan.co.uk/AjaxExperiments/AjaxTag2" title="AJAX Tagger Version 2" rel="tag">http://www.kinlan.co.uk/AjaxExperiments/AjaxTag2</a>, and you will see the tags are requested on a priorty queue and the tag stats are requested on a slower "thread".  <p />All the page is completely async! :)<p />

