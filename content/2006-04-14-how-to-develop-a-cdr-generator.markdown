---
slug: how-to-develop-a-cdr-generator
date: 2006-04-14
 
title: How to develop a CDR generator
published: true
---
My Final Year project covered Telecoms fraud.  It included a call detail record generator.<p />I have had a fair few queries about this, mostly around how to develop a CDR tool.<p />Whilst I have only ever seen one CDR file.  I did do a fair amount of research around the subject and I found out quite a bit.<p />Firstly, I choose to store the least amount of data that I could get away with.  The data that I chose was:<br /><ul>
<br /><li>Caller (source)</li>
<br /><li>Callee (destination)</li>
<br /><li>Call Type (local, national etc)</li>
<br /><li>Start Time</li>
<br /><li>Duration</li>
<br />
</ul><p />With those 5 parameters you can work out the cost of the call and you can also work out a lot of other statistics.<p />To generate a CDR I had to configure a lot of models, high user, low users, business users etc.  Each of these models had different parameters.  The parameters were attributes such as:<br /><ul>
<br /><li>The average cost and STDEV of a local call</li>
<br /><li>The average number and STDEV of local calls</li>
<br /><li>The average cost and STDEV of a PRS call</li>
<br /><li>The average number and STDEV of PRS calls</li>
<br /><li>The average cost and STDEV of a national call</li>
<br /><li>The average number and STDEV of National calls</li>
<br /><li>The times most likely to make a call: 8am -5 pm for a business as an example</li>
<br />
</ul><p />When you have all these parameters you can get a random number generate to randomly pick values that fall within the bounds set by the model.<p />When the model generator is finished you should have a spread of customers that fit the model described.<p />Using this data you can then simulate your network in whatever manner you need.<p />How you determine the parameters of the model, is upto you because you know the data that you are trying to model.<p /><table class="TechnoratiHead TagHeader">
<tr><td>Related Tags</td></tr>
<tr class="Technorati"><td>
<a href="http://www.kinlan.co.uk/tag/stdev" class="Tag" rel="tag">stdev</a> <a href="http://www.kinlan.co.uk/tag/cdr%20file" class="Tag" rel="tag">cdr file</a> <a href="http://www.kinlan.co.uk/tag/local%20call" class="Tag" rel="tag">local call</a> <a href="http://www.kinlan.co.uk/tag/call%20detail%20record" class="Tag" rel="tag">call detail record</a> <a href="http://www.kinlan.co.uk/tag/prs" class="Tag" rel="tag">prs</a> <a href="http://www.kinlan.co.uk/tag/models" class="Tag" rel="tag">models</a> <a href="http://www.kinlan.co.uk/tag/model%20generator" class="Tag" rel="tag">model generator</a> <a href="http://www.kinlan.co.uk/tag/telecoms%20fraud" class="Tag" rel="tag">telecoms fraud</a> <a href="http://www.kinlan.co.uk/tag/random%20number" class="Tag" rel="tag">random number</a> <a href="http://www.kinlan.co.uk/tag/national%20call" class="Tag" rel="tag">national call</a> <a href="http://www.kinlan.co.uk/tag/average%20cost" class="Tag" rel="tag">average cost</a> <a href="http://www.kinlan.co.uk/tag/CDR" class="Tag" rel="tag">CDR</a>
</td></tr>
</table><br /><table class="TechnoratiHead TagHeader">
<tr><td>Related Wikipedia Documents</td></tr>
<tr class="Technorati"><td>
<a href="http://en.wikipedia.org/wiki/CDR" class="Tag" rel="tag">CDR</a>, <a href="http://en.wikipedia.org/wiki/Geometric_standard_deviation" class="Tag" rel="tag">Geometric standard deviation</a>, <a href="http://en.wikipedia.org/wiki/Local_call" class="Tag" rel="tag">Local call</a>, <a href="http://en.wikipedia.org/wiki/Caller_ID" class="Tag" rel="tag">Caller ID</a>, <a href="http://en.wikipedia.org/wiki/Telecommunications_rating" class="Tag" rel="tag">Telecommunications rating</a>, <a href="http://en.wikipedia.org/wiki/PRS" class="Tag" rel="tag">PRS</a>
</td></tr>
</table><br /><table class="TechnoratiHead TagHeader">
<tr><td>My Related Documents</td></tr>
<tr class="Technorati"><td>
<a href="http://www.kinlan.co.uk/2005/12/call-detail-record-cdr-generation-tool.html" class="Tag" rel="tag">C#, .Net Framework: Call Detail Record (CDR) Generation Tool</a>, <a href="http://www.kinlan.co.uk/tag/telecoms" class="Tag" rel="tag">Related Information for tag: telecoms</a>, <a href="http://www.kinlan.co.uk/tag/fraud" class="Tag" rel="tag">Related Information for tag: fraud</a>, <a href="http://www.kinlan.co.uk/finalyearproject/final%20report%203.doc" class="Tag" rel="tag">final year project</a>, <a href="http://www.kinlan.co.uk/2005/12/update-to-call-detail-record-generator.html" class="Tag" rel="tag">C#, .Net Framework: Update to Call Detail Record Generator</a>, <a href="http://www.kinlan.co.uk/2005/12/neural-networks-c-and-telecoms-fraud.html" class="Tag" rel="tag">C#, .Net Framework: Neural Networks, C# and telecoms fraud detection final year project</a>
</td></tr>
</table><br /><table class="TechnoratiHead TagHeader">
<tr><td>Related Amazon Books</td></tr>
<tr class="Technorati"><td>Financial Modeling Using Excel and VBA: <a href="http://www.amazon.co.uk/exec/obidos/redirect?tag=cnetfra-21&amp;link_code=xm2&amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.co.uk/gp/redirect.html%253fASIN=0471267686%2526tag=cnetfra-21%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/0471267686%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon UK</a>/<a href="http://www.amazon.com/exec/obidos/redirect?tag=cnetfra-20&amp;link_code=xm2&amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.com/gp/redirect.html%253fASIN=0471267686%2526tag=cnetfra-20%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/0471267686%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon USA</a> Analytic Methods in the Analysis and Design of Number Theoretic Algorithms: <a href="http://www.amazon.co.uk/exec/obidos/redirect?tag=cnetfra-21&amp;link_code=xm2&amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.co.uk/gp/redirect.html%253fASIN=0262022192%2526tag=cnetfra-21%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/0262022192%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon UK</a>/<a href="http://www.amazon.com/exec/obidos/redirect?tag=cnetfra-20&amp;link_code=xm2&amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.com/gp/redirect.html%253fASIN=0262022192%2526tag=cnetfra-20%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/0262022192%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon USA</a> Image Analysis, Random Fields and Markov Chain Monte Carlo Methods: A Mathematical Introduction (Stochastic Modeling and Applied Probability S.): <a href="http://www.amazon.co.uk/exec/obidos/redirect?tag=cnetfra-21&amp;link_code=xm2&amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.co.uk/gp/redirect.html%253fASIN=3540442138%2526tag=cnetfra-21%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/3540442138%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon UK</a>/<a href="http://www.amazon.com/exec/obidos/redirect?tag=cnetfra-20&amp;link_code=xm2&amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.com/gp/redirect.html%253fASIN=3540442138%2526tag=cnetfra-20%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/3540442138%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon USA</a> Random Generation of Trees: Random Generators in Computer Science: <a href="http://www.amazon.co.uk/exec/obidos/redirect?tag=cnetfra-21&amp;link_code=xm2&amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.co.uk/gp/redirect.html%253fASIN=079239528X%2526tag=cnetfra-21%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/079239528X%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon UK</a>/<a href="http://www.amazon.com/exec/obidos/redirect?tag=cnetfra-20&amp;link_code=xm2&amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.com/gp/redirect.html%253fASIN=079239528X%2526tag=cnetfra-20%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/079239528X%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon USA</a> Uniform Random Numbers: Theory and Practice (Kluwer International Series in Engineering &amp; Computer Science): <a href="http://www.amazon.co.uk/exec/obidos/redirect?tag=cnetfra-21&amp;link_code=xm2&amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.co.uk/gp/redirect.html%253fASIN=0792395727%2526tag=cnetfra-21%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/0792395727%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon UK</a>/<a href="http://www.amazon.com/exec/obidos/redirect?tag=cnetfra-20&amp;link_code=xm2&amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.com/gp/redirect.html%253fASIN=0792395727%2526tag=cnetfra-20%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/0792395727%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon USA</a>
</td></tr>
</table><br /><table class="TechnoratiHead TagHeader">
<tr><td>Related Images From Flickr</td></tr>
<tr class="Technorati"><td>
<span style="float: left;">[[posterous-content:hiHgIubenagbgHErneGd]]</span><span style="float: left;">[[posterous-content:BwcogJvhcIakfyyHlFhk]]</span>
</td></tr>
</table>

