---
slug: building-a-video-editor-on-the-web-screencasting
date: 2018-10-12T12:00:00Z
title: 'Building a video editor on the web. Part 0.1 - Screencast'
video_url: /videos/video-editor-part-0-1-screen-cast.webm
tags: ['video editor', 'webrtc', 'getusermedia', 'getdisplaymedia', 'pwa']
---


Debería poder crear y editar videos usando solo la web en el navegador. Debería ser posible proporcionar una interfaz de usuario similar a Screenflow que le permita crear un video de salida que combine múltiples videos, imágenes y audio en un video que se puede cargar a servicios como YouTube.

Siguiendo con la [mi publicación anterior](/building-a-video-editor-on-the-web-with-the-web/) que describe brevemente los requisitos del editor de video, en esta publicación solo quería mostrar rápidamente cómo construí la grabadora de cámara web y también cómo crear una presentación de pantalla. grabadora :)

Todo está bastante limpio y utiliza la nueva API `navigator.getDisplayMedia` que les permite al usuario otorgar acceso a los contenidos de su pantalla. El siguiente código es todo lo que usé para crear este video.

El video es muy crudo, hay muchos errores porque en este momento no puedo editar el video :) mi objetivo es que al final de este proyecto pueda crear un buen video de principio a fin.

[Código para este video](https://glitch.com/edit/\#!/screen-recorder-voice?path=script.js:1:0) [Demo](https://screen-recorder-voice.glitch.me/)


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

