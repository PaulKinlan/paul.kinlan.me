---
date: 2013-02-04
slug: bootstraping-your-own-mobile-device-lab-part-1
summary: In this blog post, I share a simple shell script to help you create your
  own mobile web testing lab for Android.  The script uses adb to connect to attached
  Android devices, sets up port forwarding for Chrome DevTools, and opens the browser
  on each device.  It's a starting point towards my goal of using a Raspberry PI to
  host adb and all connected devices, simplifying multi-device testing.
tags:
- android
- mobile web testing
- adb
- chrome dev tools
- raspberry pi
- shell script
- port forwarding
- multi-device testing
title: Bootstraping your own mobile web testing lab for Android Part 1

---
What do you do if you want to quickly test your sites on mutliple versions of Android at the same time?

There are couple of solutions, such as [Adobe Edge Inspect](http://html.adobe.com/edge/inspect/), but what if you want to create and manage your own in your own workflow?  I haven't seen single solution yet.

Here is a simple shell script that I created that starts to get you on your way to your own testing lab.  It connects to every single Android device that is attached to your machine by using `adb` (Android Debugging tool).

The process is as follows (and please suggest better ways):

*  Kill any existing adb servers
*  Get a list of attached devices
*  For each device set up port forwarding (required for [Chrome Dev tools](https://developers.google.com/chrome-developer-tools/docs/remote-debugging))
*  Fire Android intent to open the browser (with a url if one is on the command line)

<script src="https://gist.github.com/4706201.js"></script>

It's not a complete solution, but it is a nice way to start.  My ultimate goal is to have a [Raspberry PI](http://www.xda-developers.com/android/adb-fully-working-on-raspberry-pi/) hosting adb and all the devices that I can attach to it with an attached proxy that will route all my devtools requests to the correct device.

How do you test across multiple devices?
