---
slug: webmessaging-is-broken
date: 2011-06-21
 
title: WebMessaging is broken
published: true
---
<p>I have been working on a rather cool project recently that initially used a
lot of <a href="http://www.w3.org/TR/webmessaging/">WebMessaging</a> (postMessage etc)
to talk between all the components.  However, even though these API's look
simple and easy to grok there are some bizaare limitations and usage of them
is frustrating to say the least.</p>

<p>Ignoring the fact that Chrome passes structured clones, and Firefox passes
strings, that is a simple difference to resolve.  It is not even the fact
that WebKit supports MessageChannels and Entangled Ports and no one else
seems too.  These we can work around in sane ways.</p>

<p>The normal developers flow is as follows: open a window/iframe, get a
reference to that window, send it a message, have the frame or window handle
the message.</p>

<p>Client App:</p>

<div class="CodeRay">
  <div class="code"><pre>var w = window.open(&quot;test.html&quot;);
w.postMessage({ data: &quot;some more data&quot;}, &quot;*&quot;);</pre></div>
</div>


<p>Service App: test.html</p>

<div class="CodeRay">
  <div class="code"><pre>window.addEventListener(&quot;message&quot;, function(e) {
  // Do something with the data
}, false);</pre></div>
</div>


<p>This would be pretty simple and intuitive, something that nearly every
developer would be able to pick up in an instant.  But this isn't the case,
if you want to send a window a message you have to wait for it to load &ndash;
which might be a logical assumption, but given that if the page you are
opening is outside the origin of the opener, you can't easily tell when it
loads.  So the current solution is on the host page to postMessage back to
the window.opener, and for the opener to handle the message.</p>

<p>Client App:</p>

<div class="CodeRay">
  <div class="code"><pre>var w = window.open(&quot;test.html&quot;);
window.addEventListener(&quot;message&quot;, function(e) {
    if(e.data.state &amp;&amp; e.data.state != &quot;ready&quot;) return; // do nothing.
    // Send data
    e.source.postMessage({ data: &quot;some more data&quot;}, e.origin);
}, false);</pre></div>
</div>


<p>Service App: test.html</p>

<div class="CodeRay">
  <div class="code"><pre>window.addEventListener(&quot;load&quot;, function(e) {
    // tell the opener that it is ready to receive messages
    e.source.postMessage({ state: &quot;ready&quot; }, e.origin);
}, false);

window.addEventListener(&quot;message&quot;, function(e) {
    // Process data from opening window.
}, false);</pre></div>
</div>


<p>This is bonkers! Developers just want it to work.</p>

<p>There is a hack that allows you pass data to a window so that it is
available to the window as soon as the script starts executing.  It is
probably not safe nor is it likely to be secure.  When you open a window,
you can pass it data immediately using the name parameter on window.open()</p>

<div class="CodeRay">
  <div class="code"><pre>window.open(&quot;test.html&quot;, &quot;{ data: 'ABC123' }&quot;);</pre></div>
</div>


<p>And then on the opening page, you can read it back.</p>

<div class="CodeRay">
  <div class="code"><pre>var data = JSON.parse(window.name);</pre></div>
</div>


<p>There are problems here though:</p>

<ul>
<li> We have no real proof of where the data came from, we can check
window.opener but that is not enough</li>
<li> We have to ensure that the window.name is cleared down as soon as we
parse it, because it will be available for the life time of the application.</li>
</ul>


<p>This is a quick hack, that allows the opened window to read the data that
was passed to it as soon as it opened.</p>

<p>What are your thoughts?  Have you come across these limitations?  Have you
solved them in any other interesting ways?</p>

