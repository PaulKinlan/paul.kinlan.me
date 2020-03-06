---
slug: chrome-extension-post-to-buzz-the-basics
date: 2010-11-30
 
title: "Chrome Extension \"Post to Buzz\": The basics"
published: true
---
<p>In this quick tutorial, we are going to start to build the super simple <a href="https://chrome.google.com/extensions/detail/dnkpofojlncaepnglinmdjkfolgabldj">Buzz
This Chrome Extension</a>.</p>

<p>At the end of each tutorial, you will have something that works.</p>

<p>In this tutorial, we are going to create the basic manifest,</p>

<p>First thing to do is to create a folder where you are going to store your
extension.  I am not going to tell you how to do that, you should know.</p>

<p>Inside this folder, create a file called <a href="http://code.google.com/chrome/extensions/manifest.html">manifest.json</a>.  This manifest is
the true heart of your extension.  Without it, you have nothing that Chrome
can load and work with.  The manifest simply defines some basic information
about your extension including it's name, description and version number.</p>

<p>In the manifest add the following:</p>

<div class="CodeRay">
  <div class="code"><pre>{
  <span class="key"><span class="delimiter">&quot;</span><span class="content">name</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">Buzz This</span><span class="delimiter">&quot;</span></span>,
  <span class="key"><span class="delimiter">&quot;</span><span class="content">version</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">0.0.0.1</span><span class="delimiter">&quot;</span></span>
}</pre></div>
</div>


<p>Thats it.  Honest.  If you visit chrome://extensions, click &ldquo;Developer Mode&rdquo;
and click &ldquo;Load unpacked extension&hellip;&rdquo; and select the folder with your
manifest in, you will see that it loads&hellip;.. Although it doesn't do
anything.</p>

<p>Lets add a little something, so at least I can show you something cool
(ish).</p>

<p>This extension wouldn't be much without a button that was alway visible to
the user so that they can click on it to post the current page to Buzz.  So
lets do that.</p>

<p>Lets go back to the manifest.json, and add a section called
<a href="http://code.google.com/chrome/extensions/browserAction.html">&ldquo;browser_action&rdquo;</a> as follows:</p>

<div class="CodeRay">
  <div class="code"><pre>{
    <span class="key"><span class="delimiter">&quot;</span><span class="content">name</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">Buzz This</span><span class="delimiter">&quot;</span></span>,
    <span class="key"><span class="delimiter">&quot;</span><span class="content">version</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">0.0.0.1</span><span class="delimiter">&quot;</span></span>,
    <span class="key"><span class="delimiter">&quot;</span><span class="content">browser_action</span><span class="delimiter">&quot;</span></span>: {
        <span class="key"><span class="delimiter">&quot;</span><span class="content">default_icon</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">buzz-little.png</span><span class="delimiter">&quot;</span></span>,
        <span class="key"><span class="delimiter">&quot;</span><span class="content">default_title</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">Post to Google Buzz</span><span class="delimiter">&quot;</span></span>
     }
}</pre></div>
</div>


<p>This is pretty simple, and self explanatory.  We are just giving the
browser_action a tooltip title and a nice icon (19x19px); note, the icon
must be included in the directory of the manifest.</p>

<p>Visit chrome://extensions, find your extension and click re-load.  Boom! You
now have a nice little icon in the top right corner of the browser.  Click
on it and see what happens! Nothing?  Thats correct, no code is hooked up
yet.</p>

<p>Lets make it do something when the user clicks on it.</p>

<p>We need to do two things now.  First we need to create a <a href="http://code.google.com/chrome/extensions/background_pages.html">&ldquo;background
page&rdquo;</a>; the
background page allows you to add logic to your extension and is considered
the &ldquo;brains&rdquo; of your extension.  We also need to link to the background page
from the manifest.json file.</p>

<p>Add a file named what ever you want to your extension directory, and then modify the manifest so it looks like:</p>

<div class="CodeRay">
  <div class="code"><pre>{
    <span class="key"><span class="delimiter">&quot;</span><span class="content">name</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">Buzz This</span><span class="delimiter">&quot;</span></span>,
    <span class="key"><span class="delimiter">&quot;</span><span class="content">version</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">0.0.0.1</span><span class="delimiter">&quot;</span></span>,
    <span class="key"><span class="delimiter">&quot;</span><span class="content">browser_action</span><span class="delimiter">&quot;</span></span>: {
        <span class="key"><span class="delimiter">&quot;</span><span class="content">default_icon</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">buzz-little.png</span><span class="delimiter">&quot;</span></span>,
        <span class="key"><span class="delimiter">&quot;</span><span class="content">default_title</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">Post to Google Buzz</span><span class="delimiter">&quot;</span></span> 
     },
     <span class="key"><span class="delimiter">&quot;</span><span class="content">background_page</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">background.html</span><span class="delimiter">&quot;</span></span>
}</pre></div>
</div>


