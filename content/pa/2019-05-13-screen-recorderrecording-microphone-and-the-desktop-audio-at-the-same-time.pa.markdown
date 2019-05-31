---
slug: screen-recorderrecording-microphone-and-the-desktop-audio-at-the-same-time
date: 2019-05-13T19:47:24.846Z
title: 'Screen Recorder: recording microphone and the desktop audio at the same time'
link: 'https://screen-record-voice.glitch.me/'
tags: [links, getusermedia, screen record,video editor, webrtc, getdisplaymedia]
---
ਮੇਰੇ ਕੋਲ ਸੰਸਾਰ ਦਾ ਸਭ ਤੋਂ ਸਰਲ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ ਸਾਫਟਵੇਅਰ ਬਣਾਉਣ ਦਾ ਟੀਚਾ ਹੈ ਅਤੇ ਪਿਛਲੇ ਕੁਝ ਮਹੀਨਿਆਂ ਤੋਂ ਪ੍ਰੋਜੈਕਟ ਤੇ ਮੈਂ ਹੌਲੀ-ਹੌਲੀ ਨੂਡਲਿੰਗ ਕਰ ਰਿਹਾ ਹਾਂ (ਮੇਰਾ ਮਤਲਬ ਸਚਮੁਚ ਹੈ).

ਪਿਛਲੇ ਪੋਸਟਾਂ ਵਿੱਚ ਮੈਨੂੰ ਸਾਰੇ ਇਨਪੁਟ ਸ੍ਰੋਤਾਂ ਦੇ ਸਟ੍ਰੀਮਜ਼ ਦੇ ਨਾਲ [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) ਕਰਕੇ WORDS0 ਪ੍ਰਾਪਤ ਹੋਇਆ ਸੀ ਨਿਰਾਸ਼ਾ ਦਾ ਇੱਕ ਖੇਤਰ ਹਾਲਾਂਕਿ ਇਹ ਸੀ ਕਿ ਮੈਂ ਆਉਟਪੁੱਟ ਨੂੰ ਆਵਾਜ਼ ਨਹੀਂ ਕਰ ਸਕਦਾ ਕਿ ਆਕ੍ਰਿਤੀ ਕਿਵੇਂ ਆਉਂਦੀ ਹੈ. ਅਖੀਰ ਵਿੱਚ ਮੈਂ ਇਹ ਕਿਵੇਂ ਕੀਤਾ, ਇਹ ਕਿਵੇਂ ਕੀਤਾ.

ਪਹਿਲੀ, Chrome ਵਿੱਚ `getDisplayMedia` ਹੁਣ ਔਡੀਓ ਕੈਪਚਰ ਦੀ ਆਗਿਆ ਦਿੰਦਾ ਹੈ, ਸਪੀਕ ਵਿੱਚ ਇੱਕ ਅਸਾਧਾਰਣ ਨਿਗਾਹ ਵਾਂਗ ਲੱਗਦਾ ਹੈ ਕਿ ਇਹ ਤੁਹਾਨੂੰ ਫੰਕਸ਼ਨ ਕਾਲ ਵਿੱਚ `audio: true` ਦੇਣ ਦੀ ਇਜਾਜ਼ਤ ਨਹੀਂ ਦਿੰਦਾ, ਹੁਣ ਤੁਸੀਂ ਕਰ ਸਕਦੇ ਹੋ.

```javascript
const audio = audioToggle.checked || false;
desktopStream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio: audio });
```

ਦੂਜਾ, ਮੈਨੂੰ ਪਹਿਲਾਂ ਸੋਚਿਆ ਗਿਆ ਸੀ ਕਿ ਆਡੀਓ ਸਟ੍ਰੀਮ ਵਿੱਚ ਦੋ ਟ੍ਰੈਕ ਬਣਾ ਕੇ ਮੈਂ ਜੋ ਚਾਹੁੰਦਾ ਸੀ ਪ੍ਰਾਪਤ ਕਰ ਸਕਾਂਗਾ, ਹਾਲਾਂਕਿ ਮੈਨੂੰ ਪਤਾ ਲੱਗਾ ਹੈ ਕਿ ਕਰੋਮ ਦੇ `MediaRecorder` API ਕੇਵਲ ਇੱਕ ਟਰੈਕ ਆਉਟ ਕਰ ਸਕਦੀ ਹੈ, ਅਤੇ ਦੂਜੀ, ਇਹ ਕਿਸੇ ਵੀ ਤਰਾਂ ਕੰਮ ਨਹੀਂ ਸੀ ਕਿਉਂਕਿ ਟਰੈਕ ਉਹ ਡੀਵੀਡੀ ਬਾਹਰੀ ਆਡੀਓ ਟਰੈਕਾਂ ਵਾਂਗ ਹਨ ਜਿਹਨਾਂ ਵਿੱਚ ਸਿਰਫ ਇੱਕ ਹੀ ਵਾਰ ਇੱਕ ਖੇਡ ਸਕਦੀ ਹੈ

ਹੱਲ ਬਹੁਤ ਸਾਰੇ ਲੋਕਾਂ ਲਈ ਸੌਖਾ ਹੈ, ਪਰ ਇਹ ਮੇਰੇ ਲਈ ਨਵਾਂ ਸੀ: ਵੈਬ ਔਡੀਓ ਦੀ ਵਰਤੋਂ ਕਰੋ.

ਇਹ ਪਤਾ ਚਲਦਾ ਹੈ ਕਿ WebAudio API ਕੋਲ `createMediaStreamSource` ਅਤੇ `createMediaStreamDestination` , ਜੋ ਕਿ API ਦੀ ਸਮੱਸਿਆ ਨੂੰ ਹੱਲ ਕਰਨ ਲਈ ਜ਼ਰੂਰੀ ਹੈ. `createMediaStreamSource` ਮੇਰੇ ਡੈਸਕਟੌਪ ਆਡੀਓ ਅਤੇ ਮਾਈਕ੍ਰੋਫੋਨ ਤੋਂ ਸਟ੍ਰੀਮ ਲੈ ਸਕਦਾ ਹੈ ਅਤੇ ਦੋਨਾਂ ਨੂੰ `createMediaStreamDestination` ਦੁਆਰਾ ਬਣਾਏ ਵਸਤੂ ਵਿੱਚ ਜੋੜ ਕੇ ਇਹ ਮੈਨੂੰ `MediaRecorder` API ਵਿੱਚ ਇਸ ਇੱਕ ਸਟ੍ਰੀਮ ਨੂੰ ਪਾਈਪ ਕਰਨ ਦੀ ਸਮਰੱਥਾ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ.

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

ਸਧਾਰਨ

ਪੂਰਾ ਕੋਡ [my glitch](https://glitch.com/edit/#!/screen-record-voice) ਤੇ ਪਾਇਆ ਜਾ ਸਕਦਾ ਹੈ, ਅਤੇ ਡੈਮੋ ਇੱਥੇ ਮਿਲ ਸਕਦਾ ਹੈ: https://screen-record-voice.glitch.me/

{{fast-youtube oGIdqcMFKlA&gt;}}

