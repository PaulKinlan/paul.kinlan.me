---
slug: proxy-script-to-yahoo-related-searches
date: 2005-08-27
 
title: Proxy Script To Yahoo Related Searches
published: true
---
One of the other features that my <a href="http://www.kinlan.co.uk/AjaxExperiments/AjaxTag">AJAX</a> application had was Related Searches. This API connected to the <a href="http://developer.yahoo.net">Yahoo API</a> and performed a query. The query is a single search term; the results are searches that a User could perform to get similar results.<p />For instance if you were to put the keyword "Kinlan" into the API, it might bring back searches that would related to "Kinlan", so "Funky Person, Cool Dude and Amazing Geeza" might be some of the searhes that would also relate to the topic of Kinlan.<p />This is quite a handy little thing, because you can link it in with my previous <a href="http://www.kinlan.co.uk/2005/08/proxy-script-to-yahoo-api-term.html">entry </a>to bring back all the related searches to all the keywords are provided.<p />The idea was to allow me to specify some searches that would allow the reader to target related topics and subjects through a search engine such as MSN, Google or Yahoo<p />Anyway, here is the code.<p /><div class="CodeRay">
  <div class="code"><pre>#!/usr/bin/perluse LWP;use CGI qw(:standard);$CGI::POST_MAX=1024 * 100;  # max 100K postsmy($qCGI) = new CGI();my($YahooAppID) = 'APPIDHERE';my($baseUrl) = 'http://api.search.yahoo.com/WebSearchService/V1/relatedSuggestion';my($query) = $qCGI-&gt;param('query');my($finalUrl) = $baseUrl$ua = LWP::UserAgent-&gt;new;$ua-&gt;agent('YahooPassThrough/0.1 ');# Create a requestmy $req = HTTP::Request-&gt;new(POST =&gt; $finalUrl);$req-&gt;content('appid=$YahooAppID&amp;query=$query&amp;results=50');# Pass request to the user agent and get a response backmy $res = $ua-&gt;request($req);print 'Content-type: text/xml\n\n';print $res-&gt;content;</pre></div>
</div>
<p />

