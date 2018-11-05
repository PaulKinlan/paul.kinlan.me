---
slug: boomerang-video
date: 2018-11-05T09:53:10.359Z
title: 'Creating a simple boomerang effect video in javascript'
tags: [video, boomerang, mediarecorder]
video_url: /videos/boomerang.webm
video_autoloop: true
---

In the process of building on online [video
editor](/building-a-video-editor-on-the-web-with-the-web/) I wanted to scratch
an itch that had been bugging me for a long time. Boomerang effect. It's cheesy,
fun and pretty useless. It's also been said to be impossible to do on the web in
real-time.... [until now](https://boomerang-video-instant.glitch.me/).

You can try the [Instant Boomerang
Creator](https://boomerang-video-instant.glitch.me/) if you don't want to read
the article. :)

For the uninitiated, the boomerang effect is a video effect that is popular on
Instagram - a video will play forwards and then it will play backwards in an
infinte loop.

It turns out that it is not that easy to recreate on the web, especially if you
want it to happen instantly, but I would like to show you how I did it.

This article assumes that you know how to [record the frames from a video
stream using the MediaRecorder API](/tags/mediarecorder/).

A simplistic approach would be to play a video forwards in a video element and
then when the playback position reaches the end of the video, set the
`playbackRate` to -1 and then repeat the process again when the playback
position reaches the beginning of the video. This, however has a number of
problems, the first that it's nearly impossible to get an accurate timestamp of
where the playback is in the video, and secondly the events that fire on the
`<video>` element aren't instant - both combined mean that the video playback
won't be smooth to the user, it also means that you will need to do the video
processing on the server because this would just be a simple video that is
recorded in normal forwards time.

An better solution would be to create a video file that had the forwards and
backwards frames in one video file.

The solution I created uses a couple of little known API's `captureStream()`.
These API's are supported by Chromium based browsers and Firefox (there's
a hint it might be in Safari too).

The `captureStream()` API is available on `<canvas>`, `<video>` and `<audio>`
elements, and when called return a `MediaStream` object that can be used
either as a source for a `<video>` element, or as the input to the `MediaRecorder`
API.

It is the `captureStream` method on the `<canvas>` element that is particularly
interesting. The method enables you to draw to the canvas (as you normally
would) and then at your own rate call `requestFrame()` on the video track of the
stream, which will push the contents of the `<canvas>` on to the MediaStream for
recording or for playback.

Armed with this method, my solution to get instant looping boomerang and a recording 
of the single loop was as follows.

1. Get the Web Cam stream via `getUserMedia`
2. Create a 'frame buffer', to hold frames from the video camera stream when we
   want to record
3. Create a canvas element that will act as our live video element
3. Set up a `requestAnimationFrame` and grab the frame from the camera stream
   and pipe it to a hidden `<video>` element so that they can be drawn to a
   visible `<canvas>.
3. Set up a `MediaRecorder` whose input is the result of `canvas.captureStream()`
4. When the user wants to record
    1. Set the `MediaRecorder` to record, then for each frame
    2. Continue to draw each frame of video to the canvas (this is now the
       forward part of the boomerang)
    3. Add the `canvas` pixels to 'frame buffer'
    4. When the user stops recording, clone and reverse the 'frame buffer' 
    5. Join the the two frame buffers together.
    6. Stop rendering from the camera stream to the canvas, but use the frames
       from the 'frame buffer', starting in the middle (the point the user
       stopped recording)
    7. As we progress through the frame buffer, stop the `MediaRecorder` when
       at the last frame (the output will be exactly one forward loop and one
       reverse loop).
    8. Treat the frame buffer as a circular array, making an infinte loop of
       boomerangtastic video.

The code is on my [Glitch]() but the core logic is

```javascript
let renderFrame = () => {
  // Every draw to the canvas will be rendered to the MediaStream
  // once requestFrame is called
  let imageData;
  if (canvasStreamTrack === undefined) return;

  if(recording) {
    // The forwards part of the loop, draw to canvas anc
    // record the frame in to the 'frame buffer'
    context.drawImage(bufferVideo, 0, 0);
    imageData = context.getImageData(0, 0, width, height);
    frames.push(imageData);
  } 
  else {
    if (playback === false) {
      // Use the camera stream straight to canvas
      context.drawImage(bufferVideo, 0, 0);
    } 
    else {
      canvasOutput.width = canvasOutput.width;
      // Loop through the frame buffer and draw to canvas
      frameIdx = (++frameIdx) % frames.length;
      context.putImageData(frames[frameIdx], 0, 0);
      if (frameIdx === 0 && rec.state != 'inactive') { 
        // We are at the last frame of the reversal, stop recording
        rec.stop();
      }
    }
  }

  // Make sure the updates to canvas are rendered on to the stream.
  canvasStreamTrack.requestFrame();
  requestAnimationFrame(renderFrame);
};
```