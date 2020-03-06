---
slug: dom-treewalker
date: 2010-08-08
title: DOM TreeWalker
published: true
---
I really wanted to get a reference to Walker Texas Ranger in to the title, but I really couldn't think of anything that cool.  If you can think of a great Chuck Norris reference leave a comment, I am all chins!

It always amazes me that there is so much to HTML that is still not being exploited by developers.

One pattern I see regularly is recursive descent through the DOM to find particular TEXT nodes that contain a given string so that the container element can be manipulated.

It is not that recursion is slow, if your DOM is complex enough you could hit stack overflow errors (although it is pretty unlikely), it is that there are a lot of edge cases when parsing the DOM that you need to code in.

A little known DOM function is available that makes developing applications that need to scan the DOM easy.  It is called Tree Walker, created through the createTreeWalker function on the document.

You can create a tree walker very quickly using the following JavaScript:

```JavaScript
document.createTreeWalker(document.body, NODE_FILTER.SHOW_TEXT, function(node) { return NodeFilter.FILTER_ACCEPT; }, false);

while (treeWalker.nextNode()) console.log(treeWalker.currentNode);
```

The above code is given a root node of document.body, a filter of what to show (only Text Nodes in our case), and a function that returns if the node should be returned (essentially a filter).

An interesting point to note is that the Filter function is only called when iterating over the treeWalker.

This is actually a really cool feature, the currentNode property of the Tree Walker contains DOM objects, so you can start to do some really advanced processing, you could highlight the current node, replace its text or remove it &ndash; really anything you want.  This is significantly simpler than managing the recursion yourself.

As a more concrete example, lets use this to find all twitter user names on a page and then automatically make these a twitter link. It could be done using recursion pretty simply, but I need something fun to show you.

```JavaScript
var re = new RegExp(); // This isn't accurate RE
re.compile('@([A-Za-z0-9_]*)');
var walker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_TEXT,
  function(node) {
    var matches = node.textContent.match(re);

    if (matches) {
      return NodeFilter.FILTER_ACCEPT;
    } else {
      return NodeFilter.FILTER_SKIP;
    }
  },
  false);

var nodes = [];

while (walker.nextNode()) {
  nodes.push(walker.currentNode);
}

for(var i = 0; node=nodes[i] ; i++) {
  node.parentNode.innerHTML = node.parentNode.innerHTML.replace(re, '@$1') }
```


<a href="http://html5samples.appspot.com/treewalker.html">A live example is on my sample site</a>

The theory is, that User-Agents can optimize the access to the DOM better than you can recursively descend through the DOM.  So, where would I use this?  The first thing that springs to mind is that it is ideal for Chrome extensions.  Many Chrome extensions traverse the DOM looking for pieces of text, or particular patterns inside nodes that aren&rsquo;t available via CSS Selectors.

More information can be found on <a href="https://developer.mozilla.org/en/DOM/document.createTreeWalker">Mozilla's Developer site</a>

