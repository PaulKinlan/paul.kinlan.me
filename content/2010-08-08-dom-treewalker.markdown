---
slug: dom-treewalker
date: 2010-08-08
title: DOM TreeWalker
published: true
---
<p>I really wanted to get a reference to Walker Texas Ranger in to the title, but I really couldn&rsquo;t think of anything that cool.  If you can think of a great Chuck Norris reference leave a comment, I am all chins!</p>

<p>It always amazes me that there is so much to HTML that is still not being exploited by developers.</p>

<p>One pattern I see regularly is recursive descent through the DOM to find particular TEXT nodes that contain a given string so that the container element can be manipulated.</p>

<p>It is not that recursion is slow, if your DOM is complex enough you could hit stack overflow errors (although it is pretty unlikely), it is that there are a lot of edge cases when parsing the DOM that you need to code in.</p>

<p>A little known DOM function is available that makes developing applications that need to scan the DOM easy.  It is called Tree Walker, created through the createTreeWalker function on the document.</p>

<p>You can create a tree walker very quickly using the following JavaScript:</p>

<div class="CodeRay">
  <div class="code"><pre>document.createTreeWalker(document.body, NODE_FILTER.SHOW_TEXT, <span class="keyword">function</span>(node) { <span class="keyword">return</span> NodeFilter.FILTER_ACCEPT; }, <span class="predefined-constant">false</span>);

<span class="keyword">while</span>(treeWalker.nextNode()) console.log(treeWalker.currentNode);</pre></div>
</div>


<p>The above code is given a root node of document.body, a filter of what to show (only Text Nodes in our case), and a function that returns if the node should be returned (essentially a filter).</p>

<p>An interesting point to note is that the Filter function is only called when iterating over the treeWalker.</p>

<p>This is actually a really cool feature, the currentNode property of the Tree Walker contains DOM objects, so you can start to do some really advanced processing, you could highlight the current node, replace its text or remove it &ndash; really anything you want.  This is significantly simpler than managing the recursion yourself.</p>

<p>As a more concrete example, lets use this to find all twitter user names on a page and then automatically make these a twitter link. It could be done using recursion pretty simply, but I need something fun to show you.</p>

<div class="CodeRay">
  <div class="code"><pre><span class="keyword">var</span> re = <span class="keyword">new</span> RegExp(); <span class="comment">// This isn't accurate RE</span>
re.compile(<span class="string"><span class="delimiter">&quot;</span><span class="content">@([A-Za-z0-9_]*)</span><span class="delimiter">&quot;</span></span>);
<span class="keyword">var</span> walker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_TEXT,
  <span class="keyword">function</span>(node) {
    <span class="keyword">var</span> matches = node.textContent.match(re);

    <span class="keyword">if</span>(matches) { 
      <span class="keyword">return</span> NodeFilter.FILTER_ACCEPT;
    } <span class="keyword">else</span> {
      <span class="keyword">return</span> NodeFilter.FILTER_SKIP;
    }
  },
  <span class="predefined-constant">false</span>);

<span class="keyword">var</span> nodes = [];

<span class="keyword">while</span>(walker.nextNode()) {
  nodes.push(walker.currentNode);
}

<span class="keyword">for</span>(<span class="keyword">var</span> i = <span class="integer">0</span>; node=nodes[i] ; i++) {
  node.parentNode.innerHTML = node.parentNode.innerHTML.replace(re, <span class="string"><span class="delimiter">&quot;</span><span class="content">@<a href="http://twitter.com/$1">$1</a></span><span class="delimiter">&quot;</span></span>) }</pre></div>
</div>


<p><a href="http://html5samples.appspot.com/treewalker.html">A live example is on my sample site</a></p>

<p>The theory is, that User-Agents can optimize the access to the DOM better than you can recursively descend through the DOM.  So, where would I use this?  The first thing that springs to mind is that it is ideal for Chrome extensions.  Many Chrome extensions traverse the DOM looking for pieces of text, or particular patterns inside nodes that aren&rsquo;t available via CSS Selectors.</p>

<p>More information can be found on <a href="https://developer.mozilla.org/en/DOM/document.createTreeWalker">Mozilla&rsquo;s Developer site</a></p>

