---
slug: the-lumpy-web
date: 2016-07-16
title: "The Lumpy Web"
description: "Wrinkles, Crinkles and lumpy bits."
image_header: "/images/lumpy.jpg"
---

It's well over a year since I started to write this post, but there have been a couple of things
that have happened recently that I finally dusted of the digital cob webs and started to write it 
up again.  I started to think about writing it when I was presenting [This is the web platform](
https://speakerdeck.com/paulkinlan/this-is-the-web-platform) at Fronteers in Amsterdam in 2014.

<script async class="speakerdeck-embed" data-id="7105f980347a013238ed56e996df704e" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

I was doing a lot of research off the back of [caniuse.com](http://caniuse.com) and I was building out
[iwanttouse.com](http://iwanttouse.com) and a [little CLI to query the data](https://github.com/paulkinlan/cli-caniuse) so
that I could start to see broadly how compatible the web is.

#### The Lumpy Web

In no uncertain terms the web is lumpy. There are many different types of Internet connected
devices each with different capabilities in terms of context of use (mobile, desktop, kiosk, [insert any future platform here]),
each of these devices normally has a browser on it so that the user can use the Web.

Taking the context of use out of the question, there are still a bewildering set of options for
us to consider.

There are many different types of "Engines": Blink, WebKit, Gecko, EdgeHTML... each Engine can power
many different Browsers created by Browser vendors such as: Apple, Google, Microsoft, Opera, Samsung, 
Baidu, Dolphin, ... WeChat, Facebook, the list goes on, all develop their systems at different 
cadences of launch and with each adding new features, fixing inconsistencies, introducing bugs and 
removing legacy features and having to potentially maintain many version of the browser that the users have
in the wild.

The web is incredibly diverse. This is a good thing, but it presents challenges for developers. Challenges
that I don't think we fully understand and that I want to try and raise awareness of.

#### Lumps, Bumps and Humps

I've tried to classify the types of problems in to a number of "classifications" (honestly, I am not
shoehorning these classifications into these categories because I thought of a snappy name for the
title of this blog post).

**Lumps**: Browsers are hard to build, Specs are hard to write and all of it is created by people.
It's easy for implementation differences to occur. As a developer when you expect something to work and 
it doesn't then it causes you a huge problem. You have to deal with all of the different browsers, you 
have to manage the fact that different versions of the same browser may implement different versions
of the API's that you rely on.

**Bumps**: The specifications defining the web evolve and change and as consensus builds at standards bodies, then 
browser vendors will start to implement the features. This can result in a mismatch of features and implementations.

There is a point where as a developer you can take a risk and decided to build your software and sites.

We recently saw this with ES2015. Everyone was committed to shipping, but Chrome, Safari, Edge and Mozilla all
have different release schedules and as such you know something is going to be ubiquitous, but not exactly
when it will be.  There were tools that let you build using ES2015 and ship using ES5. There was a great talk at
IO by Matt Gaunt and Sam Saccone called "[The 2016 Web Development Workflow](https://www.youtube.com/watch?v=sGsA7oKoQhI)" in 
which Matt and Sam argue that you can now flip that around, you can build and iterate locally using all the latest
tooling and then at deploy time ship with a compatibility layer.  The Bumps are clear, but we can work around
them effectively because we clearly can see what they are.

**Humps**: Browser vendors have their own priorities about what features are implemented and when. In many cases
consensus is reached across browser vendors and they will ship an API. In some cases there is an internal customer
and priority that a company might have that needs an Open Web Platform feature and thus that gets shipped 
before other browsers. Sometimes the browser vendors have a vision for the web and they start to build out 
that part of the web platform before anyone else, and sometimes staffing and their skills affect, heck if 
you don't have engineers that understand video and streaming it is unlikely that you will prioritize shipping 
an API like Web RTC.

In some cases this means that no other vendor will ship a feature for a relatively long time
creating a pronounced hump in the web. As a web developer you have two choices: Do or don't. It is however
pretty clear.

<figure>
<img src="/images/lumpy-web.jpg">
</figure>

We have Lumps, Bumps and Humps.  How do we deal with them?

#### Telescopes, Binoculars and Microscopes; Gardenrollers and Steamrollers

If you have ever been in a field you will know this, but imagine you are walking across a 
the countryside: You can see the humps from a mile away and you can make a choice and decide to tackle it or tak 
around it. Bumps too, they are harder to see from a far but you can. It's the Lumps that trip you and can 
do real damage. Because you can't easily see the obstacle, it's the one that causes the most damage. Because 
you can't predict the capabilities of the platform, you can't have the confidence that you need to build for it 
and you slow down as you try to navigate the field.

Predictability is a great thing in hindsight.

Luckily developers have been thinking about this for a long time and many tools have been created to help
us web developers. I like to think of them in terms of the granularity that they give us.

**Telescopes**:

A number of tools exist that give us an overview of what the web platform is capable of.  They remind me of 
a telescope, they let you get a sense of a full picture of the platform however the resolution is limited.  It's
like looking at Jupiter with the Hubble Space Telescope: you can get so much information from it that we wouldn't
get normally, but it's a little blurry, the details you need are not clearly visible.

Caniuse.com and [HTML5Test](https://www.html5test.com/) are two great examples of projects that we all use everyday.

**Binoculars**:

Most of the Browser vendors have a status page where you can see what features have been shipped, which features
are being worked on, and which are planned (or not) for future work. These tools give you an insight in to what is
being worked on but they are normally from  

* [Chrome Status](https://www.chromestatus.com/)
* [WebKit Feature Status](https://webkit.org/status/)
* [Microsoft](https://developer.microsoft.com/en-us/microsoft-edge/platform/status/)

These are great tools created by the Browser vendors to give you an idea of what they have been working on and 
what they are working now and what they are considering to work on in the future. This data gives us developers
a great reference point.

We even get to understand the usage of certain features. 

* [Microsoft's measured feature popularity](https://developer.microsoft.com/en-us/microsoft-edge/platform/usage/)
* [Chrome's measured CSS popularity](https://www.chromestatus.com/metrics/css/popularity)
* [Chrome's measured JS popularity](https://www.chromestatus.com/metrics/feature/popularity)

Great tools, but again the resolution is not as good as you need.

**Microscopes**:

We don't quite have the tools needed (browser vendors and web developers) to understand
the platform as a whole.  We don't really know how compatible Browsers are with the web.

But there are efforts underway at the moment to help understand this.

* [Web Platform tests](https://github.com/w3c/web-platform-tests)
* [CSS WG tests and Test Harness](https://test.csswg.org/harness/)

These tests are normally run by the browser vendors to test how compatible their implementations are 
with the spec. The Web Platform Tests (started by test the [http://testthewebforward.org/](http://testthewebforward.org/))

#### What do we need?

If you go back to field analogy you have many ways to make it smoother, you can use a garden roller
to iron out some of the lumps in your garden, but to clear the humps we need something
a lot bigger. We need a Steamroller.

What we don't have is an easy way to run and aggregate the data and truly understand actually what the platform is doing and
in a way that developers can consume. I am hopeful that caniuse.com, HTML5Test or anyone start to 
integrate these test suites into their products so we can start to get that intelligence 
about the capabilities of the web platform.

These are all great tools that can give you a huge amount of insight into the web platform
and can give you the confidence that you need to deploy on the platform, but they don't
fix the fundamental issue: The platform needs to be less bumpy and a lot more predictable.

Microsoft have done a great job at working out how interoperable the web is, you should check out
the Platform Visualizer.

<figure>
<img src="/images/webplatform-visualizer.png">
<figcaption><a href="https://developer.microsoft.com/en-us/microsoft-edge/platform/catalog/">Microsoft's Platform Visualizer</a></figcaption>
</figure>

It was incredibly interesting to learn about how they gathered this data for this tool.

> Browser information was gathered by traversing the type system within the latest available version of the top browsers. Specification data was gathered by extracting Web IDL definitions from notable web specifications.

It's incredibly hard to get this data, but it's incredibly valuable.

Rick Byers on the Chrome team also recently started the [Web Platform Predictability](https://www.chromium.org/blink/platform-predictability) project in Blink

<figure>
<img src="/images/predictability.png">
<figcaption>Chrome's Web Platform Predictability</figcaption>
</figure>

The reason that I finally got around to writing this post now is that people *are* starting to work on this area a lot more and
there are a number of things coming together that gives me hope.

Lumps, Humps and Bumps. We need to make the Web smoother, more predictable. 

`</tired-analogies>`

#### My vision for a happier developer life

* Platform inconsistencies hurt us more than big feature differences, we should start to try and prioritize aligning the platform
* We need better tools to help us understand what the inconsistencies are and guidance on how to manage them
* Developers should raise more issues to keep browser vendors accountable when there are differences

I would love to see a dashboard of all the runs across all of the browsers against [Web Platform tests](https://github.com/w3c/web-platform-tests).

I would love to see tools like HTML5Test and CanIUse.com be backed off the data generated by these tests.

I would love to see tools like HTML5Test and CanIuse.com get the granularity of Microsoft's visualizer.

I would love the data traffic data from caniuse.com and html5test to be applied against the data that Microsoft extracted so vendors
could infer the pain points that developers hit and work on prioritizing those fixes.

I would love to see a more consistent web at the lower levels.

I am hopeful.

Header image credit: [Phoenix Wolf-Ray](https://www.flickr.com/photos/phoenixwolfray/5492376594)