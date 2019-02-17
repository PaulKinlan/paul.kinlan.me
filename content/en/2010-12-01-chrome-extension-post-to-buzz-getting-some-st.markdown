---
slug: chrome-extension-post-to-buzz-getting-some-st
date: 2010-12-01
 
title: "Chrome Extension \"Post to Buzz\": Getting some stats"
published: true
---
<p>In my <a href="/chrome-extension-post-to-buzz-the-basics">last post</a> we had a functioning Chrome Extensions, that lets you Buzz about the current page you are on.  It is pretty simplistic, but a nice example of how easy it is to create a Chrome Extension, but also how to perform some basic interactions with the Buzz API.</p>

<p>In this part of the tutorial, I am going to show you how you can do some cross domain requests and how you can interact with the &ldquo;browser_action&rdquo; (the buttons on the top right).  Essentially we are going to add a &ldquo;Share count&rdquo; to the browser_action by making a HTTP request to the following URL: <a href="http://www.google.com/buzz/api/buzzThis/buzzCounter">http://www.google.com/buzz/api/buzzThis/buzzCounter</a>, this url will return a simple json object that we can use to get some information about the current page.</p>

<p>Using where we left off in the last tutorial, we will start with the manifest.  To be able to do cross-domain requests inside an extension, the extension needs to know the url(s) you will be calling.</p>

<div class="CodeRay">
  <div class="code"><pre>{
    <span class="key"><span class="delimiter">&quot;</span><span class="content">name</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">Buzz This</span><span class="delimiter">&quot;</span></span>,
    <span class="key"><span class="delimiter">&quot;</span><span class="content">version</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">0.0.0.1</span><span class="delimiter">&quot;</span></span>,
    <span class="key"><span class="delimiter">&quot;</span><span class="content">browser_action</span><span class="delimiter">&quot;</span></span>: {
        <span class="key"><span class="delimiter">&quot;</span><span class="content">default_icon</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">buzz-little.png</span><span class="delimiter">&quot;</span></span>,
        <span class="key"><span class="delimiter">&quot;</span><span class="content">default_title</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">Post to Google Buzz</span><span class="delimiter">&quot;</span></span> 
    },
    <span class="key"><span class="delimiter">&quot;</span><span class="content">background_page</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">background.html</span><span class="delimiter">&quot;</span></span>,
    <span class="key"><span class="delimiter">&quot;</span><span class="content">permissions</span><span class="delimiter">&quot;</span></span>: [
        <span class="string"><span class="delimiter">&quot;</span><span class="content">tabs</span><span class="delimiter">&quot;</span></span>
        <span class="string"><span class="delimiter">&quot;</span><span class="content">http://www.google.com/buzz/api/buzzThis/buzzCounter</span><span class="delimiter">&quot;</span></span>
        ]
}</pre></div>
</div>


<p>A single item has been added to the &ldquo;permissions&rdquo; array.  That item is the url of the buzzCounter.  We can now perform XMLHttpRequest&rsquo;s against that URL now. Awesome!</p>

<p>Lets add the code in to the background.html file so that we can make the requests to get the Buzz count.  It won&rsquo;t be too complex, essentially we will detect when a user changes the current page they are viewing and make an request to buzz to get the URL count.  Once we have that URL count, we will set some text on the browser_action so it is visible to the user.</p>

<p>First we shall listen the events that Chrome triggers when the user changes tab (onSelectionChanged) and when the user navigates to a new page (onUpdated).</p>

<div class="CodeRay">
  <div class="code"><pre>chrome.tabs.onSelectionChanged.addListener(getNewInfo);
chrome.tabs.onUpdated.addListener(getNewInfo);</pre></div>
</div>


<p>The getNewInfo is a function, so let us define it.</p>

<div class="CodeRay">
  <div class="code"><pre><span class="keyword">function</span> <span class="function">getNewInfo</span>(t, info) {
    chrome.tabs.get(t, <span class="keyword">function</span>(tab) { 
        <span class="keyword">var</span> url = <span class="string"><span class="delimiter">&quot;</span><span class="content">http://www.google.com/buzz/api/buzzThis/buzzCounter</span><span class="delimiter">&quot;</span></span>            
        url += <span class="string"><span class="delimiter">&quot;</span><span class="content">?url=</span><span class="delimiter">&quot;</span></span> +encodeURI(tab.url);

        <span class="keyword">var</span> xhr = <span class="keyword">new</span> XMLHttpRequest();
        xhr.<span class="function">onreadystatechange</span> = <span class="keyword">function</span>() {
            <span class="keyword">if</span>(xhr.readyState == <span class="integer">4</span> &amp;&amp; xhr.status == <span class="integer">200</span>) {
                <span class="keyword">var</span> response = xhr.responseText;
                <span class="keyword">var</span> matches = <span class="regexp"><span class="delimiter">/</span><span class="content">google_buzz_set_count</span><span class="content">\(</span><span class="content">(.+?)</span><span class="content">\)</span><span class="content">;</span><span class="delimiter">/</span></span>;
                <span class="keyword">var</span> results = response.match(matches);
                <span class="keyword">if</span>(results) {
                    <span class="keyword">var</span> count = google_buzz_set_count(tab, JSON.parse(results[<span class="integer">1</span>]));
                }
            }
        }; 
        xhr.open(<span class="string"><span class="delimiter">&quot;</span><span class="content">GET</span><span class="delimiter">&quot;</span></span>, url);
        xhr.send();
    });
}

<span class="keyword">function</span> <span class="function">google_buzz_set_count</span>(tab, data) {
    <span class="keyword">if</span>(data[tab.url] != <span class="predefined-constant">undefined</span> &amp;&amp; data[tab.url] != <span class="string"><span class="delimiter">&quot;</span><span class="content">undefined</span><span class="delimiter">&quot;</span></span>) {
        chrome.browserAction.setBadgeText({ <span class="key"><span class="delimiter">&quot;</span><span class="content">text</span><span class="delimiter">&quot;</span></span> : data[tab.url] + <span class="string"><span class="delimiter">&quot;</span><span class="delimiter">&quot;</span></span>, <span class="key"><span class="delimiter">&quot;</span><span class="content">tabId</span><span class="delimiter">&quot;</span></span> :tab.id });
    }
}</pre></div>
</div>


<p>That is actually quite a lot of code, but it is pretty simple.  Everytime the user changes tab or url, getNewInfo is called.  We don&rsquo;t have access to the URL of the tab, so we have to first call &ldquo;chrome.tabs.get()&rdquo; to obtain more information.  After this, everything is pretty standard, we create an XMLHttpRequest and call our url.</p>

<p>The response returned from this API is JSONP, which we can&rsquo;t load directly so, the code simply strips out the data that we need and then performs a JSON.parse on the value. Once we have this value, we simply call the &ldquo;google_buzz_set_count&rdquo; method.</p>

<p>The google_buzz_set_count function is very simple.  All it does is call &ldquo;chrome.browserAction.setBadgeText&rdquo;.  setBadgeText is a really nice method because it allows you to have a very subtle way to communicate with your users.</p>

<p>And that is it.  This was the original extension that I published, however recently I decided to integrate Content Menu&rsquo;s to allow users to have more control over what gets posted to Buzz, and this is what we will cover in the next (and final) tutorial.</p>

