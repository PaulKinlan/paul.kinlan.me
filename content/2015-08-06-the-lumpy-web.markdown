---
slug: the-lumpy-web
date: 2016-11-07
title: "The Lumpy Web"
description: "Wrinkles, Crinkles and lumpy bits."
image_header: "/images/lumpy.jpg"
---
 
It's almost a year since I started to write this post, but there have been a couple of things
that have happened recently that I finally dusted of the digital cob webs and started to write it 
up again.

In no uncertain terms the web is lumpy. There are many different types of Internet connected
devices each with different capabilities in terms of context of use (mobile, desktop, kiosk, [insert any future platform here]),
each of these devices normally has a browser on it so that the user can use the Web.

Taking the context of use out of the question, there are still a bewildering set of options for
us to consider.

There are many different types of "Engines": Blink, WebKit, Gecko, Trident... each Engine can power
many different Browsers created by Browser vendors such as: Apple, Google, Microsoft, Opera, Samsung, 
Baidu, Dolphin, ... WeChat, Facebook, the list goes on, all develop their systems at different 
cadences of launch and with each adding new features, fixing inconsistencies, introducing bugs and 
removing legacy features and having to potentially maintain many version of the browser that the users have
in the wild.

The web is incredibly diverse. This is a good thing, but it presents challenges for developers. Challenges
that I don't think we fully understand.

#### Lumps, Bumps and Humps

I've tried to classify the types of problems in to a number of "classifications" (honestly, I am not
shoe horning these classifications into these categories because I thought of a snappy name for the
title of this blog post).

**Lumps**: Browsers are hard to build, Specs are hard to write and all of it is created by people.
It's easy for implementation differences to occur. As a developer when you expect something to work and 
it doesn't then it causes you a huge problem. You have to deal with all of the different browsers, you 
have to manage the fact that different versions of the same browser may implement different versions
of the API's that you rely on.

**Bumps**: The specifcations defining the web evolve and change and as consensus builds at standards bodies, then 
browser vendors will start to implement the features. This can result in a mismatch of features and implementations.

There is a point where as a developer you can take a risk and decided to build your software and sites.

We recently saw this with ES2015. Everyone was committed to shipping, but Chrome, Safari, IE and Mozilla all
have different release schedules and as such you know something is going to be ubiquitos, but not exactly
when it will be.  There were tools that let you build using ES2015 and ship using ES5. There was a great talk at
 IO by Matt Gaunt and Sam Sacone called "[The 2016 Web Development Workflow](https://www.youtube.com/watch?v=sGsA7oKoQhI)" in 
 which Matt and Sam argue that you can now flip that around, you can build and itterate locally using all the latest
 tooling and then at deploy time ship with a compatability layer.

**Humps**: Browser vendors have their own priorities about what features are implemented and when. In many cases
consensus is reached across browser vendors and they will ship an API. In some cases there is an internal customer
and priority that a company might have that needs an Open Web Platform feature and thus that gets shipped 
before other browsers. Sometimes the browser vendors have a vision for the web and they start to build out 
that part of the web platform before anyone else, and sometimes staffing and their skills affect, heck if 
you don't have engineers that understand video and streaming it is unlikely that you will prioritize shipping 
an API like Web RTC.

In some cases this means that no other vendor will ship a feature for a relatively long time
creating a pronounced hump in the web. As a web developer you have two choices: Do or don't.  It is however
pretty clear.

We have Lumps, Bumps and Humps.

#### Telescopes, Binoculars and Microscopes; Gardenrollers and Steamrollers

If you have ever been in a field you will know this, but imagine you are walking across a 
field: You can see the humps from a mile away and you can make a choice and decide to tackle it or tak 
around it. Bumps too, they are harder to see from a far but you can. It's the Lumps that trip you and can 
do real damage. Because you can't easily see the obstacle, it's the one that causes the most damage. Because 
you can't predict the capabilities of the platform, you can't have the confidence that you need to build for it 
and you slow down as you try to navigate the field.

The thing about predictability is...

Telescopes:

We have a number of tools that give us an overview of what the web platform is capable of.  They remind me of 
a telescope, they let you get a sense of a full picture of the platform however the resolution is limited.  It's
like looking at Jupiter with the Hubble Space Telescope: you can get so much information from it that we wouldn't
get noramlly, but it's a little blurrey.

Caniuse.com and HTML5Test are two great examples of projects that we all use everyday to.

Binoculars:

Most of the Browser vendors have a status page where you can see what features have been shipped, which features
are being worked on, and which are planned (or not) for future work. These tools give you an insight in to what is
being worked on but they are normally from  

* [Chrome Status](https://chromestatus.com/) &mdash;
* [Microsoft]() &mdash;

Microscopes:

We don't quite have the tools that we (browser vendors and web developers) to understand
the platform as a whole.  We don't know how compatible Browsers are with the web.

There are efforts underway at the moment to help understand this.

* Web Platform tests
* CSS WG tests.

What we don't have is a way to run these and undersand actually what the platfom is doing and
in a way that developers can consume.  I am hopeful that caniuse.com, HTML5Test or anyone start to 
integrate these test suites into their products so we can start to get that intelligence 
about the capabilities of the web platform.

These are all great tools that can give you a huge amount of insight into the web platform
and can give you the confidence that you need to deploy on the platform, but they don't
fix the fundamental issue: The plaform needs to be less bumpy and a lot more predictable.

If you go back to field analogy you have many ways to make it smoother, you can use a garden roller
to iron out some of the lumps in your garden, but to clear the humps we need something
a lot bigger: A Steamroller.

Gardenrollers: 
Steamrollers: exert great pressure squashing to remove undulations and introduce uniformity.

The reason that I wrote this post now is that people are starting to work on this area a lot more and
there are a number of things comming together that gives me hope.

I had the good fortune to meet Patrick (pDiddy) Kettner, Interop PM from Microsoft at the Progressive
Web App Dev Summit.

I love the Venn Diagramm visualisation tool that Microsoft have created that show you.  It takes the WebIDL
that Browsers use to implement the

As mentioned above, the Web Platform  Test and the CSS WG Test are actively being contributed to 

Rick Byers on the Chrome team also recently started the [Web Platform Predictability](https://www.chromium.org/blink/platform-predictability) project in Blink

<figure>
<img src="/images/predictability.png">
<figcaption>Chrome's Web Platform Predictability</figcaption>
</figure>

Lumps, Humps and Bumps.  We need your help to make the Web Platform smoother.

`</tired-analogies>`

* Platform inconsistencies hurt us more than feature differences
* We need better tools to help us understand what the inconsitencies are
* Developers should raise more issues to keep browser vendors accountable


Image credit: [Phoenix Wolf-Ray](https://www.flickr.com/photos/phoenixwolfray/5492376594)