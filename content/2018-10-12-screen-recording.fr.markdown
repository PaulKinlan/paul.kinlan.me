---
slug: building-a-video-editor-on-the-web-screencasting
date: 2018-10-12T12:00:00Z
title: 'Building a video editor on the web. Part 0.1 - Screencast'
video_url: /videos/video-editor-part-0-1-screen-cast.webm
tags: ['video editor', 'webrtc', 'getusermedia', 'getdisplaymedia', 'pwa']
---


Vous devriez pouvoir créer et éditer des vidéos en utilisant uniquement le Web dans le navigateur. Il devrait être possible de fournir une interface utilisateur semblable à Screenflow qui vous permet de créer une sortie vidéo combinant plusieurs vidéos, images et son en une seule vidéo pouvant être téléchargée vers des services tels que YouTube.

Après mon [précédent post](/building-a-video-editor-on-the-web-with-the-web/) qui décrit brièvement les exigences de l’éditeur de vidéo, je voulais simplement montrer rapidement, dans un screencast, comment j’ai construit l’enregistreur de webcam, et comment créer un screencast. enregistreur :)

C'est très joli et il utilise la nouvelle API `navigator.getDisplayMedia` qui permet aux utilisateurs d'accorder l'accès au contenu de leur écran. Le code ci-dessous est tout ce que j'ai utilisé pour créer cette vidéo.

La vidéo est très très brute, il y a beaucoup d'erreurs car pour le moment je ne peux pas éditer la vidéo :) mon objectif est qu'à la fin de ce projet je puisse créer une bonne vidéo de bout en bout.

[Code pour cette vidéo](https://glitch.com/edit/\#!/screen-recorder-voice?path=script.js:1:0) [Démo](https://screen-recorder-voice.glitch.me/)


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

