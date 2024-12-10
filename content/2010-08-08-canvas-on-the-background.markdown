---
date: 2010-08-08
published: true
slug: canvas-on-the-background
summary: I recently discovered a cool trick in WebKit that lets you use a canvas element
  as a background image, which opens up a ton of creative possibilities.  It's a powerful
  feature, allowing for dynamic, programmatic manipulation of background images.  I've
  included a simple demo showing how to draw a square on a div's background, but imagine
  the possibilities for games or complex animations!  While currently WebKit-specific,
  I hope other browsers will adopt it soon. More demos to follow!
tags:
- webkit
- canvas
- background
- css
- html5
- javascript
- animation
- graphics
- web development
- -webkit-canvas
title: Canvas on the Background

---


<div>
<div>I was reading the documentation about -webkit-gradient on the Apple HTML documentation site and I stumbled across something that I had never seen before. &nbsp;I thought it was so cool, that I decided to write a blog post about it.</div>
<p />
<div>With the introduction of CSS3 into many top-line browsers there is now the ability to manipulate the background-image of any element, specifically gradients and svg. &nbsp;One of the things that is missing is canvas as an element for the background.</div>
<p />
<div>In 2008! WebKit introduced(<a href="http://webkit.org/blog/176/css-canvas-drawing/" target="_blank" style="color: #406480;">http://webkit.org/blog/176/css-canvas-drawing/</a>) a CSS attribute value called -webkit-canvas(id). &nbsp;When attached to a background style allows you the developer to have programatic access to the background-image through canvas. Believe me when I say "This is Powerful".</div>
<p />
<div>I must warn that this is specific to WebKit only at the moment. &nbsp;I would love to see other browsers add this support in as it is super powerful.</div>
<p />
<div>So lets see this in action.</div>
<p />
<div>In this post I will do one simple sample (<a href="http://html5samples.appspot.com/backgroundCanvas.html" target="_blank" style="color: #406480;">http://html5samples.appspot.com/backgroundCanvas.html</a>)&nbsp;and all it will do is draw a square into the background of a div:</div>
</div>
<p />
<div>&nbsp;&nbsp;&lt;html&gt;</div>
<div>&nbsp;&nbsp; &nbsp;&lt;head&gt;</div>
<div>&nbsp;&nbsp; &nbsp; &nbsp;&lt;style&gt;</div>
<div>&nbsp;&nbsp; &nbsp; &nbsp;div {</div>
<div>&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;background: -webkit-canvas(test);</div>
<div>&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;float:left;</div>
<div>&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;width: 100;</div>
<div>&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;height: 100;</div>
<div>&nbsp;&nbsp; &nbsp; &nbsp;}</div>
<div>&nbsp;&nbsp; &nbsp; &nbsp;&lt;/style&gt;</div>
<p />
<div>&nbsp;&nbsp; &nbsp; &nbsp;&lt;script&gt;</div>
<div>&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;function onLoad() {</div>
<div>&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;var ctx = document.getCSSCanvasContext("2d","test", 100,100);</div>
<div>&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;ctx.fillStyle = "blue";</div>
<div>&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;ctx.fillRect(10,10,90,90)</div>
<div>&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;}</div>
<p />
<div>&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;(function() {</div>
<div>&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;document.addEventListener("DOMContentLoaded", onLoad);</div>
<div>&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;})();</div>
<div>&nbsp;&nbsp; &nbsp; &nbsp;&lt;/script&gt;</div>
<div>&nbsp;&nbsp; &nbsp;&lt;/head&gt;</div>
<div>&nbsp;&nbsp; &nbsp;&lt;body&gt;</div>
<div>&nbsp;&nbsp; &nbsp; &nbsp;&lt;div&gt;This is a div&lt;/div&gt;</div>
<div>&nbsp;&nbsp; &nbsp;&lt;/body&gt;</div>
<div>&nbsp;&nbsp;&lt;/html&gt;</div>
<p />
<div>
<div>Pretty cool! &nbsp;Well actually the concept is cool, that demo is pretty ugly :)&nbsp;You can do some pretty awesome demos with this. &nbsp;You could have a game or some super cool animation running in the background. I think you could get around the lack of background-opacity support in CSS3.</div>
<p />
</div>
<div>I will do some more samples soon.</div>
<p>&nbsp;</p>

