---
date: 2019-05-13 19:47:24.846000+00:00
link: https://screen-record-voice.glitch.me/
slug: screen-recorderrecording-microphone-and-the-desktop-audio-at-the-same-time
summary: I've been working on creating a simple screen recording software, and in
  this post, I share how I finally figured out how to record both microphone and desktop
  audio simultaneously.  Previously, I could only record one or the other.  The key
  is to use the Web Audio API, specifically `createMediaStreamSource` and `createMediaStreamDestination`,
  to combine the two audio streams into one. This combined stream can then be fed
  into the `MediaRecorder` API.  You can check out the full code on my Glitch project
  and see a demo, too!
tags:
- screen recording
- web audio
- javascript
- getdisplaymedia
- mediarecorder
- microphone
- desktop audio
- glitch
- webrtc
- web development
title: 'Screen Recorder: recording microphone and the desktop audio at the same time'

---
I have a goal of building the worlds simplest screen recording software and I've been slowly noodling around on the project for the last couple of months (I mean really slowly).

In previous posts I had got the [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) by futzing about with the streams from all the input sources. One area of frustration though was that I could not work out how to get the audio from the desktop *and* overlay the audio from the speaker. I finally worked out how to do it.

Firstly, `getDisplayMedia` in Chrome now allows audio capture, there seems like an odd oversight in the Spec in that it did not allow you to specify `audio: true` in the function call, now you can.

```javascript
const audio = audioToggle.checked || false;
desktopStream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio: audio });
```

Secondly, I had originally thought that by creating two tracks in the audio stream I would be able to get what I wanted, however I learnt that Chrome's `MediaRecorder` API can only output one track, and 2nd, it wouldn't have worked anyway because tracks are like the DVD mutliple audio tracks in that only one can play at a time.

The solution is probably simple to a lot of people, but it was new to me: Use Web Audio.

It turns out that WebAudio API has `createMediaStreamSource` and `createMediaStreamDestination`, both of which are API's needed to solve the problem. The `createMediaStreamSource` can take streams from my desktop audio and microphone, and by connecting the two together into the object created by `createMediaStreamDestination` it gives me the ability to pipe this one stream into the `MediaRecorder` API.

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

Simples.

The full code can be found on [my glitch](https://glitch.com/edit/#!/screen-record-voice), and the demo can be found here: https://screen-record-voice.glitch.me/

{{< fast-youtube oGIdqcMFKlA >}}

