---
date: 2018-10-12 06:35:22.116000+00:00
link: https://bugs.chromium.org/p/chromium/issues/detail?id=894556&can=1&q=reporter%3Ame&colspec=ID%20Pri%20M%20Stars%20ReleaseBlock%20Component%20Status%20Owner%20Summary%20OS%20Modified&desc=3
slug: crbug-894556-multiple-video-tracks-in-a-mediastream-are-not-reflected-on-the-videotracks-object-on-the-video-element
summary: While building a web-based video editor, I encountered an issue with handling
  multiple video tracks in a MediaStream.  I wanted to switch between different video
  sources (desktop and webcam) on a single video element without interrupting the
  MediaRecorder.  Attempting to do this by toggling the 'selected' property on the
  videoTracks object of the video element failed.  The videoTracks array only contains
  the first video track added to the MediaStream, even though the stream itself contains
  both tracks. This prevents seamless switching between sources within the video element.
tags:
- web
- video
- mediastream
- javascript
- video-editor
- chromium
- bug
- multiple-video-tracks
- videotracks
- mediaRecorder
title: 894556 - Multiple video tracks in a MediaStream are not reflected on the videoTracks
  object on the video element

---
The first issue I have found trying to [build a video editor on the
web](https://paul.kinlan.me/building-a-video-editor-on-the-web-with-the-web/). 

I have multiple video streams (desktop and web cam) and I wanted to be able to
toggle between the video streams on one video element so that I can quickly
switch between the web cam and the desktop and not break the `MediaRecorder`.

It looks like you should be able to do it via toggling the `selected` property
on the `videoTracks` object on the `<video>` element, but you can't, the array
of tracks contains only 1 element (the first video track on the MediaStream).

> What steps will reproduce the problem?
> (1) Get two MediaStreams with video tracks
> (2) Add them to a new MediaStream and attach as srcObject on a videoElement
> (3) Check the videoElement.videoTracks object and see there is only one track
> 
> Demo at https://multiple-tracks-bug.glitch.me/
> 
> What is the expected result?
> I would expect videoElement.videoTracks to have two elements.
> 
> What happens instead?
> It only has the first videoTrack that was added to the MediaStream.

[Read full post](https://bugs.chromium.org/p/chromium/issues/detail?id=894556&can=1&q=reporter%3Ame&colspec=ID%20Pri%20M%20Stars%20ReleaseBlock%20Component%20Status%20Owner%20Summary%20OS%20Modified&desc=3).

Repro case.

```javascript
window.onload = () => {
  if('getDisplayMedia' in navigator) warning.style.display = 'none';

  let blobs;
  let blob;
  let rec;
  let stream;
  let webcamStream;
  let desktopStream;

  captureBtn.onclick = async () => {

       
    desktopStream = await navigator.getDisplayMedia({video:true});
    webcamStream = await navigator.mediaDevices.getUserMedia({video: { height: 1080, width: 1920 }, audio: true});
    
    // Always 
    let tracks = [...desktopStream.getTracks(), ... webcamStream.getTracks()]
    console.log('Tracks to add to stream', tracks);
    stream = new MediaStream(tracks);
    
    console.log('Tracks on stream', stream.getTracks());
    
    videoElement.srcObject = stream;
    
    console.log('Tracks on video element that has stream', videoElement.videoTracks)
    
    // I would expect the length to be 2 and not 1
  };

};
```