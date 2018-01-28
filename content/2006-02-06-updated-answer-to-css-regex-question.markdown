---
slug: updated-answer-to-css-regex-question
date: 2006-02-06
 
title: Updated Answer to CSS Regex Question
published: true
---
I gave out a bit of duff information in my last post. Thanks Rasmus!<p />The code should have been:<p />string css = @"<br />.class1{<br />color:pink;<br />}<br />.class2{<br />color:blue;<br />}";<br />string patt = @"\.[-]?[_a-zA-Z][_a-zA-Z0-9-]*|[^\0-\177]*\\[0-9a-f]{1,6}(\r\n[ \n\r\t\f])?|\\[^\n\r\f0-9a-f]*";<br />MatchCollection arr = Regex.Matches(css, patt);<br />}<p /><br />The "arr" Collection will contain all the class names found in the input string. arr.Count will be the number of matches, and it can be indexed like so:  arr[0].Value etc. etc.<p />Sorry about that :)<p /><br /><table class="TechnoratiHead TagHeader">
<tr><td>Related Tags</td></tr>
<tr class="Technorati"><td>
<a href="http://www.kinlan.co.uk/tag/class%20names" class="Tag" rel="tag">class names</a> <a href="http://feeds.kinlan.co.uk/feed/posts/tag/class%20names" class="Tag">[feed]</a>, <a href="http://www.kinlan.co.uk/tag/regex" class="Tag" rel="tag">regex</a> <a href="http://feeds.kinlan.co.uk/feed/posts/tag/regex" class="Tag">[feed]</a>, <a href="http://www.kinlan.co.uk/tag/css" class="Tag" rel="tag">css</a> <a href="http://feeds.kinlan.co.uk/feed/posts/tag/css" class="Tag">[feed]</a>, <a href="http://www.kinlan.co.uk/tag/split" class="Tag" rel="tag">split</a> <a href="http://feeds.kinlan.co.uk/feed/posts/tag/split" class="Tag">[feed]</a>, <a href="http://www.kinlan.co.uk/tag/match" class="Tag" rel="tag">match</a> <a href="http://feeds.kinlan.co.uk/feed/posts/tag/match" class="Tag">[feed]</a>, <a href="http://www.kinlan.co.uk/tag/index" class="Tag" rel="tag">index</a> <a href="http://feeds.kinlan.co.uk/feed/posts/tag/index" class="Tag">[feed]</a>
</td></tr>
</table><br /><table class="TechnoratiHead TagHeader">
<tr><td>Related Wikipedia Documents</td></tr>
<tr class="Technorati"><td>
<a href="http://en.wikipedia.org/wiki/Regular_expression" class="Tag" rel="tag">Regular expression</a>, <a href="http://en.wikipedia.org/?title=Regular_expression" class="Tag" rel="tag">Regular expression</a>, <a href="http://en.wikipedia.org/wiki/Cascading_Style_Sheets" class="Tag" rel="tag">Cascading Style Sheets</a>, <a href="http://en.wikipedia.org/wiki/CSS_Zen_Garden" class="Tag" rel="tag">CSS Zen Garden</a>
</td></tr>
</table><br /><table class="TechnoratiHead TagHeader">
<tr><td>My Related Documents</td></tr>
<tr class="Technorati"><td>
<a href="http://www.kinlan.co.uk/2006/01/css-c-token-reader.html" class="Tag" rel="tag">C#, .Net Framework: CSS C# Token Reader</a>, <a href="http://www.kinlan.co.uk/2005/10/re-regex-101-exercise-s2-verify-string.html" class="Tag" rel="tag">C#, .Net Framework: RE: Regex 101 Exercise S2 - Verify a string is a hex number</a>
</td></tr>
</table><br /><table class="TechnoratiHead TagHeader">
<tr><td>Related Amazon Books</td></tr>
<tr class="Technorati"><td>The ZEN of CSS Design: Visual Enlightenment for the Web: <a href="http://www.amazon.co.uk/exec/obidos/redirect?tag=cnetfra-21&amp;link_code=xm2&amp;amp;amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.co.uk/gp/redirect.html%253fASIN=0321303474%2526tag=cnetfra-21%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/0321303474%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon UK</a>/<a href="http://www.amazon.com/exec/obidos/redirect?tag=cnetfra-20&amp;link_code=xm2&amp;amp;amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.com/gp/redirect.html%253fASIN=0321303474%2526tag=cnetfra-20%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/0321303474%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon USA</a> CSS Pocket Reference: <a href="http://www.amazon.co.uk/exec/obidos/redirect?tag=cnetfra-21&amp;link_code=xm2&amp;amp;amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.co.uk/gp/redirect.html%253fASIN=0596007779%2526tag=cnetfra-21%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/0596007779%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon UK</a>/<a href="http://www.amazon.com/exec/obidos/redirect?tag=cnetfra-20&amp;link_code=xm2&amp;amp;amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.com/gp/redirect.html%253fASIN=0596007779%2526tag=cnetfra-20%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/0596007779%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon USA</a> Professional CSS: <a href="http://www.amazon.co.uk/exec/obidos/redirect?tag=cnetfra-21&amp;link_code=xm2&amp;amp;amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.co.uk/gp/redirect.html%253fASIN=0764588338%2526tag=cnetfra-21%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/0764588338%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon UK</a>/<a href="http://www.amazon.com/exec/obidos/redirect?tag=cnetfra-20&amp;link_code=xm2&amp;amp;amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.com/gp/redirect.html%253fASIN=0764588338%2526tag=cnetfra-20%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/0764588338%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon USA</a> Eric Meyer on CSS: <a href="http://www.amazon.co.uk/exec/obidos/redirect?tag=cnetfra-21&amp;link_code=xm2&amp;amp;amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.co.uk/gp/redirect.html%253fASIN=073571245X%2526tag=cnetfra-21%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/073571245X%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon UK</a>/<a href="http://www.amazon.com/exec/obidos/redirect?tag=cnetfra-20&amp;link_code=xm2&amp;amp;amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.com/gp/redirect.html%253fASIN=073571245X%2526tag=cnetfra-20%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/073571245X%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon USA</a>
</td></tr>
</table><br /><table class="TechnoratiHead TagHeader">
<tr><td>Related Images From Flickr</td></tr>
<tr class="Technorati"><td>
<span style="FLOAT: left;">[[posterous-content:bioAlEnxGJJdFoBCoeAs]]</span><span style="FLOAT: left;">[[posterous-content:CkaoJgqDollBwqjDhubu]]</span><span style="FLOAT: left;">[[posterous-content:IFHEAseGqaesHtHtmdIs]]</span><span style="FLOAT: left;">[[posterous-content:rqxwsGqctxkEBAIlaFnB]]</span>
</td></tr>
</table>

