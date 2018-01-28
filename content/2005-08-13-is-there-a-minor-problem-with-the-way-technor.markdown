---
slug: is-there-a-minor-problem-with-the-way-technor
date: 2005-08-13
 
title: Is there a minor problem with the way technorati parses URLs
published: true
---
I was looking through my logs today, and I noticed that I had not had a single referal over the past day from technorati.  I investigated a bit more and I noticed none of my blogs are in any of the tag searches on Technorati.... This is odd I thought.<p />It is my Technorati AJAX application that creates the tag information for a post now.  So there must be a problem there.  I checked the HTML and I noticed that a link had the following &lt;a href='blurb' rel='tag'&gt;. hmmm the only thing that is slightly off there is the apostrophe instead of the double quote.  I changed it so now it looks like &lt;a href="blurb" rel="tag"&gt;.  Hopefully this will sort it out!.<p />Should Technorati be able to parse single quotes around a anchor as well as double quotes?<p />ps My application is fixed now too.<p /><table class="TechnoratiHead TagHeader">
<tr><td>Related Tags</td></tr>
<tr class="Technorati"><td>
<a href="https://paul.kinlan.me/tags/Tag" class="Tag" rel="tag">Tag</a> <a href="https://paul.kinlan.me/tags/Technorati" class="Tag" rel="tag">Technorati</a> <a href="https://paul.kinlan.me/tags/Ajax" class="Tag" rel="tag">Ajax</a> <a href="https://paul.kinlan.me/tags/Logs" class="Tag" rel="tag">Logs</a> <a href="https://paul.kinlan.me/tags/Blogs" class="Tag" rel="tag">Blogs</a> <a href="https://paul.kinlan.me/tags/Html" class="Tag" rel="tag">Html</a>
</td></tr>
</table>

