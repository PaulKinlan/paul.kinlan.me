---
slug: screen-recorderrecording-microphone-and-the-desktop-audio-at-the-same-time
date: 2019-05-13T19:47:24.846Z
title: 'Screen Recorder: recording microphone and the desktop audio at the same time'
link: 'https://screen-record-voice.glitch.me/'
tags: [links, getusermedia, screen record,video editor, webrtc, getdisplaymedia]
---
உலகின் எளிமையான திரை பதிவு மென்பொருளை உருவாக்குவதற்கான குறிக்கோள் எனக்கு உள்ளது, கடந்த இரண்டு மாதங்களாக நான் மெதுவாக திட்டத்தை சுற்றி வருகிறேன் (நான் மிகவும் மெதுவாக அர்த்தம்).

முந்தைய இடுகைகளில், அனைத்து உள்ளீட்டு மூலங்களிலிருந்தும் ஸ்ட்ரீம்களைப் பற்றிக் கொண்டு [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) பெற்றேன். விரக்தியின் ஒரு பகுதி என்னவென்றால், டெஸ்க்டாப்பில் இருந்து ஆடியோவை எவ்வாறு பெறுவது என்று என்னால் வேலை செய்ய முடியவில்லை * மற்றும் * ஸ்பீக்கரிடமிருந்து ஆடியோவை மேலடுக்கு. நான் அதை எப்படி செய்வது என்று இறுதியாக வேலை செய்தேன்.

முதலாவதாக, Chrome இல் உள்ள `getDisplayMedia` இப்போது ஆடியோ பிடிப்பை அனுமதிக்கிறது, ஸ்பெக்கில் ஒற்றைப்படை மேற்பார்வை இருப்பது போல் தெரிகிறது, இது செயல்பாட்டு அழைப்பில் `audio: true` ஐ குறிப்பிட உங்களை அனுமதிக்கவில்லை, இப்போது உங்களால் முடியும்.

```javascript
const audio = audioToggle.checked || false;
desktopStream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio: audio });
```

இரண்டாவதாக, ஆடியோ ஸ்ட்ரீமில் இரண்டு டிராக்குகளை உருவாக்குவதன் மூலம் நான் விரும்பியதைப் பெற முடியும் என்று நான் முதலில் நினைத்தேன், இருப்பினும் Chrome இன் `MediaRecorder` API ஒரு தடத்தை மட்டுமே `MediaRecorder` முடியும் என்பதை அறிந்தேன், 2 வது, இது எப்படியும் வேலை செய்யாது, ஏனெனில் தடங்கள் ஒரே நேரத்தில் ஒருவர் மட்டுமே இயக்கக்கூடிய டிவிடி மட்டு ஆடியோ டிராக்குகளைப் போன்றது.

தீர்வு அநேகருக்கு எளிதானது, ஆனால் இது எனக்கு புதியது: வலை ஆடியோவைப் பயன்படுத்துங்கள்.

WebAudio API இல் `createMediaStreamSource` மற்றும் `createMediaStreamDestination` உள்ளது என்று மாறிவிடும், இவை இரண்டும் சிக்கலைத் தீர்க்க API இன் தேவை. `createMediaStreamSource` எனது டெஸ்க்டாப் ஆடியோ மற்றும் மைக்ரோஃபோனிலிருந்து ஸ்ட்ரீம்களை எடுக்க முடியும், மேலும் `createMediaStreamDestination` உருவாக்கிய `createMediaStreamDestination` மூலம் இந்த ஒரு ஸ்ட்ரீமை `MediaRecorder` API இல் குழாய் `createMediaStreamDestination` திறனை இது தருகிறது.

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

எளிய.

முழு குறியீட்டை [my glitch](https://glitch.com/edit/#!/screen-record-voice) இல் [my glitch](https://glitch.com/edit/#!/screen-record-voice) , மேலும் டெமோவை இங்கே காணலாம்: https://screen-record-voice.glitch.me/

{{&lt;fast-youtube oGIdqcMFKlA&gt;}}

