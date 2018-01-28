---
slug: start-of-the-requirements
date: 2005-09-20
 
title: Start Of The Requirements
published: true
---
Okay, here goes.  This is the start of the requirements that I have gathered/made up/learnt that the next version of AJAXTagger should achieve.  I am finding it quite hard to get the requirements down, so I think the best thing to do is to break them down in functional areas.  My application should really achieve all of these for it to be a success (in my terms anyway).<p /><h3>Features of the application</h3><br /><ol>
<li>The application must be able to tag journal entries easily.</li>
<br /><li>The application must be able to find related information about tags so that the user can decide if to use them or not.</li>
<br /><li>The application must be able to find related articles on the users site.</li>
<br /><li>The application must be able to find related blogs.</li>
<br /><li>The application must be able to find related websites.</li>
<br /><li>The application must be able to find related articles on any particular web site.</li>
<br /><li>The application must provide the user with searches related to the subject via a variety of search providers.</li>
<br /><li>The application must provide the user with all the search results (where possible) in one simple feed.</li>
<br /><li>The application must be able to find images related to an article for inclusion.</li>
<br /><li>The application must be able to extract items that could be used to help associate schemes.</li>
<br /><li>The application must be able to pull an article from either a site or a blogging system such as blogger.</li>
<br /><li>The application must be able to save an article to either a site or email system.</li>
<br /><li>The application must make a minimal number of round trips to the server.</li>
<br /><li>The system must be able to determine when a client can perform work that the server needs not.</li>
</ol><p /><h3>UI</h3><br /><ol>
<li>The user must be aware of all the data that is entered on to the system</li>
<br /><li>The user must be required to do as little work as possible.</li>
<br /><li>The user must be able to see the results of editing straight away</li>
<br /><li>The user must be able to hide information that they do not require</li>
<br /><li>The UI must not interfere with the results the user requires</li>
<br /><li>The user must be able to see the results of their actions immediatly</li>
</ol><p /><h3>Business Logic Client Side</h3><br /><ol>
<li>The application's logic must not cause the browser to be stalled.</li>
<br /><li>The application must be able to access data across domains if needed but be able to fall back to server side proxy scripts.</li>
<br /><li>The application must function in IE6 and IE7.</li>
<br /><li>The application must function in Firefox.</li>
<br /><li>All Business Logic must be performant in Firefox</li>
<br /><li>All Business Logic must be performant in IE6 and IE7</li>
<br /><li>The system must be created in such a way that new functionality can be added easily</li>
<br /><li>The system must be created in such a manner that adding new search engines and results sections is straight forward.</li>
<br /><li>The system must be created in such a way that it can be easily maintained</li>
<br /><li>The system must be able to handle errors</li>
<br /><li>The system must be able to handle broken communication</li>
<br /><li>The system must be able to manage chained events, one action causing another action causing another etc</li>
<br /><li>The system must be able to handle multiple data requests at any one time</li>
<br /><li>The system must be able to prioritze system events that require access to external data sources so that not too many requests happen at once</li>
</ol><p /><h3>Business Logic Server Side</h3><br /><ol>
<li>Any logic that is done on the server should be as short as possible</li>
<br /><li>Any logic done on the server must be performed in as secure a manner as possible</li>
</ol><p /><h3>Data Access</h3><br /><ol>
<li>Data should not need to be stored on the server</li>
<br /><li>Data may be stored in cookies so that the user doesn't have to enter</li>
<br /><li>Direct access to external data sources will be as short as possible</li>
<br /><li>Direct access to external data sources may be cached</li>
<br /><li>Direct access to external data sources will fail gracefully if errors occur</li>
</ol><p /><h3>Known External Dependancies</h3><br /><ol>
<li>Amazon</li>
<br /><li>Yahoo</li>
<br /><li>MSN</li>
<br /><li>Google</li>
<br /><li>Ebay</li>
<br /><li>FindOry</li>
<br /><li>Flickr</li>
<br /><li>Alexa</li>
<br /><li>Wikipedia</li>
</ol><p /><h3>Known Internal Dependencies</h3><br /><ol>
<li>No Root Access to server</li>
<br /><li>Bandwidth constraints</li>
<br /><li>HTML Interface</li>
<br /><li>JavaScript</li>
<br /><li>XmlHTTPrequest</li>
<br /><li>Internet Explorer 6 &amp; 7</li>
<br /><li>Firefox</li>
</ol><p /><table class="TechnoratiHead TagHeader">
<tr><td>Related Tags</td></tr>
<tr class="Technorati"><td>
<a href="https://paul.kinlan.me/tags/Search" class="Tag" rel="tag">Search</a> <a href="https://paul.kinlan.me/tags/Tag" class="Tag" rel="tag">Tag</a> <a href="https://paul.kinlan.me/tags/Yahoo" class="Tag" rel="tag">Yahoo</a> <a href="https://paul.kinlan.me/tags/Alexa" class="Tag" rel="tag">Alexa</a> <a href="https://paul.kinlan.me/tags/Wikipedia" class="Tag" rel="tag">Wikipedia</a> <a href="https://paul.kinlan.me/tags/Ebay" class="Tag" rel="tag">Ebay</a> <a href="https://paul.kinlan.me/tags/Google" class="Tag" rel="tag">Google</a> <a href="https://paul.kinlan.me/tags/Amazon" class="Tag" rel="tag">Amazon</a> <a href="https://paul.kinlan.me/tags/Cookies" class="Tag" rel="tag">Cookies</a> <a href="https://paul.kinlan.me/tags/Data%20Sources" class="Tag" rel="tag">Data Sources</a> <a href="https://paul.kinlan.me/tags/Logic" class="Tag" rel="tag">Logic</a> <a href="https://paul.kinlan.me/tags/New%20Search%20Engines" class="Tag" rel="tag">New Search Engines</a> <a href="https://paul.kinlan.me/tags/Business%20Logic" class="Tag" rel="tag">Business Logic</a> <a href="https://paul.kinlan.me/tags/Ie7" class="Tag" rel="tag">Ie7</a> <a href="https://paul.kinlan.me/tags/Firefox" class="Tag" rel="tag">Firefox</a> <a href="https://paul.kinlan.me/tags/Server%20Side%20Proxy" class="Tag" rel="tag">Server Side Proxy</a> <a href="https://paul.kinlan.me/tags/Ie6" class="Tag" rel="tag">Ie6</a> <a href="https://paul.kinlan.me/tags/Functionality" class="Tag" rel="tag">Functionality</a> <a href="https://paul.kinlan.me/tags/Blogging" class="Tag" rel="tag">Blogging</a> <a href="https://paul.kinlan.me/tags/Search" class="Tag" rel="tag">Search</a> <a href="https://paul.kinlan.me/tags/Feed" class="Tag" rel="tag">Feed</a> <a href="https://paul.kinlan.me/tags/Functional%20Areas" class="Tag" rel="tag">Functional Areas</a> <a href="https://paul.kinlan.me/tags/Success" class="Tag" rel="tag">Success</a>
</td></tr>
</table><br /><table class="TechnoratiHead TagHeader">
<tr><td>Wikipedia Documents</td></tr>
<tr class="Technorati"><td>
<a href="http://en.wikipedia.org/wiki/RSS_(protocol)">Rss (file Format) - Wikipedia, The Free Encyclopedia</a> ,<a href="http://en.wikipedia.org/wiki/Web_feed">Web Feed - Wikipedia, The Free Encyclopedia</a> ,<a href="http://en.wikipedia.org/wiki/Search_engine">Wikipedia: Search Engine</a> ,<a href="http://en.wikipedia.org/wiki/Search_algorithm">Search Algorithm - Wikipedia, The Free Encyclopedia</a> ,<a href="http://en.wikipedia.org/wiki/Blog">Weblog - Wikipedia, The Free Encyclopedia</a> ,<a href="http://en.wikipedia.org/wiki/Internet_Explorer">Internet Explorer - Wikipedia, The Free Encyclopedia</a> ,<a href="http://en.wikipedia.org/wiki/Proxy_server">Proxy Server - Wikipedia, The Free Encyclopedia</a> ,<a href="http://en.wikipedia.org/wiki/AJAX">Wikipedia: Ajax</a> ,<a href="http://en.wikipedia.org/wiki/Mozilla_Firefox">Mozilla Firefox - Wikipedia, The Free Encyclopedia</a> ,<a href="http://en.wikipedia.org/wiki/Business_rules">Business Rules - Wikipedia, The Free Encyclopedia</a> ,<a href="http://en.wikipedia.org/wiki/Aspect_(computer_science)">Aspect (computer Science) - Wikipedia, The Free Encyclopedia</a> ,<a href="http://en.wikipedia.org/wiki/Automated_business_process">Automated Business Process - Wikipedia, The Free Encyclopedia</a> ,<a href="http://en.wikipedia.org/wiki/Cookies">Cookie - Wikipedia, The Free Encyclopedia</a> ,<a href="http://en.wikipedia.org/wiki/Alexa_Internet">Alexa Internet - Wikipedia, The Free Encyclopedia</a> ,<a href="http://en.wikipedia.org/wiki/Yahoo!">Yahoo! - Wikipedia, The Free Encyclopedia</a> ,<a href="http://en.wikipedia.org/wiki/Tag_cloud">Tag Cloud - Wikipedia, The Free Encyclopedia</a>
</td></tr>
</table>

