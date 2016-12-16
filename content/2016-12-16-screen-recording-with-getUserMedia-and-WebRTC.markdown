---
slug: screen-recording-with-getUserMedia-and-WebRTC
date: 2016-12-16T13:20:31+01:00
title: "Screen recording on Android with getUserMedia and WebRTC"
description: "Finally you can record your screen directly on Android via JS... well 'finally' is a strong word."
---

I am a real believer in showing live demos when doing nearly any tech based
presentation.  It brings a sense of this thing is real, it is not too complex
to implement (heck, someone on stage is doing this live). There are many problems
with doing this, demos fail, internet connections drop, coding errors creep in,
service quota issues etc.

To overcome a lot of the issues with live demos, I frequently [screen record the
demo](/android-screen-recording-and-device-framing/) in the context of how it is
to be used. It is still the same demo but it is running in the context of the
slide. It allows me to focus on the output and not writing the code or worrying
about the demo. This method isn't for everyone but it works for me.

To create these screen recordings, I've created a number of tools to help
with [screen recording](/android-screen-recording/), [screen recording with device framing](https://gist.github.com/PaulKinlan/2fdb0c8a6b6f6a646f87)
and a nifty [web app that will add a device frame around a video](https://paulkinlan.github.io/deviceframe.es/)

I think the videos work pretty well and we've used them in a number of keynote
talks. The thing is that no body likes to use any of the tooling. Try getting
anyone to install `adb` or `ffmpeg` just for a presentation and I am frequently
asked to record a demo (I don't mind, at least I am valuable to some people) so
I would like to automate it as much as possible.

I've long wanted the ability to directly record from an Android screen, add the
device frame and finally encode it into multiple formats so that they can be
embedded anywhere, without the need to install any software.

We are nearly there. The Chrome team is adding the ability to share your screen
from your Android Device via `getUserMedia` and I've created an [prototype that
records your screen and streams it to another device so it can be recorded to
a file and device framed](https://paulkinlan.github.io/screenrecord).

The infrastructure at a high-level is not incredibly complex although the nitty
gritty of WebRTC is an absolute nightmare. More on that in another post.

There are two pieces of this are.

1. capture locally (and optionally recording locally) and
2. stream remotely to a desktop.

### Capturing the screen

[`getUserMedia` is a pretty great
API](https://www.w3.org/TR/mediacapture-streams/). It allows you to access any
of the cameras or microphones directly and in real-time inline in your web page.
The `getUserMedia` API has a [constraint
system](https://www.w3.org/TR/mediacapture-streams/#idl-def-Constraints) that
allows you to request that you only connect to certain types of device.  For
example, you can request that you only connect to audio enabled devices by
setting a constrain `{audio: true}`, or you could say that you only want to
connect to a HD camera `{video: {'mandatory': {width: 1920, height: 1080}}}`.

Chrome is introducing a new constaint `{'chromeMediaSource':'screen'}`, this
says that Chrome should use the Screen as the Streams media source.

It is currently behind a flag and totally experimental. You need to enable it
on Android by toggling chrome://flags#enable-usermedia-screen-capturing.  You
can also track the implementation on the [Chrome Bug 487935](https://bugs.chromium.org/p/chromium/issues/detail?id=487935).
```
const constraints = {
    audio: false, // mandatory.
    video: {'mandatory': {'chromeMediaSource':'screen'}}
};

const successCallback = (stream) => {
    // Do something with the stream.
    // Attach to WebRTC connections
    // Record via MediaRecorder
};

const errorCallback = () => {
  // We don't have access to the API
};

navigator.getUserMedia(constraints, successCallback, errorCallback);
```

That is all.

Well, technically that is all. In practice, you don't get access straight away.
The user has to grant access to the media stream (like you always do) for
`getUserMedia` and then because it is an incredibly powerful feature of this
API the user has to clearly opt in to sharing their screen. Once they have opted
in there will be a clear indicator that they are sharing their screen.

Now that you have the screen stream you can store it locally, or you can stream
it out over WebRTC.

Recording it locally is possible using `MediaRecorder` like I did in my
[WebGL recording snippet](https://gist.github.com/PaulKinlan/def79b32a6cfec88f7b61e531523c743).
and I've created a simple demo that will record the screen for 10 seconds and
then download it to your device.

```
(function() {
  // Download locally
  function download(blob) {
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  const successCallback = (stream) => {
    // Set up the recorder
    let blobs = [];
    let recorder = new MediaRecorder(stream, {mimeType: 'video/webm; codecs=vp9'});
    recorder.ondataavailable = e => { if (e.data && e.data.size > 0) blobs.push(e.data)};
    recorder.onstop = (e) => download(new Blob(blobs, {type: 'video/webm'}));

    // Record for 10 seconds.
    setTimeout(()=> recorder.stop(), 10000);

    // Start recording.
    recorder.start(10); // collect 10ms chunks of data
  };

  const errorCallback = (err) => {
    // We don't have access to the API
    console.log(err)
  };

  navigator.getUserMedia({
    audio: false,
    video: {'mandatory': {'chromeMediaSource':'screen'}}
  }, successCallback, errorCallback);
})();
```

### Streaming remotely

That's WebRTC! :) I am totally going to bail on explaining this in this post and
instead moan about it in a follow up.

### Open? Standard compliant?

The constraint `chromeMediaSource` is clearly not part of the standard. I think
this needs to be worked out.

[Code for this demo](https://github.com/PaulKinlan/screenrecord).