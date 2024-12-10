---
date: 2010-12-03
published: true
slug: webkit-appearance-your-little-known-friend
summary: Styling file input elements has always been tricky due to browser inconsistencies.
  WebKit-based browsers offer a clever way to style these elements.  You can style
  the text and color of the file input using standard CSS. Additionally, the `::-webkit-file-upload-button`
  pseudo-element allows customization of the OS-specific button's appearance, like
  changing it from rounded to square, going beyond basic styling.
tags:
- CSS
- WebKit
- Styling
- File Input
- Web Development
- -webkit-appearance
- file upload button
- cross-browser compatibility
title: -webkit-appearance your little known friend

---
<p>Remember years ago, when you styled your site up just the way you wanted and
then you included a &lt; input type='file'> and then everything went to pot.  You couldn't style it up, so you had to hide it, create your 'button' and then simulate a click via javascript to get it to open.  Well, I say years ago, nearly every browser today still can't style the system provided buttons.</p>

Webkit provides a bit of a 'hack' (well, I call it a hack) that allows you to style these hidden elements through the use of special Webkit specific CSS selectors and extensions.  But back to the subject.  If you use &lt; input type='file' >, how do you style the OS button?  There are two selectors you need, the first is a standard input[type='file'] selector.  This allows you to change the basic appearance of the text and colours for example:

<div class="CodeRay">
  <div class="code"><pre><span class="type">input</span>[<span class="attribute-name">type=&quot;file&quot;</span>] {
              <span class="key">color</span>: <span class="value">white</span>;
              <span class="key">margin</span>: <span class="float">0px</span>;
     }</pre></div>
</div>


The second selector is `::-webkit-file-upload-button`, this gives you direct access to the OS button.  Once you are in there you can do a couple of things.  You can change its color or font.  You can also change its appearance, and what I mean by this, is that you can change it to look like something a lot different.    In the following example, I am changing the appearance to be a square button rather than the default circle button on OSX, it is a very simple and subtle change.    There are a lot of <a href="http://css-infos.net/property/-webkit-appearance">different appearances</a> an element can take; I could even make it look like a radio-button (hmm).

<div class="CodeRay">
  <div class="code"><pre>:<span class="pseudo-class">:-webkit-file-upload-button</span> {
         <span class="key">-webkit-appearance</span>: <span class="value">square-button</span>;
      }</pre></div>
</div>

