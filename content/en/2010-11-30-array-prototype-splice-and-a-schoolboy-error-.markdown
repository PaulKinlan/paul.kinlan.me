---
slug: array-prototype-splice-and-a-schoolboy-error-
date: 2010-11-30
 
title: Array.prototype.splice and a schoolboy error.
published: true
---
<p>The other day I <a href="/js-quickly-removing-an-arbitrary-element-from">posted</a> about
there being no &ldquo;delete an arbitrary element&rdquo; method on Array in Javascrip.
 The problem being that I tried the solution I am about to present, but made
the biggest School Boy Error possible &ndash; I didn't read the documentation
correctly!</p>

<p>Whilst I maintain that my solution removes the need to first find the
elements, and then delete them (which is better ;).  It must be noted that
Array.prototype.splice allows you to remove arbitrary elements if you know
the index and the number of elements you want to remove.</p>

<p>Anyway, here goes, to remove 1 element from an Array from an arbitrary
position:</p>

<div class="CodeRay">
  <div class="code"><pre><span class="keyword">var</span> values = [<span class="string"><span class="delimiter">&quot;</span><span class="content">Ah</span><span class="delimiter">&quot;</span></span>, <span class="string"><span class="delimiter">&quot;</span><span class="content">hello</span><span class="delimiter">&quot;</span></span>, <span class="string"><span class="delimiter">&quot;</span><span class="content">world</span><span class="delimiter">&quot;</span></span>];
<span class="keyword">var</span> result = values.splice(<span class="integer">1</span>,<span class="integer">1</span>);
console.log(values);
console.log(result);</pre></div>
</div>


<p>This removes the &ldquo;hello&rdquo; from the values array in place and returns the
elements removed.  The result is values = [&ldquo;Ah&rdquo;, &ldquo;world&rdquo;] and result =
[&ldquo;hello&rdquo;]</p>

<p>Thanks to @<a href="http://www.twitter.com/dezfowler">dezfowler</a></p>

