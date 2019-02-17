---
slug: webkit-appearance-your-little-known-friend
date: 2010-12-03
 
title: -webkit-appearance your little known friend
published: true
---
<p>Remember years ago, when you styled your site up just the way you wanted and
then you included a &lt; input type=&ldquo;file&rdquo;> and then everything went to pot.  You couldn&rsquo;t style it up, so you had to hide it, create your &ldquo;button&rdquo; and then simulate a click via javascript to get it to open.  Well, I say years ago, nearly every browser today still can&rsquo;t style the system provided buttons.</p>

<p>Webkit provides a bit of a &ldquo;hack&rdquo; (well, I call it a hack) that allows you to style these hidden elements through the use of special Webkit specific CSS selectors and extensions.  But back to the subject.  If you use &lt; input type=&ldquo;file&rdquo; >, how do you style the OS button?  There are two selectors you need, the first is a standard input[type=&ldquo;file&rdquo;] selector.  This allows you to change the basic appearance of the text and colours for example:</p>

<div class="CodeRay">
  <div class="code"><pre><span class="type">input</span>[<span class="attribute-name">type=&quot;file&quot;</span>] {
              <span class="key">color</span>: <span class="value">white</span>;
              <span class="key">margin</span>: <span class="float">0px</span>;
     }</pre></div>
</div>


<p>The second selector is &ldquo;::-webkit-file-upload-button&rdquo;, this gives you direct access to the OS button.  Once you are in there you can do a couple of things.  You can change its color or font.  You can also change its appearance, and what I mean by this, is that you can change it to look like something a lot different.    In the following example, I am changing the appearance to be a square button rather than the default circle button on OSX, it is a very simple and subtle change.    There are a lot of <a href="http://css-infos.net/property/-webkit-appearance">different appearances</a> an element can take; I could even make it look like a radio-button (hmm).</p>

<div class="CodeRay">
  <div class="code"><pre>:<span class="pseudo-class">:-webkit-file-upload-button</span> {
         <span class="key">-webkit-appearance</span>: <span class="value">square-button</span>;
      }</pre></div>
</div>

