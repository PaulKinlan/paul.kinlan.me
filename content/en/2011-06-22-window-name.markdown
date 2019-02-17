---
slug: window-name
date: 2011-06-22
 
title: window.name
published: true
---
<p>I have learnt a lot of the last couple of days about inter-window and
inter-iframe communication.  I documented <a href="/webmessaging-is-broken">some of my frustrations</a> about Web Messaging API&rsquo;s and
an attempted work around.</p>

<p>For you to be able to pass data into a window (that isn&rsquo;t on your domain) so
that it is available before the onload event fires in the opened window, the
only sane way I have found is to set the window name via window.open.</p>

<p>Client:</p>

<div class="CodeRay">
  <div class="code"><pre>var w = window.open(&quot;list.html&quot;, &quot;some data&quot;);</pre></div>
</div>


<p>Service:</p>

<div class="CodeRay">
  <div class="code"><pre>window.onload = function () {  alert(window.name); };</pre></div>
</div>


<p>Now that we can pass data between the windows, you can quickly imagine that
you stringify a JSON object on open and parse it in the opened window.
 Pretty simple.</p>

<p>The good news is that the work-around works in FF, WebKit and Opera as is,
but not IE.</p>

<p>To get it working with IE, it takes a few of hacks so I thought it best to
document them here.</p>

<p>When you open a window via window.open, the second parameter is the name, in
IE it must only contain [A-Za-z0-9_], this means that you have to base64
encode the JSON object for it to be able to be sent across, but that is not
enough because Base64 encoding can only use certain characters.  Base64 will
also likely include an == at the end, which is not an allowed character.</p>

<p>However, IE doesn&rsquo;t include a btoa and atob function for managing base64, so
you will also need to <a href="http://www.stringify.com/static/js/base64.js">find a library to use</a>.</p>

<p>To encode the data I used the following:</p>

<div class="CodeRay">
  <div class="code"><pre>var winname = window.btoa(
  unescape(
    encodeURIComponent(JSON.stringify(obj))
  )).replace(/=/g, &quot;_&quot;)
var w = window.open(e.target.href, winname);</pre></div>
</div>


<p>To decode the data I used the following:</p>

<div class="CodeRay">
  <div class="code"><pre>var obj = JSON.parse(window.atob(window.name.replace(/_/g, &quot;=&quot;)));</pre></div>
</div>


<p>Pretty hacky, but it seems to work.</p>

<p>As always, if anyone has a better suggestion, or there are any obvious flaws
let me know.</p>

