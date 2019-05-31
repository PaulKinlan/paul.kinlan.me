---
slug: screen-recorderrecording-microphone-and-the-desktop-audio-at-the-same-time
date: 2019-05-13T19:47:24.846Z
title: 'Screen Recorder: recording microphone and the desktop audio at the same time'
link: 'https://screen-record-voice.glitch.me/'
tags: [links, getusermedia, screen record,video editor, webrtc, getdisplaymedia]
---
నేను ప్రపంచాల సరళమైన స్క్రీన్ రికార్డింగ్ సాఫ్ట్ వేర్ ను నిర్మించాలనే లక్ష్యము కలిగి ఉన్నాను మరియు గత కొద్ది నెలలుగానే నెమ్మదిగా నాడీలింగ్ చేసాను (నేను నిజంగా నెమ్మదిగా ఉన్నాను).

మునుపటి పోస్ట్లలో నేను [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) ను అన్ని ఇన్పుట్ మూలాల నుండి ప్రసారాల ద్వారా futzing [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) . అయితే నిరాశకు గురైన ఒక ప్రాంతం డెస్క్టాప్ నుండి * ఆడియో * మరియు * స్పీకర్ నుండి ఆడియోను ఓవర్లే ఎలా పొందాలో నేను పని చేయలేకపోయాను. నేను చివరకు దీన్ని ఎలా చేయాలో పని చేశాను.

ముందుగా, Chrome లో `getDisplayMedia` ఇప్పుడు ఆడియో సంగ్రహణను అనుమతిస్తుంది, `getDisplayMedia` ఒక బేసి పర్యవేక్షణ లాగా ఉంది, దీనిలో మీరు ఫంక్షన్ కాల్లో `audio: true` ని పేర్కొనడానికి అనుమతించలేదు, ఇప్పుడు మీరు చెయ్యగలరు.

```javascript
const audio = audioToggle.checked || false;
desktopStream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio: audio });
```

రెండవది, ఆడియో స్ట్రీమ్లో రెండు ట్రాక్లను సృష్టించడం ద్వారా నేను కోరుకునేదాన్ని `MediaRecorder` మొదట్లో భావించాను, అయినప్పటికీ Chrome యొక్క `MediaRecorder` API ఒక ట్రాక్ను మాత్రమే అవుట్పుట్ `MediaRecorder` నేను తెలుసుకున్నాను, మరియు 2 వ, అది ఏమైనప్పటికీ పనిచేయలేదు కేవలం ఒక సమయంలో ప్లే చేసే DVD mutliple ఆడియో ట్రాక్లు లాగా ఉంటాయి.

పరిష్కారం బహుశా చాలా మందికి చాలా సులభం, కానీ నాకు క్రొత్తది: వెబ్ ఆడియో ఉపయోగించండి.

ఇది `createMediaStreamSource` API `createMediaStreamSource` మరియు `createMediaStreamDestination` , రెండూ సమస్యను పరిష్కరించడానికి అవసరమైనవి. `createMediaStreamSource` నా డెస్క్టాప్ ఆడియో మరియు మైక్రోఫోన్ నుండి ప్రవాహాలను `createMediaStreamSource` మరియు `createMediaStreamDestination` చే సృష్టించబడిన ఆబ్జెక్ట్తో కలిపి కనెక్ట్ `createMediaStreamDestination` అది `MediaRecorder` API లోకి ఈ స్ట్రీమ్ను పైప్ చేయడానికి నాకు సామర్థ్యాన్ని ఇస్తుంది.

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

సాధారణ.

పూర్తి కోడ్ [my glitch](https://glitch.com/edit/#!/screen-record-voice) చూడవచ్చు మరియు ఇక్కడ డెమో చూడవచ్చు: https://screen-record-voice.glitch.me/

{{&lt;fast-youtube oGIdqcMFKlA&gt;}}

