---
slug: screen-recorderrecording-microphone-and-the-desktop-audio-at-the-same-time
date: 2019-05-13T19:47:24.846Z
title: 'Screen Recorder: recording microphone and the desktop audio at the same time'
link: 'https://screen-record-voice.glitch.me/'
tags: [links, getusermedia, screen record,video editor, webrtc, getdisplaymedia]
---
Eu tenho um objetivo de construir o software de gravação de tela mais simples do mundo e tenho andado devagarinho pelo projeto nos últimos dois meses (quero dizer, muito devagar).

Em postagens anteriores, eu tinha conseguido o [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) por futzing com os fluxos de todas as fontes de entrada. Uma área de frustração era que eu não conseguia descobrir como obter o áudio da área de trabalho * e * sobrepor o áudio do alto-falante. Eu finalmente trabalhei como fazer isso.

Em primeiro lugar, o `getDisplayMedia` no Chrome agora permite a captura de áudio, parece um erro estranho na especificação, pois não permite que você especifique `audio: true` na chamada de função, agora você pode.

```javascript
const audio = audioToggle.checked || false;
desktopStream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio: audio });
```

Em segundo lugar, inicialmente pensei que, criando duas faixas no fluxo de áudio, eu conseguiria o que queria, no entanto, aprendi que a API `MediaRecorder` do Chrome só pode produzir uma faixa e, segundo, ela não teria funcionado de qualquer maneira, porque faixas são como as faixas de áudio múltiplas do DVD em que apenas uma pode tocar de cada vez.

A solução é provavelmente simples para muitas pessoas, mas era nova para mim: Use o Web Audio.

Acontece que a API WebAudio possui `createMediaStreamSource` e `createMediaStreamDestination` , sendo que ambas são APIs necessárias para resolver o problema. O `createMediaStreamSource` pode receber fluxos do áudio e do microfone da minha área de trabalho e, ao conectar os dois juntos no objeto criado pelo `createMediaStreamDestination` , é possível canalizar esse fluxo para a API `MediaRecorder` .

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

Simples

O código completo pode ser encontrado em [my glitch](https://glitch.com/edit/#!/screen-record-voice) , e a demonstração pode ser encontrada aqui: https://screen-record-voice.glitch.me/

{{&lt;fast-youtube oGIdqcMFKlA&gt;}}

