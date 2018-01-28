---
slug: wikipedia-related-document-retrivla-is-in-but
date: 2005-10-08
 
title: Wikipedia Related Document Retrivla is in. But....
published: true
---
Wikipedia document retrieval is in the application now, however I have made a slight omission with the way that I have designed the application.  Currently the application has a basic object model:<p />A Tag Group has a collection of Tags; each Tag has selected information such as Related Self Blog Entries,  Related Statistics and Related Wikipedia Articles.  However each of tag doesn't know or care about the information other tags contain.  This is the problem, because Tag "A" doesn't know about Tag B's Related Wikipedia documents, they migh duplicate the content in the related articles section of the application.  I don't want this to happen, therefore I must create a system to link tags to each other so that they can share information with each other and provide the user with a better experience.<p />Take a look for yourself: <a href="http://www.kinlan.co.uk/AjaxExperiments/AjaxTag2">http://www.kinlan.co.uk/AjaxExperiments/AjaxTag2</a><p /><table class="TechnoratiHead TagHeader">
<tr><td>Related Tags</td></tr>
<tr class="Technorati"><td>
<a href="https://paul.kinlan.me/tags/Wikipedia" class="Tag" rel="tag">Wikipedia</a> <a href="https://paul.kinlan.me/tags/Document%20Retrieval" class="Tag" rel="tag">Document Retrieval</a> <a href="https://paul.kinlan.me/tags/Object%20Model" class="Tag" rel="tag">Object Model</a> <a href="https://paul.kinlan.me/tags/Omission" class="Tag" rel="tag">Omission</a> <a href="https://paul.kinlan.me/tags/Statistics" class="Tag" rel="tag">Statistics</a>
</td></tr>
</table>

