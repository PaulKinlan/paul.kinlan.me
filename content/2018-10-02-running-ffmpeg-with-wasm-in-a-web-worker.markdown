---
slug: running-ffmpeg-with-wasm-in-a-web-worker
date: 2018-10-02T16:17:19.798Z
title: 'Running FFMPEG with WASM in a Web Worker'
link: https://github.com/PaulKinlan/ffmpeg.js/blob/wasm/examples/async.html
tags: [links, ffmpeg, wasm]
---
I love [FFMPEG.js](https://github.com/Kagami/ffmpeg.js), it's a neat tool that is compiled with asm.js`and it let's me build JS web apps that can quickly edit videos. FFMPEG.js also works with web workers so that you can encode videos without blocking the main thread.

I also love [Comlink](https://github.com/GoogleChromeLabs/comlink). Comlink let's me easily interact with web workers by exposing functions and classes without having to deal with a complex `postMessage` state machine.

I recently got to combine the two together. I was [experimenting getting FFMPEG exported to Web Assembly](https://github.com/PaulKinlan/ffmpeg.js/tree/wasm) (it works - yay) and I wanted to clean up all of the postMessage work in the current FFMPEG.js project. Below is what the code now looks like - I think it's pretty neat. We have one worker that imports ffmpeg.js and comlink and it simply exposes the ffmpeg interface, and then we have the webpage that loads the worker and then uses comlink to create a proxy to the ffmpeg API.

Neat.

#### worker.js
 
```
importScripts('https://cdn.jsdelivr.net/npm/comlinkjs@3.0.2/umd/comlink.js');
importScripts('../ffmpeg-webm.js'); 
Comlink.expose(ffmpegjs, self);
```
#### client.html
 
```
let ffmpegjs = await Comlink.proxy(worker);
let result = await ffmpegjs({
   arguments: ['-y','-i', file.name, 'output.webm'],
   MEMFS: [{name: file.name, data: data}],
   stdin: Comlink.proxyValue(() => {}),
   onfilesready: Comlink.proxyValue((e) => {
     let data = e.MEMFS[0].data;
     output.src = URL.createObjectURL(new Blob([data]))
     console.log('ready', e)
   }),
   print: Comlink.proxyValue(function(data) { console.log(data); stdout += data + "\n"; }),
   printErr: Comlink.proxyValue(function(data) { console.log('error', data); stderr += data + "\n"; }),
   postRun: Comlink.proxyValue(function(result) { console.log('DONE', result); }),
   onExit: Comlink.proxyValue(function(code) {
     console.log("Process exited with code " + code);
     console.log(stdout);
   }),
});
```
I really like how Comlink, Workers and WASM compiled modules can play together. I get idiomatic JavaScript that interacts with the WASM module directly and it runs off the main thread.

[Read full post](https://github.com/PaulKinlan/ffmpeg.js/blob/wasm/examples/async.html).
