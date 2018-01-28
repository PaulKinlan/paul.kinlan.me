---
slug: the-failures-of-my-first-ajax-application-par
date: 2005-09-04
 
title: "The Failures of my first AJAX Application: Part 2"
published: true
---
This is the second instalment of the "Failures of my First AJAX application" and is subtitled "It didn’t help reduce bandwidth".<p />One of the initial goals of the application was to access all the web services directly from the page without having to pass any queries through my own server.  This would mean the only data that my server sent to the client would be the HTML and JavaScript for the page.  All other requests would be handled by the client and would be directed straight to the third party web service.  This would greatly reduce my bandwidth demands.<p />[[posterous-content:sEuvqgvIzJEiteicHxGC]]<p />The diagram shows that my server should only return the response to the initial request.  And the client will handle all the other requests by use of AJAX method (JavaScript and XML) directly with the required web services.<p />It turned out differently however.  The actual implementation suffered from lack of foresight.  As soon as I created what I thought was my ideal solution [see above], I ran across problems running the AJAX code in Firefox.  I also then realised in a high security environment in IE 7 and Internet Explorer 6, data binding across data sources is disabled.<p />To get around this I had to create proxy scripts [<a href="http://www.kinlan.co.uk/2005/08/proxy-script-to-yahoo-api-term.html">here </a>and <a href="http://www.kinlan.co.uk/2005/08/proxy-script-to-yahoo-related-searches.html">here</a>]on my server that the client page would call (because it is on my domain name IE and Firefox would allow this).  All that the client scripts do is to pass a request that the client makes onto the correct web service. [see image below]<p />[[posterous-content:DeGksCnpiHtCuqHgEfbz]]<p />There is an added benefit to using a proxy script; you can hide any secret information that should not be available for the client to see, things such as the developer token that Technorati requires.<p />The major downside that I see and the point of this entry, is that I have to handle every client request to the desired web service rather than having the client manage the request.  Thus increasing my bandwidth demands.<p />Advantages:<ul>
<li>Hides security information needed in some web services.</li>
<li>Will allow the developer to monitor the requests that I a client would make.</li>
<li>Proxy scripts would allow you to merge requests and perform any kind of data manipulation on the script before it reaches the client.</li>
</ul><br />Disadvantages:<ul>
<li>All data is passed through the server, thus using extra bandwidth.</li>
<li>Requires proxy scripts to be created.</li>
<li>Proxy scripts may be insecure and also may take up too much server bandwidth</li>
</ul><br />I fully intend to support in the next version systems that allow cross domain data sources, because it will greatly help my bandwidth demand situation.  But there may be some situations that I need to perform multiple calls to web services in one single call to my proxy script.<br />

