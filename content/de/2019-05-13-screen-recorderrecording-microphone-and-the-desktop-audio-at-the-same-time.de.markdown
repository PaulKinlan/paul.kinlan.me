---
slug: screen-recorderrecording-microphone-and-the-desktop-audio-at-the-same-time
date: 2019-05-13T19:47:24.846Z
title: 'Screen Recorder: recording microphone and the desktop audio at the same time'
link: 'https://screen-record-voice.glitch.me/'
tags: [links, getusermedia, screen record,video editor, webrtc, getdisplaymedia]
---
Ich habe mir zum Ziel gesetzt, die einfachste Bildschirmaufzeichnungssoftware der Welt zu entwickeln, und habe in den letzten Monaten langsam an dem Projekt herumgeschraubt (ich meine wirklich langsam).

In früheren Beiträgen hatte ich das [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) indem ich mit den Streams aus allen [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) herumgebastelt hatte. Ein Bereich der Frustration war jedoch, dass ich nicht herausfinden konnte, wie ich das Audio vom Desktop * bekommen und * das Audio vom Lautsprecher überlagern kann. Ich habe endlich herausgefunden, wie es geht.

Erstens erlaubt `getDisplayMedia` in Chrome jetzt die `getDisplayMedia` Audiodaten. Es scheint ein seltsames Versehen in der Spezifikation zu geben, dass Sie `audio: true` im Funktionsaufruf angeben `audio: true` Jetzt können Sie es.

```javascript
const audio = audioToggle.checked || false;
desktopStream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio: audio });
```

Zweitens hatte ich ursprünglich gedacht, dass ich durch das Erstellen von zwei Spuren im Audiostream das bekommen würde, was ich wollte, aber ich habe erfahren, dass die `MediaRecorder` API von Chrome nur eine Spur `MediaRecorder` kann, und `MediaRecorder` hätte es sowieso nicht funktioniert, weil Spuren Wie bei der DVD gibt es mehrere Audiospuren, die jeweils nur von einer abgespielt werden können.

Die Lösung ist wahrscheinlich für viele Menschen einfach, aber für mich war sie neu: Verwenden Sie Web-Audio.

Es stellt sich heraus, dass die WebAudio-API über `createMediaStreamSource` und `createMediaStreamDestination` verfügt. Beide APIs werden zur Lösung des Problems benötigt. Das `createMediaStreamSource` kann Streams von meinem Desktop-Audio und meinem Mikrofon `createMediaStreamSource` Durch Verbinden der beiden Streams zu dem von `createMediaStreamDestination` erstellten `createMediaStreamDestination` kann ich diesen einen Stream in die `MediaRecorder` API `MediaRecorder` .

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

Den vollständigen Code finden Sie auf [my glitch](https://glitch.com/edit/#!/screen-record-voice) . Die Demo finden Sie hier: https://screen-record-voice.glitch.me/

{{&lt;fast-youtube oGIdqcMFKlA&gt;}}

