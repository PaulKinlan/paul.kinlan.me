---
slug: problem-with-javascript-in-ie7
date: 2005-10-23
 
title: Problem with JavaScript in IE7
published: true
---
I have been having a problem in IE7 and Internet Explorer 6, by where if you dynamically create a checkbox, set it to checked = true and then add it in to the HTML document, it loses it's checked status.<p />var newCheck = document.createElement('&lt;input name=relatedSearchesChk&gt;');<br />newCheck.type = "checkbox";		<br />newCheck.onclick = updateCheckStatus;//Function to Call when clicked<br />newCheck.relatedUrl =  currSearch.Query;//Expando String<br />newCheck.relatedObject = currSearch; //Expand Object<br />newCheck.checked = isChecked; //DOESN't WORK.  isChecked is just a local Booelan Variable.<br />tagCell1.appendChild(newCheck);<p />The closest related problem on the web that I found was this thread: <a href="http://forum.java.sun.com/thread.jspa?threadID=628633&amp;messageID=3810937">Java Forums - Creating a checked Checkbox through javascript</a>.  The solution in this thread works.<p />However I found another solution.  Update the checked status after it has been added to the document.  I have no idea why it works like this but it does work.<p />var newCheck = document.createElement(&lt;input name=relatedSearchesChk&gt;');<br />newCheck.type = "checkbox";		<br />newCheck.onclick = updateCheckStatus;//Function to Call when clicked<br />newCheck.relatedUrl =  currSearch.Query;//Expando String<br />newCheck.relatedObject = currSearch; //Expand Object<br />tagCell1.appendChild(newCheck);<br />newCheck.checked = isChecked; //WORKS<p />If you know why this happens I would love to know: <a href="mailto:%20paul.kinlan@gmail.com">paul.kinlan@gmail.com</a><p /><table class="TechnoratiHead TagHeader">
<tr><td>Related Tags</td></tr>
<tr class="Technorati"><td>
<a href="https://paul.kinlan.me/tags/JavaScript" class="Tag" rel="tag">JavaScript</a> <a href="https://paul.kinlan.me/tags/Internet%20Explorer%206" class="Tag" rel="tag">Internet Explorer 6</a> <a href="https://paul.kinlan.me/tags/Java%20Sun" class="Tag" rel="tag">Java Sun</a> <a href="https://paul.kinlan.me/tags/Checkbox" class="Tag" rel="tag">Checkbox</a> <a href="https://paul.kinlan.me/tags/Ie7" class="Tag" rel="tag">Ie7</a> <a href="https://paul.kinlan.me/tags/Internet%20Explorer" class="Tag" rel="tag">Internet Explorer</a>
</td></tr>
</table><br /><table class="TechnoratiHead TagHeader">
<tr><td>Wikipedia Documents</td></tr>
<tr class="Technorati"><td>
<a href="http://en.wikipedia.org/wiki/MSIE">Internet Explorer</a> ,<a href="http://en.wikipedia.org/wiki/Internet_Explorer_box_model_bug">Internet Explorer Box Model Bug</a> ,<a href="http://en.wikipedia.org/wiki/Tabbed_Document_Interface">Tabbed Document Interface</a> ,<a href="http://en.wikipedia.org/wiki/Mozilla_Firefox">Mozilla Firefox</a> ,<a href="http://en.wikipedia.org/wiki/Check_box">Wikipedia: Check Box</a> ,<a href="http://en.wikipedia.org/wiki/JavaScript">JavaScript</a> ,<a href="http://en.wikipedia.org/wiki/ECMAScript">Ecmascript</a> ,<a href="http://en.wikipedia.org/wiki/AJAX">Wikipedia: Ajax</a> ,<a href="http://en.wikipedia.org/wiki/JSON">Json</a>
</td></tr>
</table><div class="blogger-post-footer"><img class="posterous_download_image" src="https://blogger.googleusercontent.com/tracker/8109338-113008416967688222?l=www.kinlan.co.uk%2Findex.html" height="1" alt="" width="1" /></div>

