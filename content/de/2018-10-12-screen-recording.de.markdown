---
slug: building-a-video-editor-on-the-web-screencasting
date: 2018-10-12T12:00:00Z
title: 'Building a video editor on the web. Part 0.1 - Screencast'
video_url: /videos/video-editor-part-0-1-screen-cast.webm
tags: ['video editor', 'webrtc', 'getusermedia', 'getdisplaymedia', 'pwa']
---


Sie sollten Videos nur über das Web im Browser erstellen und bearbeiten können. Es sollte möglich sein, eine Benutzeroberfläche ähnlich wie bei Screenflow bereitzustellen, mit der Sie ein Ausgabevideo erstellen können, das mehrere Videos, Bilder und Audio zu einem Video kombiniert, das zu Diensten wie YouTube hochgeladen werden kann.

Im Anschluss an den meinem [vorheriger Beitrag](/building-a-video-editor-on-the-web-with-the-web/), der kurz die Anforderungen des Videoeditors beschreibt, wollte ich in diesem Beitrag nur schnell in einem Screencast zeigen, wie ich den Web Cam Recorder gebaut habe, und wie man einen Screencast erstellt Recorder :)

Es ist alles ziemlich ordentlich und es verwendet die neue 'navigator.getDisplayMedia'-API, mit der Benutzer Zugriff auf ihre Bildschirminhalte gewähren können. Der folgende Code ist alles, was ich verwendet habe, um dieses Video zu erstellen.

Das Video ist sehr sehr roh, es gibt viele Fehler, weil ich das Video im Moment nicht bearbeiten kann :) Mein Ziel ist es, dass ich am Ende dieses Projekts ein gutes Video Ende-zu-Ende erstellen kann.

[Code für dieses Video](https://glitch.com/edit/\#!/screen-recorder-voice?path=script.js:1:0) [Demo](https://screen-recorder-voice.glitch.me/)


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

