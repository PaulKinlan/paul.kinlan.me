---
slug: using-canvas-to-create-beautiful-custom-marke
date: 2010-10-14
 
title: Using Canvas to create beautiful custom markers in Google Maps
published: true
---
<p>I have been playing with <a href="http://code.google.com/apis/maps/documentation/javascript">Google
Maps</a> a
little recently and I want to dynamically create a set of Markers
without resorting to a server.  I noticed that the <a href="http://code.google.com/apis/maps/documentation/javascript/reference.html#Marker">Marker
class</a>
can take a string URL as a parameter, so it seemed to make sense that
if it was a url to an icon, it could also be a dataUri to an image
that I can control via a canvas.</p>

<p>To cut a long prologue short, it works.  More importantly I was quite
pleased with the effect I generated and this is what this post is all
about.</p>

<p>The markers that I wanted to create had to be rectangular, with
rounded corners, distinct colours and a number right in the centre.</p>

<p>The first problem was how to create rounded rounded.  I didn&rsquo;t have a
lot of time for this but I used a lot of the code from
<a href="http://js-bits.blogspot.com/2010/07/canvas-rounded-corner-rectangles.html">http://js-bits.blogspot.com/2010/07/canvas-rounded-corner-rectangles.html</a>
as inspiration.  This simply draws a nice rounded rectangle.</p>

<p>The next problem to solve is how to create a nice range of colours
that aren&rsquo;t the same but are consistent.  This is where the new
support for hsla (hue, saturation and luminance) support via CSS3
really pays off in a big way.  Using RGB there is no simple way to
find a suite of colours that have the same tone but are uniquely
distinct; with the HSL colour model if you keep the S and L values the
same but modify the hue (H) you can produce a wide spectrum of colours
that are of the same tone. <a href="/example-of-the-canvas-markers">See the Example image</a>.</p>

<p>This creates an image that is a single colour, but it doesn&rsquo;t look
amazingly nice.  I decided to add a gradient to give it one of those
effects you see all over the web at the moment (I am not sure of the
name, its not a Gel Button, but it is close&hellip;.ish).  The question is,
how do you choose a colour for the gradient?  The answer was pretty
simple in the end: use the same Hue and Saturation values as the first
colour but reduce the Luminance by a couple of percentage.  The
overall effect is pretty nice I think.</p>

<p>Centring the text was pretty simple too.  The canvas API provides a
nice little method called <em>MeasureText</em>, this allows you to get the
pixel width of any arbitrary string (using the font-size and family
you specify).  From this it is a simple case of finding the centre of
the text and the centre of the canvas and subtracting one from the
other.</p>

<p>The final problem is pretty simple to solve.  How do you get the
canvas image as a url?  canvas.toDataURL() will return an image url
that can be attached to any &ldquo;src&rdquo; or css &ldquo;url()&rdquo; property.</p>

<p>It must be noted that this will only work with browsers that can
render canvas elements.</p>

<p>The final code is follows for posterity:</p>

