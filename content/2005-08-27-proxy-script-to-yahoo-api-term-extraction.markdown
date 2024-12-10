---
date: 2005-08-27
published: true
slug: proxy-script-to-yahoo-api-term-extraction
summary: I've just finished creating a proxy script that allows access to the Yahoo
  Content Analysis API Term Extraction service from any browser, bypassing cross-site
  scripting issues.  It works by taking a POST request, forwarding it to Yahoo, and
  returning the XML response.  The code (Perl) is included in the post,  and I've
  successfully tested it with IE6, IE7, and Firefox.  Feel free to email me if you
  have any questions.
tags:
- Yahoo
- API
- proxy
- perl
- cross-site scripting
- AJAX
- term extraction
- Content Analysis
- browser compatibility
title: Proxy Script To Yahoo API Term Extraction

---
Finally, here it is after a busy week.<p />What follows is a listing of the code I created to create a proxy that would allow me to access the Yahoo API from any browser with out having to worry about Cross Site Scripting.<p />This works in Internet Explorer (IE6, IE7) and firefox, and is used in my <a href="http://www.kinlan.co.uk/AjaxExperiments/AjaxTag">AJAX </a>example.<p />Bascially, it retrieves a POST request from the browser and forwards the result inside another POST request to Yahoo, once I recieve the response, I pass back the XML to the web browser.<p />And thats it really.<p />Do you have any Questions, email me: <a href="mailto:paul.kinlan@gmail.com">Paul Kinlan</a> [paul.kinlan@gmail.com]<p /><span style="color: #33ff33;">#!/usr/bin/perl</span><span style="color: #6666cc;">use</span> LWP;<span style="color: #6666cc;">use</span> CGI qw(:standard);$CGI::POST_MAX=1024 * 100;  # max 100K posts<span style="color: #cc66cc;">my</span>($qCGI) = new CGI();<span style="color: #cc66cc;">my</span>($YahooAppID) = "APPIDHERE";<p /><span style="color: #cc66cc;">my</span>($baseUrl) = "<a href="http://api.search.yahoo.com/">http://api.search.yahoo.com/</a>ContentAnalysisService/V1/termExtraction";<p /><span style="color: #cc66cc;">my</span>($context)= $qCGI-&gt;param('context');<span style="color: #cc66cc;">my</span>($query) = $qCGI-&gt;param('query');<span style="color: #cc66cc;">my</span>($finalUrl) = $baseUrl ;<p />$ua = LWP::UserAgent-&gt;new;$ua-&gt;agent("YahooPassThrough/0.1 ");<p /># Create a request<span style="color: #cc66cc;">my</span> $req = HTTP::Request-&gt;new(POST =&gt; $finalUrl);$req-&gt;content("appid=".$YahooAppID."&amp;context=".$context."&amp;query".$query);$req-&gt;content_type('application/x-www-form-urlencoded');<p /># Pass request to the user agent and get a response back<span style="color: #cc33cc;">my</span> $res = $ua-&gt;request($req);<span style="color: #6666cc;">print</span> "Content-type: text/xml\n\n";<span style="color: #6666cc;">print</span> $res-&gt;content;<p />

