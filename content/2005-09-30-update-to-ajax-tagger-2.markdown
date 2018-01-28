---
slug: update-to-ajax-tagger-2
date: 2005-09-30
 
title: Update to AJAX Tagger 2
published: true
---
I am still working on the development of AJAX Tagger 2.  Currently I am developing a little framework that will help me query datasources.<p />I have developed a priority queue for AJAX Requests.  There are 5 queues and work is delegated between the queues based on the need of the request.  An urgent request will get placed in the queue that cycles the fastest, a non-urgent request will get placed in a queue which only cycles every once in a while.<p />Take a look at <a href="http://www.kinlan.co.uk/AjaxExperiments/AjaxTag2" title="AJAX Tagger Version 2" rel="tag">http://www.kinlan.co.uk/AjaxExperiments/AjaxTag2</a>, and you will see the tags are requested on a priorty queue and the tag stats are requested on a slower "thread".  <p />All the page is completely async! :)<p /><table class="TechnoratiHead TagHeader">
<tr><td>Related Tags</td></tr>
<tr class="Technorati"><td>
<a href="https://paul.kinlan.me/tags/Priority%20Queue" class="Tag" rel="tag">Priority Queue</a> <a href="https://paul.kinlan.me/tags/Ajax" class="Tag" rel="tag">Ajax</a> <a href="https://paul.kinlan.me/tags/Tagger" class="Tag" rel="tag">Tagger</a> <a href="https://paul.kinlan.me/tags/Queues" class="Tag" rel="tag">Queues</a> <a href="https://paul.kinlan.me/tags/Async" class="Tag" rel="tag">Async</a> <a href="https://paul.kinlan.me/tags/Priority" class="Tag" rel="tag">Priority</a> <a href="https://paul.kinlan.me/tags/Help" class="Tag" rel="tag">Help</a>
</td></tr>
</table><br /><table class="TechnoratiHead TagHeader">
<tr><td>Wikipedia Documents</td></tr>
<tr class="Technorati"><td>
<a href="http://en.wikipedia.org/wiki/Priority_queue">Priority Queue - Wikipedia, The Free Encyclopedia</a> ,<a href="http://en.wikipedia.org/wiki/Queueing_theory">Queueing Theory - Wikipedia, The Free Encyclopedia</a> ,<a href="http://en.wikipedia.org/wiki/AJAX">Wikipedia: Ajax</a>
</td></tr>
</table>

