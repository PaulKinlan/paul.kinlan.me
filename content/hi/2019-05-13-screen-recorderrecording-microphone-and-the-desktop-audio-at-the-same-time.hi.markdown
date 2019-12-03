---
slug: screen-recorderrecording-microphone-and-the-desktop-audio-at-the-same-time
date: 2019-05-13T19:47:24.846Z
title: 'Screen Recorder: recording microphone and the desktop audio at the same time'
link: 'https://screen-record-voice.glitch.me/'
tags: [links, getusermedia, screen record,video editor, webrtc, getdisplaymedia]
---
मेरे पास दुनिया के सबसे सरल स्क्रीन रिकॉर्डिंग सॉफ़्टवेयर के निर्माण का लक्ष्य है और मैं पिछले कुछ महीनों से परियोजना पर धीरे-धीरे नूडल बना रहा हूं (मेरा मतलब वास्तव में धीरे-धीरे है)।

पिछले पोस्टों में मुझे सभी इनपुट स्रोतों से प्राप्त धाराओं के बारे में [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) मिला था। हालांकि निराशा का एक क्षेत्र यह था कि मैं यह काम नहीं कर सकता था कि डेस्कटॉप से ऑडियो कैसे प्राप्त किया जाए * और * स्पीकर से ऑडियो को ओवरले करें। मैंने आखिरकार यह करने के लिए कैसे काम किया।

सबसे पहले, Chrome में `getDisplayMedia` अब ऑडियो कैप्चर करने की अनुमति देता है, विशेष रूप से एक अजीब `getDisplayMedia` जैसा लगता है कि यह आपको फ़ंक्शन कॉल में `audio: true` निर्दिष्ट करने की अनुमति नहीं देता है, अब आप कर सकते हैं।

```javascript
const audio = audioToggle.checked || false;
desktopStream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio: audio });
```

दूसरी बात, मैंने मूल रूप से सोचा था कि ऑडियो स्ट्रीम में दो ट्रैक बनाने से मैं वह प्राप्त कर सकूंगा जो मैं चाहता था, लेकिन मुझे पता चला कि Chrome का `MediaRecorder` API केवल एक ट्रैक का उत्पादन कर सकता है, और दूसरा, यह वैसे भी काम नहीं करेगा क्योंकि पटरियों डीवीडी उत्परिवर्ती ऑडियो पटरियों की तरह हैं जो केवल एक समय में खेल सकते हैं।

समाधान शायद बहुत से लोगों के लिए सरल है, लेकिन यह मेरे लिए नया था: वेब ऑडियो का उपयोग करें।

यह पता चला है कि WebAudio API में `createMediaStreamSource` और `createMediaStreamDestination` , जो दोनों ही समस्या को हल करने के लिए API की आवश्यकता है। `createMediaStreamSource` मेरे डेस्कटॉप ऑडियो और माइक्रोफ़ोन से धाराएँ ले सकता है, और दोनों को मिलकर `createMediaStreamDestination` द्वारा बनाई गई वस्तु में शामिल कर सकता है, यह मुझे इस एक स्ट्रीम को `MediaRecorder` API में पाइप करने की सुविधा देता है।

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

साधारण।

पूरा कोड [my glitch](https://glitch.com/edit/#!/screen-record-voice) पर पाया जा सकता है, और डेमो यहाँ पाया जा सकता है: https://screen-record-voice.glitch.me/

{{&lt;तेज़-youtube oGIdqcMFKlA&gt;}}

