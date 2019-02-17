---
slug: chrome-extension-adding-context-menus
date: 2010-12-06
 
title: "Chrome Extension: Adding Context menus"
published: true
---
<p>This is the final part of the &ldquo;<a href="https://chrome.google.com/extensions/detail/dnkpofojlncaepnglinmdjkfolgabldj">Buzz This</a>&rdquo;
Chrome Extension series, in the <a href="/chrome-extension-post-to-buzz-the-basics">first post</a> I showed you
how to create a basic Chrome Extension.  We then expanded on it in the <a href="/chrome-extension-post-to-buzz-getting-some-st">2nd
post</a>
showing you how to use XHR and some advanced features of browser_actions.</p>

<p>In this post, I will show you how to quickly integrate <a href="http://code.google.com/chrome/extensions/contextMenus.html">Context Menus</a> into Chrome
Extensions.  Why am I integrating Context Menus? Because they are a powerful
hook in to your extension, and I want to be able to let users &ldquo;Buzz&rdquo; about
specific things on any page, for instance, if they find an interesting
image, they can Buzz just that rather than the entire page.  It is pretty
powerful.</p>

<p>The code is pretty simple, and should show you how easy it is to get
started.</p>

<p>Context menus are pretty powerful and have the ability to be present
through-out the life time of a users browsing experience, as such you must
declare in your manifest the intention to use Context Menus.  It is a pretty
simple addition to the &ldquo;permissions&rdquo; array in the manifest.</p>

<div class="CodeRay">
  <div class="code"><pre>{
  <span class="key"><span class="delimiter">&quot;</span><span class="content">name</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">Post to Google Buzz</span><span class="delimiter">&quot;</span></span>,
  <span class="key"><span class="delimiter">&quot;</span><span class="content">version</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">1.0.0.6</span><span class="delimiter">&quot;</span></span>,
  <span class="key"><span class="delimiter">&quot;</span><span class="content">icons</span><span class="delimiter">&quot;</span></span> : {
    <span class="key"><span class="delimiter">&quot;</span><span class="content">16</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">buzz-little.png</span><span class="delimiter">&quot;</span></span>,
    <span class="key"><span class="delimiter">&quot;</span><span class="content">128</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">buzz-big.png</span><span class="delimiter">&quot;</span></span>
  },
  <span class="key"><span class="delimiter">&quot;</span><span class="content">background_page</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">background.html</span><span class="delimiter">&quot;</span></span>,
  <span class="key"><span class="delimiter">&quot;</span><span class="content">browser_action</span><span class="delimiter">&quot;</span></span>: {
      <span class="key"><span class="delimiter">&quot;</span><span class="content">default_icon</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">buzz-little.png</span><span class="delimiter">&quot;</span></span>,
      <span class="key"><span class="delimiter">&quot;</span><span class="content">default_title</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">Post to Google Buzz</span><span class="delimiter">&quot;</span></span>
    },
  <span class="key"><span class="delimiter">&quot;</span><span class="content">permissions</span><span class="delimiter">&quot;</span></span> : [
    <span class="string"><span class="delimiter">&quot;</span><span class="content">tabs</span><span class="delimiter">&quot;</span></span>,
    <span class="string"><span class="delimiter">&quot;</span><span class="content">contextMenus</span><span class="delimiter">&quot;</span></span>,
    <span class="string"><span class="delimiter">&quot;</span><span class="content">http://www.google.com/buzz/api/buzzThis/buzzCounter</span><span class="delimiter">&quot;</span></span>
    ]
}</pre></div>
</div>


<p>Now that we have specified the requirement to use Context Menus, the user
will be alerted to the fact when they install your extension.</p>

<p>Simply asking for permission is not enough, you need to also add some code
that will tell the browser when to display the context menu and how to
display the context menu.  You, the developer, can define where the context
menu appears by specifying &ldquo;contexts&rdquo;, you have a lot of flexibility, for
instance you can say the context menu will only be active on text
selections, or video and image elements or links.</p>

<p>Lets start by editing our background.html file.  We are going to simply add
a method call to chrome.contextMenus.create(), which takes an object that
defines our context menu &ndash; and that is pretty much it.</p>

