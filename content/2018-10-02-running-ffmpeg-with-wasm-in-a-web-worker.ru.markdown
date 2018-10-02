---
slug: running-ffmpeg-with-wasm-in-a-web-worker
date: 2018-10-02T16:17:19.798Z
title: 'Running FFMPEG with WASM in a Web Worker'
link: https://github.com/PaulKinlan/ffmpeg.js/blob/wasm/examples/async.html
tags: [links, ffmpeg, wasm]
---
Я люблю [FFMPEG.js](https://github.com/Kagami/ffmpeg.js), это аккуратный инструмент, который скомпилирован с помощью asm.js`and, и пусть он будет создавать JS-приложения, которые могут быстро редактировать видео. FFMPEG.js также работает с веб-рабочими, чтобы вы могли кодировать видео без блокировки основного потока.

Я также люблю [Comlink](https://github.com/GoogleChromeLabs/comlink). Comlink позволяет мне легко взаимодействовать с веб-рабочими, выставляя функции и классы, не имея дело с сложным конечным автоматом `postMessage`.

Недавно мне удалось объединить этих двух. Я [экспериментировал с тем, чтобы экспортировать FFMPEG в Web Assembly](https://github.com/PaulKinlan/ffmpeg.js/tree/wasm) (он работает - yay), и я хотел очистить всю работу postMessage в текущем проекте FFMPEG.js. Ниже приведен код, который теперь выглядит - я думаю, что это довольно аккуратно. У нас есть один рабочий, который импортирует ffmpeg.js и comlink, и он просто предоставляет интерфейс ffmpeg, а затем у нас есть веб-страница, которая загружает рабочего, а затем использует комлинк для создания прокси-сервера API ffmpeg.

Ухоженная.

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
Мне очень нравится, как компилируемые модули Comlink, Workers и WASM могут играть вместе. Я получаю идиоматический JavaScript, который напрямую взаимодействует с модулем WASM, и он отключается от основного потока.

[Читать полностью](https://github.com/PaulKinlan/ffmpeg.js/blob/wasm/examples/async.html).
