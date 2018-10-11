---
slug: building-a-video-editor-on-the-web-with-the-web
date: 2018-10-11T11:00:00Z
title: 'Building a video editor on the web. Part 0.'
---

You should be able to create and edit videos using just the web in the browser. 
It should be possible to provide a user-interface akin to Screenflow that lets 
you create an output video that combines multiple videos, images, and audio into 
one video that can be uploaded to services like YouTube.

Anyway, this post is really just a statement of intent. I am going to start the
long process of working out what is and isn't available on the platform and seeing
how far we can get today.

During some of the thoughts on this project, I had a Carl Sagan moment - so 
instead of inventing the universe to create an apple pie, I need to at least
create all the tools needed to build a video editor, especially if I want to 
record the process of doing it.

I don't think I am going to create one massively monolithic 'video editor', that
can be a business for someone else, but I do plan on trying to work out all 
the pieces that are needed so that I can make it easy to create great videos on
the web.

**Use cases that I have:**

* I normally have to record all the device demos for Google I/O and Chrome 
  DevSummit and add in the overlays etc. Everyone on the team should be able to 
  do this.
* The team often record screencasts and I would like to enable them to do it 
  quickly from a simple website and be able to the clean up the final output.

**Input:**

* [p0] Record audio from a microphone
* [p0] Record video from a web camera [done - see below]
* [p0] Embed external videos hosted on the web
* [p0] Record the desktop
* [p1] Record a remote stream
* [p1] Record a &lt;canvas&gt; element
* [p0] Load a file from the local device
* [p1] Share a file from the local device (android share intent)

**Manipulation:**

* [p1] Add watermarks
* [p1] Add in filter effects to the image
* [p0] Add in custom images as layers
* [p0] Queue videos and overlay
* [p0] Overlay separate tracks of audio and video
* [p1] Overlay text at specific times
* [p0] Crop video to size
* [p0] Enable positioning and resizing of the video
* [p0] Trim video / audio
* [p0] Splice video / audio

**Output:**

* [p0] Video file in webm format
* [p1] VTT information
* [p1] Video file in xyz format

[Code for this 
video](https://glitch.com/edit/\#!/camera-recorder?path=script.js:1:0) 
[Demo]([https://camera-recorder.glitch.me/](https://camera-recorder.glitch.me/))

```javascript  
const init = () =&gt; {  
  let blobs;  
  let rec;  
  let stream;  
    
  captureBtn.onclick = async () =&gt; {  
    stream = await navigator.mediaDevices.getUserMedia({video: { width: 1280, 
height: 720 }, audio: true});

    videoElement.srcObject = stream;  
    let opts = {mimeType: 'video/webm; codecs=vp9,opus'};  
    blobs = [];  
    download.style.display = 'none'

    rec = new MediaRecorder(stream, opts);  
    rec.ondataavailable = (e) =&gt; blobs.push(e.data);  
    rec.onstop = async () =&gt; {  
      let blob = new Blob(blobs, {type: 'video/webm'});  
      let url = window.URL.createObjectURL(blob);  
      download.href = url;  
      download.download = 'test.webm';  
      download.style.display = 'block';  
    };  
    startBtn.disabled = false;  
    captureBtn.disabled = true;  
  };

  startBtn.onclick = () =&gt; {  
    startBtn.disabled = true;  
    stopBtn.disabled = false;  
    rec.start();  
  };

  stopBtn.onclick = () =&gt; {  
    captureBtn.disabled = false;  
    startBtn.disabled = true;  
    stopBtn.disabled = true;

    rec.stop();  
    stream.getTracks().forEach(s=&gt;s.stop())  
    videoElement.srcObject = null  
    stream = null;  
  };  
};

window.addEventListener('load', init);  
```