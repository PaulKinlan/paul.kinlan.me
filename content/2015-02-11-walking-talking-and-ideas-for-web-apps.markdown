--- 
layout: post
title: "Walking, talking and ideas for web apps"
description: "How do you find ideas for web apps and why is it important to build apps that push the platform?"
categories: browsers mobile webapps 
---

An issue came up in a recent team meeting: in Developer Relations, how do you 
remain a leading expert in the field? My answer: Create. Build. Tell a story 
about what you have learnt. It is [a principle shared by Roman Nurik](https://medium.com/@romannurik/walk-then-talk-3b935bfe5484) 
which he called "Walk, then Talk"; I encourage you to read his post.

Our team, Chrome Developer Relations, are doing just this right now. We are 
building real-world apps that let us:

* stretch our understanding of how to build modern web applications; 
* push the capabilities of the web platform as they are developed; 
* define new patterns for how to combine existing and bleeding edge platform 
  features;
* create great stories that tell developers how they can also build similar 
  quality applications using the same tools. 

If we can achieve this and socialize it well, it is my hope that we increase the 
minimum bar for what developers should deliver on the web and raise the 
expectation of user experience from users (I'll talk more about this in another 
post, but I am using it to set the scene for this post.)

As a team we are lucky, we have a reasonable idea about the types of apps that 
we want to build and also the apps that we want to see on the web. But a lot of 
developers that I speak to struggle for ideas of what they can build.

I was catching up with Jake Archibald about how he came up with idea for 
[SVGOMG](https://jakearchibald.github.io/svgomg/)  — SVGOMG is a great app for optimizing SVGs, it's hard to tell that it is not a native app. It has a nice Material design, loads quickly, runs at 60fps, works 
across form-factors and has great use of touch gestures — and it came from the 
fact that people said SVGO was hard to use and needed a front end. A project was 
born!

He then used [npm](https://www.npmjs.com/), found the [SVGO](https://github.com/svg/svgo) and that gave 
him the impetus to create SVGOMG, a front-end client for a service library.

I think this is a brilliant idea! The promise of NodeJS is that it enables you 
to do full-stack development in one language. NodeJS and npm have built up a 
huge ecosystem (&gt; 120,000 packages) of JS libraries, tools and utilities, 
primarily focused on the server side of your application.

I'm going to ask you take a mental jump, because getting I am going to skip how 
to get NodeJS packages working in the browser, but it requires you to use 
[Browserify](http://browserify.org/), which to quote the Browserify site:

> browserify will recursively analyze all the require() calls in your app in 
> order to build a bundle you can serve up to the browser in a single 
> &lt;script&gt; tag.

Not every package will be browserify-erable, especially if it is a JS wrapper 
for an system level service (in which case Emscripten is an option), but the 
crux is, by using NPM and browserify we now have a huge repository of libraries 
that have done a huge amount of heavy lifting and are crying out for a 
beautiful, modern web app client.

What makes a modern web app? That comes in another post (Sorry).

I spent 20 minutes curating potential project ideas whilst casually browsing 
npm. I have also added them to the [WebUtils](https://github.com/WebUtils/Platform/issues) 
project which is a great place to collaborate and discuss what should be built 
and how to build it.

## **Converters**

Conversion tools are always a great source of app ideas.

* Unit Convert: [https://www.npmjs.com/package/convert-units](https://www.npmjs.com/package/convert-units)
* Currency Converter: [https://www.npmjs.com/package/currency](https://www.npmjs.com/package/currency)
* Sprite SVG Images: [https://www.npmjs.com/package/spritemaker-svg](https://www.npmjs.com/package/spritemaker-svg)
* WebCam 2 Gif: [https://www.npmjs.com/package/gif-encoder](https://www.npmjs.com/package/gif-encoder)

## **Calculators**

A simple search for 
"[calculator](https://www.npmjs.com/browse/keyword/calculator)" reveals a huge 
plethora of utilities that you can build upon.

* Loan Calculator:[https://www.npmjs.com/packages/financial-loan-calculator-engine](https://www.npmjs.com/packages/financial-loan-calculator-engine)
* Roman Numerals:[https://www.npmjs.com/packages/deromanize](https://www.npmjs.com/packages/deromanize)
* Student Loan Calculator:[https://www.npmjs.com/packages/uk-student-loan](https://www.npmjs.com/packages/uk-student-loan)

## **Calendars and Dates**

It constantly vexes me that every calendar I see on the web is 1) terrible, 2) 
optimized for desktop 3) full of ads and rubbish I don't need.

* A Simple calendar: [https://www.npmjs.com/package/calendar](https://www.npmjs.com/package/calendar)
* Days/Time until: [https://www.npmjs.com/package/timediff](https://www.npmjs.com/package/timediff)

## **Image tools**

Who doesn't want to manipulate images and why do we need native apps for actions 
we only perform a couple of times.

* RGB Analysis:[https://www.npmjs.com/package/rgbanalyse](https://www.npmjs.com/package/rgbanalyse)
* Object detector:[https://www.npmjs.com/package/pixfinder](https://www.npmjs.com/package/pixfinder)
* Exif reader: [https://www.npmjs.com/package/exif](https://www.npmjs.com/package/exif)
* Quick image cropper:[https://www.npmjs.com/package/scrissors](https://www.npmjs.com/package/scrissors)

## **QR Codes**

Every so often, you need to scan a QR code. Why do you need a native app for 
something you only use once in a blue moon.

* QR Code generator:[https://www.npmjs.com/package/qrcode](https://www.npmjs.com/package/qrcode)
* QR Code reader: [https://www.npmjs.com/package/qcode-decoder](https://www.npmjs.com/package/qcode-decoder)
* 

In fact, I built a QR code reader:[https://qrsnapper.appspot.com/](https://qrsnapper.appspot.com/) 
— article about this soon.

## **Editors**

I hate having to install native apps just to edit part of a file or image only 
once, and I don't think I am alone. People like to open files and do things with 
them. Make a front end for it. 

* Hex Editor: [https://www.npmjs.com/package/hex](https://www.npmjs.com/package/hex)
* Theme-color tool: [https://www.npmjs.com/package/color-scheme](https://www.npmjs.com/package/color-scheme)
* JSON Editor:[https://www.npmjs.com/package/json-nice](https://www.npmjs.com/package/json-nice)
* Quick PNG cropper: [https://www.npmjs.com/package/png-crop](https://www.npmjs.com/package/png-crop)

## **Players and Readers**

There are a huge number of API's that are clients for existing web services. For 
example any audio service normally has an API that lets you read play lists and 
gives you access to the audio.

* SoundCloud player:[https://www.npmjs.com/packages/soundcloud-audio](https://www.npmjs.com/packages/soundcloud-audio)
* Reddit Reader: [https://www.npmjs.com/package/snoode](https://www.npmjs.com/package/snoode)
* MixCloud player: [https://www.npmjs.com/package/mixcloud](https://www.npmjs.com/package/mixcloud)
* ePub Reader / Summary: [https://www.npmjs.com/package/epub](https://www.npmjs.com/package/epub)
* Tumblr client: [https://www.npmjs.com/package/tumblr](https://www.npmjs.com/package/tumblr)

## **Markdown tools**

Creating content on the web is a pain in the bum sometimes, Markdown at least 
can help make the authorship easier.

* Markdown to HTML: [https://www.npmjs.com/packages/markdown](https://www.npmjs.com/packages/markdown)
* HTML to Markdown: [https://www.npmjs.com/package/to-markdown](https://www.npmjs.com/package/to-markdown)
* Quick outline generator: [https://www.npmjs.com/package/markdown-outline](https://www.npmjs.com/package/markdown-outline)

