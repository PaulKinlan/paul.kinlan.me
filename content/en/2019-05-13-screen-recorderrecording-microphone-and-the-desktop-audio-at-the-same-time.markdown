---
slug: screen-recorderrecording-microphone-and-the-desktop-audio-at-the-same-time
date: 2019-05-13T19:47:24.846Z
title: 'Screen Recorder: recording microphone and the desktop audio at the same time'
link: 'https://screen-record-voice.glitch.me/'
tags: [links, getusermedia, screen record,video editor, webrtc, getdisplaymedia]
---
I have a goal of building the worlds simplest screen recording software and I've been slowly noodling around on the project for the last couple of months (I mean really slowly).

In previous posts I had got the [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) by futzing about with the streams from all the input sources. One area of frustration though was that I could not work out how to get the audio from the desktop *and* overlay the audio from the speaker. I finally worked out how to do it.

Firstly, `getDisplayMedia` in Chrome now allows audio capture, there seems like an odd oversight in the Spec in that it did not allow you to specify `audio: true` in the function call, now you can.

```
const audio = audioToggle.checked || false;
desktopStream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio: audio });
```

Secondly, I had originally thought that by creating two tracks in the audio stream I would be able to get what I wanted, however I learnt that Chrome's `MediaRecorder` API can only output one track, and 2nd, it wouldn't have worked anyway because tracks are like the DVD mutliple audio tracks in that only one can play at a time.

The solution is probably simple to a lot of people, but it was new to me: Use Web Audio.

It turns out that WebAudio API has `createMediaStreamSource` and `createMediaStreamDestination`, both of which are API's needed to solve the problem. The `createMediaStreamSource` can take streams from my desktop audio and microphone, and by connecting the two together into the object created by `createMediaStreamDestination` it gives me the ability to pipe this one stream into the `MediaRecorder` API.

```
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

Simples.

The full code can be found on [my glitch](<a href="https://glitch.com/edit/#!/screen-record-voice">https://glitch.com/edit/#!/screen-record-voice</a>, and the demo can be found here: https://screen-record-voice.glitch.me/

