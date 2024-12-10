---
date: 2005-08-11
published: true
slug: a-difference-i-think-i-have-noticed-between-i
summary: I've noticed a difference in how Internet Explorer (versions 6 and 7) and
  Firefox handle synchronous XmlHttpRequests.  In both browsers, you can send requests
  using JavaScript. However, after the synchronous send() call, Internet Explorer
  still triggers the onreadystatechange event, while Firefox does not. I need to research
  which behavior is correct and according to spec.  If you happen to know, please
  email me!
tags:
- javascript
- xmlhttprequest
- ajax
- internet explorer
- firefox
- synchronous
- asynchronous
- browser compatibility
title: A Difference I think I have noticed between IE and Firefox concerning XmlHttpRequest

---
I am going to do a little bit more research on this but I think I have found an implementation difference between IE 6, IE 7 and Firefox, centering around XmlHttpRequest.<p />In both browsers, IE and Firefox, the developer can create a script that sends an HttpReqeust out via JavaScript.  The following code is pretty standard:<p />httpObj2.open("POST", url, false);  // Asyn = true, Sync = falsehttpObj2.onreadystatechange = parseSearchResponse;httpObj2.setRequestHeader("Connection","close"); httpObj2.setRequestHeader("Content-Type","application/x-www-form-urlencoded");httpObj2.send("query="+ escape(query)); <p />The above code will send a request synchronosly (it will block at send).  Now Internet Explorer will still call the function attached to the onreadystatechange event after the send has finished blocking.  Firefox on the otherhand will not call it.<p />Which is the correct behaviour.  If anyone knows email me at <a href="mailto:paul.kinlan@gmail.com">paul.kinlan@gmail.com</a><p />

