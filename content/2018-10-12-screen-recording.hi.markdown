---
slug: building-a-video-editor-on-the-web-screencasting
date: 2018-10-12T12:00:00Z
title: 'Building a video editor on the web. Part 0.1 - Screencast'
video_url: /videos/video-editor-part-0-1-screen-cast.webm
tags: ['video editor', 'webrtc', 'getusermedia', 'getdisplaymedia', 'pwa']
---


आप ब्राउज़र में बस वेब का उपयोग करके वीडियो बनाने और संपादित करने में सक्षम होना चाहिए। स्क्रीनफ्लो के समान उपयोगकर्ता-इंटरफ़ेस प्रदान करना संभव होना चाहिए जो आपको एक आउटपुट वीडियो बनाने देता है जो एकाधिक वीडियो, छवियों और ऑडियो को एक वीडियो में जोड़ता है जिसे YouTube जैसी सेवाओं पर अपलोड किया जा सकता है।

मेरे [पिछली पोस्ट](/building-a-video-editor-on-the-web-with-the-web/) के बाद से जो वीडियो संपादक की आवश्यकताओं का संक्षेप में वर्णन करता है, इस पोस्ट में मैं बस एक स्क्रीनकास्ट में दिखाना चाहता था कि मैंने वेब कैम रिकॉर्डर कैसे बनाया, और स्क्रीनकास्ट कैसे बनाया जाए रिकॉर्डर :)

यह सब बहुत साफ है और यह नए 'navigator.getDisplayMedia` API का उपयोग करता है जो उपयोगकर्ता को उनकी स्क्रीन सामग्री तक पहुंच प्रदान करने देता है। नीचे दिया गया कोड वह सब कुछ है जिसका उपयोग मैंने इस वीडियो को बनाने के लिए किया था।

वीडियो बहुत कच्चा है, बहुत सारी गलतियां हैं क्योंकि फिलहाल मैं वीडियो संपादित नहीं कर सकता :) मेरा लक्ष्य यह है कि इस परियोजना के अंत में मैं एक अच्छा वीडियो अंत तक बना सकता हूं।

[इस वीडियो के लिए कोड](https://glitch.com/edit/\#!/screen-recorder-voice?path=script.js:1:0) [डेमो](https://screen-recorder-voice.glitch.me/)


```javascript  
window.onload = () => {
  if('getDisplayMedia' in navigator) warning.style.display = 'none';

  let blobs;
  let blob;
  let rec;
  let stream;
  let voiceStream;
  let desktopStream;

  captureBtn.onclick = async () => {
    download.style.display = 'none';
    
    desktopStream = await navigator.getDisplayMedia({video:true});
    voiceStream = await navigator.mediaDevices.getUserMedia({video: false, audio: true});
    
    let tracks = [...desktopStream.getTracks(), ...voiceStream.getAudioTracks()]
    console.log('Tracks to add to stream', tracks);
    stream = new MediaStream(tracks);
    videoElement.srcObject = stream;
      
    blobs = [];
  
    rec = new MediaRecorder(stream, {mimeType: 'video/webm; codecs=vp9,opus'});
    rec.ondataavailable = (e) => blobs.push(e.data);
    rec.onstop = async () => {
      blob = new Blob(blobs, {type: 'video/webm'});
      let url = window.URL.createObjectURL(blob);
      download.href = url;
      download.download = 'test.webm';
      download.style.display = 'block';
    };
    startBtn.disabled = false;
    captureBtn.disabled = true;
  };

  startBtn.onclick = () => {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    rec.start();
  };

  stopBtn.onclick = () => {
    captureBtn.disabled = false;
    startBtn.disabled = true;
    stopBtn.disabled = true;

    rec.stop();
    stream.getTracks().forEach(s=>s.stop())
    videoElement.srcObject = null
    stream = null;
  };
};
```

