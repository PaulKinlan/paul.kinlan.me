---
slug: the-skinny-on-leviroute-js-routing-framework
date: 2011-04-02
 
title: The skinny on LeviRoute JS routing framework
published: true
---
<p>If you follow me on Twitter &ndash; @<a href="http://twitter.com/paul_kinlan">Paul_Kinlan</a>
&ndash; you will know I yap on a lot about many of my projects on Github.  This
post is no exception, I want to introduce <a href="https://github.com/PaulKinlan/leviroutes">LeviRoutes</a>, a client-side JS routing
framework that is loosely based on a Rails like approach to URL handling.</p>

<p>There are plenty of frameworks that do this already so why did you create
this? I hear you ask.  Well it is pretty simple. I wanted a framework that
would:
 *  execute specific methods when the URL changed and matched a certain
pattern;
 *  is quick and easy to use;
 *  listened for changes in the URL fragment;
 *  worked with HTML5 History APIs;
 *  worked on browsers that don't support any of these features;
 *  and most importantly doesn't try to do anything else.</p>

<p>Thus LeviRoutes was born.  It came about because I am working on a project
that uses NodeJS with the Express framework, and the URL handling is very
simple to access and I wanted to replicate this behavior in the browser, not
just the server.  My ultimate goal is for me to be able to share a lot of
the logic that is on the server with the client and thus cut down the amount
of code that I need to do.</p>

<p>The LeviRoutes project started with juat the ability to listen to changes in
the HTML5 History by listening to the 'onpopstate' event.  When there is a
'pop', the matching code is invoked with the current window.location object.
 It later included a onhashchange event listener to listen to changes in
the fragment and finally included a listener for the onload event.  By
listening to these three events.</p>

<p>Lets have a look at the simplest app that we can build with this.</p>

<div class="CodeRay">
  <div class="code"><pre><span class="kw">var</span> app = <span class="kw">new</span> routes();
app.get(<span class="s"><span class="dl">&quot;</span><span class="k">/</span><span class="dl">&quot;</span></span>, <span class="kw">function</span>(req) { alert(<span class="s"><span class="dl">&quot;</span><span class="k">On /</span><span class="dl">&quot;</span></span>); });</pre></div>
</div>


<p>Pretty simple right!  Under the hood, the system is listening for when the
URL is just '/' and nothing more, if your URL was '/index.html' the code
would not be executed.  If you wanted to watch for when the URL is
'/index.html' you would need a route with that as the exact string.</p>

<p>Looking for just the root directory by itself is not very interesting, and
neither are simple static URL's.  Thus the named parameters from Rails and
other frameworks is built straight in, and this is the most interesting
part.</p>

<p>It also supports named parameters for route syntax:</p>

<div class="CodeRay">
  <div class="code"><pre>!#javascript
app.get(&quot;/:category&quot;, function(req) { alert(&quot;In &quot; + req.params.category); });
app.get(&quot;/:category.:format&quot;, function(req) { alert(&quot;format: &quot; + req.params.format); });</pre></div>
</div>


<p>This is simple, yet powerful, LeviRoutes allows you to treat the URL as an
input event to your controller, or as the controller.</p>

<p>Have a play, let me know what you think, and look out for my next post about
<a href="https://github.com/PaulKinlan/formfactor">FormFactorJS</a>.</p>

