---
slug: screen-recorderrecording-microphone-and-the-desktop-audio-at-the-same-time
date: 2019-05-13T19:47:24.846Z
title: 'Screen Recorder: recording microphone and the desktop audio at the same time'
link: 'https://screen-record-voice.glitch.me/'
tags: [links, getusermedia, screen record,video editor, webrtc, getdisplaymedia]
---
Mon objectif est de créer le logiciel de capture d&#39;écran le plus simple au monde et je m&#39;occupe du projet lentement au cours des deux derniers mois (je veux dire très lentement).

Dans les articles précédents, j&#39;avais eu le [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) en utilisant les flux de toutes les sources d&#39;entrée. Un point de frustration cependant était que je ne pouvais pas savoir comment obtenir le son du bureau * et * superposer le son du haut-parleur. J&#39;ai finalement trouvé comment le faire.

Tout d’abord, `getDisplayMedia` dans Chrome permet désormais la capture audio. Il semble qu’il `getDisplayMedia` un oubli dans la spécification en ce sens qu’il ne vous permettait pas de spécifier `audio: true` dans l’appel de la fonction, c’est désormais possible.

```javascript
const audio = audioToggle.checked || false;
desktopStream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio: audio });
```

Deuxièmement, j&#39;avais d&#39;abord pensé qu&#39;en créant deux pistes dans le flux audio, je pouvais obtenir ce que je voulais. Cependant, j&#39;ai appris que l&#39;API `MediaRecorder` de Chrome ne peut générer qu&#39;une seule piste et, 2e, cela n&#39;aurait pas fonctionné ressemblent aux DVD multiples pistes audio dans la mesure où un seul peut jouer à la fois.

La solution est probablement simple pour beaucoup de gens, mais elle était nouvelle pour moi: Utiliser Web Audio.

Il s&#39;avère que les API WebAudio ont `createMediaStreamSource` et `createMediaStreamDestination` , qui sont toutes deux des API nécessaires à la résolution du problème. Le `createMediaStreamSource` peut prendre des flux de l&#39;audio et du microphone de mon bureau. En reliant les deux ensemble à l&#39;objet créé par `createMediaStreamDestination` il me permet de `createMediaStreamDestination` ce flux vers l&#39;API `MediaRecorder` .

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

Le code complet peut être trouvé sur [my glitch](https://glitch.com/edit/#!/screen-record-voice) , et la démo peut être trouvée ici: https://screen-record-voice.glitch.me/

{{&lt;fast-youtube oGIdqcMFKlA&gt;}}

