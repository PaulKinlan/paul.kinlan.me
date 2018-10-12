---
slug: building-a-video-editor-on-the-web-screencasting
date: 2018-10-12T12:00:00Z
title: 'Building a video editor on the web. Part 0.1 - Screencast'
video_url: /videos/video-editor-part-0-1-screen-cast.webm
tags: ['video editor', 'webrtc', 'getusermedia', 'getdisplaymedia', 'pwa']
---


Вы должны иметь возможность создавать и редактировать видео, используя только веб-браузер. Должно быть возможно предоставить пользовательский интерфейс, похожий на Screenflow, который позволяет создавать выходное видео, которое объединяет несколько видео, изображений и аудио в одно видео, которое может быть загружено на такие сервисы, как YouTube.

Следуя моему [предыдущему сообщению](/building-a-video-editor-on-the-web-with-the-web/), который кратко описывает требования видеоредактора, в этом посте я просто хотел быстро показать в скринкасте, как я построил рекордер для веб-камеры, а также как создать скринкаст рекордер :)

Все это довольно аккуратно, и он использует новый API `navigator.getDisplayMedia`, который позволяет пользователям предоставлять доступ к их содержимому экрана. Код ниже - это все, что я использовал для создания этого видео.

Видео очень сырое, есть много ошибок, потому что на данный момент я не могу редактировать видео :) Моя цель в том, что в конце этого проекта я могу создать хорошее видео в конец.

[Код для этого видео](https://glitch.com/edit/\#!/screen-recorder-voice?path=script.js:1:0) [Демо](https://screen-recorder-voice.glitch.me/)


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

