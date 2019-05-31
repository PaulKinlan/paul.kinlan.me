---
slug: screen-recorderrecording-microphone-and-the-desktop-audio-at-the-same-time
date: 2019-05-13T19:47:24.846Z
title: 'Screen Recorder: recording microphone and the desktop audio at the same time'
link: 'https://screen-record-voice.glitch.me/'
tags: [links, getusermedia, screen record,video editor, webrtc, getdisplaymedia]
---
நான் உலகின் எளிய திரை பதிவு மென்பொருள் உருவாக்க ஒரு நோக்கம் மற்றும் நான் மெதுவாக மாதங்கள் கடந்த இரண்டு (நான் உண்மையில் மெதுவாக அர்த்தம்) திட்டத்தை சுற்றி noodling வருகிறது.

முந்தைய இடுகைகளில், நான் [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) ஐ அனைத்து உள்ளீடு மூலங்களிலிருந்து நீரோடைகள் மூலம் எதிர்கொண்டேன். இருப்பினும் ஏமாற்றத்தின் ஒரு பகுதி டெஸ்க்டாப்பிலிருந்து ஆடியோவை எவ்வாறு பெறுவது மற்றும் ஸ்பீக்கரின் ஆடியோவை மேலோட்டமாகப் பயன்படுத்துவது எப்படி என்று எனக்குத் தெரியவில்லை. நான் இறுதியாக அதை செய்ய எப்படி வேலை.

முதலில், Chrome இல் `getDisplayMedia` இப்போது ஆடியோ பிடிப்புகளை அனுமதிக்கிறது, `getDisplayMedia` ஒரு ஒற்றைப்படை மேற்பார்வை போல் உள்ளது, இதில் நீங்கள் செயல்பாடு அழைப்பில் `audio: true` ஐ குறிப்பிடுவதற்கு அனுமதிக்கவில்லை, இப்போது உங்களால் முடியும்.

```javascript
const audio = audioToggle.checked || false;
desktopStream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio: audio });
```

இரண்டாவதாக, ஆடியோ ஸ்ட்ரீமில் இரண்டு டிராக்குகளை உருவாக்குவதன் மூலம் நான் விரும்பியதைப் பெற முடியும் என்று முதலில் நான் நினைத்தேன், இருப்பினும் Chrome இன் `MediaRecorder` ஏபிஐ ஒரு பாதையை மட்டுமே வெளியீடு செய்ய முடியும் என்று நான் அறிந்தேன், மற்றும் 2 வது, அது எப்படியாவது வேலை செய்திருக்காது ஒரே ஒரு நேரத்தில் விளையாட முடியும் என்று டிவிடி mutliple ஆடியோ தடங்கள் போல் இருக்கும்.

தீர்வு மக்கள் நிறைய எளிது, ஆனால் அது எனக்கு புதிய இருந்தது: வலை ஆடியோ பயன்படுத்தவும்.

இது WebAudio ஏபிஐ `createMediaStreamSource` மற்றும் `createMediaStreamDestination` என்று மாறிவிடும், இவை இரண்டும் ஏபிஐ பிரச்சனைக்குத் தீர்வு காண வேண்டும். `createMediaStreamSource` என் டெஸ்க்டாப் ஆடியோ மற்றும் மைக்ரோஃபோனில் இருந்து ஸ்ட்ரீம்களை எடுக்கலாம், மேலும் `createMediaStreamDestination` உருவாக்கிய பொருளுக்கு ஒன்றாக `createMediaStreamDestination` அதை `MediaRecorder` API இல் இந்த ஸ்ட்ரீமை குழாய் செய்யும் திறனை வழங்குகிறது.

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

முழு குறியீடு [my glitch](https://glitch.com/edit/#!/screen-record-voice) இல் [my glitch](https://glitch.com/edit/#!/screen-record-voice) , மற்றும் டெமோ இங்கே காணலாம்: https://screen-record-voice.glitch.me/

{{&lt;fast-youtube oGIdqcMFKlA&gt;}}

