---
date: 2005-10-05
published: true
slug: update-status-of-ajax-tagger-2
summary: Quick update on the AJAX Tagger 2 development. Priority queues are working
  well, but might need some tweaking on queue numbers and polling intervals.  Querying
  Technorati for tag counts is proving slow (around 2 seconds per query). Any tips
  on speeding this up, perhaps by limiting the number of blogs returned?  Currently
  working on improving the related documents results, which now includes counts for
  all selected tags, not just the last search.  Need to refine this area. More updates
  to come!
tags:
- ajax
- tagger
- technorati
- javascript
- development
- programming
- blogging
- update
- performance
title: Update Status of AJAX Tagger 2

---
It is comming along quite well.  The priority queues seem to work okay.  I think the number of queues and the polling interval might need to be tweaked but it is still good.<p />One area that is not working too well is querying the Technorati search engine about the number of Post a Tag is in.  It is really slow, it takes about two seconds to perform a query.  That is a bit too slow.  Has anybody had any experience with this?  Can you speed it up by restricting the number of blogs to return in the result?<p />The area that I am working on is getting the related documents results back.  It works okay, but needs improving.  Currently it returns a count of the number of related documents for the last search only, however it includes all the documents that it finds for all the selected tags.  So I need to sort that out.<p />Sorry for this entry being a bit haywire, but I wanted to get it all down quickly. :) (Partly as a memory aid! ;))<p />

