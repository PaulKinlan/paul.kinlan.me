---
date: 2005-10-25
published: true
slug: re-opml-please-enlighten-me
summary: I'm struggling to understand the practical uses of OPML, especially given
  the inconsistent use of attributes like 'type', 'url', and 'xmlurl'.  While I'm
  developing a JavaScript OPML object model for my own projects (like a tagging system
  where OPML stores related links for blog posts), I haven't found a clear standard
  for defining outlines.  It seems like the 'standard' emerges from popular usage
  rather than formal specification.  I'm particularly interested in how to determine
  the file type of items within an OPML outline, as my current application only uses
  links for pages and images (feed support is still pending).  The lack of clear semantics
  in OPML makes it difficult to build dynamic applications that can 'mash up' content
  from different sources based on the OPML structure.
tags:
- opml
- javascript
- xml
- rss
- feeds
- data-formats
- standards
- web-development
- ajax
- mashup
title: 'RE: OPML - Please enlighten me'

---
Finally, someone like me who has trouble seeing what you can do with opml [see below].  I have been in the same boat, I spent three days finding resources about the type/url, xmlurl etc attributes.  I had no idea what to do with them!  It is not standard, but it is meant to be that way [for some reason].  I spent three days looking for common ways to define outlines but could find a consistent way that everyone uses.  It appears that if you create whatever attribute you want, document it and enough people use it and recognise it, then it will become a "standard" attribute.<p />I have a couple of posts on [http://tagger.kinlan.co.uk](http://tagger.kinlan.co.uk) about this and the JavaScript OPML object model I am trying to create ([http://www.kinlan.co.uk/AjaxExperiments/opml.js](http://www.kinlan.co.uk/AjaxExperiments/opml.js))  I use it on<a href="http://www.kinlan.co.uk/AjaxExperiments/AjaxTag2"> [http://www.kinlan.co.uk/AjaxExperiments/AjaxTag2](http://www.kinlan.co.uk/AjaxExperiments/AjaxTag2)</a> [which isn't finished yet so it might take a bit of getting used too],  I use it because based on a blog post there can be many many related links/resources/searches that a user might want to look at based on a blog entry.  I though it would be handy to have an OPML file to look at instead of all the links cloging up the blog.<p />As for determining the file type then I am can't really help you because as far as my app is concerned it doesn't care what type it is because all it uses is links for pages and images.  I need to add support for feeds.<p /><blockquote>
<div><div style="font-size: 115%;">
<p>I am not an Opml expert. This is the results of my observations of a couple Opml feeds. I fail to see how to adequately leverage Opml in the mash-up web world. </p>
<p>A few weeks ago, I published a demonstration for <a href="http://spaces.msn.com/members/siteexperts/Blog/cns!1pNcL8JwTfkkjv4gg6LkVCpw!2332.entry" target="_blank">searching multiple site's </a>entirely via the web-browser. I was illustrating the value of opening up unauthenticaed cross-domain xmlhttp requests and the opportunities that would create. </p>
<p>I planned to build a new demo that can "mash-up" Opml. This demo would take an XML feed (whether RSS, Atom, or Opml) and render it. For Opml lists, I wanted to expand each list item based on type. Opml files (e.g., reading lists) expansion would have been a powerful expression. Loading an Opml file would render the list. Each outline item would be rendered based on type within the page - links to other Opml lists would expand in outline format, links to Rss feeds would expand with the feed in place, links to Mp3 or videos would expand with a media player, html pages could expand with a preview of the page, and so on. This provides a foundation for a a very quick and effective newspaper page. </p>
<p>Developing this should have been trivial. The base code was less than a few screenfuls. However, my good intentions quickly fell apart because I discovered that Opml provides no (actually minimal) semantics to understand the items in the list without having to physically request them. </p>
<p>Opml apparently has a type attribute. However, this type attribute is not well defined. According to the <a href="http://feeds.scripting.com/powerOpmlGuidelines" target="_blank">Opml Guidelines</a>, this merely tells you that the link is an Rss feed or something else. Something else is pretty broad. Having to request the resource to somehow determine its type is a non-starter (I am not downloading a multi-megabyte video just to know its a video). Even worse, different feeds use the url and xmlurl fields differently. I found Opml files that list each type as a "link" and then the url refers to an Rss file.  Even in the most recent post dated a week ago, <a href="http://www.opml.org/guidelinesForValidation" target="_blank">Validating OPML</a>, while the type attribute is considered required, it still appears to distinguish only between Rss and the everything else. I can't understand why isn't type just the mime-type? </p>
<p>I know this has been a challenge for others as I found code attempting to determine types via the file extension on the Url. This approach is very unreliable especially with the dynamic nature of many sites (Many times every file, regardless of actually mime-type, will end in extensions such as .aspx, .php, etc.). </p>
<p>So... I guess I don't get it. A list is interesting but without knowing what is in the list I fail to see how I can adequately leverage and "mash" it up into a greater experience. </p>
<p>Please enlighten me.</p>
</div></div>
[[posterous-content:atpdzDnmGuhzkvkrfEsu]][[posterous-content:imJeHHGFGEfBuxpHwsrd]]
</blockquote><i>[Via [Scott's "SiteExperts" Place](http://spaces.msn.com/members/siteexperts/Blog/cns!1pNcL8JwTfkkjv4gg6LkVCpw!2577.entry)]</i><p />

