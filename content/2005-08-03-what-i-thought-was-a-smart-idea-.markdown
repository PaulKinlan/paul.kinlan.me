---
date: 2005-08-03
published: true
slug: what-i-thought-was-a-smart-idea-
summary: I had this brilliant idea to create a merged RSS feed using client-side processing.
  The idea was to have a main RSS feed that linked to other feeds.  My custom XML
  would include a list of sources. Then, using XSLT in the browser, the client could
  merge these external feeds into a single view. It worked perfectly locally!  However,
  I hit a roadblock with cross-domain security restrictions when I uploaded it to
  my server.  The browser wouldn't let me pull in feeds from other domains due to
  security concerns.  Additionally, client-side XSLT processing isn't universally
  supported.  So, even if the security issue wasn't there, many feed readers wouldn't
  be able to display the merged feed. In the end, the project failed. But, I learned
  a lot about browser security, XSLT limitations and client/server interactions!
tags:
- rss
- feed
- xml
- xslt
- cross-domain
- security
- client-side
- msxml
- internet explorer
- browser
- aggregation
- mashup
title: What I thought was a smart Idea.

---
With the introduction of IE7 and the automatic RSS feed detection and the special search tags that I am now including at the footer of each blog entry, I had a thought: Why not include all the feeds specified into an RSS feed that summates the results of all the tags.  This feed would be viewable by your favorite browser or feed reader.  It would get the results of each RSS feed and genereate a new RSS feed, and the best bit was that it shouldn't requrie any special server or program; Just the browser/feedreader that the user used.<p />I quickly thought about this and thought the possiblilties would be endless (well nearly) I could provide a short feed file, that linked to the other blogs/feeds etc, my server resources would be minimal, the feed owners would see extra traffic and hits to their blog (fully credited of course) and the users would get the best of both worlds.  All the processing would be done on the client.<p />I knew that the RSS 2.0 format could be extended with custom schema elements, so I could extend the channel element to include links to extra feeds.<p />I developed an extension to the RSS 2.0 format, it would extend the Channel element by including a new "Sources" element containing a collection of "Source" elements each of which simply pointed to the RSS feed that it needed to include.<p /><div class="CodeRay">
  <div class="code"><pre>&lt;?xml version='1.0' ?&gt;&lt;?xml-stylesheet href='rssFeed.xsl' type='text/xsl' ?&gt;&lt;rss version='2.0' xmlns:merge='http://kinlan.co.uk/merge'&gt;    &lt;channel&gt;        &lt;title&gt;Kinlan&lt;/title&gt;        &lt;link&gt; &lt;/link&gt;        &lt;description&gt;Kinlan RSS feed.&lt;/description&gt;        &lt;managingEditor&gt;Paul Kinlan&lt;/managingEditor&gt;        &lt;webMaster&gt;paul@kinlan.co.uk&lt;/webMaster&gt;        &lt;pubDate&gt;Unknown&lt;/pubDate&gt;        &lt;merge:Sources&gt;            &lt;Source id='Technorati' href='http://feeds.technorati.com/feed/posts/tag/Styling' /&gt;                &lt;/merge:Sources&gt;    &lt;/channel&gt;&lt;/rss&gt;</pre></div>
</div>
I then developed a simple XSLT that would scan this "plain" RSS feed and pull in the RSS feeds specified by the Source element. I know MSXML does this.  There is the ability to import another set of nodes from an external document in MSXML's XSLT engine (it might be standard, I am not too sure).<div class="CodeRay">
  <div class="code"><pre>&lt;?xml version='1.0' ?&gt;&lt;xsl:stylesheet xmlns:xsl='http://www.w3.org/1999/XSL/Transform' version='1.0' xmlns:merge='http://kinlan.co.uk/merge'&gt;    &lt;xsl:output method='xml'/&gt;    &lt;xsl:template match='channel'&gt;        &lt;xsl:copy-of select='/.' /&gt;        &lt;xsl:element name='rss' namespace=''&gt;            &lt;xsl:apply-templates select='/rss/channel/merge:Sources/Source' /&gt;        &lt;/xsl:element&gt;    &lt;/xsl:template&gt;    &lt;xsl:template match='/rss/channel/merge:Sources/Source'&gt;        &lt;!--Import Some More Documents --&gt;        &lt;xsl:copy-of select='document(@href)//item'/&gt;    &lt;/xsl:template&gt;&lt;/xsl:stylesheet&gt;</pre></div>
</div>
I tested it locally and it worked! Bonus! This is easy I thought to myself.  Here in front of me, I have 3 seperate RSS feeds merged into one simple feed.  I thought on, with a little more development I could provide sorting, so that the output is sorted by date and all the feeds are merged in to one list.<p />Then it hit me!  I uploaded the xml and the xslt to my web server, I set it to so that it was pulling in two remote technorati feeds.  I typed in the URL and .................... ERROR!<p />Pants!  Why did this happen?<p />I quickly thought on.<ul>
<li>IE has security (no jokes please ;))</li>
<li> IE has data island security</li>
<li> I was essentially pulling in data from a domain other than the one I was in.</li>
</ul>I was stopped in my tracks, I couldn't pull in anything that wasn't on my own domain (kinlan.co.uk).  I took a little more time to think about what had happened and I realaised several other things that would stop me down the line.<p /><ul>
<li>It is fine and dandy having data pulled in from different sources by the client that needs them, but there is no guarantee that the engine that pulls them in will have an XSLT Engine, let alone MSXML.</li>
<li>If I wanted it all done on the client, I can't use any fancy AJAX stuff either, nor could I use any MSXML objects in the browser for the same reason as the previous point.</li>
</ul>Both of the above points meant that if a non Internet Explorer client, perhaps RSS Bandit etc pulled down my feed all it would see is an empty blog with my custom elements.<p />Oh well, if it worked it would have been cool, because it didn't work I have learnt some interesting stuff! :)<p />Here are the links to the <a href="http://www.kinlan.co.uk/rss/rssFeed.xml">XML</a> and the <a href="http://www.kinlan.co.uk/rss/rssFeed.xsl">XSLT</a>.<p />

