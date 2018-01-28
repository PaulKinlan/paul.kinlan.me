---
slug: c-query-from-google
date: 2005-11-05
 
title: C# Query from Google
published: true
---
One of the queries that someone entered in to Google and found my site was:<br /><strong>c# test a string to see if it is a number</strong>:<br />I suppose there are a couple of ways that this can be done.<p />If you know the datatype that you want to convert it to [i.e you know the numeric range] you can use the Convert class.<br /><strong>Convert.ToInt16 (short), Convert.ToInt32 (int), Convert.ToFloat (floats). etc etc</strong><p />You could also use a regex along the lines of:<p />/^[0-9]+$/<br />or<br />/^[\d]+$/<p />both of the above regex's will check to see if it is a numeric string. (Whole numbers only though).<p />Anyone who is looking for <strong>c# test a string to see if it is a number</strong>; I hope you find this usefull.<p /><table class="TechnoratiHead TagHeader">
<tr><td>Related Tags</td></tr>
<tr class="Technorati"><td>
<a href="https://paul.kinlan.me/tags/Numeric%20String" class="Tag" rel="tag">Numeric String</a> <a href="https://paul.kinlan.me/tags/Regex" class="Tag" rel="tag">Regex</a> <a href="https://paul.kinlan.me/tags/Numeric%20String" class="Tag" rel="tag">Numeric String</a> <a href="https://paul.kinlan.me/tags/C#" class="Tag" rel="tag">C#</a>
</td></tr>
</table><br /><table class="TechnoratiHead TagHeader">
<tr><td>Wikipedia Documents</td></tr>
<tr class="Technorati"><td>
<a href="http://en.wikipedia.org/wiki/Regex">Wikipedia: Regex</a> ,<a href="http://en.wikipedia.org/wiki/Regular_expression">Regular Expression</a>
</td></tr>
</table>

