---
slug: running-ffmpeg-with-wasm-in-a-web-worker
date: 2018-10-02T16:17:19.798Z
title: 'Running FFMPEG with WASM in a Web Worker'
link: https://github.com/PaulKinlan/ffmpeg.js/blob/wasm/examples/async.html
tags: [links, ffmpeg, wasm]
---
Me encanta [FFMPEG.js](https://github.com/Kagami/ffmpeg.js), es una buena herramienta compilada con asm.js` y me permite crear aplicaciones web JS que pueden editar videos rápidamente. FFMPEG.js también trabaja con trabajadores web para que pueda codificar videos sin bloquear el hilo principal.

También me encanta [Comlink](https://github.com/GoogleChromeLabs/comlink). Comlink me permite interactuar fácilmente con los trabajadores web al exponer funciones y clases sin tener que lidiar con una compleja máquina de estados `postMessage`.

Recientemente pude combinar los dos juntos. Estaba [experimentando para que FFMPEG fuera exportado a Web Assembly](https://github.com/PaulKinlan/ffmpeg.js/tree/wasm) (funciona - yay) y quería limpiar todo el trabajo posterior al mensaje en el proyecto FFMPEG.js actual. A continuación se muestra cómo se ve el código: creo que es bastante claro. Tenemos un trabajador que importa ffmpeg.js y comlink y simplemente expone la interfaz ffmpeg, y luego tenemos la página web que carga al trabajador y luego usa comlink para crear un proxy para la API de ffmpeg.

Ordenado.

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
Me gusta mucho cómo pueden jugar juntos los módulos compilados de Comlink, Workers y WASM. Obtengo JavaScript idiomático que interactúa con el módulo WASM directamente y se ejecuta fuera del hilo principal.

[Leer publicación completa](https://github.com/PaulKinlan/ffmpeg.js/blob/wasm/examples/async.html).
