---
slug: screen-recorderrecording-microphone-and-the-desktop-audio-at-the-same-time
date: 2019-05-13T19:47:24.846Z
title: 'Screen Recorder: recording microphone and the desktop audio at the same time'
link: 'https://screen-record-voice.glitch.me/'
tags: [links, getusermedia, screen record,video editor, webrtc, getdisplaymedia]
---
私は世界で最も簡単なスクリーンレコーディングソフトウェアを作ることを目標としています、そして私はここ数カ月間ずっとこのプロジェクトについてゆっくりとうなずいていました（私は本当にゆっくり意味します）。

前回の記事では、私は持っていた[screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) 、すべての入力ソースからのストリームを用いて約futzingで。ただし、欲求不満の1つの分野は、デスクトップからオーディオを取得する方法やスピーカーからオーディオをオーバーレイする方法を理解できなかったことです。私はついにそれをする方法を考え出しました。

まず、Chromeの`getDisplayMedia`ではオーディオキャプチャが可能に`audio: true`ましたが、関数呼び出しで`audio: true`を指定することができなかったという点で、Specでの奇妙な見落としのようですが、今は可能です。

```javascript
const audio = audioToggle.checked || false;
desktopStream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio: audio });
```

2つ目は、オーディオストリームに2つのトラックを作成することで、必要なものを取得できると思いましたが、Chromeの`MediaRecorder` APIは1トラックしか出力できないことを知りました。 DVDマルチオーディオトラックのようなものですが、一度に再生できるのは1つだけです。

解決策はおそらく多くの人にとって単純なことですが、それは私にとっては初めてのことでした。ウェブオーディオを使う

WebAudio APIには`createMediaStreamSource`と`createMediaStreamDestination` 、どちらも問題を解決するために必要なAPIです。 `createMediaStreamSource`は私のデスクトップオーディオとマイクからストリームを取ることができます、そして`createMediaStreamDestination`によって作成されたオブジェクトに2つを一緒に接続することによってそれは私にこの1つのストリームを`MediaRecorder` APIにパイプする能力を与えます。

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

単純です。

完全なコードは[my glitch](https://glitch.com/edit/#!/screen-record-voice)にあり、デモはここにあります。https: [my glitch](https://glitch.com/edit/#!/screen-record-voice)

{{&lt;fast-youtube oGIdqcMFKlA&gt;}}}

