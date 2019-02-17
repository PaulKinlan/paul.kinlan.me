---
slug: building-a-video-editor-on-the-web-screencasting
date: 2018-10-12T12:00:00Z
title: 'Building a video editor on the web. Part 0.1 - Screencast'
video_url: /videos/video-editor-part-0-1-screen-cast.webm
tags: ['video editor', 'webrtc', 'getusermedia', 'getdisplaymedia', 'pwa']
---

You should be able to create and edit videos using just the web in the browser.
It should be possible to provide a user-interface akin to Screenflow that lets
you create an output video that combines multiple videos, images, and audio into
one video that can be uploaded to services like YouTube.

Following on from the my [previous
post](/building-a-video-editor-on-the-web-with-the-web/) that briefly describes
the requirements of the video editor, in this post I just wanted to quickly show
in a screencast how I built the web cam recorder, and also how how to build
a screencast recorder :)

It's all pretty neat and it uses the new `navigator.getDisplayMedia` API which
lets they user grant access to their screen contents. The code below is everything
that I used to create this video.

The video is very very raw, there are a lot of mistakes because at the moment
I can't edit the video :) my goal is that at the end of this project
I can create a good video end-to-end.

[Code for this 
video](https://glitch.com/edit/\#!/screen-recorder-voice?path=script.js:1:0) 
[Demo](https://screen-recorder-voice.glitch.me/)

```javascript  
window.onload = () => {
  if('getDisplayMedia' in navigator) warning.style.display = 'none';

  let blobs;
  let blob;
  let rec;
  let stream;
  let voiceStream;
  let desktopStream;

  captureBtn.onclick = async () => {
    download.style.display = 'none';
    
    desktopStream = await navigator.getDisplayMedia({video:true});
    voiceStream = await navigator.mediaDevices.getUserMedia({video: false, audio: true});
    
    let tracks = [...desktopStream.getTracks(), ...voiceStream.getAudioTracks()]
    console.log('Tracks to add to stream', tracks);
    stream = new MediaStream(tracks);
    videoElement.srcObject = stream;
      
    blobs = [];
  
    rec = new MediaRecorder(stream, {mimeType: 'video/webm; codecs=vp9,opus'});
    rec.ondataavailable = (e) => blobs.push(e.data);
    rec.onstop = async () => {
      blob = new Blob(blobs, {type: 'video/webm'});
      let url = window.URL.createObjectURL(blob);
      download.href = url;
      download.download = 'test.webm';
      download.style.display = 'block';
    };
    startBtn.disabled = false;
    captureBtn.disabled = true;
  };

  startBtn.onclick = () => {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    rec.start();
  };

  stopBtn.onclick = () => {
    captureBtn.disabled = false;
    startBtn.disabled = true;
    stopBtn.disabled = true;

    rec.stop();
    stream.getTracks().forEach(s=>s.stop())
    videoElement.srcObject = null
    stream = null;
  };
};
```
