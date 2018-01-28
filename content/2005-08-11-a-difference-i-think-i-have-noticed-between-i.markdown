---
slug: a-difference-i-think-i-have-noticed-between-i
date: 2005-08-11
 
title: A Difference I think I have noticed between IE and Firefox concerning XmlHttpRequest
published: true
---
I am going to do a little bit more research on this but I think I have found an implementation difference between IE 6, IE 7 and Firefox, centering around XmlHttpRequest.<p />In both browsers, IE and Firefox, the developer can create a script that sends an HttpReqeust out via JavaScript.  The following code is pretty standard:<p />httpObj2.open("POST", url, false);  // Asyn = true, Sync = false<br />httpObj2.onreadystatechange = parseSearchResponse;<br />httpObj2.setRequestHeader("Connection","close"); <br />httpObj2.setRequestHeader("Content-Type","application/x-www-form-urlencoded");<br />httpObj2.send("query="+ escape(query)); <p />The above code will send a request synchronosly (it will block at send).  Now Internet Explorer will still call the function attached to the onreadystatechange event after the send has finished blocking.  Firefox on the otherhand will not call it.<p />Which is the correct behaviour.  If anyone knows email me at <a href="mailto:paul.kinlan@gmail.com">paul.kinlan@gmail.com</a><p /><table class="TechnoratiHead TagHeader">
<tr><td>Related Tags</td></tr>
<tr class="Technorati"><td>
<a href="https://paul.kinlan.me/tags/Ie7" class="Tag" rel="tag">Ie7</a> <a href="https://paul.kinlan.me/tags/Url" class="Tag" rel="tag">Url</a> <a href="https://paul.kinlan.me/tags/Firefox" class="Tag" rel="tag">Firefox</a> <a href="https://paul.kinlan.me/tags/Xmlhttprequest" class="Tag" rel="tag">Xmlhttprequest</a> <a href="https://paul.kinlan.me/tags/Browsers" class="Tag" rel="tag">Browsers</a> <a href="https://paul.kinlan.me/tags/JavaScript" class="Tag" rel="tag">JavaScript</a> <a href="https://paul.kinlan.me/tags/Ie%206" class="Tag" rel="tag">Ie 6</a>
</td></tr>
</table>

