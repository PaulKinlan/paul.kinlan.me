---
slug: an-api-to-detect-if-a-chrome-extension-has-up
date: 2010-12-15
 
title: An API to detect if a Chrome Extension has updated
published: true
---
<p>As you might have been able to tell from my previous posts, I am a bit of a
nut when it comes to the <a href="http://code.google.com/chrome/extensions/management.html">Management API</a> in the Chrome
Extension framework.</p>

<p>I got asked a question recently about detecting if a Chrome Extension has
been updated.  The good news is that there is an API for that.  The bad news
is that I told a little fib: there isn&rsquo;t actually a specific API for
detecting if an Extension/App had been updated.</p>

<p>Lets get back on to the Good News, you can detect if an Extension/App has
been updated by listening to the <a href="http://code.google.com/chrome/extensions/management.html#event-onInstalled">onInstalled</a>
event triggered by Chrome.  Every time an extension is installed (or
updated) this event gets fired.</p>

<p>The important thing to remember is that it doesn&rsquo;t tell you directly if the
installation was an update, so the thing that you need to do is first get a
list of all the extensions installed by the user and then track the version
number in onInstalled.</p>

<p>Here is a neat little sample of it in action:</p>

<div class="CodeRay">
  <div class="code"><pre><span class="comment">/*
    Track all the version numbers (background.html) 
    in your background page
*/</span>
<span class="keyword">var</span> extensions = {};
<span class="keyword">var</span> <span class="function">getAllCallback</span> = <span class="keyword">function</span>(exts) {
  <span class="keyword">for</span>(<span class="keyword">var</span> i <span class="keyword">in</span> exts) {
    <span class="keyword">var</span> ext = exts[i];
    extensions[ext.id] = ext; <span class="comment">// store a reference to the app</span>
  }
};

chrome.management.getAll(getAllCallback);</pre></div>
</div>


<p>Now that we have a list of the apps, we can listen for installatons.  In the
handler, we are only going notify they user if the extension/app is not new
and the version has changed.  An extension is not new if we already know
about it.</p>

<div class="CodeRay">
  <div class="code"><pre><span class="keyword">var</span> <span class="function">onInstall</span> = <span class="keyword">function</span>(ext) {
  <span class="keyword">var</span> id = ext.id;

  <span class="keyword">if</span>(extensions[id] &amp;&amp; extensions[id].version != ext.version) {
    chrome.browserAction.setBadgeText({<span class="key"><span class="delimiter">&quot;</span><span class="content">text</span><span class="delimiter">&quot;</span></span> :<span class="string"><span class="delimiter">&quot;</span><span class="content">New</span><span class="delimiter">&quot;</span></span> }); <span class="comment">// tell the user  </span>
    extensions[id] = ext; <span class="comment">// track the extension</span>
  }
};</pre></div>
</div>


<p>Cool.</p>

