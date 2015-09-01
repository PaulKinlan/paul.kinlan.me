---
slug: the-reverse-polyfill
date: 2015-08-07
title: "Reverse Polyfilling"
image_header: "/images/.jpg"
draft: true
---

The browser is slow, it is bloated.  Stop adding new features!

How about taking some away?

That is an interesting question. There is an implicit assumption that once a feature 
is specified a) it should be implemented in all browsers and b) it should never be 
removed. Both of which are flawed in my eyes. Pruning of features natively supported
in the platform should be a viable option.

I have a lot of memories of building for the Win32 platform and Microsoft's
insistance at the time that apps will not break between operating systems upgrades because
windows will always be backwards compatible &mdash; As a developer this felt great, my stuff will
work and keep working. Each new OS revision adding many new and rich
platform features that developers wanted, all whilst retaining the features back from 
days prior to Windows 3.11.  

Bloat, increase size and reduces cadence. All of this was a massive cost, and the web 
is in a similar position.

The question needs to be raised. When should a piece of the platform be put out to pasture and 
What do we as web developers do we do when features on the web die?

Browser vendors are actively deprecating features on the web already, some because of poor
standarisation, others because they are large monolithic codebases with web developers
hardly using them and in some cases the cost of maintaining support for these features
is too high.  A set of recent changes spring to mind where this is happening. 

* showModalDialog (Chrome, Microsoft)
* XSLT (Maybe)
* SMIL

The case for doing this is strong: Less code, less maintanence, fewer bugs, smaller binaries, 
reduced attack surfaces, faster browsers.  

The case for **not** doing it is strong too: Messing with Developers and breaking working stuff.

There is also an argument to stop adding new features and instead keep what we have. I 
will briefly say on this that this is not feasible, not if we want the web to thrive and evolve
in the world of mobile (I will do a seperate post about this).

Interesting questions arise out of this: How do we (as browser vendors) tell developers about this 
so that they can migrate their sites and apps to new equivilent API's and keep their 
users happy; How does a developer who can't migrate keep their sites and businesses functioning? 

Traditionally we web developers smooth over the [lumpy bits](/the-lumpy-web/) bits of the web 
by creating a polyfill that will implement the feature in another technology. For example, 
when getUserMedia was introduced many sites that used this new API would use a Flash 
plugin to provide the functionality using a functionally similar API. As mobile started to 
eat the world polyfilling in this manner becomes less and less viable.

Polyfills and Shims have three major problems: Everyone knows they are not "the actual" API
&mdash; [Modernizer calls them Fallbacks](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills) &mdash; 
and only use them when they have to or not at all; they don't integrate well with the
progressive enhancemnt story; they frequently rely on plugins which are non existant 
on mobile.

With plugins deprecated, it has been up to browser vendors and spec authors to ensure that 
when new features are defined and implemented, they are done so in a way that can be explained by 
the core primitives and foundations that can be implemented upon.

To quote the [Extensible Web Manifesto](https://extensiblewebmanifesto.org/)

> To enable libraries to do more, browser vendors should provide new low-level 
> capabilities that expose the possibilities of the underlying platform 
> as closely as possible.
>
> They should also seed the discussion of high-level APIs through JavaScript 
> implementations of new features (such as Mozilla’s X-Tags and Google’s Polymer).

Maybe every "fundamental" new feature won't be able to implemented today in this way, but as more of the 
platform is exposed by primitives across the browser landscape, in my head at least, polyfills
will become more prevelant, easier to implement and provide unified access to new capabilities
that differentiate the web from native platforms.

Service Worker and it's Network API's are a prime example of the Extensible Web in action. It can 
be managed in a way that enables the same declartive API that AppCache defines yet it provides all 
the raw primitives for building any number of more appropriate solutions for your web 
site: partical caching, intelligent caching, progressive offlining. You name it, Service Worker
 can enable it for the network (and other platform features).

We have a huge chunck of the web platform that wasn't built with the extensible web in mind.

So can we remove AppCache? Yes. If someone has built a "reverse 
[polyfill](http://stackoverflow.com/questions/6599815/what-is-the-difference-between-a-shim-and-a-polyfill)" for it.

*Are people building "reverse polyfills"?*

Yes and No.

Microsoft in Edge have [implented XPath Level 3](http://blogs.windows.com/msedgedev/2015/03/19/improving-interoperability-with-dom-l3-xpath/) 
in JavaScript via [Wicked Good XPath](https://github.com/google/wicked-good-xpath).  You 
wont see the polyfill pouluting the pages as they have a seperate runtime engine for it.

Chrome [replaced the](https://codereview.chromium.org/394773003) `<marquee>` element in
the Blink rendering engine.

Neither of these two are visible to the developer, they just work and it appears they 
are working well enough in terms of performance that no one notices they are not directly
integrated natively into the browser.

* Extensible web => core primitives, higher level constructs built by developers.
* We need more platform pieces ported from other languages => Web Assembly.
* It's a shame that the w3c don't build out these API's in pure JS.

If large portions of DOM APIs are removed from browsers and there is no direct replacement
then JS only spec compliant solutions are going to be needed.

Reverse Polyfills are the future. They are the same as polyfills but for features that are
pulled from the platform, and those added to the platform.  Developers will need to accept
that Polyfills are a good thing and are now part of the progressive enhancement story.

* Need to be API compatible
* [TODO]

I believe the long term viability of the web depends on the [Extensible Web](https://extensiblewebmanifesto.org/):
build the primatives of the web in a way that can be expanded on without the need for new core features. 
To get to this new future we are going to have to push forwards faster on the Extensible Web.

We are going to need technologies such as ASM.js and WebAssembly to reverse polyfill.

Funny thought: A bare bones browser that exposes has all API's open that you as a developer
need to choose to polyfill.


https://github.com/domenic/html-as-custom-elements 
Blink-in-JS https://code.google.com/p/chromium/issues/detail?id=341031
