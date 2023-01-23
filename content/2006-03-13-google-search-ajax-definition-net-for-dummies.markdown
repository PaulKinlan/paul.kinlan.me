---
slug: google-search-ajax-definition-net-for-dummies
date: 2006-03-13
 
title: "Google Search: ajax definition .net for dummies"
published: true
---
A Google search came by my site the other day for the following query: "ajax definition .net for dummies"<p />Firstly I will provide a breif definition of what AJAX is:<strong style="TEXT-DECORATION: underline;">A</strong>synchronous <strong style="TEXT-DECORATION: underline;">JA</strong>vaScript and <strong style="TEXT-DECORATION: underline;">X</strong>ML. Using an enhancement (originally by Microsoft for Web Outlook) in JavaScript that allows Web pages to be more interactive by communicating with the server retrieving data without the browser reloading the entire page.<p />This communication helps provide a better User experience when interacting with a website (when used correctly). Originally the browser had to reload the entire page before being able to show updates to the page.<p />Now that the definintion is given, I will talk <em>briefly</em> about using it in .Net.<p />ASP.Net really was designed for the old method of working. A page would be requested, events internally would fire based off the logic in the page and the Result would be displayed. Ajax really isn't like this, Ajax says, I already have the page, but I need to update this small portion of the page. Nativly, ASP.Net (1.x) can't handle this, it wants to load the page in its entirity.<p />All is not lost, because the Request Pipeline in ASP.Net is so flexible and has the ability to allow plugins to handle the incomming HTTP Request, people have developed plugins (or HTTPHandlers) that enable the developers to handle the AJAX Requests. The general consensus seems to be that Ajax Methods are embedded in the page, and the HTTPHandler pulls out the single method it needs to execute and only runs that code.<p />Some .Net Based Ajax Frameworks are:<ul>
<li>
<a href="http://www.ajaxpro.info">www.ajaxpro.info</a> : Very good, and source is now included</li>
<li>
<a href="http://arshad-dot-net.sourceforge.net/" title="http://Arshad-dot-net.sourceforge.net/" class="external text">Arshad.NET</a>: Supports viewstate on server side controls</li>
<li>
<a href="http://www.mathertel.de/AJAXEngine/" title="http://www.mathertel.de/AJAXEngine/" class="external text">AjaxAspects</a>: Supports calling Webservices</li>
<li>There are many more documented at <a href="http://ajaxpatterns.org/DotNet_Ajax_Frameworks">http://ajaxpatterns.org/DotNet_Ajax_Frameworks</a>
</li>
</ul><p />

