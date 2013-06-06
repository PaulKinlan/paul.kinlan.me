---
layout: post
title: "Screen Recording from your Android device"
date: 2013-06-06 13:45
comments: false
categories: chrome, android
---
In our talk for Google I/O 2013 &mdash; [Mobile HTML: The future of your sites](http://mobile-html.appspot.com/) &mdash; we wanted a way to show actual real demos of Chrome in action without have to constantly switch to the projector over to a special device.  Not only does switching cameras waste time, it is also easy to lose the context of what you are demoing in the first place.

The solution we came up with in the end was to record the videos of the device ahead of time and have them in-line in the slides.  I think it worked really well and it looked pretty cool too.   So how did we do it?

Well.  It's not easy.  Nor is our solution cheap.

It turns out that a lot of Android based devices have the ability to output HDCP via a selection of different methods (MHI, MiniHDMI) and if you can take this stream you can record at the FULL 60FPS at the extact resolution of the screen.  However the problem that you face with this is two fold:

1.  How do you get the output of the HDMI recorded to disk.
2.  HDCP.

Capturing the HDMI output from the device is pretty easy, but a little bit expensive.  We used a device called "[Blackmagic Insensity Shuttle](http://www.blackmagicdesign.com/products/intensity/) for Thunderbolt" - this device is AMAZING.  It allows you to attach HDMI and S-Video outputs and stream it into your Mac (or other computer).  You can then use their software to read the data from this new "Camera" and save it directly to a video.

One of the issues you will face is as soon as Android detects you have an HDMI output attached it will force itself into a landscape mode (which is not ideal).  The best solution I have found so far is to use [Orientation Control](https://play.google.com/store/apps/details?id=com.coinsoft.android.orientcontrol) (Paid) which lets your force the orientation on the device to be Portrait.

The biggest issue you will face recording from devices is HDCP.  HDCP is a form of copy protection **which you should not try to break or subvert**.  The BlackMagic devices will not record anything with HDCP embeded in the HDMI output.  After some experiementation I found that the Galaxy Nexus does not attach HDCP to the HDMI output and allows you to record the data from the web browser.

And that is pretty much it!


