---
slug: creating-a-new-new-tab-page-for-chrome
date: 2010-12-09
 
title: Creating a New New Tab Page for Chrome
published: true
---
<p>For a long time Chrome Extensions have had the ability to <a href="http://code.google.com/chrome/extensions/override.html">create a new tab page</a> in side Chrome.  An excellent example of this is <a href="https://chrome.google.com/webstore/detail/dgpdioedihjhncjafcpgbbjdpbbkikmi">SpeedDial</a>.</p>

<p>With the introduction of the new <a href="http://chrome.google.com/webstore">Chrome Web Store</a> there is a new boy in town.  Apps.  Apps are installed on to the New Tab Page and if your extension doesn&rsquo;t handle them, then you need to update it because users will not be able to run the new apps that they have installed or purchased.</p>

<p>The good news is that for a little while now Chrome has had a <a href="http://code.google.com/chrome/extensions/management.html">Management API</a>.  The API gives you specific access to a list of all the Apps and Extensions that are installed in to a users browser.</p>

<p>So, without further ado, lets make an awesome Chrome Extension New Tab Page with an amazing App Launcher!!</p>

<p>As always with an extension, you start with a manifest.</p>

<div class="CodeRay">
  <div class="code"><pre>{
    <span class="key"><span class="delimiter">&quot;</span><span class="content">name</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">The New App Launcher</span><span class="delimiter">&quot;</span></span>,
    <span class="key"><span class="delimiter">&quot;</span><span class="content">description</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">Launches apps, the good way!</span><span class="delimiter">&quot;</span></span>,
    <span class="key"><span class="delimiter">&quot;</span><span class="content">version</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">0.0.0.1</span><span class="delimiter">&quot;</span></span>,
    <span class="key"><span class="delimiter">&quot;</span><span class="content">permissions</span><span class="delimiter">&quot;</span></span> : [<span class="string"><span class="delimiter">&quot;</span><span class="content">management</span><span class="delimiter">&quot;</span></span>],
    <span class="key"><span class="delimiter">&quot;</span><span class="content">chrome_url_overrides</span><span class="delimiter">&quot;</span></span> : {
        <span class="key"><span class="delimiter">&quot;</span><span class="content">newtab</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">newtab.html</span><span class="delimiter">&quot;</span></span>
    }
 }</pre></div>
</div>


<p>Done, that was simple.  Notice that we defined a permission &ndash; management, and we also defined an object called &ldquo;chrome_url_overrides&rdquo;, specifying a new url for the New Tab Page.</p>

<p>Next step, create the &ldquo;newtab.html&rdquo; file &ndash; we will keep it simple for now &ndash; just a simple skeleton.</p>

<div class="CodeRay">
  <div class="code"><pre><span class="tag">&lt;html&gt;</span>
  <span class="tag">&lt;head&gt;</span>
    <span class="tag">&lt;style&gt;</span>

    <span class="tag">&lt;/style&gt;</span>
    <span class="tag">&lt;script&gt;</span>
<span class="inline">      document.addEventListener(<span class="string"><span class="delimiter">&quot;</span><span class="content">DOMContentLoaded</span><span class="delimiter">&quot;</span></span>, <span class="keyword">function</span>() {
        chrome.management.getAll(getAllCallback);
      });

      <span class="keyword">var</span> <span class="function">getAllCallback</span> = <span class="keyword">function</span>(list) {
        <span class="comment">// TODO: Something Awesome</span>
      };</span>
    <span class="tag">&lt;/script&gt;</span>
  <span class="tag">&lt;/head&gt;</span>
  <span class="tag">&lt;body&gt;</span>
    <span class="tag">&lt;div</span> <span class="attribute-name">id</span>=<span class="string"><span class="delimiter">&quot;</span><span class="content">apps</span><span class="delimiter">&quot;</span></span><span class="tag">&gt;</span>

    <span class="tag">&lt;/div&gt;</span>
  <span class="tag">&lt;/body&gt;</span>
<span class="tag">&lt;/html&gt;</span></pre></div>
</div>


<p>It is pretty standard HTML, with a simple call to a Chrome specific API called chrome.management.getAll &ndash; which as you guessed gets a list of all the Extensions and App installed on the your system.  Like all methods in the extension subsystem, getAll doesn&rsquo;t return data directly, rather the data is returned via a callback defined by you.  The callback will recieve a list of <a href="http://code.google.com/chrome/extensions/management.html#type-ExtensionInfo">ExtensionInfo</a> objects</p>

<p>Lets do something with this, because as it stands it is just a blank page.  Lets populate the &ldquo;apps&rdquo; div with some content by padding out &ldquo;getAllCallback&rdquo; with some functionality.</p>

<div class="CodeRay">
  <div class="code"><pre><span class="keyword">var</span> <span class="function">getAllCallback</span> = <span class="keyword">function</span>(list) {
  <span class="keyword">var</span> apps = document.getElementById(<span class="string"><span class="delimiter">&quot;</span><span class="content">apps</span><span class="delimiter">&quot;</span></span>);
  <span class="keyword">for</span>(<span class="keyword">var</span> i <span class="keyword">in</span> list) {
    <span class="comment">// we don't want to do anything with extensions yet.</span>
    <span class="keyword">var</span> extInf = list[i];
    <span class="keyword">if</span>(extInf.isApp &amp;&amp; extInf.enabled) {
      <span class="keyword">var</span> app = document.createElement(<span class="string"><span class="delimiter">&quot;</span><span class="content">div</span><span class="delimiter">&quot;</span></span>);

      <span class="keyword">var</span> img = <span class="keyword">new</span> Image();
      img.className = <span class="string"><span class="delimiter">&quot;</span><span class="content">image</span><span class="delimiter">&quot;</span></span>;
      img.src = find128Image(extInf.icons);

      <span class="keyword">var</span> name = document.createElement(<span class="string"><span class="delimiter">&quot;</span><span class="content">div</span><span class="delimiter">&quot;</span></span>);
      name.className = <span class="string"><span class="delimiter">&quot;</span><span class="content">name</span><span class="delimiter">&quot;</span></span>;
      name.textContent = extInf.name;

      app.className = <span class="string"><span class="delimiter">&quot;</span><span class="content">app</span><span class="delimiter">&quot;</span></span>;
      app.appendChild(img);
      app.appendChild(name);
      apps.appendChild(app);
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


<p>Again, pretty simple &ndash; the output should look similar to the attached.  Pretty nice, but there is one small problem &ndash; nothing is clickable, we can&rsquo;t launch anything.  That is pretty simple to solve thanks again to chrome.management API.  The API has a simple method called &ldquo;launchApp&rdquo; which at its simplest takes an extension ID as its parameter.</p>

<p>Lets get that added so we have a fully functioning New Tab Page and App launcher.  We will just add a click handler to the image, no anchors needed.</p>

<div class="CodeRay">
  <div class="code"><pre>img.addEventListener(<span class="string"><span class="delimiter">&quot;</span><span class="content">click</span><span class="delimiter">&quot;</span></span>, (<span class="keyword">function</span>(ext) {
    <span class="keyword">return</span> <span class="keyword">function</span>() {
        chrome.management.launchApp(ext.id);
    };
})(extInf));</pre></div>
</div>


<p>And that is it.  We have a Chrome extension that provides a New Tab Page with app launcher functionality!  Awesome</p>

<p>The code for this post is <a href="https://github.com/PaulKinlan/New-App-Launcher">on Github</a>, so fork away and have a play and let me know if you create an awesome extension.</p>

