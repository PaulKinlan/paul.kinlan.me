---
date: 2005-08-15
published: true
slug: the-successes-of-my-first-ajax-application-pa
summary: In this third part of my series on my first AJAX application, I'm diving
  into the power of the Yahoo! API.  It's been a learning experience, and I'm incredibly
  impressed with how much it offers compared to Google's.  I've been exploring the
  Term Extraction and Related Searches APIs, and I'm starting to think about how to
  use the Contextual Search API.  The Term Extraction API is great for pulling out
  keywords, while the Related Searches API helps me find relevant search queries.  My
  app combines these to analyze blog posts and generate related searches.  I'm hoping
  to use the Contextual Search API to add targeted search results.  Future versions
  will incorporate more APIs, possibly from Technorati, to enhance functionality.  Stay
  tuned!
tags:
- ajax
- yahoo api
- term extraction
- related searches
- contextual search
- rest
- web development
- apis
- blogging
- javascript
title: 'The Successes of my first AJAX Application: Part 3'

---
It got me thinking about how the Yahoo! API works.  The Yahoo API can be found at <a href="http://developer.yahoo.net/">http://developer.yahoo.net</a>.<p />I have been investing a fair bit of time investigating the Yahoo! API's.  I am really impressed so far.  They offer so much to a developer than the Google one does.<p />The main areas that I have been working in are the Term Extraction API and the Related searches API.  I have also been thinking a bit about the Contextual Search API too.<p />The Yahoo API is called via a simple RESTful HTTP call.  REST is a way of interacting with a server via HTTP and getting a response (Normally an XML document) that can be processed by most systems.  Wikipedia has a good article about REST <a href="http://en.wikipedia.org/wiki/REST" rel="tag">here</a><p />The Term Extraction API is a really cool little API you basically supply a text string to it (say an article or blog post like this one) and a query that helps it to understand the topic you are talking about.  The result is an XML document listing the top 50 most important Keywords in the text.  It is really smart and very simple to use.  <em>I have also learnt today that the first 2000 characters of the input are given more significance that later text.</em><p />The Related Searches API is another cool little API, you supply a keyword and in response it gives you a series of queries that a user might type into a search engine to get results relating to that keyword. For example:  I supply the word AJAX into the API and in return it gives me queries that I could use in Yahoo.  So it might give me results such as "Ajax Football, Ajax Bleach, AJAX Development" etc.<p />In the application I have combined the two together.  I submit a document (such as this blog post) via my web browser (currently IE7), it returns a list of important keywords.  For each of the keywords I choose that are relevant to the blog it will then select some related searches.<p />Yahoo offer some other APIs, such as the contextual search.  I hope to use this one to incorporate some relevant pages that are associated with what I am blogging about.  With this API, you provide a context to a query, so say I was talking about the failures of my AJAX application, I would supply the blog post as a context to a normal query such as "AJAX Mistakes".  Hopefully this would give me a very targeted set of results (rather than AJAX Team talks in Holland;)).<p />There are many other services that I am yet to think about.  But you can combine them quite easily.  The next version of my application must make better use of these API's.  At one point I did combine the results of the TermExtraction with information about Tags (blog counts etc) at Technorati, but it was a bit too slow.  The next version of the App will link in with some more API's.  I am yet to really think which ones, but Yahoo and Technorati are defiantly high up the list.<p />Do you have any ideas of webservices I can link into?  If so email me: <a href="mailto:paul.kinlan@gmail.com">paul.kinlan@gmail.com</a>.<p />

