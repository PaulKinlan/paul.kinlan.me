---
slug: screen-recorderrecording-microphone-and-the-desktop-audio-at-the-same-time
date: 2019-05-13T19:47:24.846Z
title: 'Screen Recorder: recording microphone and the desktop audio at the same time'
link: 'https://screen-record-voice.glitch.me/'
tags: [links, getusermedia, screen record,video editor, webrtc, getdisplaymedia]
---
ప్రపంచంలోని సరళమైన స్క్రీన్ రికార్డింగ్ సాఫ్ట్‌వేర్‌ను నిర్మించాలనే లక్ష్యం నాకు ఉంది మరియు గత రెండు నెలలుగా నేను ఈ ప్రాజెక్టుపై నెమ్మదిగా నూడుల్ చేస్తున్నాను (నా ఉద్దేశ్యం నిజంగా నెమ్మదిగా).

మునుపటి పోస్ట్‌లలో, అన్ని ఇన్‌పుట్ మూలాల నుండి ప్రసారాలతో [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) ద్వారా నేను [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) ను పొందాను. నిరాశకు గురైన ఒక ప్రాంతం ఏమిటంటే, డెస్క్‌టాప్ నుండి ఆడియోను ఎలా పొందాలో నేను పని చేయలేకపోయాను * మరియు * స్పీకర్ నుండి ఆడియోను అతివ్యాప్తి చేయండి. చివరకు దీన్ని ఎలా చేయాలో నేను పనిచేశాను.

మొదట, Chrome లోని `getDisplayMedia` ఇప్పుడు ఆడియో సంగ్రహాన్ని అనుమతిస్తుంది, `getDisplayMedia` బేసి పర్యవేక్షణ ఉన్నట్లు అనిపిస్తుంది, దీనిలో ఫంక్షన్ కాల్‌లో `audio: true` ని పేర్కొనడానికి ఇది మిమ్మల్ని అనుమతించలేదు, ఇప్పుడు మీరు చేయవచ్చు.

```javascript
const audio = audioToggle.checked || false;
desktopStream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio: audio });
```

రెండవది, ఆడియో స్ట్రీమ్‌లో రెండు ట్రాక్‌లను సృష్టించడం ద్వారా నేను కోరుకున్నదాన్ని పొందగలుగుతాను అని నేను `MediaRecorder` అనుకున్నాను, అయితే Chrome యొక్క `MediaRecorder` API ఒక ట్రాక్‌ను మాత్రమే అవుట్పుట్ `MediaRecorder` నేను తెలుసుకున్నాను, మరియు 2 వ, ఇది ఏమైనప్పటికీ `MediaRecorder` ఎందుకంటే ట్రాక్‌లు DVD మ్యూటిపుల్ ఆడియో ట్రాక్‌ల మాదిరిగా ఒకే సమయంలో ఒకరు మాత్రమే ప్లే చేయగలరు.

పరిష్కారం చాలా మందికి చాలా సులభం, కానీ ఇది నాకు క్రొత్తది: వెబ్ ఆడియోని ఉపయోగించండి.

వెబ్‌ఆడియో API కి `createMediaStreamSource` మరియు `createMediaStreamDestination` `createMediaStreamSource` `createMediaStreamDestination` , ఈ రెండూ సమస్యను పరిష్కరించడానికి API అవసరం. `createMediaStreamSource` నా డెస్క్‌టాప్ ఆడియో మరియు మైక్రోఫోన్ నుండి స్ట్రీమ్‌లను తీసుకోవచ్చు మరియు రెండింటినీ `createMediaStreamDestination` సృష్టించిన ఆబ్జెక్ట్‌తో అనుసంధానించడం ద్వారా ఈ ఒక స్ట్రీమ్‌ను `MediaRecorder` API లోకి పైప్ చేసే సామర్థ్యాన్ని ఇస్తుంది.

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

పూర్తి కోడ్‌ను [my glitch](https://glitch.com/edit/#!/screen-record-voice) చూడవచ్చు మరియు డెమోను ఇక్కడ చూడవచ్చు: https://screen-record-voice.glitch.me/

{{&lt;ఫాస్ట్-యూట్యూబ్ oGIdqcMFKlA&gt;}}

