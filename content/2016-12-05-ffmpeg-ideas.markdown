---
slug: ffmpeg-ideas
date: 2016-12-05
title: "Ideas for web apps with FFMPEG and ffmpeg.js"
---

I recently built a Progressive Web App that takes a [screencast from your
Android device and then wraps the video in a device
frame](https://paulkinlan.github.io/deviceframe.es/) using [FFMPEG.js](https://github.com/Kagami/ffmpeg.js) like so:

{{< youtube E_U6zvjW8so >}}
 
I also managed to sort out [building ffmpeg.js](https://paul.kinlan.me/building-ffmpeg.js/) 
so that with relative ease, create custom optimized builds of ffmpeg and run it
in the browser.

The two things together I think present a lot of opportunities to build some 
great new small Progressive Web Apps that push what we think the web is capable
of with regards to manipulating audio and video. 

There are a lot of web based video utilities on the web, but in my eyes many
are built like websites of old, and don't take advantage of the advancements in
client side processing, they are laden with advertising and can't work offline.

I am also very keen on the Unix philosophy of ["Do one thing and do it
well"](https://en.wikipedia.org/wiki/Unix_philosophy#Do_One_Thing_and_Do_It_Well)
so rather than build one massively monolithic video editing app, I think there
are a lot of different web apps that can be built that easily and quickly:

* Trim a video (take 5 seconds off the front, 3 off the back etc)
* Any video format -> GIF
* Lots of images -> Any video format
* Any video format -> Any video format
* Add a watermark
* Resize video
* Shrink video
* Add watermarks to a video
* Overlay videos on top of each other
* Splice videos together
* FFMPEG playground (drop in sources and a script)
* [If you have any ideas add them to this list](https://github.com/PaulKinlan/paul.kinlan.me/edit/master/content/2016-12-05-ffmpeg-ideas.markdown)

I think I have most of the code in place as a UI harness for this with my
[Device Frames repo on Github](https://github.com/PaulKinlan/deviceframe.es) and
in many cases it is a matter of adjusting the ffmpeg processing graph and
updating the UI to allow for some configuration.

I am going to create a couple of these over the coming weeks, if anyone wants to
join in, then get in contact!