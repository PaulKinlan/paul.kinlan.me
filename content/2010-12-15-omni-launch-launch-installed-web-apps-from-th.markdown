---
slug: omni-launch-launch-installed-web-apps-from-th
date: 2010-12-15
 
title: "Omni Launch: Launch Installed Web apps from the URL bar"
published: true
---
<p>Yes, I know, three posts today about the <a href="">Management API</a>.  Anyway, I have
created an <a href="https://chrome.google.com/webstore/detail/bjjlkdelfjemfgmkjinpglfcbmchlnac">Awesome extension</a>
that allows you to use your URL Bar (The Omnibox) to find an launch apps by
their name.</p>

<p>It is pretty cool, just type '<strong>go</strong> TAB or SPACE <em>app name</em>' in your URL
bar and that is it.  It will search through your installed extensions and
let you launch it very quickly.</p>

<p>The remarkable thing is that this extension took 20 minutes to create, and I
will try and show you how in this post.</p>

<p>Like all extensions, the first thing that we do is define a manifest.</p>

<div class="CodeRay">
  <div class="code"><pre>{
  <span class="key"><span class="delimiter">&quot;</span><span class="content">name</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">Omni Launch</span><span class="delimiter">&quot;</span></span>,
  <span class="key"><span class="delimiter">&quot;</span><span class="content">description</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">Launches apps, the quick way!</span><span class="delimiter">&quot;</span></span>,
  <span class="key"><span class="delimiter">&quot;</span><span class="content">version</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">0.0.0.2</span><span class="delimiter">&quot;</span></span>,
  <span class="key"><span class="delimiter">&quot;</span><span class="content">background_page</span><span class="delimiter">&quot;</span></span>: <span class="string"><span class="delimiter">&quot;</span><span class="content">background.html</span><span class="delimiter">&quot;</span></span>,
  <span class="key"><span class="delimiter">&quot;</span><span class="content">permissions</span><span class="delimiter">&quot;</span></span> : [<span class="string"><span class="delimiter">&quot;</span><span class="content">management</span><span class="delimiter">&quot;</span></span>],
  <span class="key"><span class="delimiter">&quot;</span><span class="content">omnibox</span><span class="delimiter">&quot;</span></span>: { <span class="key"><span class="delimiter">&quot;</span><span class="content">keyword</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">go</span><span class="delimiter">&quot;</span></span> },
  <span class="key"><span class="delimiter">&quot;</span><span class="content">icons</span><span class="delimiter">&quot;</span></span> : {
    <span class="key"><span class="delimiter">&quot;</span><span class="content">16</span><span class="delimiter">&quot;</span></span> : <span class="string"><span class="delimiter">&quot;</span><span class="content">go.png</span><span class="delimiter">&quot;</span></span>
  }
}</pre></div>
</div>


<p>The important thing here is the 'omnibox' attribute which lets you define a
keyword that will allow the user to activate your extension.</p>

<p>Chrome does a lot of magic now, firstly it takes your 16 pixel icon and when
ever the user types 'go' into the address bar this icon will be shown next
to the action (although it will be in grey-scale).  If you load this
extension now, as is, you will see what I mean.</p>

<p>Now lets add some functionality to the background.html file.  This is the
brains of our extension.  The way the extension works is a  progressive
filter.  If I type 'go t' it will find all apps that contain 't', if I type
'tw' it will find all apps that have a 'tw' in their name.  It is pretty
basic stuff.</p>

<p>The first thing that we will do is hook-up the a function that handles the
keypresses in the omnibar for our keyword.  There is a simple API called</p>

<div class="CodeRay">
  <div class="code"><pre><span class="keyword">var</span> <span class="function">inputChanged</span> = <span class="keyword">function</span>(text, suggestionsCallback) {
    <span class="keyword">if</span>(text == <span class="string"><span class="delimiter">&quot;</span><span class="delimiter">&quot;</span></span>) {
      <span class="keyword">return</span>;
    }

    <span class="keyword">var</span> suggestions = [];
    <span class="keyword">var</span> textlc = text.toLowerCase();
    <span class="keyword">var</span> re = <span class="keyword">new</span> RegExp(<span class="string"><span class="delimiter">&quot;</span><span class="content">(</span><span class="delimiter">&quot;</span></span>+text+<span class="string"><span class="delimiter">&quot;</span><span class="content">)</span><span class="delimiter">&quot;</span></span>,<span class="string"><span class="delimiter">&quot;</span><span class="content">ig</span><span class="delimiter">&quot;</span></span>);

    <span class="keyword">for</span>(<span class="keyword">var</span> a <span class="keyword">in</span> apps) {
      <span class="keyword">var</span> app = apps[a];
      <span class="keyword">var</span> name = app.name.toLowerCase();
      <span class="keyword">var</span> idx = name.indexOf(textlc);
      <span class="keyword">if</span>(idx &gt; -<span class="integer">1</span>) {
        <span class="keyword">var</span> content = app.name;
        <span class="keyword">var</span> description = (app.description == <span class="string"><span class="delimiter">&quot;</span><span class="delimiter">&quot;</span></span>) ? 
           <span class="string"><span class="delimiter">&quot;</span><span class="content"> </span><span class="delimiter">&quot;</span></span> : app.description;

        <span class="keyword">var</span> matchStyle = chrome.omnibox.styleMatch(idx, text.length);

        suggestions.push(
          {
            <span class="key"><span class="delimiter">&quot;</span><span class="content">content</span><span class="delimiter">&quot;</span></span>: content,
            <span class="key"><span class="delimiter">&quot;</span><span class="content">description</span><span class="delimiter">&quot;</span></span> : content + <span class="string"><span class="delimiter">&quot;</span><span class="content"> - </span><span class="delimiter">&quot;</span></span> + description,
            <span class="key"><span class="delimiter">&quot;</span><span class="content">descriptionStyles</span><span class="delimiter">&quot;</span></span> : [
              matchStyle
            ]
          }
        );
      }
    }

    suggestionsCallback(suggestions);
  };</pre></div>
</div>


<p>And hook-up the handler:</p>

<div class="CodeRay">
  <div class="code"><pre>chrome.omnibox.onInputChanged.addListener(inputChanged);</pre></div>
</div>


<p>The code is pretty straight forward, but it does do some special bits.  For
a start, we only want to be able to launch apps, so we need to maintain a
simple list of all  apps (done
via chrome.management.getAll(getAllCallback);); once that is out of the way,
we have the handler hooked up (onInputChanged) that detects when the users
is changing their input against our keyword.  The code iterates across all
known apps and checks to see if their name contains the search term.  If it
does we add it to an array of suggestions.  We also style the suggestion a
little using 'chrome.omnibox.styleMatch' to highlight the exact text that
matched in the suggestion.  At the end of the handler we call the method
(suggestionsCallback) passed in to our handler with a list of the apps that
we are suggesting to the user.</p>

<p>And that is the basics done for adding suggestions into the Omnibox, it
isn't an amazing amount of use at the moment because if you select one of
the suggestions it doesn't do anything.  We want it to launch the app
Dammit! :)</p>

