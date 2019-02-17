---
slug: web-app-launcher-as-a-browser-action
date: 2010-12-15
 
title: Web app launcher as a browser_action
published: true
---
<p>In my previous post <a href="/creating-a-new-new-tab-page-for-chrome">&ldquo;Creating a New New Tab Page For Chrome&rdquo;</a> I showed how
you can take advantage of the <a href="http://code.google.com/chrome/extensions/management.html">Management API</a> and the <a href="http://code.google.com/chrome/extensions/override.html">Override
Pages</a> framework to
make your own custom App Launcher.</p>

<p>This in itself was pretty cool, however it didn&rsquo;t address a real problem &ndash;
Users still like to keep their existing custom NTP AND use Apps installed
from the <a href="http://chrome.google.com/webstore">Webstore</a>.  To address this, I
made a really simple <a href="http://code.google.com/chrome/extensions/browserAction.html">&ldquo;browser_action&rdquo;</a> for a new
extension called <a href="https://chrome.google.com/webstore/detail/fladocijdganbikpfjhgnodllkgcmmgm">Quick Launch</a>.</p>

<p>It uses pretty much all of the existing code from the NTP tutorial, but some
small changes.  First the manifest has been updated to include the
&ldquo;browser_action&rdquo; and remove the page override as follows:</p>

<div class="CodeRay">
  <div class="code"><pre>{
    <span class="key"><span class="delimiter">&quot;</span><span class="content">name</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">Quick Launch</span><span class="delimiter">&quot;</span></span>,
    <span class="key"><span class="delimiter">&quot;</span><span class="content">description</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">Launches apps, the quick way!</span><span class="delimiter">&quot;</span></span>,
    <span class="key"><span class="delimiter">&quot;</span><span class="content">version</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">0.0.0.10</span><span class="delimiter">&quot;</span></span>,
    <span class="key"><span class="delimiter">&quot;</span><span class="content">background_page</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">background.html</span><span class="delimiter">&quot;</span></span>,
    <span class="key"><span class="delimiter">&quot;</span><span class="content">permissions</span><span class="delimiter">&quot;</span></span> : [<span class="string"><span class="delimiter">&quot;</span><span class="content">management</span><span class="delimiter">&quot;</span></span>],
    <span class="key"><span class="delimiter">&quot;</span><span class="content">browser_action</span><span class="delimiter">&quot;</span></span> : {
        <span class="key"><span class="delimiter">&quot;</span><span class="content">default_icon</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">go.png</span><span class="delimiter">&quot;</span></span>,
        <span class="key"><span class="delimiter">&quot;</span><span class="content">default_title</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">Quick Launch</span><span class="delimiter">&quot;</span></span>,
        <span class="key"><span class="delimiter">&quot;</span><span class="content">default_popup</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">popup.html</span><span class="delimiter">&quot;</span></span>
    }
}</pre></div>
</div>


<p>It is pretty simple, we just define an icon, a title and a webpage that will
be opened when the user clicks on the button.  We then create a file called
popup.html and put the following JS in.</p>

<div class="CodeRay">
  <div class="code"><pre>document.addEventListener(<span class="string"><span class="delimiter">&quot;</span><span class="content">DOMContentLoaded</span><span class="delimiter">&quot;</span></span>, <span class="keyword">function</span>() {
        chrome.management.getAll(getAllCallback);
      });

      <span class="keyword">var</span> <span class="function">getAllCallback</span> = <span class="keyword">function</span>(list) {
        <span class="keyword">var</span> apps = document.getElementById(<span class="string"><span class="delimiter">&quot;</span><span class="content">apps</span><span class="delimiter">&quot;</span></span>);
        <span class="keyword">var</span> counter = <span class="integer">0</span>;
        <span class="keyword">for</span>(<span class="keyword">var</span> i <span class="keyword">in</span> list) {
          <span class="comment">// we don't want to do anything with extensions yet.</span>
          <span class="keyword">var</span> extInf = list[i];

          <span class="keyword">if</span>(extInf.isApp &amp;&amp; extInf.enabled) {
            <span class="keyword">var</span> app = document.createElement(<span class="string"><span class="delimiter">&quot;</span><span class="content">div</span><span class="delimiter">&quot;</span></span>);

            <span class="keyword">var</span> img = <span class="keyword">new</span> Image();
            img.className = <span class="string"><span class="delimiter">&quot;</span><span class="content">image</span><span class="delimiter">&quot;</span></span>;
            img.src = find128Image(extInf.icons);
            img.addEventListener(<span class="string"><span class="delimiter">&quot;</span><span class="content">click</span><span class="delimiter">&quot;</span></span>, (<span class="keyword">function</span>(ext) {
              <span class="keyword">return</span> <span class="keyword">function</span>() {
                chrome.management.launchApp(ext.id);
              };
            })(extInf));

            <span class="keyword">var</span> name = document.createElement(<span class="string"><span class="delimiter">&quot;</span><span class="content">div</span><span class="delimiter">&quot;</span></span>);
            name.className = <span class="string"><span class="delimiter">&quot;</span><span class="content">name</span><span class="delimiter">&quot;</span></span>;
            name.textContent = extInf.name;

            app.className = <span class="string"><span class="delimiter">&quot;</span><span class="content">app</span><span class="delimiter">&quot;</span></span>;
            app.appendChild(img);
            app.appendChild(name);
            apps.appendChild(app);

            <span class="keyword">if</span>(counter % <span class="integer">2</span>) {
              <span class="keyword">var</span> row = document.createElement(<span class="string"><span class="delimiter">&quot;</span><span class="content">br</span><span class="delimiter">&quot;</span></span>);
              apps.appendChild(row);
            }
            counter ++;

          }
        }
      };

      <span class="keyword">var</span> <span class="function">find128Image</span> = <span class="keyword">function</span>(icons) {
        <span class="keyword">for</span>(<span class="keyword">var</span> icon <span class="keyword">in</span> icons) {
          <span class="keyword">if</span>(icons[icon].size == <span class="string"><span class="delimiter">&quot;</span><span class="content">128</span><span class="delimiter">&quot;</span></span>) {
            <span class="keyword">return</span> icons[icon].url;
          }
        }

        <span class="keyword">return</span> <span class="string"><span class="delimiter">&quot;</span><span class="content">/noicon.png</span><span class="delimiter">&quot;</span></span>;
      };</pre></div>
</div>


<p>The code is pretty straight forward &ndash; when we detect that the DOM has loaded
we ask the extension sub-sytem to get a list of all the apps and extension
that the user has installed.  Once the results are returned, we
simply iterate through the list checking to see if it is an app (there is a
handy property called &ldquo;isApp&rdquo;) and for each app we build a series of DOM
objects and add them to the container.  That is it, nothing else&hellip;.. or is
there?  (well there is a few extra enhancements and styling I have made, but
it is all visible in the source)</p>

<p>As always, the source is <a href="https://github.com/PaulKinlan/Quick-Launch">available on Github</a></p>

<p>I actually have another extension, that I will blog about a little later
that I think you will really like &ndash; along the same lines as this.</p>

