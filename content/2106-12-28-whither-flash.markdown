---
slug: whither-flash
date: 2016-12-28
title: "Whither Flash. Now what?"
description: It's the end of the road for Flash and plugins on the web, what do we do now on the web?
draft: true
---

I was [reflecting on 2016](/2016-devrel-year-in-review/) and the history of the
web over the past couple of months and what I would love to see happen in 2017
and beyond. 

I got thinking about Flash and advanced experiences that the plugin model brought
about by the `<APPLET>` tag, `<EBMED>` and [`<OBJECT>`](https://www.w3.org/TR/html401/struct/objects.html#h-13.3).
To quote the spec, the `<OBJECT>` tag enabled:

> Most user agents have built-in mechanisms for rendering common data types such
> as text, GIF images, colors, fonts, and a handful of graphic elements. To
> render data types they don't support natively, user agents generally run
> external applications. The OBJECT element allows authors to control whether
> data should be rendered externally or by some program, specified by the
> author, that renders the data within the user agent.

I'll gloss over a lot of the technology but in general native plugins could be
loaded and interfaced with through technologies such as
[NPAPI](https://en.wikipedia.org/wiki/NPAPI) and
[PPAPI](https://en.wikipedia.org/wiki/PPAPI) and they enabled experiences such
as Flash or things like [Quake Live](https://en.wikipedia.org/wiki/Quake_Live) -
you could play quake in the browser and all it needed was a little plugin.

**The Web *was* extensible**. Granted you needed a plug-in, but you could send
someone a link to content and they could access amazingly advanced experiences
without any install of your "app". No other platform comes close to the web when
it concerns reach and ease of access, on desktop at least.

On desktop, plugin platform developers had to deal with the migration away from
[NPAPI](https://blog.chromium.org/2014/11/the-final-countdown-for-npapi.html)
and PPAPI (in Chrome at least) and in many cases it wasn't worth it &mdash;
Silverlight never migrated to PPAPI, [QuakeLive moved native and into
Steam](http://www.vg247.com/2015/10/28/quake-live-migrated-to-steamworks-no-more-free-to-play-option/)
&mdash; and as such the web on desktop has slowly been losing features with the
exception of embedded Flash, more importantly the removal of plugins has been
[shifting users between
browsers](http://www.theinquirer.net/inquirer/news/2383624/google-will-kill-microsoft-silverlight-in-chrome-by-disabling-npapi-plug-in)
or back into native apps.

Mobile has been a different story altogether &mdash; ignore the follies of
Android supporting Flash &mdash; Mobile has had no plug-in model for the web
*(well, it might have with WebView, but I will deal with that in another post.)*

All of this will be coming to a head in 2017 with something that has been coined
as "HTML5 By Default" on desktop and it will require developers to make some
choices especially if they have experiences built with Flash.

Over the past couple of years the web platform has been gaining more and more
features allowing developers to offer experiences on the web that are
comparative to what you would expect on native platforms:

<figure>
 <img src='/images/web-platform-2016.png'>
 <figcaption>Web Platform 2016 &mdash; Web vs Native</figcaption>
</figure>

The theory is that the industry and the platform has ~~all~~ most of the pieces
it needs to [support everything that Flash has been offering for
years](https://en.wikipedia.org/wiki/Comparison_of_HTML5_and_Flash):

* Animations and timelines &mdash; The Web Animation's API has been around for a
  while, but it's got incredibly low usage primarily because Edge, Firefox
  (until recently) and Safari have not supported it. The current recommendation
  is to use [GreenSock](https://greensock.com/).
* Camera Access &mdash; `getUserMedia` which is only supported by Blink and
  Gecko engines but will soon include Edge and
  [WebKit](https://bugs.webkit.org/show_bug.cgi?id=146746) although Safari is 
  still a massive unknown.
* Media Streaming &mdash; The platform has MSE (Media Source Extensions) which
  is supported by Edge, Chrome, Safari (but not iOS) and Firefox and mobile
  platforms have support for HTTP Live Streaming. MP4/H.264 are broadly
  supported across all platforms.
* DRM for Media Streaming &mdash; Is in all major desktop platforms via Encrypted
  Media Extensions, and on most mobile platforms with the exception of Safari
  which supports Fairplay via HTTP Live Streaming.
* Clipboard Access &mdash; the ability to copy content on to the clipboard is 
  now ubiquitous on the web platform as of 2016.
* Font access &mdash; you can't get a list of the installed fonts on a users
  system. Whilst this is an issue it's becoming less of an issue as web fonts
  are becoming more prevelant and more effectively optimised.
* Packaging &mdash; Progressive rendering works for me, but not everyone. There
  is a benefit to being able to distribute one file and be able to reference files
  within that package.

## What are the browsers doing?

There have been a number of announcements from all browser vendors about their
plans, but they are all over the place so I will try and summarize what is
happening based on the publicly shared knowledge.

### Chrome

**Reference**: [Announcement](https://blog.google/products/chrome/flash-and-chrome/), [Rollout
plan](https://blog.chromium.org/2016/12/roll-out-plan-for-html5-by-default.html),
[Site Engagement
plan](https://www.chromium.org/developers/design-documents/site-engagement),
[Flash
Roadmap](https://sites.google.com/a/chromium.org/dev/flash-roadmap#TOC-HTML5-By-Default-Target:-Chrome-55---Dec-2016-)

**TL;DR** &mdash; NPAPI has been disabled in September 2015, all NPAPI plugins no longer work
Flash via PPAPI (embedded with Chrome) will be moved to a "click to activate" 
model for sites that have never been visited and will slowly ramp up over the 
year based on the user's engagement with the site until Flash content requires
a click to active (tentatively October 2017).

YouTube Flash Embeds are automatically [re-written to the HTML5 embed as of October
2016](https://bugs.chromium.org/p/chromium/issues/detail?id=625984).

### EDGE

**Reference**: [Announcement](https://blogs.windows.com/msedgedev/2016/12/14/edge-flash-click-run/#jLOsxEyi0MfEzdJv.97)

**TL;DR** &mdash; Like Chrome, Edge started by pausing non-critical Flash elements by default
(think Ads). In future updates Edge will not load Flash at all for most sites
based on some heuristic. It is also a little unclear how they will detect HTML5
by default if sites support it. I suspect it will be by not presenting Flash as
an option in `navigator.plugins` and `navigator.mimeTypes`.

Edge currently does not support Silverlight or any other ActiveX or NPAPI based
plugin.

### Safari

**Reference**: [Announcement](https://webkit.org/blog/6589/next-steps-for-legacy-plug-ins/)

**TL;DR** &mdash; Will act like there are NPAPI plugin installed by default. If
a site requires the plugin, the user will be able to enable it once or always
(as long as the user keeps using the site) by clicking on a placeholder in the
page. I am taking a punt, but I believe that Safari as of Safari 9 [replaced
Flash youtube embeds](https://trac.webkit.org/browser/trunk/Source/WebCore/Modules/plugins/YouTubePluginReplacement.cpp)
with the HTML embed.

### Mozilla

**Reference**: [Announcement](https://blog.mozilla.org/futurereleases/2016/07/20/reducing-adobe-flash-usage-in-firefox/)

**TL;DR**  NPAPI support will be removed in 2017. Flash will require click to
activate in 2017 - no firm ETA. YouTube Flash embeds are [already re-written to
HTML5 embed](https://bugzilla.mozilla.org/show_bug.cgi?id=769117).

## Now What?

It is easy for me to say that [this moment has been _almost_ 10 years in the
making](https://en.wikipedia.org/wiki/Apple_and_Adobe_Flash_controversy) since
the launch of the iPhone.

10, 9, 8, 7... years later and it's not that developers are creating new content
on the web that is Flash based &mdash; some are _**cough** Ads **cough**_
&mdash; it's more that we have a huge corpus of content that has not been
touched in many years that is Flash based, or there are systems that are
maintained that are generating real revenue for people and inertia is a critical
factor in not porting to HTML based solutions.

This change is looming fast, browsers are going ahead with this and the hurdles
are great enough for the user that it means they will prefer a smoother, more
seamless solution so developers are going to have to act, but how will they? I
am worried that developers have a choice of staying on the web or not.

The solution should be the web, but there are a number of scenarios at play:

* You're a business and you have a mobile native team, you know Mobile is big,
  why not cut your losses, remove support for one platform and save time and
  focus on the mobile platforms?
* You're used to Flash and you can still deploy to mobile native via Air and
  desktop too, so you do that.
* You're a Flash developer or site owner and you don't do anything. You might 
  consider moving to another platform that can host 
* You're taking the plunge and moving to the web

The first three issues are what we as an industry should fear! Sites and 
Experiences moving off the web into a closed platform. The latter point: "stay 
on the web" will require hard work.
  
It has taken 10 years to get even some of the smaller abilities of the Flash 
platform into the web platform and the platform is [still lumpy](/the-lumpy-web/)
and not every browser supports the features that developers need. It is also
incredibly clear what to do: there are no simple migration tools and there is no 
clear documentation and guidance about what developers should actually do to
make the process as painless as possible.

I am really concerned that at this inflection point the choice will be to take
content off the web and put it in a silo. As a web industry we really need to
not mess up this transition and support developers in this migration.

Looking at what we can do, here are some thoughts and I would appreciate any
other recommendations:

* Articulate a clear vision about what is possible on the web today, there is 
  still a lot of FUD about what the web can and can't do especially when it
  comes to usage numbers for older browsers.
* Provide great guidance about how to best build for this vision (for all 
  web developers)
* Provide clear and strongly opinionated documentation and guidance on how to
  migrate from Flash to the web covering as many scenarios as possible.

I glossed over it earlier (quite deliberately), but Media playback on the web is
entirely possible both streaming and if you require a DRM-based solution, the
problem is that support is [unbelievably incredibly lumpy](/the-lumpy-web/).
There are many different codec choices, streaming choices and even more
complexities around the choice of DRM solution with said streaming choice 
depending on the platform you want to target.

As a developer relations team for Chrome at Google, I'd like to make sure that
we have as much of the guidance needed to support developers in this
transition from Flash to Web especially from the angle of the media stack.

I am very keen to hear from Flash developers about your frustrations
and what you will need to help with the migration. If there are features missing
from Chrome or any other browser that you need, we need that list. If there
are tooling issues then it will be great to know. If there are things we are
blatantly missing then we need to know that too.

Onwards Web!