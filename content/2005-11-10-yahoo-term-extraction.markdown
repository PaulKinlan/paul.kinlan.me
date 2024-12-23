---
date: 2005-11-10
published: true
slug: yahoo-term-extraction
summary: 'I''m exploring how to improve the relevance of Yahoo Term Extraction API
  results.  My initial question to Yahoo revealed that their system uses a semantic
  network to relate words and phrases.  I''m experimenting with a two-step process:
  first, extract terms without a query to identify the most relevant term, and second,
  use that term as a query in a second extraction to refine the results. This might
  improve relevance, though it doubles the number of API calls. I plan to test this
  in my DeliTag and AjaxTag applications.'
tags:
- Yahoo
- Term Extraction
- API
- Webservices
- Semantic Network
- Relevance
- DeliTag
- AjaxTag
title: Yahoo Term Extraction

---
I really like the Yahoo Webservices, one reason is that the guys their are really helpful.  I asked a general question and they were kind enough to spend plenty of time explaining some parts of the Yahoo Term Extraction API.<p />My basic question was how does the "query parameter" that you pass to the Term Extraction help parse the context parameter.<p />Their general answer was that their is a semantic network in the background that relates words and phrases to a general term.  The general term I assume can be controlled by the basic query that you pass as a parameter.<p />So it got me thinking, how can you determine the correct query parameter to use so that the results you get will be the most relevant.  It turns out that the results of the term extraction are ordered by relevance, so the most important term is first in the results [kind of obvious when you think about it].  Therefore, if you Term extract your context without a query, choose the first result and then term extract the context again with the query being the first term, you <em>might</em> have a system that will best guess the gerneral topic of the context and then use this topic to filter the results better.<p />I am going to try this in my DeliTag and AjaxTag applications, because a lot of the terms that it generates have little relevance to the actuall topic that I am talking about.<p />Obviously, this method will half the number of requests that your system can run against the Yahoo API's (because two requests are being made).<p />