<p>Now lets add some code to the background.html page, so that it actually does something.</p>

<div class="CodeRay">
  <div class="code"><pre><span class="tag">&lt;html&gt;</span>
    <span class="tag">&lt;head&gt;</span>
        <span class="tag">&lt;script&gt;</span>
<span class="inline">          chrome.browserAction.onClicked.addListener(<span class="keyword">function</span> (t) {
              alert(t.url);
          });</span>
        <span class="tag">&lt;/script&gt;</span>
    <span class="tag">&lt;/head&gt;</span>
<span class="tag">&lt;/html&gt;</span></pre></div>
</div>


<p>This is great, we now have user interaction. If you reload your extension and click it, it tells you the url that the user is currently on. But still it doesn't do anything that useful.</p>

<p>Now lets make it useful.  We are going to use the API exposed by the Buzz system, to allow you <a href="http://code.google.com/apis/buzz/buttons_and_gadgets.html#hyperlink_api">create html widgets</a> and hack it a little so that we can open a new tab to allow the user of the extension to post to Buzz.  However, to open a new tab you need to use the <code>chrome.tabs</code> <a href="http://code.google.com/chrome/extensions/tabs.html">API</a> and this requires special permission, so the first thing to do is ask for it in the manifest.</p>

<div class="CodeRay">
  <div class="code"><pre>{
    <span class="key"><span class="delimiter">&quot;</span><span class="content">name</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">Buzz This</span><span class="delimiter">&quot;</span></span>,
    <span class="key"><span class="delimiter">&quot;</span><span class="content">version</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">0.0.0.1</span><span class="delimiter">&quot;</span></span>,
    <span class="key"><span class="delimiter">&quot;</span><span class="content">browser_action</span><span class="delimiter">&quot;</span></span>: {
        <span class="key"><span class="delimiter">&quot;</span><span class="content">default_icon</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">buzz-little.png</span><span class="delimiter">&quot;</span></span>,
        <span class="key"><span class="delimiter">&quot;</span><span class="content">default_title</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">Post to Google Buzz</span><span class="delimiter">&quot;</span></span> 
     },
     <span class="key"><span class="delimiter">&quot;</span><span class="content">background_page</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">background.html</span><span class="delimiter">&quot;</span></span>,
     <span class="key"><span class="delimiter">&quot;</span><span class="content">permissions</span><span class="delimiter">&quot;</span></span>: [<span class="string"><span class="delimiter">&quot;</span><span class="content">tabs</span><span class="delimiter">&quot;</span></span>]
}</pre></div>
</div>


<p>The Chrome Extension sub-system has a robust security model that requires you to declare upfront the systems (such as tabs) that your extension will need access to.  This is designed to allow the user to understand the implications of installing your extension and to stop extensions from accessing information without the users consent.  Luckily the whole process is as simple as specifing the permissions you require in the &ldquo;permissions&rdquo; array.</p>

<p>Now that you have access to the &ldquo;tabs&rdquo; privilege, we can now open tabs, so lets modify our background page.</p>

<div class="CodeRay">
  <div class="code"><pre><span class="tag">&lt;html&gt;</span>
    <span class="tag">&lt;head&gt;</span>
        <span class="tag">&lt;script&gt;</span>
<span class="inline">          chrome.browserAction.onClicked.addListener(<span class="keyword">function</span> (t) {
              chrome.tabs.create(
                  {<span class="key"><span class="delimiter">&quot;</span><span class="content">url</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">http://www.google.com/buzz/post?url=</span><span class="delimiter">&quot;</span></span> + encodeURI(t.url) });
          });</span>
        <span class="tag">&lt;/script&gt;</span>
    <span class="tag">&lt;/head&gt;</span>
<span class="tag">&lt;/html&gt;</span></pre></div>
</div>


<p>That's pretty cool, one line of extra code to call the chrome.tabs.create API and we have our first version of the extension working.</p>

<p>In the next tutorial I will add in the ability to get the stats for the
number of buzzes for the current URL. This will show you how to do Cross
domain request and also show you how to interact with the browser_action.</p>

