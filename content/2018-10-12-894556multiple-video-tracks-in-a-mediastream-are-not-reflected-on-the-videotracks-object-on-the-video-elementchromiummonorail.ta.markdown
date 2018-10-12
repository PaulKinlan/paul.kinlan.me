---
slug: crbug-894556-multiple-video-tracks-in-a-mediastream-are-not-reflected-on-the-videotracks-object-on-the-video-element
date: 2018-10-12T06:35:22.116Z
title: '894556 - Multiple video tracks in a MediaStream are not reflected on the videoTracks object on the video element'
link: https://bugs.chromium.org/p/chromium/issues/detail?id=894556&can=1&q=reporter%3Ame&colspec=ID%20Pri%20M%20Stars%20ReleaseBlock%20Component%20Status%20Owner%20Summary%20OS%20Modified&desc=3
tags: [links]
---
முதல் சிக்கல் [வலைப்பக்கத்தில் ஒரு வீடியோ எடிட்டரை உருவாக்க முயற்சித்தேன்](https://paul.kinlan.me/building-a-video-editor-on-the-web-with-the-web/).

நான் பல வீடியோ ஸ்ட்ரீம்களையும் (டெஸ்க்டாப் மற்றும் வலை கேம்) வைத்திருக்கிறேன், மேலும் நான் ஒரு வீடியோ மூலையில் வீடியோ ஸ்ட்ரீம்களுக்கு இடையே மாறுவதற்கு விரும்பினேன், இதனால் வலை கேமிலும் டெஸ்க்டாப்பிலும் விரைவாக மாறலாம் மற்றும் `மீடியா ரெக்கார்டர்` ஐ உடைக்க முடியாது.

`வீடியோ ட்ராக்ஸ்` பொருளில்` தேர்ந்தெடுக்கப்பட்ட` சொத்துக்களை மாற்றுவதன் மூலம் இதைச் செய்ய முடியும் என தோன்றுகிறது. <video> `உறுப்பு, ஆனால் நீங்கள் முடியாது, தடங்கள் வரிசையில் 1 உறுப்பு மட்டுமே உள்ளது (மீடியாஸ்ட்ரீம் முதல் வீடியோ டிராக்).

> What steps will reproduce the problem?
> (1) Get two MediaStreams with video tracks
> (2) Add them to a new MediaStream and attach as srcObject on a videoElement
> (3) Check the videoElement.videoTracks object and see there is only one track
> 
> Demo at https://multiple-tracks-bug.glitch.me/
> 
> What is the expected result?
> I would expect videoElement.videoTracks to have two elements.
> 
> What happens instead?
> It only has the first videoTrack that was added to the MediaStream.


[முழு இடுகையைப் படிக்கவும்](https://bugs.chromium.org/p/chromium/issues/detail?id=894556&can=1&q=reporter%3Ame&colspec=ID%20Pri%20M%20Stars%20ReleaseBlock%20Component%20Status%20Owner%20Summary%20OS%20Modified&desc=3).

Repro வழக்கு.


```javascript
window.onload = () => {
  if('getDisplayMedia' in navigator) warning.style.display = 'none';

  let blobs;
  let blob;
  let rec;
  let stream;
  let webcamStream;
  let desktopStream;

  captureBtn.onclick = async () => {

       
    desktopStream = await navigator.getDisplayMedia({video:true});
    webcamStream = await navigator.mediaDevices.getUserMedia({video: { height: 1080, width: 1920 }, audio: true});
    
    // Always 
    let tracks = [...desktopStream.getTracks(), ... webcamStream.getTracks()]
    console.log('Tracks to add to stream', tracks);
    stream = new MediaStream(tracks);
    
    console.log('Tracks on stream', stream.getTracks());
    
    videoElement.srcObject = stream;
    
    console.log('Tracks on video element that has stream', videoElement.videoTracks)
    
    // I would expect the length to be 2 and not 1
  };

};
```