---
slug: running-ffmpeg-with-wasm-in-a-web-worker
date: 2018-10-02T16:17:19.798Z
title: 'Running FFMPEG with WASM in a Web Worker'
link: https://github.com/PaulKinlan/ffmpeg.js/blob/wasm/examples/async.html
tags: [links, ffmpeg, wasm]
---
Saya suka [FFMPEG.js](https://github.com/Kagami/ffmpeg.js), ini adalah alat yang rapi yang dikompilasi dengan asm.js`dan ini memungkinkan saya membangun aplikasi web JS yang dapat mengedit video dengan cepat. FFMPEG.js juga berfungsi dengan pekerja web sehingga Anda dapat menyandikan video tanpa memblokir utas utama.

Saya juga suka [Comlink](https://github.com/GoogleChromeLabs/comlink). Comlink mari saya dengan mudah berinteraksi dengan pekerja web dengan mengekspos fungsi dan kelas tanpa harus berurusan dengan mesin negara `postMessage` yang kompleks.

Saya baru saja menggabungkan keduanya bersama. Saya [bereksperimen mendapatkan FFMPEG diekspor ke Web Assembly](https://github.com/PaulKinlan/ffmpeg.js/tree/wasm) (berfungsi - yay) dan saya ingin membersihkan semua pekerjaan postMessage dalam proyek FFMPEG.js saat ini. Di bawah ini adalah apa kode sekarang terlihat - saya pikir itu cukup rapi. Kami memiliki satu pekerja yang mengimpor ffmpeg.js dan comlink dan itu hanya memperlihatkan antarmuka ffmpeg, dan kemudian kami memiliki halaman web yang memuat pekerja dan kemudian menggunakan comlink untuk membuat proxy ke API ffmpeg.

Rapi.

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
Saya sangat suka bagaimana modul Comlink, Workers dan WASM compiled dapat bermain bersama. Saya mendapatkan JavaScript idiomatik yang berinteraksi dengan modul WASM secara langsung dan menjalankan dari utas utama.

[Baca pos lengkap](https://github.com/PaulKinlan/ffmpeg.js/blob/wasm/examples/async.html).
