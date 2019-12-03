---
slug: screen-recorderrecording-microphone-and-the-desktop-audio-at-the-same-time
date: 2019-05-13T19:47:24.846Z
title: 'Screen Recorder: recording microphone and the desktop audio at the same time'
link: 'https://screen-record-voice.glitch.me/'
tags: [links, getusermedia, screen record,video editor, webrtc, getdisplaymedia]
---
Eu tenho o objetivo de criar o software de gravação de tela mais simples do mundo e tenho andado lentamente pesquisando o projeto nos últimos meses (quero dizer, bem devagar).

Nas postagens anteriores, eu obtive o [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) futzing com os fluxos de todas as fontes de entrada. Uma área de frustração, porém, foi que eu não conseguia descobrir como obter o áudio da área de trabalho * e * sobrepor o áudio do alto-falante. Eu finalmente descobri como fazê-lo.

Em primeiro lugar, o `getDisplayMedia` no Chrome agora permite a captura de áudio, parece uma supervisão estranha na Especificação, pois não permite especificar o `audio: true` na chamada de função, agora você pode.

```javascript
const audio = audioToggle.checked || false;
desktopStream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio: audio });
```

Em segundo lugar, originalmente eu pensava que, ao criar duas faixas no fluxo de áudio, conseguiria o que queria, mas aprendi que a API `MediaRecorder` do Chrome só pode `MediaRecorder` uma faixa e a segunda não funcionaria, porque as faixas são como as várias faixas de áudio do DVD, em que apenas uma pode ser reproduzida por vez.

A solução é provavelmente simples para muitas pessoas, mas era nova para mim: use o áudio da Web.

Acontece que a API do WebAudio possui `createMediaStreamSource` e `createMediaStreamDestination` , as quais são necessárias para resolver o problema. O `createMediaStreamSource` pode receber fluxos do meu áudio e microfone da área de trabalho e, ao conectar os dois no objeto criado pelo `createMediaStreamDestination` , é possível canalizar esse fluxo na API do `MediaRecorder` .

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

O código completo pode ser encontrado em [my glitch](https://glitch.com/edit/#!/screen-record-voice) , e a demonstração pode ser encontrada aqui: https://screen-record-voice.glitch.me/

{{&lt;oGIdqcMFKlA do YouTube&gt;}}

