---
slug: answer-to-css-regex-question
date: 2006-02-06
 
title: Answer to CSS Regex Question
published: true
---
I have had a question in my <a href="http://www.kinlan.co.uk/2006/02/regex-to-get-class-names-from-css-20.html#c113916701172912826">Comments by Rasmus</a> about CSS Regex for obtaining CSS class names. And rather than post it in the comments, I will post it as abn entry just so everyone can see it.<p />The Regex I gave was<br />\.[-]?[_a-zA-Z][_a-zA-Z0-9-]*|[^\0-\177]*\\[0-9a-f]{1,6}(\r\n[ \n\r\t\f])?|\\[^\n\r\f0-9a-f]*<p />I think this is nearly correct and the C# that it is not supposed to work with is:<p /><br />string css = @"<br />.class1{<br />color:pink;<br />}<br />.class2{<br />color:blue;<br />}";<br />string patt = @"\.[-]?[_a-zA-Z][_a-zA-Z0-9-]*[^\0-\177]*\\[0-9a-f]{1,6}(\r\n[ \n\r\t\f])?\\[^\n\r\f0-9a-f]*";<br />string[] arr = Regex.Split(css, patt);<br />}<p />I tried the above code and it worked as Expected, there is an array entry in arr at the index of each class. Therefore each entry in arr contains the text between the class names.<p />Try Regex.Match if you want to get at the names of the classes.  And Check that the | character comes out correctly.<p /><table class="TechnoratiHead TagHeader">
<tr><td>Related Tags</td></tr>
<tr class="Technorati"><td>
<a href="http://www.kinlan.co.uk/tag/class%20names" class="Tag" rel="tag">class names</a> <a href="http://www.kinlan.co.uk/tag/regex" class="Tag" rel="tag">regex</a> <a href="http://www.kinlan.co.uk/tag/css" class="Tag" rel="tag">css</a> <a href="http://www.kinlan.co.uk/tag/split" class="Tag" rel="tag">split</a> <a href="http://www.kinlan.co.uk/tag/match" class="Tag" rel="tag">match</a> <a href="http://www.kinlan.co.uk/tag/index" class="Tag" rel="tag">index</a>
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
<tr class="Technorati"><td>The ZEN of CSS Design: Visual Enlightenment for the Web: <a href="http://www.amazon.co.uk/exec/obidos/redirect?tag=cnetfra-21&amp;link_code=xm2&amp;amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.co.uk/gp/redirect.html%253fASIN=0321303474%2526tag=cnetfra-21%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/0321303474%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon UK</a>/<a href="http://www.amazon.com/exec/obidos/redirect?tag=cnetfra-20&amp;link_code=xm2&amp;amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.com/gp/redirect.html%253fASIN=0321303474%2526tag=cnetfra-20%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/0321303474%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon USA</a> CSS Pocket Reference: <a href="http://www.amazon.co.uk/exec/obidos/redirect?tag=cnetfra-21&amp;link_code=xm2&amp;amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.co.uk/gp/redirect.html%253fASIN=0596007779%2526tag=cnetfra-21%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/0596007779%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon UK</a>/<a href="http://www.amazon.com/exec/obidos/redirect?tag=cnetfra-20&amp;link_code=xm2&amp;amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.com/gp/redirect.html%253fASIN=0596007779%2526tag=cnetfra-20%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/0596007779%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon USA</a> Professional CSS: <a href="http://www.amazon.co.uk/exec/obidos/redirect?tag=cnetfra-21&amp;link_code=xm2&amp;amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.co.uk/gp/redirect.html%253fASIN=0764588338%2526tag=cnetfra-21%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/0764588338%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon UK</a>/<a href="http://www.amazon.com/exec/obidos/redirect?tag=cnetfra-20&amp;link_code=xm2&amp;amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.com/gp/redirect.html%253fASIN=0764588338%2526tag=cnetfra-20%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/0764588338%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon USA</a> Eric Meyer on CSS: <a href="http://www.amazon.co.uk/exec/obidos/redirect?tag=cnetfra-21&amp;link_code=xm2&amp;amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.co.uk/gp/redirect.html%253fASIN=073571245X%2526tag=cnetfra-21%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/073571245X%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon UK</a>/<a href="http://www.amazon.com/exec/obidos/redirect?tag=cnetfra-20&amp;link_code=xm2&amp;amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.com/gp/redirect.html%253fASIN=073571245X%2526tag=cnetfra-20%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/073571245X%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon USA</a>
</td></tr>
</table><br /><table class="TechnoratiHead TagHeader">
<tr><td>Related Images From Flickr</td></tr>
<tr class="Technorati"><td>
<span style="FLOAT: left;">[[posterous-content:FgwpptIJBghipdEbhyEl]]</span><span style="FLOAT: left;">[[posterous-content:xAnJIAkgxAdsGpkumFiq]]</span><span style="FLOAT: left;">[[posterous-content:GgccGEyfFGxghferemyI]]</span><span style="FLOAT: left;">[[posterous-content:pfhyniafkGthylnjwzeu]]</span>
</td></tr>
</table>

