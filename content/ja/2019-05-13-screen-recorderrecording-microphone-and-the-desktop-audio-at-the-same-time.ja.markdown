---
slug: screen-recorderrecording-microphone-and-the-desktop-audio-at-the-same-time
date: 2019-05-13T19:47:24.846Z
title: 'Screen Recorder: recording microphone and the desktop audio at the same time'
link: 'https://screen-record-voice.glitch.me/'
tags: [links, getusermedia, screen record,video editor, webrtc, getdisplaymedia]
---
私は世界で最もシンプルなスクリーンレコーディングソフトウェアを構築することを目標としており、この2か月間、プロジェクトについてゆっくりとうろついています（本当に遅いということです）。

以前の投稿では、すべての入力ソースからのストリームを[screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/)てWORDS0を取得し[screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/)た。しかし、フラストレーションの1つの領域は、デスクトップからオーディオを取得する方法と、スピーカーからのオーディオをオーバーレイする方法を見つけることができなかったことです。私は最終的にそれを行う方法を考え出した。

まず、Chromeの`getDisplayMedia`でオーディオキャプチャが可能になりました。機能呼び出しで`audio: true`を指定できなかったという点で、仕様に奇妙な見落としがあるようです。

```javascript
const audio = audioToggle.checked || false;
desktopStream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio: audio });
```

第二に、もともとオーディオストリームに2つのトラックを作成することで、必要なものを取得できると考えていましたが、Chromeの`MediaRecorder` APIは1つのトラックしか出力できないこと、そして2つ目は、とにかく機能しなかったことを学びました一度に1つしか再生できないという点で、DVDの複数のオーディオトラックに似ています。

解決策はおそらく多くの人にとっては簡単ですが、私にとっては新しいものでした:Web Audioを使用します。

WebAudio APIには、問題を解決するために必要なAPIである`createMediaStreamSource`と`createMediaStreamDestination`があります。 `createMediaStreamSource`は、デスクトップオーディオとマイクからストリームを`createMediaStreamSource`できます。この2つを`createMediaStreamDestination`で作成されたオブジェクトに接続することにより、この1つのストリームを`MediaRecorder` APIにパイプすることが`MediaRecorder`ます。

```javascript
const mergeAudioStreams = (desktopStream, voiceStream) => {
  const context = new AudioContext();
    
  // Create a couple of sources
  const source1 = context.createMediaStreamSource(desktopStream);
  const source2 = context.createMediaStreamSource(voiceStream);
  const destination = context.createMediaStreamDestination();
  
  const desktopGain = context.createGain();
  const voiceGain = context.createGain();
    
  desktopGain.gain.value = 0.7;
  voiceGain.gain.value = 0.7;
   
  source1.connect(desktopGain).connect(destination);
  // Connect source2
  source2.connect(voiceGain).connect(destination);
    
  return destination.stream.getAudioTracks();
};
```

シンプル。

完全なコードは[my glitch](https://glitch.com/edit/#!/screen-record-voice)にあり、デモはhttps://screen-record-voice.glitch.me/にあります。

{{&lt;fast-youtube oGIdqcMFKlA&gt;}}

