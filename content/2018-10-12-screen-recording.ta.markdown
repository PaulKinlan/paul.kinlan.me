---
slug: building-a-video-editor-on-the-web-screencasting
date: 2018-10-12T12:00:00Z
title: 'Building a video editor on the web. Part 0.1 - Screencast'
video_url: /videos/video-editor-part-0-1-screen-cast.webm
tags: ['video editor', 'webrtc', 'getusermedia', 'getdisplaymedia', 'pwa']
---


உலாவியில் இணையத்தைப் பயன்படுத்தி வீடியோக்களை உருவாக்க மற்றும் தொகுக்க முடியும். YouTube போன்ற சேவைகளில் பதிவேற்றக்கூடிய ஒரு வீடியோவில் பல வீடியோக்கள், படங்கள் மற்றும் ஆடியோ ஆகியவற்றை ஒருங்கிணைக்கும் வெளியீடு வீடியோவை உருவாக்க, ஸ்கிரீன்ஃபொலுக்கு இணக்கமான பயனர் இடைமுகத்தை வழங்க இது சாத்தியமாகும்.

வீடியோ ஆசிரியரின் தேவைகளை சுருக்கமாக விவரிக்கும் எனது [முந்தைய இடுகை](/building-a-video-editor-on-the-web-with-the-web/) இலிருந்து தொடர்ந்து வந்த பின், நான் வலை திரட்டாளர் பதிவை எவ்வாறு கட்டியெழுப்பினேன், எப்படி ஒரு திரையில் எப்படி உருவாக்குவது ரெக்கார்டர் :)

இது மிகவும் அழகாக சுத்தமாகவும், புதிய திரைப்பலகையைப் பயன்படுத்துகிறது. GetDisplayMedia` ஏபிஐ அவர்கள் திரையில் உள்ள உள்ளடக்கங்களுக்கு பயனர் வழங்கல் அணுகலை அனுமதிக்கும். கீழே உள்ள குறியீட்டை இந்த வீடியோவை உருவாக்க நான் பயன்படுத்தினேன்.

வீடியோ மிகவும் மிகவும் மூல உள்ளது, நேரத்தில் தவறுகளை நிறைய உள்ளன ஏனெனில் நான் வீடியோ திருத்த முடியாது :) என் குறிக்கோள் இந்த திட்டத்தின் முடிவில் நான் ஒரு நல்ல வீடியோ இறுதியில் இறுதி செய்ய முடியும் என்று ஆகிறது.

[இந்த வீடியோவின் குறியீடு](https://glitch.com/edit/\#!/screen-recorder-voice?path=script.js:1:0) [டெமோ](https://screen-recorder-voice.glitch.me/)


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

