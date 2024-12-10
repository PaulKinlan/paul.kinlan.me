---
date: 2006-02-15
published: true
slug: google-search-and-ie-7-search-provider
summary: I've added a custom search provider to my blog using Google Search for Internet
  Explorer 7 Beta 2 users.  It lets you easily search my site's content.  The provider
  is set up using an OpenSearch XML file linked in each page's header.  Not sure about
  Google's terms on this, so I'll remove it if there's an issue.  Hopefully, this
  example helps others implement search providers.
tags:
- internet explorer
- ie7
- search
- google search
- opensearch
- custom search
- search provider
- blogging
- web development
title: Google Search and IE 7 Search Provider

---
If you are using IE7 Beta 2 and you are looking this entry from my site you should notice that I have provided a customer search provider.<p />The search provider hooks up with Google search, so you can now search my site for specific text. I am not too sure if this breaks any T's &amp; C's of Google but I will take it down if anyone complains.<p />This is just a showcase really to show you how easy it is to set up a custom site search provider in Internet Explorer 7 Beta 2.<p />There is an OpenSearch file at <a href="http://www.kinlan.co.uk/opensearch.xml">http://www.kinlan.co.uk/opensearch.xml</a> which contains the following:<p />&lt;opensearchdescription xmlns="http://a9.com/-/spec/opensearch/1.1/"&gt;&lt;shortname&gt;Paul Kinlans Blog: Google Search&lt;/shortname&gt;&lt;description&gt;A Google Search from Paul Kinlans C#, .Net Framework&lt;/description&gt;&lt;url template="http://www.google.com/custom?q={searchTerms} &amp;domains=www.kinlan.co.uk&amp; sitesearch=www.kinlan.co.uk&amp;amp;forid=1&amp;ie=ISO-8859-1&amp;oe=ISO-8859-1&amp;safe=active&amp; cof=GALT:#008000;GL:1;DIV:#336699;VLC:663399; AH:center;BGC:FFFFFF;LBGC:336699;ALC:0000FF; LC:0000FF;T:000000;GFNT:0000FF;GIMP:0000FF; FORID:1;&amp;hl=en" type="text/html"&gt;&lt;/opensearchdescription&gt;<p />And each page has the following &lt;link&gt; in the section.&lt;link title="C#, .Net Framework: Google Search" href="http://www.kinlan.co.uk/opensearch.xml" rel="search"  type="application/opensearchdescription+xml" /&gt;<p />Hope this helps anyone who wants to set up search providers.<p />

