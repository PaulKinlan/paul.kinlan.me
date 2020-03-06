---
slug: drag-to-desktop-in-js
date: 2010-12-09
 
title: Drag to Desktop in JS
published: true
---
<p>When I created <a href="http://appmator.appspot.com">appmator</a>, I want to remove a
lot of the traditional webism that we see in apps.  Specifically, I am not
overly keen on 'Save As' buttons, so I made sure I didn't include one in the
application</p>

<p>The question then becomes how do you get data quickly to a directory of the
users choice.  I have chosen two operations, a standard click of a url that
downloads the data clientside (another post to come shortly).  Chrome has a
feature, its Drag and Drop implementation allows you to specify a URI or
Data URI that is attached to a drag operation, specifically a drag operation
that ends outside the browser.  When Chrome detects that the drag operation
has ended outside the browser</p>

<div class="CodeRay">
  <div class="code"><pre><span class="keyword">var</span> element = document.getElementById(<span class="string"><span class="delimiter">&quot;</span><span class="content">anyoldelement</span><span class="delimiter">&quot;</span></span>);
anyoldelement.addEventListener(<span class="string"><span class="delimiter">&quot;</span><span class="content">dragstart</span><span class="delimiter">&quot;</span></span>, <span class="keyword">function</span>(e) {
   e.dataTransfer.setData(<span class="string"><span class="delimiter">&quot;</span><span class="content">DownloadURL</span><span class="delimiter">&quot;</span></span>,
       <span class="string"><span class="delimiter">&quot;</span><span class="content">application/zip:package.zip:data:image/png;base64,</span><span class="delimiter">&quot;</span></span> +
       Builder.output({<span class="key"><span class="delimiter">&quot;</span><span class="content">binary</span><span class="delimiter">&quot;</span></span>: <span class="predefined-constant">false</span>}));
});</pre></div>
</div>


<p>It is pretty simple, we attach a function to the ondragstart event.  That
function simply sets the sets Data on the dataTransefer object in the event
callback.  The data is of a specific type called 'DownloadURL' and attaches
a valid URI &ndash; this URI can be anything in the domain, or it can be a DataURI
(as in the case of this example).    Prior to the URI is the meta-data about
the URI, in this case it is <em>application/zip:package.zip</em> which is a simple
MIME type and file name.</p>

<p>The code that generates the dataURI is part of a library function that
generates a ZIP file (<a href="https://github.com/Stuk/jszip">JSZip</a> in fact, which
is an awesome library)</p>

<p>And that is pretty much it.</p>

<p>In honesty, this approach only works in Chrome, so be warned.  Also, it is
impossible to detect the presence of this feature.</p>

