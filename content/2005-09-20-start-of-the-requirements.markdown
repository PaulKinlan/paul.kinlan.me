---
slug: start-of-the-requirements
date: 2005-09-20
 
title: Start Of The Requirements
published: true
---
Okay, here goes.  This is the start of the requirements that I have gathered/made up/learnt that the next version of AJAXTagger should achieve.  I am finding it quite hard to get the requirements down, so I think the best thing to do is to break them down in functional areas.  My application should really achieve all of these for it to be a success (in my terms anyway).<p /><h3>Features of the application</h3><ol>
<li>The application must be able to tag journal entries easily.</li>
<li>The application must be able to find related information about tags so that the user can decide if to use them or not.</li>
<li>The application must be able to find related articles on the users site.</li>
<li>The application must be able to find related blogs.</li>
<li>The application must be able to find related websites.</li>
<li>The application must be able to find related articles on any particular web site.</li>
<li>The application must provide the user with searches related to the subject via a variety of search providers.</li>
<li>The application must provide the user with all the search results (where possible) in one simple feed.</li>
<li>The application must be able to find images related to an article for inclusion.</li>
<li>The application must be able to extract items that could be used to help associate schemes.</li>
<li>The application must be able to pull an article from either a site or a blogging system such as blogger.</li>
<li>The application must be able to save an article to either a site or email system.</li>
<li>The application must make a minimal number of round trips to the server.</li>
<li>The system must be able to determine when a client can perform work that the server needs not.</li>
</ol><p /><h3>UI</h3><ol>
<li>The user must be aware of all the data that is entered on to the system</li>
<li>The user must be required to do as little work as possible.</li>
<li>The user must be able to see the results of editing straight away</li>
<li>The user must be able to hide information that they do not require</li>
<li>The UI must not interfere with the results the user requires</li>
<li>The user must be able to see the results of their actions immediatly</li>
</ol><p /><h3>Business Logic Client Side</h3><ol>
<li>The application's logic must not cause the browser to be stalled.</li>
<li>The application must be able to access data across domains if needed but be able to fall back to server side proxy scripts.</li>
<li>The application must function in IE6 and IE7.</li>
<li>The application must function in Firefox.</li>
<li>All Business Logic must be performant in Firefox</li>
<li>All Business Logic must be performant in IE6 and IE7</li>
<li>The system must be created in such a way that new functionality can be added easily</li>
<li>The system must be created in such a manner that adding new search engines and results sections is straight forward.</li>
<li>The system must be created in such a way that it can be easily maintained</li>
<li>The system must be able to handle errors</li>
<li>The system must be able to handle broken communication</li>
<li>The system must be able to manage chained events, one action causing another action causing another etc</li>
<li>The system must be able to handle multiple data requests at any one time</li>
<li>The system must be able to prioritze system events that require access to external data sources so that not too many requests happen at once</li>
</ol><p /><h3>Business Logic Server Side</h3><ol>
<li>Any logic that is done on the server should be as short as possible</li>
<li>Any logic done on the server must be performed in as secure a manner as possible</li>
</ol><p /><h3>Data Access</h3><ol>
<li>Data should not need to be stored on the server</li>
<li>Data may be stored in cookies so that the user doesn't have to enter</li>
<li>Direct access to external data sources will be as short as possible</li>
<li>Direct access to external data sources may be cached</li>
<li>Direct access to external data sources will fail gracefully if errors occur</li>
</ol><p /><h3>Known External Dependancies</h3><ol>
<li>Amazon</li>
<li>Yahoo</li>
<li>MSN</li>
<li>Google</li>
<li>Ebay</li>
<li>FindOry</li>
<li>Flickr</li>
<li>Alexa</li>
<li>Wikipedia</li>
</ol><p /><h3>Known Internal Dependencies</h3><ol>
<li>No Root Access to server</li>
<li>Bandwidth constraints</li>
<li>HTML Interface</li>
<li>JavaScript</li>
<li>XmlHTTPrequest</li>
<li>Internet Explorer 6 &amp; 7</li>
<li>Firefox</li>
</ol><p />

