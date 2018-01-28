---
slug: re-call-to-action-the-demise-of-css-hacks-and
date: 2005-10-12
 
title: "RE: Call to action: The demise of CSS hacks and broken pages"
published: true
---
There is an interesting post over on MSDN Blogs (IEBlog) by the <a href="blogs.msdn.com/ie" title="IE Team Blog">IE Team</a>.  It discusses that some of the CSS hacks that people have used  to get around some of the issues with IE5 and IE6, wont work in IE7.  They appear to be breaking changes so many peoples web pages will have to be changed to get the system working correctly.  If you are a web developer and expect to target IE7, then I would recomend that you take a quick look to see if you are affected by the changes.<p />Here is a quick snippet of the IETeams <a href="http://blogs.msdn.com/ie/archive/2005/10/12/480242.aspx" title="IE Teams blog Entry">Blog Entry</a>.<p /><blockquote>
<p>Weâ€™re starting to see the first round of sites and pages breaking due to the CSS fixes we have made. We would like to ask your help in cleaning up existing CSS hacks in your pages for IE7. It is has been our policy since IE6 that under quirks <a href="http://msdn.microsoft.com/library/default.asp?url=/workshop/author/dhtml/reference/objects/doctype.asp">doctype</a> we will not make any behavioral changes<b><i> </i></b>so that<b><i> </i></b>existing pages will continue to render unmodified, but under the strict doctype we want to change behavior to be as compliant as possible with the web standards. For IE7, we introduced new CSS functionality (see Chris's <a href="https://blogs.msdn.com:443/ie/archive/2005/07/29/445242.aspx">blog</a> post for the full list) and cleaned up our <a href="https://blogs.msdn.com:443/ie/archive/2005/09/02/460115.aspx">parser bugs</a>. This leads now to several CSS hacks failing. If you are using IE7 (you are MSDN subscriber or received a copy at the PDC) you may notice major sites breaking due to the use of CSS hacks and the strict doctype.  </p>
<br /><p><b>Example how easy it is to fall into the CSS hack trap</b></p>
<br /><p>I was very happy to hear that Slashdot has their <a href="http://slashdot.org/article.pl?sid=05/09/22/1324207&amp;from=rss">page rewritten</a> using clean HTML 4.01 with a full complement of CSS. I immediately opened up IE7 to see how it would look like. It looked very good, but I noticed an odd behavior with their search box being moved into the footer of their page. I opened up the <a href="https://blogs.msdn.com:443/ie/archive/2005/09/16/469686.aspx">IE dev toolbar</a> started to take a look, and found:</p>
<p>...</p>
<br /><p><b>Call to action: Please check your pages</b></p>
<br /><p>Here is a list of common CSS hacks to look out for (please also consider their variations):</p>
<br /><ul></ul>
<br /><li>html &gt; body - <a href="http://css-discuss.incutio.com/?page=ChildHack">http://css-discuss.incutio.com/?page=ChildHack</a> <br />
</li>
<li>* html - <a href="http://css-discuss.incutio.com/?page=StarHtmlHack">http://css-discuss.incutio.com/?page=StarHtmlHack</a> <br />
</li>
<li>head:first-child + body - <a href="http://centricle.com/ref/css/filters/tests/owen/">http://centricle.com/ref/css/filters/tests/owen/</a> <br />
</li>
<li>head + body - <a href="http://www.dithered.com/css_filters/css_only/head_adjacent_sibling_body.html">http://www.dithered.com/css_filters/css_only/ head_adjacent_sibling_body.html</a> <br />
</li>
<li>body &gt; element - <a href="http://css-discuss.incutio.com/?page=ChildHack">http://css-discuss.incutio.com/?page=ChildHack</a> </li>
<br /><p>We ask that you please update your pages to not use these CSS hacks. If you want to target IE or bypass IE, you can use <a href="http://msdn.microsoft.com/library/default.asp?url=/workshop/author/dhtml/overview/ccomment_ovw.asp">conditional comments</a> .</p>
<br /><p>...</p>
<br /><p>I would prefer a CSS solution too but currently there isn't one in the CSS standard.  Please help us spread the word so it is an easier decision for us in the future to make improvements to our standards implementation (even if it means breaking customers).  </p>
<br /><p>Thanks,</p>
<br /><p> - Markus Mielke</p>
[[posterous-content:iDtIjpfJjetjmyfyunHc]]
</blockquote><br /><i>[Via <a href="http://blogs.msdn.com/ie/archive/2005/10/12/480242.aspx">MSDN Blogs</a>]</i>

