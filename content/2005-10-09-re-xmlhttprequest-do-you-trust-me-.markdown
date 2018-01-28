---
slug: re-xmlhttprequest-do-you-trust-me-
date: 2005-10-09
 
title: "RE: XMLHttpRequest - Do you trust me?"
published: true
---
<i><a href="http://spaces.msn.com/members/siteexperts/Blog/cns!1pNcL8JwTfkkjv4gg6LkVCpw!2085.entry">Scott's "SiteExperts" Place</a></i> has a pretty good conversation about cross domain security when it comes to XMLHttpRequest.<p /><blockquote><div>
<div style="font-size: 115%;">
<br /><p>Many web applications that "mash-up" or integrate data from around the web hit the following issue: How do you request data from third party sites in a scalable and cost-effective way? Today, due to the cross-domain restrictions of xmlhttprequest, you must proxy all requests through a server in your domain. </p>
<br />...<br /><p>This problem arises because the xmlhttprequest object can only communicate back to the originating domain.  This restriction greatly limits the potential for building "mash-up" or rich aggregated experiences. While I understand the wisdom behind this restriction, I have begun questioning its value and am sharing some of my thoughts on this. </p>
<br />...<br /><p>Much of the cross-domain concern is around phishing attacks - xmlhttp can be used to request any file from another domain (e.g., html interface), While client access to this data can increase the attack vector, I do not believe the risk of this scenario outweighs the benefits.  I do not believe Phishing sites will benefit more from cross-domain access - they have been capable enough at stealing passwords by merely just copying the UI.  </p>
<br />...<br /><p>Other's claim that cross-domain xmlhttp requests can give the client access to private data. If the cross-domain requests are restricted to the same visibility as the host page (e.g., internet sites cannot access the intranet), then the information being requested is already public.  The only potential issue is with a rogue intranet site (requesting authenticated intranet data from another intranet site), but I believe that can be handled via greater controls. Prohibiting client-side cross-domain requests does not entirely protect the user. The moment a server is involved (which means any web-site), any such client internet request can be proxied by the server.  Furthermore, there is no way to indicate to the user when the server does the proxying.</p>
<br />...<br /><p>Also, I just want to be clear before anyone gets overly excited (especially those that may disagree with me), there are no plans that I know of to change browser security models around xmlhttprequest. These are merely my obversations.</p>
</div>
<br />
</div></blockquote><p />My general opinon to this was the same as most of the comments on SiteExperts' journal.  What is the problem with Cross Domain data fetching?  I have been thinking about security concerns here and am not going to talk about them.  My belif is that Cross Domain data fetching is more of a theft than anything else.  I am using the clients bandwidth in combination with external data providers bandwidth to mitigate the costs of proxying all the request through my own servers.  To be brutally honest, that is what I wanted to use third party direct connections from the client for!<p />What would be nice is a server security model that could be configured to say third party request can be resolved by client A and not client B etc.  That is the clients software [Web Browser] doesn't say that it allows cross domain data fetching, but rather the third part says that they will allow it.<p /><br />

