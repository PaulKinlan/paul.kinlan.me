---
slug: proxy-script-to-yahoo-related-searches
date: 2005-08-27
 
title: Proxy Script To Yahoo Related Searches
published: true
---
One of the other features that my <a href="http://www.kinlan.co.uk/AjaxExperiments/AjaxTag">AJAX</a> application had was Related Searches. This API connected to the <a href="http://developer.yahoo.net">Yahoo API</a> and performed a query. The query is a single search term; the results are searches that a User could perform to get similar results.<p />For instance if you were to put the keyword "Kinlan" into the API, it might bring back searches that would related to "Kinlan", so "Funky Person, Cool Dude and Amazing Geeza" might be some of the searhes that would also relate to the topic of Kinlan.<p />This is quite a handy little thing, because you can link it in with my previous <a href="http://www.kinlan.co.uk/2005/08/proxy-script-to-yahoo-api-term.html">entry </a>to bring back all the related searches to all the keywords are provided.<p />The idea was to allow me to specify some searches that would allow the reader to target related topics and subjects through a search engine such as MSN, Google or Yahoo<p />Anyway, here is the code.<p /><br /><div class="CodeRay">
  <div class="code"><pre>#!/usr/bin/perluse LWP;use CGI qw(:standard);$CGI::POST_MAX=1024 * 100;  # max 100K postsmy($qCGI) = new CGI();my($YahooAppID) = &quot;APPIDHERE&quot;;my($baseUrl) = &quot;http://api.search.yahoo.com/WebSearchService/V1/relatedSuggestion&quot;;my($query) = $qCGI-&gt;param('query');my($finalUrl) = $baseUrl$ua = LWP::UserAgent-&gt;new;$ua-&gt;agent(&quot;YahooPassThrough/0.1 &quot;);# Create a requestmy $req = HTTP::Request-&gt;new(POST =&gt; $finalUrl);$req-&gt;content(&quot;appid=$YahooAppID&amp;query=$query&amp;results=50&quot;);# Pass request to the user agent and get a response backmy $res = $ua-&gt;request($req);print &quot;Content-type: text/xml\n\n&quot;;print $res-&gt;content;</pre></div>
</div>
<p /><br /><table class="TechnoratiHead TagHeader">
<tr><td>Related Tags</td></tr>
<tr class="Technorati"><td>
<a href="https://paul.kinlan.me/tags/Cgi" class="Tag" rel="tag">Cgi</a> <a href="https://paul.kinlan.me/tags/Related" class="Tag" rel="tag">Related Searches</a> <a href="https://paul.kinlan.me/tags/Proxy" class="Tag" rel="tag">Proxy Script</a> <a href="https://paul.kinlan.me/tags/Lwp" class="Tag" rel="tag">Lwp</a> <a href="https://paul.kinlan.me/tags/Api" class="Tag" rel="tag">Api</a> <a href="https://paul.kinlan.me/tags/Google" class="Tag" rel="tag">Google</a> <a href="https://paul.kinlan.me/tags/Search%20Term" class="Tag" rel="tag">Search Term</a> <a href="https://paul.kinlan.me/tags/Search%20Engine" class="Tag" rel="tag">Search Engine</a> <a href="https://paul.kinlan.me/tags/Msn" class="Tag" rel="tag">Msn</a> <a href="https://paul.kinlan.me/tags/Ajax" class="Tag" rel="tag">Ajax</a> <a href="https://paul.kinlan.me/tags/Keywords" class="Tag" rel="tag">Keywords</a>
</td></tr>
</table>

