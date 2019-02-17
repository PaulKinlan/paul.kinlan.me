---
slug: js-quickly-removing-an-arbitrary-element-from
date: 2010-11-28
 
title: "JS: quickly removing an arbitrary element from an Array"
published: true
---
<p>Unless I am mistaken (and I could be), Arrays in JavaScript have no direct
way to delete an arbitrary element.  I had a little problem where I knew the
index of the item I want to remove, there was no easy way to do this.  I
can&rsquo;t just say &ldquo;array.remove(5)&rdquo;.</p>

<p>A way that I have seen some people use get around this problem is to use
Array.prototype.join to push the contents into a string, then do a string
replace on an element value and then String.split to produce the array with
the element removed.  It is a bit of a hack.  Heck, it is a lot of a hack!</p>

<p>If your browser supports parts of ECMA Script 5, then Array object now has
some extra methods for you to use, including filter().  Filter allows you to
specify a function that is called for every item in the list, and for that
value you can say if you want it in the result set.  So it is ideal to solve
the problem of removing an element from the list if you know it&rsquo;s value.</p>

<div class="CodeRay">
  <div class="code"><pre><span class="keyword">var</span> valToRemove = <span class="string"><span class="delimiter">&quot;</span><span class="content">hello</span><span class="delimiter">&quot;</span></span>;
<span class="keyword">var</span> values = [<span class="string"><span class="delimiter">&quot;</span><span class="content">Ah</span><span class="delimiter">&quot;</span></span>, <span class="string"><span class="delimiter">&quot;</span><span class="content">hello</span><span class="delimiter">&quot;</span></span>, <span class="string"><span class="delimiter">&quot;</span><span class="content">world</span><span class="delimiter">&quot;</span></span>];
values = values.filter(<span class="keyword">function</span>(i) {
  <span class="keyword">if</span>(i != valToRemove) <span class="keyword">return</span> <span class="predefined-constant">true</span>;
  <span class="keyword">else</span> <span class="keyword">return</span> <span class="predefined-constant">false</span>;
  });</pre></div>
</div>


<p>Pretty easy, and quick given a small array.  Obviously, this little piece of
code will remove every element from the list with the value I am looking for
&ndash; but this is ok for my code.</p>

<p>Still, there isn&rsquo;t an easy way to remove the nth element from a list unless
you shift or pop your way through the array.  But that is another story.</p>

