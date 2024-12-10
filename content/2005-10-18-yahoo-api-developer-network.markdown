---
date: 2005-10-18
published: true
slug: yahoo-api-developer-network
summary: 'I reported two issues with the Yahoo API over the weekend: one regarding
  the result number restriction not working as expected and another about the contextual
  term extraction API failing to process text after encountering HTML tags.  Yahoo
  responded promptly on Monday, confirming that one issue is a bug being addressed
  and the other has already been fixed.  I''m very impressed with their responsiveness
  and quick turnaround.'
tags:
- yahoo
- api
- developer
- network
- bug
- fix
- results
- contextual
- term
- extraction
- html
- tags
title: Yahoo API Developer Network

---
I posted to the mailing list two issues over the weekend. <p />One about result number restriction:<blockquote>Hi, I was just reading the documentation which gives the following URL as an example:[http://api.search.yahoo.com/MyWebService/V1/relatedTags?appid=YahooDemo&amp;tag=yahoo&amp;results=2](http://api.search.yahoo.com/MyWebService/V1/relatedTags?appid=YahooDemo&amp;tag=yahoo&amp;results=2) It is supposed to return only two results yet all 48 are returned? Is this correct? I need to start using this API and I don't know if it will return the correct results. Kind Regards, Paul Kinlan</blockquote>And the other about Contextual term extraction not processing results after an HTML style tag. i.e anything that has a "&lt;" or "&gt;" in:<blockquote>Hi, I have been playing with the contextual term extraction API, and I have noticed (well at least I think I have) that if there is a HTML tag in the text for term extraction then the term extraction API doesn't examine data after the starting tag. For instance if I had the following text: <blockquote>I have been trying to play with [Blogger BackLinks](http://help.blogger.com/default/bin/answer.py?answer=1235&amp;topic=39), and I can say that I don't really like them. I don't really like them because people have to use them! I was expecting Blogger Backlinks to automatically link into the Google Blog search to find a list of all the blogs that link to my post. And then update my page from there. I think what I will do is develop a version that does use them, it will fire a query off to Google and see what happens from there. I mean, after all Google Blog search allows you to do this, and export the results as RSS.</blockquote>
The API only seems to analyse up to and including href="xyzabc"&gt;. Anything after this in not included in the results. Has anyone else experienced this? Kind Regards, Paul Kinlan [www.kinlan.co.uk](http://www.kinlan.co.uk)
</blockquote><p />I got two replies on Monday (1 day after I posted the problem), one confirming that it is a bug that is being worked on and the other confirming that my problem has just been fixed.  Way to go Yahoo!  That is the way that I like to see services run.  Keep up the good work.<p />

