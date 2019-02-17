---
slug: running-ffmpeg-with-wasm-in-a-web-worker
date: 2018-10-02T16:17:19.798Z
title: 'Running FFMPEG with WASM in a Web Worker'
link: https://github.com/PaulKinlan/ffmpeg.js/blob/wasm/examples/async.html
tags: [links, ffmpeg, wasm]
---
Ich liebe [FFMPEG.js](https://github.com/Kagami/ffmpeg.js), es ist ein nettes Tool, das mit asm.js` zusammengestellt wurde und ich kann JS Web-Apps erstellen, die Videos schnell bearbeiten können. FFMPEG.js funktioniert auch mit Web Worker, sodass Sie Videos codieren können, ohne den Hauptthread zu blockieren.

Ich liebe auch [Comlink](https://github.com/GoogleChromeLabs/comlink). Mit Comlink kann ich leicht mit Web-Arbeitern interagieren, indem ich Funktionen und Klassen offen lege, ohne mich mit einem komplexen `postMessage'-Zustandsautomaten auseinandersetzen zu müssen.

Ich habe vor kurzem die beiden zusammen zu kombinieren. Ich habe [experimentiert FFMPEG in Web Assembly exportieren](https://github.com/PaulKinlan/ffmpeg.js/tree/wasm) (es funktioniert - yay) und ich wollte alle PostMessage Arbeit im aktuellen FFMPEG.js Projekt aufräumen. Unten ist, wie der Code jetzt aussieht - ich denke, es ist ziemlich ordentlich. Wir haben einen Worker, der ffmpeg.js und comlink importiert und einfach die ffmpeg-Schnittstelle verfügbar macht. Dann haben wir die Webseite, die den Worker lädt und anschließend mithilfe von comlink einen Proxy für die ffmpeg-API erstellt.

Ordentlich.

#### worker.js
```javascript
importScripts('https://cdn.jsdelivr.net/npm/comlinkjs@3.0.2/umd/comlink.js');
importScripts('../ffmpeg-webm.js'); 
Comlink.expose(ffmpegjs, self);
```
#### client.html
```javascript
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
Ich mag es wirklich, wie Comlink, Workers und WASM kompilierte Module zusammen spielen können. Ich erhalte idiomatisches JavaScript, das direkt mit dem WASM-Modul interagiert und vom Hauptthread abläuft.

[Ganzen Beitrag lesen](https://github.com/PaulKinlan/ffmpeg.js/blob/wasm/examples/async.html).
