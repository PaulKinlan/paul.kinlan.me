---
slug: hyperlinking-beyond-the-web---css-tricks
date: 2018-07-15T17:28:21.103Z
title: Hyperlinking Beyond the Web - CSS-Tricks
link: https://css-tricks.com/hyperlinking-beyond-the-web/
tags: ['link', 'intents']
---
Atishay Jain on CSS Tricks writes about an area close to my heart, linking:

> Hyperlinks are the oldest and the most popular feature of the web. The word hypertext (which is the ht in http/s) means text having hyperlinks. The ability to link to other people&#x2019;s hypertext made the web, a web &#x2014; a set of connected pages. This fundamental feature has made the web a very powerful platform and it is obvious that the world of apps needs this feature. All modern platforms support a way for apps to register a URI (custom protocol) and also have universal links (handling web links in an app).
> 
> Let&#x2019;s see why we&#x2019;d want to take advantage of this feature and how to do it.

[Read full post](https://css-tricks.com/hyperlinking-beyond-the-web/).

This was a great article that covers all the different types of hyperlinking available to apps and sites. I've been doing a lot of research into this space ever since Web Intents and the state of advanced linking on the web leaves a lot to be desired, imo.

One of the reasons why I love the web, is that behind a link is direct access to the resource, I don't know any other platform that can combine the link and the actual resource in the same way, but it could be soooo much more. The standard link provides essentially a VIEW intent that contains state (the url) and context (text between the anchors), and you can hack about with it custom protocols but we need to go a lot further.

* We need to expand the vocabulary to `registerProtocolHandler` to all more access to more native schemes
* Anything registered with the protocol handler needs to be system wide.
* We need to be able to have web-sites to be able to handle opening a range of content types and have pages available to be registered as a system file handler.
* We need to have higher order actions available to developers, VIEW is great, we need an agreed upon set of core actions such as PICK, SAVE, EDIT so that we can more effectively understand a site's or app's capabilities, and the ability to extend them with higher-order semantics. Android has this, Siri is getting it, both using 'Intents', the Web should have it too.

This is one of the reasons why I'm so excited about messaging abstractions such as [Comlink](https://github.com/GoogleChromeLabs/comlink) that remove the burden of the postMessage madness and let you think about exposing function to other apps, and then once you expose function you need to more easily enable the discovery of that function... and that's what links enable.
