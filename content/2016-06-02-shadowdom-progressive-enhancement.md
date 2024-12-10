---
slug: shadowdom-and-progressive-enhancement-to-create-a-sharing-component
date: 2016-06-02T13:20:32.000Z
title: "Shadow DOM and Progressive Enhancement to create a Sharing component"
draft: true
tags:
  - web components
  - shadow dom
  - progressive enhancement
  - sharing
  - javascript
  - url
  - twitter
  - web development
  - progressive web apps
summary: "Exploration of building a progressive sharing web component using Shadow DOM and focusing on ensuring URL visibility and manipulation within web apps. The component aims to be customizable, work across browsers with and without JavaScript, and provide a fallback mechanism for sharing (e.g., via Twitter intent).  The experiment leverages existing elements like anchor tags for progressive enhancement, allowing for either polyfilling or defaulting to the base element if Web Components are not supported.  The author expresses optimism about the future of web components."
---

There was a recent discussion about Progressive Web Apps and how we should be ensure that the URL 
is and should remain sacrosanct on the web, even if the experience has been designed to work and feel like
an application that runs natively on the web. 

I am hopeful that a solution will present itself, but it got me thinking: If standalone and fullscreen web apps
never got the ability for the user to view or manipulate the URL, what could a developer do to help users, yet keep 
their app looking like it was meant to be an app on the system?  Well, we need some common way or a component that 
web developers could easily drop in to their site that allows the user to see and manipulate the URL's if they wish
and also give the user the ability to perform contextual actions of things that they can do with that URL, such as
Share.

I have a chequered history and poor success story with "Sharing" on the web, but it is a still a common 
use-case and something that I want to see solved... I also like exploring and playing with technologies to deep dive into 
how they work and also work out some early best-practices.

So. What is new that I can play with?

It's a couple of weeks away from WWDC and looking at the [Safari Tech Previews](https://developer.apple.com/safari/technology-preview/release-notes/)
it seems quite likely that a large chunk of the Web Components Specs will be available for 
iOS and Mac in Safari, that is `<template>` and Shadow DOM in particular. Even without 
[Custom Elements](https://w3c.github.io/webcomponents/spec/custom/) this is huge news.

Like most developers I held off from playing too much with Shadow DOM and the rest of Web Components 
because I didn't want to have to rely on polyfills to heavily or worry about it never shipping in large
portion of the browser eco-system.  That worry seems to no longer be an issue!

Given all this, I decided to build a "Web Component" that can help answer the issue about the user not having
access to the URL bar and not being able to take the current URL and share it.

I set out some goals for what I wanted to achieve:

* It needs to progressive. Something "semantically" correct should happen if the user has a) no JavaScript, or b)
  is using a browser that doesn't support Web Components (I don't really want to shim or polyfill anything at the moment).
* It would need to be customizeable so that it fits the theme of any site.
* It needs to show the user the current URL, allow them to edit it and navigate if the user wants
* It needs to allow the user to at least easily copy the URL to the user's clipboard

During this experiment I got to like Web Components. Initailly I worried about the lack of Custom Elements and 
I fretted over this for a long time, I realised that I can still make these experiences progressive

The first attempt was to have an HTMLUnkownElement called `<share-button>` that would then be
enhanced with my custom class that handled all the logic for UI management, sharing and setting up the Shadow DOM.

This approach was interesting, I could do everything that I needed with this, however it wasn't "Progressive". So
I thought for a bit about how I would expect a developer to use this Web Component.

I liek the idea of taking an existing element and make it better by stamping a new DOM and logic on to it.

In my case, I am building a "Sharing" Component and many of the sharing services that exist have a simple URL that
let you load up their sharing interface. I decided that a good fallback would be to share to Twitter using their
simple "intent" (hint: It is not an intent - but that is for a discussion over a beverage of your choice) and 
simply enhance an anchor: `<a href="https://twitter.com/intent/tweet?text=Hello%20world">Share</a>`.

The theory behind this is sound (in my eyes):

* If there is no JS, I always have my fallback link to an existing sharing service.
* If Web Components don't exist in the user's browser, I can do two things:
  * I can polyfill the lack of Shadow DOM etc to provide the same functionality to the user as a user who 
    has Shadow DOM
  * I can choose not do anything other than use the default base element and style it
* If Custom Elements API exists then we could use the same element and enhance using the `is` 
attribute.  For example: `<button is="share-button">Share</button>`

I don't yet know the best strategy for building Web Components, but it does feel like we are at a tipping point
where even without custom elements we can optimize the way that we build for the web.

