---
slug: building-a-video-editor-on-the-web-screencasting
date: 2018-10-12T12:00:00Z
title: 'Building a video editor on the web. Part 0.1 - Screencast'
video_url: /videos/video-editor-part-0-1-screen-cast.webm
tags: ['video editor', 'webrtc', 'getusermedia', 'getdisplaymedia', 'pwa']
---


Anda harus dapat membuat dan mengedit video hanya dengan menggunakan web di browser. Seharusnya mungkin untuk menyediakan antarmuka pengguna yang mirip dengan Screenflow yang memungkinkan Anda membuat video output yang menggabungkan beberapa video, gambar, dan audio ke dalam satu video yang dapat diunggah ke layanan seperti YouTube.

Berikut dari [saya posting sebelumnya](/building-a-video-editor-on-the-web-with-the-web/) yang secara singkat menjelaskan persyaratan editor video, dalam posting ini saya hanya ingin cepat menunjukkan dalam screencast bagaimana saya membangun perekam web cam, dan juga bagaimana cara membangun screencast perekam :)

Semuanya cukup rapi dan menggunakan API `navigator.getDisplayMedia` baru yang memungkinkan mereka memberikan akses ke konten layar mereka. Kode di bawah adalah semua yang saya gunakan untuk membuat video ini.

Video ini sangat sangat baku, ada banyak kesalahan karena pada saat ini saya tidak dapat mengedit video :) tujuan saya adalah bahwa pada akhir proyek ini saya dapat membuat video yang bagus dari ujung ke ujung.

[Kode untuk video ini](https://glitch.com/edit/\#!/screen-recorder-voice?path=script.js:1:0) [Demo](https://screen-recorder-voice.glitch.me/)


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

