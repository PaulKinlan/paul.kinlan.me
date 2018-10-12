---
slug: crbug-894556-multiple-video-tracks-in-a-mediastream-are-not-reflected-on-the-videotracks-object-on-the-video-element
date: 2018-10-12T06:35:22.116Z
title: '894556 - Multiple video tracks in a MediaStream are not reflected on the videoTracks object on the video element'
link: https://bugs.chromium.org/p/chromium/issues/detail?id=894556&can=1&q=reporter%3Ame&colspec=ID%20Pri%20M%20Stars%20ReleaseBlock%20Component%20Status%20Owner%20Summary%20OS%20Modified&desc=3
tags: [links]
---
El primer problema que encontré al intentar [construir un editor de video en la web](https://paul.kinlan.me/building-a-video-editor-on-the-web-with-the-web/).

Tengo varias secuencias de video (computadora de escritorio y cámara web) y quería poder alternar entre las secuencias de video en un elemento de video para poder cambiar rápidamente entre la cámara web y la computadora de escritorio y no interrumpir el `MediaRecorder`.

Parece que deberías poder hacerlo alternando la propiedad `selected` en el objeto` videoTracks` en el ` <video> Elemento `pero no puede, la matriz de pistas contiene solo 1 elemento (la primera pista de video en MediaStream).

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


[Leer publicación completa](https://bugs.chromium.org/p/chromium/issues/detail?id=894556&can=1&q=reporter%3Ame&colspec=ID%20Pri%20M%20Stars%20ReleaseBlock%20Component%20Status%20Owner%20Summary%20OS%20Modified&desc=3).

Caso de repro.


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