---
slug: screen-recorderrecording-microphone-and-the-desktop-audio-at-the-same-time
date: 2019-05-13T19:47:24.846Z
title: 'Screen Recorder: recording microphone and the desktop audio at the same time'
link: 'https://screen-record-voice.glitch.me/'
tags: [links, getusermedia, screen record,video editor, webrtc, getdisplaymedia]
---
ਮੇਰੇ ਕੋਲ ਵਿਸ਼ਵ ਦਾ ਸਧਾਰਣ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ ਸਾੱਫਟਵੇਅਰ ਬਣਾਉਣ ਦਾ ਟੀਚਾ ਹੈ ਅਤੇ ਮੈਂ ਪਿਛਲੇ ਦੋ ਮਹੀਨਿਆਂ ਤੋਂ ਪ੍ਰੋਜੈਕਟ &#39;ਤੇ ਹੌਲੀ ਹੌਲੀ ਘੁੰਮ ਰਿਹਾ ਹਾਂ (ਮੇਰਾ ਮਤਲਬ ਅਸਲ ਹੌਲੀ ਹੈ).

ਪਿਛਲੀਆਂ ਪੋਸਟਾਂ ਵਿਚ ਮੈਂ ਸਾਰੇ ਇਨਪੁਟ ਸ੍ਰੋਤਾਂ ਤੋਂ ਸਟ੍ਰੀਮਜ਼ ਦੇ ਨਾਲ [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) ਕਰਕੇ ਡਬਲਯੂਆਰਡਐਸ 0 ਪ੍ਰਾਪਤ ਕੀਤਾ ਸੀ. ਹਾਲਾਂਕਿ ਨਿਰਾਸ਼ਾ ਦਾ ਇੱਕ ਖੇਤਰ ਇਹ ਸੀ ਕਿ ਮੈਂ ਕੰਮ ਨਹੀਂ ਕਰ ਸਕਿਆ ਕਿ ਡੈਸਕਟੌਪ * ਤੋਂ ਆਡੀਓ ਕਿਵੇਂ ਪ੍ਰਾਪਤ ਕਰਨਾ ਹੈ * ਅਤੇ * ਸਪੀਕਰ ਤੋਂ ਆਡੀਓ ਨੂੰ ਓਵਰਲੇ ਕਰਨਾ ਹੈ. ਮੈਂ ਆਖਰਕਾਰ ਕੰਮ ਕੀਤਾ ਕਿ ਇਹ ਕਿਵੇਂ ਕੀਤਾ ਜਾਵੇ.

ਪਹਿਲਾਂ, `getDisplayMedia` ਵਿੱਚ `getDisplayMedia` ਹੁਣ ਆਡੀਓ ਕੈਪਚਰ ਦੀ ਆਗਿਆ ਦਿੰਦਾ ਹੈ, ਇੱਥੇ `getDisplayMedia` ਵਿੱਚ ਇੱਕ ਅਜੀਬ ਨਿਗਰਾਨੀ ਦੀ ਤਰ੍ਹਾਂ ਜਾਪਦਾ ਹੈ ਕਿ ਇਹ ਤੁਹਾਨੂੰ ਫੰਕਸ਼ਨ ਕਾਲ ਵਿੱਚ `audio: true` 1 ਨੂੰ ਨਿਰਧਾਰਤ ਕਰਨ ਦੀ ਆਗਿਆ ਨਹੀਂ ਦਿੰਦਾ ਸੀ, ਹੁਣ ਤੁਸੀਂ ਕਰ ਸਕਦੇ ਹੋ.

```javascript
const audio = audioToggle.checked || false;
desktopStream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio: audio });
```

ਦੂਜਾ, ਮੈਂ ਅਸਲ ਵਿੱਚ ਸੋਚਿਆ ਸੀ ਕਿ ਆਡੀਓ ਸਟ੍ਰੀਮ ਵਿੱਚ ਦੋ ਟਰੈਕ ਬਣਾ ਕੇ ਮੈਂ ਉਹ ਪ੍ਰਾਪਤ ਕਰ ਸਕਾਂਗਾ ਜੋ ਮੈਂ ਚਾਹੁੰਦਾ ਹਾਂ, ਹਾਲਾਂਕਿ ਮੈਂ ਸਿੱਖਿਆ ਹੈ ਕਿ ਕ੍ਰੋਮ ਦਾ `MediaRecorder` ਏਪੀਆਈ ਸਿਰਫ ਇੱਕ ਟਰੈਕ ਨੂੰ ਆਉਟਪੁਟ ਕਰ ਸਕਦਾ ਹੈ, ਅਤੇ ਦੂਜਾ, ਇਹ ਕਿਸੇ ਵੀ ਤਰਾਂ ਕੰਮ ਨਹੀਂ ਕਰਦਾ ਕਿਉਂਕਿ ਟਰੈਕ ਡੀਵੀਡੀ ਮਲਟੀਪਲ ਆਡੀਓ ਟਰੈਕਾਂ ਵਰਗੇ ਹਨ ਜੋ ਇਕ ਸਮੇਂ ਵਿਚ ਸਿਰਫ ਇਕ ਹੀ ਚਲਾ ਸਕਦੇ ਹਨ.

ਹੱਲ ਸ਼ਾਇਦ ਬਹੁਤ ਸਾਰੇ ਲੋਕਾਂ ਲਈ ਅਸਾਨ ਹੈ, ਪਰ ਇਹ ਮੇਰੇ ਲਈ ਨਵਾਂ ਸੀ: ਵੈੱਬ ਆਡੀਓ ਦੀ ਵਰਤੋਂ ਕਰੋ.

ਇਹ ਪਤਾ ਚਲਦਾ ਹੈ ਕਿ `createMediaStreamSource` ਏਪੀਆਈ ਵਿੱਚ `createMediaStreamSource` ਅਤੇ `createMediaStreamDestination` , ਦੋਵੇਂ ਹੀ ਸਮੱਸਿਆ ਨੂੰ ਹੱਲ ਕਰਨ ਲਈ ਏਪੀਆਈ ਦੀ ਜਰੂਰਤ ਹੈ. `createMediaStreamSource` ਮੇਰੇ ਡੈਸਕਟੌਪ ਆਡੀਓ ਅਤੇ ਮਾਈਕ੍ਰੋਫੋਨ ਤੋਂ `createMediaStreamSource` ਲੈ ਸਕਦਾ ਹੈ, ਅਤੇ ਦੋਵਾਂ ਨੂੰ `createMediaStreamDestination` ਦੁਆਰਾ ਬਣਾਈ ਗਈ ਇਕਾਈ ਵਿਚ `createMediaStreamDestination` ਇਹ ਮੈਨੂੰ ਇਸ ਇਕ ਧਾਰਾ ਨੂੰ `MediaRecorder` ਏਪੀਆਈ ਵਿਚ ਪਾਈਪ ਕਰਨ ਦੀ ਯੋਗਤਾ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ.

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

ਸਧਾਰਣ.

ਪੂਰਾ ਕੋਡ [my glitch](https://glitch.com/edit/#!/screen-record-voice) &#39;ਤੇ ਪਾਇਆ ਜਾ ਸਕਦਾ ਹੈ, ਅਤੇ ਡੈਮੋ ਇੱਥੇ ਪਾਇਆ ਜਾ ਸਕਦਾ ਹੈ: https://screen-record-voice.glitch.me/

{{&lt;ਤੇਜ਼-ਯੂਟਿubeਬ oGIdqcMFKlA&gt;}}

