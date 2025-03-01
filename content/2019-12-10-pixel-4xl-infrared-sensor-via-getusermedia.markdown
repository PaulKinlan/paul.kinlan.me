---
date: 2019-12-10 02:34:54.588000+00:00
link: ''
slug: pixel-4xl-infrared-sensor-via-getusermedia
summary: The Pixel 4 XL's infrared camera, used for face detection, can be accessed
  through the standard getUserMedia API.  A live demo showcasing this can be found
  at the provided link.  Using the IR camera via getUserMedia blocks the phone's face
  unlock feature. This post invites readers to brainstorm potential applications of
  user-accessible infrared camera capabilities.  An update mentions Francois Beafort's
  contribution to Blink, adding 'infrared' to the camera name if the device supports
  it, making camera identification more convenient.
tags:
- Pixel 4 XL
- Infrared Camera
- getUserMedia
- WebRTC
- Face Detection
- Face Unlock
- Blink
- Chromium
- Francois Beafort
title: Pixel 4XL Infrared sensor via getUserMedia

---

<figure><img src="/images/2019-12-10-pixel-4xl-infrared-sensor-via-getusermedia-0.jpeg" alt=""></figure>

It's turns out that you can access the pixel 4 face detection IR camera via normal `getUserMedia`. The interesting thing is that if you try to do face unlock when this camera is being used (the bit where it throws things on to your face) the system will just flat refuse to do any of the face unlock process and that makes sense.

If you want to quickly try this then you can view the [demo here](https://webrtc.github.io/samples/src/content/devices/input-output/). 

Anyone got any ideas about what we can do with infrared camera access?

### Update

Francois Beafort updated Blink by adding `infrared` to the [camera name if the
device supports it](https://chromium-review.googlesource.com/c/chromium/src/+/1960152) - this will let you quickly get a better understanding of the type of camera just by the name (also will let users pick the one they want more effectively).
