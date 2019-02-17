---
slug: chrome-bug-897727mediarecorder-using-canvas-capturestreamfails-for-large-canvas-elements-on-android
date: 2018-10-22T14:22:21.769Z
title: 'Chrome Bug 897727 - MediaRecorder using Canvas.captureStream() fails for large canvas elements on Android'
link: https://bugs.chromium.org/p/chromium/issues/detail?id=897727
tags: [links, media, mediarecorder]
---
Pada akhir pekan saya bermain-main dengan pembuat enkoder video Boomerang, Anda dapat membuatnya bekerja hampir secara langsung (akan saya jelaskan nanti). Saya membuatnya bekerja di Chrome di Desktop, tetapi tidak akan berfungsi dengan baik di Chrome pada Android. Lihat [kode di sini](https://glitch.com/edit/#!/boomerang-video-chrome-on-android-bug?path=script.js:86:22).

Sepertinya ketika Anda menggunakan `captureStream ()` pada ` <canvas> `yang memiliki resolusi yang relatif besar (1280x720 dalam kasus saya) API MediaRecorder tidak akan dapat menyandikan video dan itu tidak akan salah dan Anda tidak dapat mendeteksi bahwa itu tidak dapat menyandikan video sebelumnya.

> (1) Capture a large res video (from getUM 1280x720) to a buffer for later processing.
> (2) Create a MediaRecorder with a stream from a canvas element (via captureStream) sized to 1280x720
> (3) For each frame captured putImageData on the canvas
> (4) For each frame call canvasTrack.requestFrame() at 60fps
> 
> context.putImageData(frame, 0, 0);
> canvasStreamTrack.requestFrame();
> 
> Demo: https://boomerang-video-chrome-on-android-bug.glitch.me/
> Code: https://glitch.com/edit/#!/boomerang-video-chrome-on-android-bug?path=script.js:21:42
> 
> # What is the expected result?
> For the exact demo, I buffer the frames and then reverse them so you would 
> see the video play forwards and backwards (it works on desktop). In generall I would expect all frames sent to the canvas to be processed by the MediaRecorder API - yet they are not.
> 
> ## What happens instead?
> It only captures the stream from the canvas for a partial part of the video and then stops. It's not predicatable where it will stop.
> 
> I suspect there is a limit with the MediaRecorder API and what resolution it can encode depending on the device, and there is no way to know about these limits ahead of time.
> 
> As far as I can tell this has never worked on Android. If you use https://boomerang-video-chrome-on-android-bug.glitch.me which has a 640x480 video frame it records just fine. The demo works at higher-resolution just fine on desktop.
> 


[Baca pos lengkap](https://bugs.chromium.org/p/chromium/issues/detail?id=897727).

Jika Anda ingin bermain-main dengan demo yang berfungsi pada keduanya, maka [klik di sini](https://boomerang-video-chrome.glitch.me)
