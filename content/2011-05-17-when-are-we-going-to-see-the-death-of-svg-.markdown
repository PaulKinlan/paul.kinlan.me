---
slug: when-are-we-going-to-see-the-death-of-svg-
date: 2011-05-17
 
title: When are we going to see the death of SVG?
published: true
---
<p>I have this bizarre mixed feelings about SVG, I loathe it and love it at the same time (according to urban dictionary the word is <a href="http://www.urbandictionary.com/define.php?term=loave&amp;defid=4855182">loave</a>) and I hate myself for it - okay, hate is a strong word.</p>
<p />
<div>I constantly feel frustrated by its complexity, requirement for tooling (have you tried to create a path by hand) and half-arsed integration into the web of today. &nbsp;I see the &lt;svg&gt; element much like I see the &lt;object&gt; tag, that is a boundary that rarely if ever should be crossed by mere mortals, a semi-permeable barrier where only through reverse osmosis can we wrangle some of the elements in our usermode. (to be read as, we can script it and hook it up in our app but that is about it).</div>
<p />
<div>The way I see it, once you get in to &lt;svg&gt; it is like a context switch, the HTML DOM and the SVG DOM will never really truly mingle.</div>
<p />
<div>But SVG has some serious awesomeness too - for one it is scaleable, two is vector based.... can you guess the third? &nbsp;It has awesome graphical capabilities, you've seen the filters right and paths? There have been lots of project that I have worked on where I simply can't build what I want because it is not available in the "web" sans SVG. &nbsp;I want to be able to apply filters with out importing a SVG declaration, I want to be able flow elements out along a path.</div>
<p />
<div>Why can't path be a css property?</div>
<p />
<div>p {</div>
<div>&nbsp; display: svg; /* <a href="http://www.w3.org/1999/08/WD-SVG-19990812/styling.html">http://www.w3.org/1999/08/WD-SVG-19990812/styling.html</a> */</div>
<div>&nbsp; path:&nbsp;"M 100 100 L 300 100 L 200 300 z";</div>
<div>}</div>
<p />
<div>Text inside the &lt;p&gt; will be rendered along the path. &nbsp;But what if &lt;p&gt; was a block element like a &lt;div&gt;? &nbsp;Even better all elements be they block or inline will be rendered along the path...... That is powerful!</div>
<p />
<div>For me this is better than what we have now. I don't want to have to have &lt;p&gt;&lt;svg&gt;......&lt;/svg&gt;&lt;/p&gt; when I want to do something awesome that SVG lets me do, that just doesn't <em>scale.</em></div>