<div class="CodeRay">
  <div class="code"><pre><span class="keyword">var</span> ButtonFactory = (<span class="keyword">function</span>() {
<span class="error"> </span><span class="error"> </span><span class="keyword">var</span> width = <span class="integer">25</span>;
<span class="error"> </span><span class="error"> </span><span class="keyword">var</span> height = <span class="integer">25</span>;
<span class="error"> </span><span class="error"> </span><span class="keyword">return</span> <span class="keyword">new</span> <span class="keyword">function</span>() {

<span class="error"> </span><span class="error"> </span> <span class="error"> </span><span class="keyword">var</span> h = <span class="integer">1</span>;
<span class="error"> </span><span class="error"> </span> <span class="error"> </span><span class="keyword">var</span> s = <span class="integer">78</span>; <span class="comment">// constant saturation</span>
<span class="error"> </span><span class="error"> </span> <span class="error"> </span><span class="keyword">var</span> l = <span class="integer">63</span>; <span class="comment">// constant luminance</span>
<span class="error"> </span><span class="error"> </span> <span class="error"> </span><span class="keyword">var</span> a = <span class="integer">1</span>;

<span class="error"> </span><span class="error"> </span> <span class="error"> </span><span class="keyword">var</span> <span class="function">getColor</span> = <span class="keyword">function</span>(val, range) {
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>h = Math.floor((<span class="integer">360</span> / range) * val);

<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span><span class="keyword">return</span> <span class="string"><span class="delimiter">&quot;</span><span class="content">hsla(</span><span class="delimiter">&quot;</span></span> + h +<span class="string"><span class="delimiter">&quot;</span><span class="content">,</span><span class="delimiter">&quot;</span></span> + s + <span class="string"><span class="delimiter">&quot;</span><span class="content">%,</span><span class="delimiter">&quot;</span></span> + l +<span class="string"><span class="delimiter">&quot;</span><span class="content">%,</span><span class="delimiter">&quot;</span></span> + a +<span class="string"><span class="delimiter">&quot;</span><span class="content">)</span><span class="delimiter">&quot;</span></span>;
<span class="error"> </span><span class="error"> </span> <span class="error"> </span>};

<span class="error"> </span><span class="error"> </span> <span class="error"> </span><span class="keyword">var</span> <span class="function">getColor1</span> = <span class="keyword">function</span>() {
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span><span class="keyword">return</span> <span class="string"><span class="delimiter">&quot;</span><span class="content">hsla(</span><span class="delimiter">&quot;</span></span> + h +<span class="string"><span class="delimiter">&quot;</span><span class="content">,</span><span class="delimiter">&quot;</span></span> + s + <span class="string"><span class="delimiter">&quot;</span><span class="content">%,</span><span class="delimiter">&quot;</span></span> + (l - <span class="integer">30</span>) +<span class="string"><span class="delimiter">&quot;</span><span class="content">%,</span><span class="delimiter">&quot;</span></span> + a +<span class="string"><span class="delimiter">&quot;</span><span class="content">)</span><span class="delimiter">&quot;</span></span>;
<span class="error"> </span><span class="error"> </span> <span class="error"> </span>};

<span class="error"> </span><span class="error"> </span> <span class="error"> </span><span class="comment">// draws a rounded rectangle</span>
<span class="error"> </span><span class="error"> </span> <span class="error"> </span><span class="keyword">var</span> <span class="function">drawRect</span> = <span class="keyword">function</span>(context, x, y, width, height) {
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span><span class="keyword">var</span> radius = <span class="integer">10</span>
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>context.beginPath();
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>context.moveTo(x + radius, y);
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>context.lineTo(x + width - radius, y);
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>context.quadraticCurveTo(x + width, y, x + width, y + radius);
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>context.lineTo(x + width, y + height - radius);
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>context.quadraticCurveTo(x + width, y + height, x + width -
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>radius, y + height);
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>context.lineTo(x + radius, y + height);
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>context.quadraticCurveTo(x, y + height, x, y + height - radius);
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>context.lineTo(x, y + radius);
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>context.quadraticCurveTo(x, y, x + radius, y);
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>context.closePath();
<span class="error"> </span><span class="error"> </span> <span class="error"> </span>}

<span class="error"> </span><span class="error"> </span> <span class="error"> </span><span class="local-variable">this</span>.<span class="function">createCanvas</span> = <span class="keyword">function</span>(label, range) {
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span><span class="keyword">var</span> canvas = document.createElement(<span class="string"><span class="delimiter">&quot;</span><span class="content">canvas</span><span class="delimiter">&quot;</span></span>);
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>canvas.width = width;
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>canvas.height = height;

<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span><span class="keyword">var</span> context = canvas.getContext(<span class="string"><span class="delimiter">&quot;</span><span class="content">2d</span><span class="delimiter">&quot;</span></span>);

<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span><span class="keyword">var</span> val = parseInt(label);

<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>context.clearRect(<span class="integer">0</span>,<span class="integer">0</span>,width,height);

<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span><span class="keyword">var</span> grad = context.createLinearGradient(<span class="integer">0</span>, <span class="integer">0</span>, <span class="integer">0</span>, height);

<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span><span class="keyword">var</span> color0 = getColor(val, range);

<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>grad.addColorStop(<span class="integer">0</span>, color0);
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>grad.addColorStop(<span class="integer">1</span>, getColor1());

<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>context.fillStyle = grad;
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>context.strokeStyle = color0;

<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>drawRect(context, <span class="integer">0</span>, <span class="integer">0</span>, width, height);
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>context.fill();
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>context.stroke();

<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>context.fillStyle = <span class="string"><span class="delimiter">&quot;</span><span class="content">white</span><span class="delimiter">&quot;</span></span>;
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>context.strokeStyle = <span class="string"><span class="delimiter">&quot;</span><span class="content">black</span><span class="delimiter">&quot;</span></span>

<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span><span class="comment">// Render Label</span>
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>context.font = <span class="string"><span class="delimiter">&quot;</span><span class="content">bold 12pt Arial</span><span class="delimiter">&quot;</span></span>;
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>context.textBaseline <span class="error"> </span>= <span class="string"><span class="delimiter">&quot;</span><span class="content">top</span><span class="delimiter">&quot;</span></span>;

<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span><span class="keyword">var</span> textWidth = context.measureText(label);

<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span><span class="comment">// centre the text.</span>
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>context.fillText(label,
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span> <span class="error"> </span>Math.floor((width / <span class="integer">2</span>) - (textWidth.width / <span class="integer">2</span>)),
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span> <span class="error"> </span><span class="integer">4</span>
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span>);

<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span><span class="keyword">return</span> canvas;

<span class="error"> </span><span class="error"> </span> <span class="error"> </span>};

<span class="error"> </span><span class="error"> </span> <span class="error"> </span><span class="local-variable">this</span>.<span class="function">create</span> = <span class="keyword">function</span>(label, range) {
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span><span class="keyword">var</span> canvas = <span class="local-variable">this</span>.createCanvas(label, range);
<span class="error"> </span><span class="error"> </span> <span class="error"> </span> <span class="error"> </span><span class="keyword">return</span> canvas.toDataURL();
<span class="error"> </span><span class="error"> </span> <span class="error"> </span>};
<span class="error"> </span><span class="error"> </span>}
})();</pre></div>
</div>


<p>Example usage:</p>

<div class="CodeRay">
  <div class="code"><pre><span class="keyword">for</span>(<span class="keyword">var</span> i = <span class="integer">1</span>; i&lt;<span class="integer">100</span>; i++) {
  document.body.appendChild(ButtonFactory.createCanvas(i,<span class="integer">99</span>));
}</pre></div>
</div>

