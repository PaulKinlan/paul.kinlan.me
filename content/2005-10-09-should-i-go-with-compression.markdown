---
slug: should-i-go-with-compression
date: 2005-10-09
 
title: Should I go with compression
published: true
---
I am debating if I should go with compression of the Yahoo Search Results from my proxy following this post [<a href="http://developer.yahoo.net/blog/archives/2005/10/getting_less_fr.html#comments">Yahoo Developer Blog Entry</a>].  I am trying to work out if it will be A) easy, B) worth it and C) Where to put it.<p />I could compress the results back to the client or compress the results to the proxy and then decompress the results to the client.  Either way I will have to code for some fallback support, because some people who use my App might not have compression support in their browser and thus my proxy will have to detect that.<p />Does anyone have any thoughts?<p /><table class="TechnoratiHead TagHeader">
<tr><td>Related Tags</td></tr>
<tr class="Technorati"><td>
<a href="https://paul.kinlan.me/tags/Proxy" class="Tag" rel="tag">Proxy</a> <a href="https://paul.kinlan.me/tags/Compression" class="Tag" rel="tag">Compression</a> <a href="https://paul.kinlan.me/tags/Browser" class="Tag" rel="tag">Browser</a> <a href="https://paul.kinlan.me/tags/Yahoo%20Search" class="Tag" rel="tag">Yahoo Search</a>
</td></tr>
</table>

