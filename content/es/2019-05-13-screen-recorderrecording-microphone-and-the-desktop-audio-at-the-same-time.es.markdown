---
slug: screen-recorderrecording-microphone-and-the-desktop-audio-at-the-same-time
date: 2019-05-13T19:47:24.846Z
title: 'Screen Recorder: recording microphone and the desktop audio at the same time'
link: 'https://screen-record-voice.glitch.me/'
tags: [links, getusermedia, screen record,video editor, webrtc, getdisplaymedia]
---
Tengo el objetivo de crear el software de grabación de pantalla más simple del mundo y he estado estudiando poco a poco el proyecto durante los últimos meses (me refiero a muy lentamente).

En publicaciones anteriores obtuve [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) al analizar con las secuencias de todas las fuentes de entrada. Sin embargo, un área de frustración fue que no pude averiguar cómo obtener el audio del escritorio * y * superponer el audio del altavoz. Finalmente me di cuenta de cómo hacerlo.

En primer lugar, `getDisplayMedia` en Chrome ahora permite la captura de audio, parece que hay un descuido extraño en la especificación porque no le permitió especificar `audio: true` en la llamada de función, ahora puede `audio: true` .

```javascript
const audio = audioToggle.checked || false;
desktopStream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio: audio });
```

En segundo lugar, originalmente pensé que al crear dos pistas en el flujo de audio sería capaz de obtener lo que quería, sin embargo, aprendí que la API `MediaRecorder` de Chrome solo puede generar una pista y, en segundo lugar, no habría funcionado de todos modos porque Son como las pistas de audio de varios clips de DVD, ya que solo uno puede reproducir a la vez.

La solución es probablemente simple para mucha gente, pero era nueva para mí: usar audio web.

Resulta que la API de WebAudio tiene `createMediaStreamSource` y `createMediaStreamDestination` , que son las API necesarias para resolver el problema. `createMediaStreamSource` puede recibir transmisiones desde el audio y el micrófono de mi escritorio, y al conectar las dos juntas en el objeto creado por `createMediaStreamDestination` , me da la posibilidad de canalizar esta transmisión en la API de `MediaRecorder` .

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

El código completo se puede encontrar en [my glitch](https://glitch.com/edit/#!/screen-record-voice) , y la demostración se puede encontrar aquí: https://screen-record-voice.glitch.me/

{{&lt;fast-youtube oGIdqcMFKlA&gt;}}

