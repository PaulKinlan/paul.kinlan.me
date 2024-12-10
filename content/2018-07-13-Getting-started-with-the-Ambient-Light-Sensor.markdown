---
date: 2018-07-13 11:55:01.570000+00:00
link: https://deanhume.com/ambient-light-sensor/
slug: getting-started-with-the-ambient-light-sensor
summary: I explored the Ambient Light Sensor API, a new feature available in PWAs.
  It lets developers access ambient light levels in lux units, useful for various
  applications like smart home lighting control or adjusting app brightness based
  on environmental conditions.  The API is built on the Generic Sensor API, which
  also supports other sensors like gyroscopes and magnetometers. I previously discussed
  the Generic Sensor API at Chrome Dev Summit 2016, and it's now available in Edge
  and Chrome (behind a flag).
tags:
- ambient light sensor
- generic sensor api
- pwa
- web development
- sensors
- light detection
- smart home
- dark mode
- chrome
- edge
- developer tools
title: Getting started with the Ambient Light Sensor

---
Dean Hume's been doing a lot great work with PWA's recently, and he's also been exploring a lot of the new platform API's, in this case the Generic Sensor API:

> The Ambient Light Sensor API provides developers with the means to determine ambient light levels as detected by the device&#x2019;s main light detector. This information is available to developers in terms of lux units. If you are building a Progressive Web App and you want to style it differently depending on the light levels in the room, then this could be the feature for you. There are a number of use cases for this feature, such as a web application that provides input for a smart home system to control lighting, a "Kindle" style reading app, or even a web app that calculates settings for a camera with manual controls (aperture, shutter speed, ISO, etc.).
> 
> 

[Read full post](https://deanhume.com/ambient-light-sensor/).

I spoke about the Generic Sensor API at Chrome Dev Summit 2016, so it's certainly taken a while for it to land in Chrome (I think it is still behind a flag) and it looks like it has landed in Edge first. The Ambient light sensor is one of many API's that is built on top of Generic Sensors &mdash; there are more such as gyro and magnetometers &mdash; and it allows you to get information about the ambient light levels around the user opening up use-cases such as automatic adjustment of brightness or even offering the user to switch to a dark-mode theme.  It's certainly going to be interesting to see what the base Generic Sensor API will bring to web experiences.
