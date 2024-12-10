---
date: 2005-10-23
published: true
slug: problem-with-javascript-in-ie7
summary: I've encountered a bug in IE6/7 where dynamically created checkboxes lose
  their checked status after being added to the document.  Setting the checked property
  *after* appending the element seems to be a reliable workaround.  If anyone knows
  why this behavior occurs, please contact me!
tags:
- javascript
- internet explorer
- ie6
- ie7
- checkbox
- dom
- dynamic
- bug
- workaround
title: Problem with JavaScript in IE7

---
I have been having a problem in IE7 and Internet Explorer 6, by where if you dynamically create a checkbox, set it to checked = true and then add it in to the HTML document, it loses it's checked status.<p />var newCheck = document.createElement('&lt;input name=relatedSearchesChk&gt;');newCheck.type = "checkbox";		newCheck.onclick = updateCheckStatus;//Function to Call when clickednewCheck.relatedUrl =  currSearch.Query;//Expando StringnewCheck.relatedObject = currSearch; //Expand ObjectnewCheck.checked = isChecked; //DOESN't WORK.  isChecked is just a local Booelan Variable.tagCell1.appendChild(newCheck);<p />The closest related problem on the web that I found was this thread: [Java Forums - Creating a checked Checkbox through javascript](http://forum.java.sun.com/thread.jspa?threadID=628633&amp;messageID=3810937).  The solution in this thread works.<p />However I found another solution.  Update the checked status after it has been added to the document.  I have no idea why it works like this but it does work.<p />var newCheck = document.createElement(&lt;input name=relatedSearchesChk&gt;');newCheck.type = "checkbox";		newCheck.onclick = updateCheckStatus;//Function to Call when clickednewCheck.relatedUrl =  currSearch.Query;//Expando StringnewCheck.relatedObject = currSearch; //Expand ObjecttagCell1.appendChild(newCheck);newCheck.checked = isChecked; //WORKS<p />If you know why this happens I would love to know: [paul.kinlan@gmail.com](mailto:%20paul.kinlan@gmail.com)<p />

