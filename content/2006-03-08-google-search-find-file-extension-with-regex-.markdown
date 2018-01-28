---
slug: google-search-find-file-extension-with-regex-
date: 2006-03-08
 
title: "Google Search: find file extension with regex in c#"
published: true
---
I have had a search to my page where I know the reader probably didn't find what they were looking for.<p />This post is to hopefully let that user find the information that they are looking for better.<p />The Search term was "find file extension with regex in c#".<p />A simple regex that could be used in C# to find file extensions is:<p />.+\.([^.]+)$<p />This will find an extension that is at the end of the string. To find an extension anywhere in a string you can use:<p />.+\.([^.]+)\s<p />A regex to find a three letter extension at the end of a line:<p />.+\.([^.]{3})$<p />To find a three letter extension anywhere in a string you can use:<p />.+\.([^.]{3})\s<p /><table class="TechnoratiHead TagHeader">
<tr><td>Related Tags</td></tr>
<tr class="Technorati"><td>
<a href="http://www.kinlan.co.uk/tag/file%20extensions" class="Tag" rel="tag">file extensions</a> <a href="http://www.kinlan.co.uk/tag/regex" class="Tag" rel="tag">regex</a> <a href="http://www.kinlan.co.uk/tag/file%20extension" class="Tag" rel="tag">file extension</a> <a href="http://www.kinlan.co.uk/tag/c%23" class="Tag" rel="tag">c#</a> <a href="http://www.kinlan.co.uk/tag/regular%20expression" class="Tag" rel="tag">regular expression</a>
</td></tr>
</table><br /><table class="TechnoratiHead TagHeader">
<tr><td>Related Wikipedia Documents</td></tr>
<tr class="Technorati"><td>
<a href="http://en.wikipedia.org/wiki/Regular_expression" class="Tag" rel="tag">Regular expression</a>, <a href="http://en.wikipedia.org/wiki/C_Sharp_programming_language" class="Tag" rel="tag">C Sharp</a>, <a href="http://en.wikipedia.org/wiki/Perl_regular_expression_examples" class="Tag" rel="tag">Perl regular expression examples</a>, <a href="http://en.wikipedia.org/wiki/Parsing_expression_grammar" class="Tag" rel="tag">Parsing expression grammar</a>, <a href="http://en.wikipedia.org/wiki/Regular_language" class="Tag" rel="tag">Regular language</a>, <a href="http://en.wikipedia.org/wiki/Grep" class="Tag" rel="tag">Grep</a>, <a href="http://en.wikipedia.org/wiki/Generalized_nondeterministic_finite_state_machine" class="Tag" rel="tag">Generalized nondeterministic finite state machine</a>
</td></tr>
</table><br /><table class="TechnoratiHead TagHeader">
<tr><td>My Related Documents</td></tr>
<tr class="Technorati"><td>
<a href="http://www.kinlan.co.uk/2005/10/re-regex-101-exercise-s2-verify-string.html" class="Tag" rel="tag">C#, .Net Framework: RE: Regex 101 Exercise S2 - Verify a string is a hex number</a>, <a href="http://www.kinlan.co.uk/2006/01/css-c-token-reader.html" class="Tag" rel="tag">C#, .Net Framework: CSS C# Token Reader</a>, <a href="http://www.kinlan.co.uk/2005/11/google-search-perl-c-comparison.html" class="Tag" rel="tag">C#, .Net Framework: Google Search: perl c# comparison</a>, <a href="http://www.kinlan.co.uk/2005/11/re-regex-101-exercise-s2-verify-string.html" class="Tag" rel="tag">C#, .Net Framework: RE: Regex 101 Exercise S2 - Verify a string is a hex number</a>
</td></tr>
</table><br /><table class="TechnoratiHead TagHeader">
<tr><td>Related Amazon Books</td></tr>
<tr class="Technorati"><td>Regular Expression Pocket Reference: <a href="http://www.amazon.co.uk/exec/obidos/redirect?tag=cnetfra-21&amp;link_code=xm2&amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.co.uk/gp/redirect.html%253fASIN=059600415X%2526tag=cnetfra-21%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/059600415X%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon UK</a>/<a href="http://www.amazon.com/exec/obidos/redirect?tag=cnetfra-20&amp;link_code=xm2&amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.com/gp/redirect.html%253fASIN=059600415X%2526tag=cnetfra-20%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/059600415X%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon USA</a> Regular Expression Recipes: A Problem-Solution Approach: <a href="http://www.amazon.co.uk/exec/obidos/redirect?tag=cnetfra-21&amp;link_code=xm2&amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.co.uk/gp/redirect.html%253fASIN=159059441X%2526tag=cnetfra-21%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/159059441X%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon UK</a>/<a href="http://www.amazon.com/exec/obidos/redirect?tag=cnetfra-20&amp;link_code=xm2&amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.com/gp/redirect.html%253fASIN=159059441X%2526tag=cnetfra-20%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/159059441X%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon USA</a> Regular Expression Recipes for Windows Developers: a Problem-solution Approach: <a href="http://www.amazon.co.uk/exec/obidos/redirect?tag=cnetfra-21&amp;link_code=xm2&amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.co.uk/gp/redirect.html%253fASIN=1590594975%2526tag=cnetfra-21%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/1590594975%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon UK</a>/<a href="http://www.amazon.com/exec/obidos/redirect?tag=cnetfra-20&amp;link_code=xm2&amp;camp=2025&amp;creative=165953&amp;path=http://www.amazon.com/gp/redirect.html%253fASIN=1590594975%2526tag=cnetfra-20%2526lcode=xm2%2526cID=2025%2526ccmID=165953%2526location=/o/ASIN/1590594975%25253FSubscriptionId=0CM2PVF6VAHJQKW5G782" class="Tag" rel="tag">View From Amazon USA</a>
</td></tr>
</table><br /><table class="TechnoratiHead TagHeader">
<tr><td>Related Images From Flickr</td></tr>
<tr class="Technorati"><td>
<span style="float: left;">[[posterous-content:dJxpfHqEamJwpuhbhoIA]]</span><span style="float: left;">[[posterous-content:zGIhnbJHzqcEchAfsgck]]</span><span style="float: left;">[[posterous-content:AwCdpudjgIhdIoizGykm]]</span>
</td></tr>
</table>