<p>Luckily, launching apps and find the selected item is really really easy.</p>

<p>So here goes:</p>

<div class="CodeRay">
  <div class="code"><pre><span class="keyword">var</span> <span class="function">inputEntered</span> = <span class="keyword">function</span>(text) {
  <span class="keyword">var</span> appsList = [];

  <span class="keyword">if</span>(text == <span class="string"><span class="delimiter">&quot;</span><span class="delimiter">&quot;</span></span>) {
    <span class="keyword">return</span>;
  }

  <span class="keyword">for</span>(<span class="keyword">var</span> a <span class="keyword">in</span> apps) {
    <span class="keyword">var</span> app = apps[a];

    <span class="keyword">if</span>(app.name.toLowerCase() == text.toLowerCase()) {
      chrome.management.launchApp(app.id);
      <span class="keyword">return</span>;
    }
  }
};</pre></div>
</div>


<p>And hook up a handler that is triggered when the user makes a selection.</p>

<div class="CodeRay">
  <div class="code"><pre>chrome.omnibox.onInputEntered.addListener(inputEntered);</pre></div>
</div>


<p>This code is pretty basic, all we do is loop through each of the installed
apps looking for the first one that matches the same name as the name of the
app selected in the suggestions list and launch it using the
'chrome.management.lauchApp' API.</p>

<p>And we are all done.  If you want to see this code in action it is
<a href="https://github.com/PaulKinlan/OmniLaunch">available on Github/PaulKinlan/OmniLaunch</a>.  Fork away and tell me what you
build.</p>

