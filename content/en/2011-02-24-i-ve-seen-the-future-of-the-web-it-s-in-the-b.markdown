---
slug: i-ve-seen-the-future-of-the-web-it-s-in-the-b
date: 2011-02-24
 
title: I've seen the future of the web. It's in the background
published: true
---
<p>*
<em>I will caveat this whole post with the a hefty disclaimer that this only
works on the Dev Channel of Chrome and could change significantly over
time.</em></p>

<p>Chrome introduced the notion of background pages to packaged apps and
extensions. Background pages allow the app or extension to run without a UI
surface &ndash; this is pretty cool because it allows for some really great
use-cases that you don't get with plain web applications; for example you
can poll Twitter for updates that mention you and receive an alert via a
Desktop Notification about the update.</p>

<p>Web-apps hosted on the open web have not had this ability, until now.</p>

<p>Chrome has recently brought this idea to the web with some added powers.
 Mainly:</p>

<ul>
<li>Your web app can still run even when your app is closed,</li>
<li>Your web app can still run when the browser is closed,</li>
<li>Your web app can run after system start-up.</li>
</ul>


<p>This is very powerful.</p>

<p>Actually let me re-phrase that.  This is amazingly, unbelievably, stonkingly
powerful. [definition: <a href="http://www.urbandictionary.com/define.php?term=stonking">stonking</a>]</p>

<p>So, how do you use them?</p>

<p>The good thing is it is really simple &ndash; a matter of two steps.</p>

<p>Step 1, this is currently only available to apps &ndash; not web sites.  Apps in
Chrome are defined using a manifest file.  You as the developer must include
a permission &ldquo;background&rdquo; to enable this feature.  More on the permissions
model can be found on <a href="http://code.google.com/chrome/extensions/manifest.html#permissions">code.google.com</a>.</p>

<div class="CodeRay">
  <div class="code"><pre>{
  <span class="ke"><span class="dl">&quot;</span><span class="k">name</span><span class="dl">&quot;</span></span> : <span class="s"><span class="dl">&quot;</span><span class="k">test</span><span class="dl">&quot;</span></span>,
  <span class="ke"><span class="dl">&quot;</span><span class="k">version</span><span class="dl">&quot;</span></span> : <span class="s"><span class="dl">&quot;</span><span class="k">0.0.0.1</span><span class="dl">&quot;</span></span>,
  <span class="ke"><span class="dl">&quot;</span><span class="k">permissions</span><span class="dl">&quot;</span></span> : [<span class="s"><span class="dl">&quot;</span><span class="k">background</span><span class="dl">&quot;</span></span>],
  <span class="ke"><span class="dl">&quot;</span><span class="k">app</span><span class="dl">&quot;</span></span> : {
    <span class="ke"><span class="dl">&quot;</span><span class="k">launch</span><span class="dl">&quot;</span></span> : {
      <span class="ke"><span class="dl">&quot;</span><span class="k">urls</span><span class="dl">&quot;</span></span> : [<span class="s"><span class="dl">&quot;</span><span class="k">http://appmator.appspot.com/</span><span class="dl">&quot;</span></span>],
      <span class="ke"><span class="dl">&quot;</span><span class="k">web_url</span><span class="dl">&quot;</span></span> : <span class="s"><span class="dl">&quot;</span><span class="k">http://appmator.appspot.com/</span><span class="dl">&quot;</span></span>
    }
  }
}</pre></div>
</div>


<p>Step 2, a little bit of JavaScript magic&hellip;. actually, it is not magic, it
is a simple call to window.open().</p>

<div class="CodeRay">
  <div class="code"><pre>win = window.open(<span class="s"><span class="dl">&quot;</span><span class="k">background.html#</span><span class="dl">&quot;</span></span>, <span class="s"><span class="dl">&quot;</span><span class="k">background</span><span class="dl">&quot;</span></span>, <span class="s"><span class="dl">&quot;</span><span class="k">background</span><span class="dl">&quot;</span></span>);</pre></div>
</div>


<p>The detail is in the 3rd parameter which is reserved for specs.  When Chrome
is running with the &ldquo;background&rdquo; permission it will launch this page with no
visible surface and track it in perpetuity.</p>

<p>By using window.open, it means that users and developers can toggle the
state of the background running task by simply calling window.close, which
will cause it to stop running.  This also means that requesting window.open
without a url, but with the background name will return a reference to the
running window that can then be closed.</p>

<p>You can only open a url that is specified in the domain of the &ldquo;urls&rdquo;
extents in the manifest &ndash; so for example you couldn't open a background page
to google.com if you didn't verify you own that domain.</p>

<p>Now your app can run in the background.  It will start up when the user logs
into their machine, it will still be running when the user closes the
visible browser (if you completely kill</p>

<p>POP QUIZ:  How can my background page talk to my app pages?</p>

<p>&hellip;</p>

<p>&hellip;</p>

<p>&hellip;</p>

<p>ANSWER: <em>SharedWorkers</em> my hairy friend.  Don't use references to windows,
that is so 2005.</p>

<p>In other exciting news, <a href="http://appmator.appspot.com/">Appmator</a> has been
modified to support the &ldquo;background&rdquo; permission.</p>