<div class="CodeRay">
  <div class="code"><pre>chrome.contextMenus.create({
    <span class="key"><span class="delimiter">&quot;</span><span class="content">title</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">Buzz This</span><span class="delimiter">&quot;</span></span>,
    <span class="key"><span class="delimiter">&quot;</span><span class="content">contexts</span><span class="delimiter">&quot;</span></span>: [<span class="string"><span class="delimiter">&quot;</span><span class="content">page</span><span class="delimiter">&quot;</span></span>, <span class="string"><span class="delimiter">&quot;</span><span class="content">selection</span><span class="delimiter">&quot;</span></span>, <span class="string"><span class="delimiter">&quot;</span><span class="content">image</span><span class="delimiter">&quot;</span></span>, <span class="string"><span class="delimiter">&quot;</span><span class="content">link</span><span class="delimiter">&quot;</span></span>],
    <span class="key"><span class="delimiter">&quot;</span><span class="content">onclick</span><span class="delimiter">&quot;</span></span> : clickHandler
  });</pre></div>
</div>


<p>Seriously, that is it.  The Context menu will be active on the page in
general, on any text selection, image (or element that has a &ldquo;src&rdquo;
attribute) and all links.  There is a simple title &ldquo;Buzz This&rdquo; that is
display when anyone of those elements is context clicked.  An when the user
selects our &ldquo;Buzz This&rdquo; menu item our &ldquo;onclick&rdquo; event handler is called.</p>

<p>So what do we do in &ldquo;clickHandler&rdquo; method?  Well we handle the click
obviously.  In this case, I will detect what was clicked.  The reason for
detecting what element is the context is that the Buzz API that we are using
allows you to pass in a few extra parameters such as the message (the
selected text), an image (if the context was an image) or a url (if a link
is the context).</p>

<div class="CodeRay">
  <div class="code"><pre><span class="keyword">var</span> <span class="function">clickHandler</span> = <span class="keyword">function</span>(e) {
    <span class="keyword">var</span> url = e.pageUrl;
    <span class="keyword">var</span> buzzPostUrl = <span class="string"><span class="delimiter">&quot;</span><span class="content">http://www.google.com/buzz/post?</span><span class="delimiter">&quot;</span></span>;

    <span class="keyword">if</span> (e.selectionText) {
        <span class="comment">// The user selected some text, put this in the message.</span>
        buzzPostUrl += <span class="string"><span class="delimiter">&quot;</span><span class="content">message=</span><span class="delimiter">&quot;</span></span> + encodeURI(e.selectionText) + <span class="string"><span class="delimiter">&quot;</span><span class="content">&amp;</span><span class="delimiter">&quot;</span></span>;
    }

    <span class="keyword">if</span> (e.mediaType === <span class="string"><span class="delimiter">&quot;</span><span class="content">image</span><span class="delimiter">&quot;</span></span>) {
        buzzPostUrl += <span class="string"><span class="delimiter">&quot;</span><span class="content">imageurl=</span><span class="delimiter">&quot;</span></span> + encodeURI(e.srcUrl) + <span class="string"><span class="delimiter">&quot;</span><span class="content">&amp;</span><span class="delimiter">&quot;</span></span>;
    }

    <span class="keyword">if</span> (e.linkUrl) {
        <span class="comment">// The user wants to buzz a link.</span>
        url = e.linkUrl;
    }

    buzzPostUrl += <span class="string"><span class="delimiter">&quot;</span><span class="content">url=</span><span class="delimiter">&quot;</span></span> + encodeURI(url);

    <span class="comment">// Open the page up.</span>
    chrome.tabs.create(
          {<span class="key"><span class="delimiter">&quot;</span><span class="content">url</span><span class="delimiter">&quot;</span></span> : buzzPostUrl });
};</pre></div>
</div>


<p>It&rsquo;s all pretty straight forward, we can get the url of the current page
where the context menu was clicked, we can also detect if there is any text
has been selected (e.selectionText) and pass that in to the
&ldquo;message&rdquo; parameter of the Buzz API, likewise, if the e.mediaType == image,
then we can add that to the imageurl parameter.  Once we are happy, then we
simply call the &ldquo;chrome.tabs.create&rdquo; API that we used in the first post in
the tutorial.</p>

<p>And that is it.  We now have context menu&rsquo;s happily integrated in to our
awesome extension.  Unless I can think of any more subtle and useful things
to include in the extension, then I think this is the last post&hellip;&hellip;.. hmm,
I hear the Omnibar API is released from experimental.</p>

<p>As always, the code is open and on
<a href="http://github.com/PaulKinlan/BuzzThis">http://github.com/PaulKinlan/BuzzThis</a> have a play and see how easy it
is to create Chrome Extensions.  And if you
do create one, let me know!!</p>

