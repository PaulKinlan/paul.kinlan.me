---
slug: running-ffmpeg-with-wasm-in-a-web-worker
date: 2018-10-02T16:17:19.798Z
title: 'Running FFMPEG with WASM in a Web Worker'
link: https://github.com/PaulKinlan/ffmpeg.js/blob/wasm/examples/async.html
tags: [links, ffmpeg, wasm]
---
J'aime [FFMPEG.js](https://github.com/Kagami/ffmpeg.js), c'est un outil soigné compilé avec asm.js` qui me permet de créer des applications Web JS pouvant éditer rapidement des vidéos. FFMPEG.js fonctionne également avec les travailleurs Web afin que vous puissiez encoder des vidéos sans bloquer le fil principal.

J'aime aussi [Comlink](https://github.com/GoogleChromeLabs/comlink). Comlink me permet d’interagir facilement avec les travailleurs Web en exposant des fonctions et des classes sans avoir à traiter avec une machine à états `postMessage` complexe.

J'ai récemment eu à combiner les deux ensemble. J'essayais [d'essayer de faire exporter FFMPEG vers Web Assembly](https://github.com/PaulKinlan/ffmpeg.js/tree/wasm) (ça marche - oui) et je voulais nettoyer tout le travail postMessage du projet actuel FFMPEG.js. Le code ci-dessous ressemble à ceci: je pense que c'est assez chouette. Nous avons un opérateur qui importe ffmpeg.js et comlink. Il expose simplement l'interface ffmpeg. La page Web qui charge l'agent et utilise ensuite comlink pour créer un proxy pour l'API ffmpeg.

Soigné.

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
J'aime beaucoup la manière dont les modules compilés par Comlink, Workers et WASM peuvent jouer ensemble. Je reçois du code JavaScript idiomatique qui interagit directement avec le module WASM et qui s'exécute à partir du thread principal.

[Lire l'article complet](https://github.com/PaulKinlan/ffmpeg.js/blob/wasm/examples/async.html).
