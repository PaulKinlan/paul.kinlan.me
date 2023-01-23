---
slug: announcing-appmator-get-your-apps-in-the-web-
date: 2010-12-07
 
title: Announcing Appmator. Get your apps in the Web Store in under a minute!
published: true
---
<p>I am excited (&lt;&ndash; every 'press release' starts like this, but this isn't a
press release) to announce <em>Appmator</em>, a tool that I have developed for you,
developers of great web apps to help you get your apps in to the Chrome Web
Store in under a minute!</p>

<p>With the recent release of the Google Chrome Webstore (literally 10 minutes
ago) developers now have an amazing channel to reach over 100 million users
of Chrome.</p>

<p>It is <a href="http://code.google.com/chrome/webstore">pretty easy</a> to get your
existing Web apps <a href="http://chrome.google.com/webstore/developer/dashboard">in to the store</a>.  Now it is even
easier using <a href="http://appmator.appspot.com/">Appmator</a>, simply go to the
<a href="http://appmator.appspot.com/">App</a>, add your URL and press enter.  You will
then have a Zip file that you can upload directly to the store.  You can
even modify the output to suit your needs!</p>

<p>It is even in the <a href="https://chrome.google.com/webstore/detail/pndpgaogppgnfdnagodccjlhfjgdefij">Chrome Web Store</a>
so you can install it <em>now</em>.  The great thing is, that this tool was
packaged ready for the store using <em>itself</em>!  Sweet.</p>

<p>It does some pretty cool stuff, all of which I will cover in JavaScript
Tutorials in the next couple of days, here is a sneak peak:</p>

<ul>
<li> Use of beautiful Webfonts to enhance the UI</li>
<li> Uses Modernizer to feature detect &ndash; I will probably do some workaround
for other browsers soon.</li>
<li> Uses classList to quickly modify styling and state</li>
<li> Creates the package (zip file) all on the client side (this is my
favorite bit) using the awesome <a href="https://github.com/Stuk/jszip/tree">jszip</a></li>
<li> Allows users to drag a zip file on to the desktop so that it can easily
be uploaded</li>
<li> Uses ArrayBuffers to initiate a client side download (it is a bit of a
hack &ndash; but pretty cool)</li>
<li> Detects favicon support so that you can quickly re-use your existing
assets</li>
<li> Uses flexible box model for layout.</li>
<li> Mostly works offline (supports appcache) &ndash; ok, this is in the next
version.</li>
</ul>


<p>And the best thing is, it is all open and the source code is available on
<a href="http://github.com/PaulKinlan/appmator">GitHub</a></p>

<p>All feedback and suggestions are welcome.  And if you spot any bugs (and you
will) please <a href="https://github.com/PaulKinlan/appmator/issues">file a bug</a></p>

