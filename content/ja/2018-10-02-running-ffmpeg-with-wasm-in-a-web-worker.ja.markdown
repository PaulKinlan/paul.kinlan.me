---
slug: running-ffmpeg-with-wasm-in-a-web-worker
date: 2018-10-02T16:17:19.798Z
title: 'Running FFMPEG with WASM in a Web Worker'
link: https://github.com/PaulKinlan/ffmpeg.js/blob/wasm/examples/async.html
tags: [links, ffmpeg, wasm]
---
私は[FFMPEG.js](https://github.com/Kagami/ffmpeg.js)が大好きです。これは、asm.jsでコンパイルされた素敵なツールです。そして、私はビデオをすばやく編集できるJS Webアプリケーションを作成しましょう。 FFMPEG.jsもWebワーカーと連携して、メインスレッドをブロックせずにビデオをエンコードすることができます。

私は[Comlink](https://github.com/GoogleChromeLabs/comlink)も大好きです。 Comlinkでは、複雑な `postMessage`ステートマシンを扱わなくても、関数やクラスを公開することで、Webワーカーと簡単にやりとりすることができます。

私は最近、この2つを組み合わせる必要があります。私は[FFMPEGをWebアセンブリにエクスポートして実験しました](https://github.com/PaulKinlan/ffmpeg.js/tree/wasm)（これはうまくいきます）、現在のFFMPEG.jsプロジェクトでpostMessageの作業をすべてクリーンアップしたかったのです。以下は、コードが今のように見えるものです - 私はそれがかなりきちんとしていると思います。私たちにはffmpeg.jsとcomlinkをインポートするワーカーがいて、単にffmpegインターフェイスを公開するだけです。次に、workerを読み込んだ後、comlinkを使ってffmpeg APIへのプロキシを作成するWebページがあります。

きちんとした

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
私はComlink、Workers、WASMのコンパイルされたモジュールが一緒に演奏できる方法が本当に好きです。私はWASMモジュールと直接対話する慣用的なJavaScriptを取得し、それはメインスレッドから実行されます。

[全文を読む](https://github.com/PaulKinlan/ffmpeg.js/blob/wasm/examples/async.html)
