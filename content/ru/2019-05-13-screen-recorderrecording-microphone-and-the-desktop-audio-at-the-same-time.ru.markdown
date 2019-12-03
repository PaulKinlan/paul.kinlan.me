---
slug: screen-recorderrecording-microphone-and-the-desktop-audio-at-the-same-time
date: 2019-05-13T19:47:24.846Z
title: 'Screen Recorder: recording microphone and the desktop audio at the same time'
link: 'https://screen-record-voice.glitch.me/'
tags: [links, getusermedia, screen record,video editor, webrtc, getdisplaymedia]
---
У меня есть цель создать самое простое в мире программное обеспечение для записи экрана, и я последние несколько месяцев медленно слоняюсь по проекту (я имею в виду очень медленно).

В предыдущих постах я получил [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) , возившись с потоками из всех входных источников. Однако одной из проблем было то, что я не мог понять, как получить звук с рабочего стола * и * наложить звук из динамика. Я наконец-то понял, как это сделать.

Во-первых, `getDisplayMedia` в Chrome теперь позволяет захватывать звук, в Spec есть странный недосмотр, поскольку он не позволяет вам указывать `audio: true` в вызове функции, теперь вы можете это сделать.

```javascript
const audio = audioToggle.checked || false;
desktopStream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio: audio });
```

Во-вторых, я изначально думал, что, создав две дорожки в аудиопотоке, я смогу получить то, что хотел, однако я узнал, что API-интерфейс `MediaRecorder` Chrome может выводить только одну дорожку, а во- `MediaRecorder` , это не сработало бы, потому что дорожки похожи на аудиофонограммы DVD, которые могут воспроизводить только одна.

Решение, вероятно, простое для многих людей, но для меня оно было новым: используйте Web Audio.

Оказывается, в API WebAudio есть `createMediaStreamSource` и `createMediaStreamDestination` , оба из которых необходимы API для решения проблемы. `createMediaStreamSource` может принимать потоки с моего настольного аудио и микрофона, и, соединяя их вместе в объект, созданный `createMediaStreamDestination` он дает мне возможность `MediaRecorder` этот поток в API `MediaRecorder` .

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

Simples.

Полный код можно найти на [my glitch](https://glitch.com/edit/#!/screen-record-voice) , а демоверсию можно найти здесь: https://screen-record-voice.glitch.me/

{{&lt;fast-youtube oGIdqcMFKlA&gt;}}

