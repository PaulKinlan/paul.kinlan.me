---
date: 2018-10-22 14:22:21.769000+00:00
link: https://bugs.chromium.org/p/chromium/issues/detail?id=897727
slug: chrome-bug-897727mediarecorder-using-canvas-capturestreamfails-for-large-canvas-elements-on-android
summary: I've encountered a bug in Chrome on Android where MediaRecorder, using Canvas.captureStream(),
  fails to encode video from large canvas elements (e.g., 1280x720).  While the process
  works on desktop Chrome, on Android, the recording stops abruptly at unpredictable
  points, likely due to limitations in the MediaRecorder API's encoding capabilities.  A
  smaller canvas (640x480) works fine, suggesting resolution-based limitations. I've
  reported this as Chrome bug 897727 and created a demo to illustrate the issue.
tags:
- Chrome
- Android
- MediaRecorder
- Canvas
- captureStream
- Video Encoding
- Bug
- Web Development
title: Chrome Bug 897727 - MediaRecorder using Canvas.captureStream() fails for large
  canvas elements on Android

---
At the weekend I was playing around with a Boomerang effect video encoder, you can kinda get it working in near real-time (I'll explain later). I got it working on Chrome on Desktop, but it would never work properly on Chrome on Android. See [the code here](https://glitch.com/edit/#!/boomerang-video-chrome-on-android-bug?path=script.js:86:22).

It looks like when you use `captureStream()` on a `<canvas>` that has a relatively large resolution (1280x720 in my case) the MediaRecorder API won't be able to encode the videos and it won't error and you can't detect that it can't encode the video ahead of time.

> (1) Capture a large res video (from getUM 1280x720) to a buffer for later processing.
> (2) Create a MediaRecorder with a stream from a canvas element (via captureStream) sized to 1280x720
> (3) For each frame captured putImageData on the canvas
> (4) For each frame call canvasTrack.requestFrame() at 60fps
> 
> context.putImageData(frame, 0, 0);
> canvasStreamTrack.requestFrame();
> 
> Demo: https://boomerang-video-chrome-on-android-bug.glitch.me/
> Code: https://glitch.com/edit/#!/boomerang-video-chrome-on-android-bug?path=script.js:21:42
> 
> # What is the expected result?
> For the exact demo, I buffer the frames and then reverse them so you would 
> see the video play forwards and backwards (it works on desktop). In generall I would expect all frames sent to the canvas to be processed by the MediaRecorder API - yet they are not.
> 
> ## What happens instead?
> It only captures the stream from the canvas for a partial part of the video and then stops. It's not predicatable where it will stop.
> 
> I suspect there is a limit with the MediaRecorder API and what resolution it can encode depending on the device, and there is no way to know about these limits ahead of time.
> 
> As far as I can tell this has never worked on Android. If you use https://boomerang-video-chrome-on-android-bug.glitch.me which has a 640x480 video frame it records just fine. The demo works at higher-resolution just fine on desktop.
> 

[Read full post](https://bugs.chromium.org/p/chromium/issues/detail?id=897727).

If you want to play around with the demo that works on both then [click here](https://boomerang-video-chrome.glitch.me)
