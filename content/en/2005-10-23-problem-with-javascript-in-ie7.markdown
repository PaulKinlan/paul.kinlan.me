---
slug: problem-with-javascript-in-ie7
date: 2005-10-23
 
title: Problem with JavaScript in IE7
published: true
---
I have been having a problem in IE7 and Internet Explorer 6, by where if you dynamically create a checkbox, set it to checked = true and then add it in to the HTML document, it loses it's checked status.<p />var newCheck = document.createElement('&lt;input name=relatedSearchesChk&gt;');<br />newCheck.type = "checkbox";		<br />newCheck.onclick = updateCheckStatus;//Function to Call when clicked<br />newCheck.relatedUrl =  currSearch.Query;//Expando String<br />newCheck.relatedObject = currSearch; //Expand Object<br />newCheck.checked = isChecked; //DOESN't WORK.  isChecked is just a local Booelan Variable.<br />tagCell1.appendChild(newCheck);<p />The closest related problem on the web that I found was this thread: [Java Forums - Creating a checked Checkbox through javascript](http://forum.java.sun.com/thread.jspa?threadID=628633&amp;messageID=3810937).  The solution in this thread works.<p />However I found another solution.  Update the checked status after it has been added to the document.  I have no idea why it works like this but it does work.<p />var newCheck = document.createElement(&lt;input name=relatedSearchesChk&gt;');<br />newCheck.type = "checkbox";		<br />newCheck.onclick = updateCheckStatus;//Function to Call when clicked<br />newCheck.relatedUrl =  currSearch.Query;//Expando String<br />newCheck.relatedObject = currSearch; //Expand Object<br />tagCell1.appendChild(newCheck);<br />newCheck.checked = isChecked; //WORKS<p />If you know why this happens I would love to know: [paul.kinlan@gmail.com](mailto:%20paul.kinlan@gmail.com)<p />

