---
slug: js-classlist-yipee-
date: 2010-12-06
 
title: "JS: classList, yipee!"
published: true
---
<p>I remember the first time I used jQuery and probably the biggest
thing that impressed me (by the way I am pretty much a nerd++) was not the
compress syntax, the ability to do XHR, or live events (ok, live events came
a lot later, and I used them all over the place on <a href="http://www.frienddeck.com">http://www.frienddeck.com</a>)
it was the ability to quickly manipulate the class attribute.</p>

<p>For a long time I have been using the class attribute to hold state, but
also naturally to providing styling.  I had my own routines to parse and
manipulate the class attribute.  However,  it never felt natural &ndash; I don't
know why, it just didn't.  Then in jQuery this all came as standard &ndash; we now
had the ability to &ldquo;toggle&rdquo; a class (my routines never had this&hellip;.. not
sure how I missed it to be honest) using simple semantics.</p>

<p>Put simply. <em>Sweet</em>!</p>

<p>Now, there is an <a href="https://developer.mozilla.org/en/DOM/element.classList">API built into the browser</a> to help developers
interact with the &ldquo;class&rdquo; attribute.  The API provides a lot of what I saw
in jQuery &ndash; toggle (to turn a class on or off), add and remove, and
&ldquo;contains&rdquo; to check the presence of a class in a classList. Its an awesome
practical example of the standards bodies (or spec writers) listening to and
recognising the needs of Developers.</p>

<p><em>What is a classList?</em></p>

<p>Under the hood it is a specialised collection provided by the DOM called
<a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/urls.html#domtokenlist-0">DOMTokenList</a>.
 With this interface you can manipulate the class attribute without having
to resort to yucky string manipulation.</p>

<p><em>Examples?</em>
It is a pretty simple API, so it should be straight forward &ndash; however here
goes:</p>

<p>Adding a class:</p>

<div class="CodeRay">
  <div class="code"><pre><span class="keyword">var</span> element = document.getElementById(<span class="string"><span class="delimiter">&quot;</span><span class="content">test</span><span class="delimiter">&quot;</span></span>);
element.classList.add(<span class="string"><span class="delimiter">&quot;</span><span class="content">hello</span><span class="delimiter">&quot;</span></span>);</pre></div>
</div>


<p>Removing a class:</p>

<div class="CodeRay">
  <div class="code"><pre><span class="keyword">var</span> element = document.getElementById(<span class="string"><span class="delimiter">&quot;</span><span class="content">test</span><span class="delimiter">&quot;</span></span>);
element.classList.remove(<span class="string"><span class="delimiter">&quot;</span><span class="content">hello</span><span class="delimiter">&quot;</span></span>);</pre></div>
</div>


<p>Toggling a class.  If the class is on the element, it will be removed.  If
it is not, it will be added:</p>

<div class="CodeRay">
  <div class="code"><pre><span class="keyword">var</span> element = document.getElementById(<span class="string"><span class="delimiter">&quot;</span><span class="content">test</span><span class="delimiter">&quot;</span></span>);
element.classList.toggle(<span class="string"><span class="delimiter">&quot;</span><span class="content">hello</span><span class="delimiter">&quot;</span></span>);</pre></div>
</div>


<p>Checking for presence a class:</p>

<div class="CodeRay">
  <div class="code"><pre><span class="keyword">var</span> element = document.getElementById(<span class="string"><span class="delimiter">&quot;</span><span class="content">test</span><span class="delimiter">&quot;</span></span>);
<span class="keyword">if</span>(element.classList.contains(<span class="string"><span class="delimiter">&quot;</span><span class="content">hello</span><span class="delimiter">&quot;</span></span>)) { ... }</pre></div>
</div>


<p>I have a better demo that I will blog about in a couple of days.</p>

<p><em>Browser support?</em></p>

<p>Well at the moment, Firefox 3.6+ and Chrome 7+.  (Not sure about Opera )</p>

<p><em>Is this Awesome?</em></p>

<p>Yes!</p>

