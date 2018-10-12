---
slug: building-a-video-editor-on-the-web-screencasting
date: 2018-10-12T12:00:00Z
title: 'Building a video editor on the web. Part 0.1 - Screencast'
video_url: /videos/video-editor-part-0-1-screen-cast.webm
tags: ['video editor', 'webrtc', 'getusermedia', 'getdisplaymedia', 'pwa']
---


あなたは、ブラウザでウェブだけを使ってビデオを作成し編集することができます。 Screenflowに似たユーザーインターフェイスを提供することで、複数のビデオ、画像、およびオーディオを1つのビデオにまとめて、YouTubeなどのサービスにアップロードできる出力ビデオを作成できるようにする必要があります。

私の[前の投稿](/building-a-video-editor-on-the-web-with-the-web/)からビデオエディタの要件を簡単に説明した後、この記事ではスクリーンキャストでウェブカメラレコーダーをどのように作成したか、そしてスクリーンキャストを構築する方法レコーダー:)

それはすべてき​​ちんとしていて、新しい `navigator.getDisplayMedia` APIを使用します。これにより、ユーザーは画面コンテンツへのアクセスを許可することができます。以下のコードは、私がこのビデオを作成するために使用したすべてのものです。

ビデオは非常に非常に生であり、現時点で私はビデオを編集することができないので、多くの間違いがあります:)私の目標は、このプロジェクトの終わりに、私は良いビデオをエンドツーエンドで作ることができるということです。

[このビデオのコード](https://glitch.com/edit/\#!/screen-recorder-voice?path=script.js:1:0)[デモ](https://screen-recorder-voice.glitch.me/)


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

