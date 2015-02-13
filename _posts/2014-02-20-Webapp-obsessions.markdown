---
layout: post
title: "Is our obsession with Web Apps blinding us from what the web is good at?"
date: 2014-02-17 17:15
comments: true
published: false
categories: webapps
---

Is our obsession with Web Apps and the need for native partiy stopping us from delivering truely amazing content based experiences?

I write this looking at the recent discussions and arguments over Web Components, at the same time as seeing a large investment in efforts such as SeriveWorker.  All great efforts, and I love my apps on the web as the next web developer.  But I do worry.

[todo: add in picture element debacle.]

Regions are no longer being implemented in Blink (the reasoning I am not sure about) [todo: check other browsers] and no one is talking about Exclusions.

The web is very slowly getting access to some of the features native app developers expect as standard, but is standing still on 

Native platforms already have comprhensive access to Sensors and low level functionality, offline and installability.  Meanwhile they are getting far better at what the Web is good at.  

Let's look at CoreText for a minute.  It has WebKit and TextKit.  Putting WebKit aside, [TextKit](https://developer.apple.com/library/ios/documentation/StringsTextFonts/Conceptual/TextAndWebiPhoneOS/CustomTextProcessing/CustomTextProcessing.html#//apple_ref/doc/uid/TP40009542-CH4-SW1) is suprisingly powerful.  It gives you the ability to:

*  Access to font metrics
*  Manage kerning
*  Create Exclusion paths and areas
*  Mult-column
*  Pagination

The point is not that native platforms are as strong as the web yet for rich content layout, but they are investing in rich content layout and catching up. Quickly!

The strength of the web, or HTML for me is that the publishing format is relatively simple, tolerant to malformed input (missed out a closing li? no worries).  Yet we (as an industry) are losing that focus.

Why don't we make a clearer delination between both

Worst thing to happen on the web is the concept of "interactive magazines"

What is wrong getting better at what you are good at?

I see huge number of Native Apps requiring rich text layout.

I look at this as a problem of focus.  The web is document and content first.  Native platforms are functionality first.  We, as the web platform, put huge investments in giving the browser access to more features.  We (web developers) often want full-screen, installable, high-priviledged apps.
