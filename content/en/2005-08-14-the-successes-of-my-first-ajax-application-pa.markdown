---
slug: the-successes-of-my-first-ajax-application-pa
date: 2005-08-14
 
title: "The Successes of my first AJAX Application: Part 2"
published: true
---
Don't get me wrong, my application wasn't a success.  I am just dealing with the easy stuff first to prepare my self for the failures!!!<p />The second success of this web application is that it got me thinking about how to code JavaScript for Firefox and Internet Explorer (IE6 and IE7).  There are some subtle differences about the two browsers when it comes to JavaScript support.  (I suppose they are not subtle if you think about it).<p />In the past, all my JavaScript that I have done has always been for Internet Explorer.  So it came as a shock that when I tried my application in Firefox that it simply didn't work.<p />Here are some of the things that I have had to deal with:<ul>
<li>Getting the node text from an XML Document in Firefox requires you to do something along the lines of results.item(i).firstChild.nodeValue, where as in IE results.item(i).value worked.  The Firefox method works in IE so therefore I judge that to be the correct way to access nodes in an XML Document</li>
<li>xmlDocument.getElementsByTagName appears to be a facade for an XPATH query for .//[TagName]</li>
<li>Setting an event handler on XmlHttpRequests' onreadystatechanged will not trigger for a synchronous request, whereas on IE it will</li>
<li>The table object model in IE and Firefox aren't completely compatible, what works in IE will not work in Firefox, but the reverse appears to be true.  An Example of this is: insertRow and insertCell do not require a parameter in IE, however Firefox must have an indexer to the row and cell to insert.</li>
</ul>One other thing that has got me in this application is that the JavaScript is not componentized.  Separating areas of functionality that are not related into separate files should allow me to mange the code better.  As a side effect, browsers cache JavaScript files, so the more that it is componentized the less the bandwidth demands on your server (Hopefully!).<p />I have also been thinking (in my <a href="http://www.kinlan.co.uk/2005/08/successes-of-my-first-ajax-application.html">previous post</a>) about creating an object model for my next application.  This object model should be able to create other objects (and differing types if separate browsers need different functionality), it should enable me to perform all the asynchronous work that I need to be able to do without hindering the actual way the page works.  I think I will have to think about it more, but a definite structure to the JavaScript (not just reams and reams of script) will help me no end.<p />I will be making my applications support both browsers.  Unfortunately I will miss out on the other browsers (Opera, Safari, Konquerer), but I think I will have to deal with this at a later time.  However there is no harm in getting people with those browsers to come by my site and let me know what they think! :)<p />Therefore some requirements for the next app:<ul>
<li>Make it support the lowest common denominator for browser support.</li>
<li>Ensure that the JavaScript works correctly in most browsers.</li>
<li>Componentize the JavaScript so that it is more manageable.</li>
<li>Think about designing an event driven object model.</li>
</ul>

