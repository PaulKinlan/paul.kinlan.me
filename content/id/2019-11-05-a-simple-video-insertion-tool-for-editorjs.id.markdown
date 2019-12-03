---
slug: a-simple-video-insertion-tool-for-editorjs
date: 2019-11-05T00:48:57.389Z
title: A simple video insertion tool for EditorJS
link: 'https://github.com/PaulKinlan/simple-video'
tags: [links, editor]
---

Saya sangat suka <a <span class="notranslate">href=&quot;https://editorjs.io/&quot; &gt;EditorJS</a> . Biarkan saya membuat antarmuka web-host yang sangat sederhana untuk blog Hugo statis saya.

EditorJS memiliki sebagian besar dari apa yang saya butuhkan dalam editor berbasis blok sederhana. Ini memiliki plugin untuk header, kode, dan bahkan cara sederhana untuk menambahkan gambar ke editor tanpa memerlukan infrastruktur hosting. Tidak ada cara sederhana untuk menambahkan video ke editor, sampai sekarang.

Saya mengambil <a <span class="notranslate">href=&quot;https://github.com/editor-js/simple-image&quot; &gt;simple-image</a> repositori plugin <a <span class="notranslate">href=&quot;https://github.com/editor-js/simple-image&quot; &gt;simple-image</a> dan mengubahnya (hanya sedikit) untuk membuat <a <span class="notranslate">href=&quot;https://github.com/PaulKinlan/simple-video&quot; &gt;simple-video</a> plugin <a <span class="notranslate">href=&quot;https://github.com/PaulKinlan/simple-video&quot; &gt;simple-video</a> ( <a <span class="notranslate">href=&quot;https://www.npmjs.com/package/simple-video-editorjs&quot; &gt;npm module</a> ). Sekarang saya dapat memasukkan video dengan mudah di blog ini.

Jika Anda terbiasa dengan EditorJS, itu agak sederhana untuk dimasukkan dalam proyek Anda. Instal saja sebagai berikut

```
npm i simple-video-editorjs
```

Dan kemudian sertakan saja dalam proyek Anda sesuai keinginan Anda.

```
const SimpleVideo = require('simple-video-editorjs');

var editor = EditorJS({
  ...
  
  tools: {
    ...
    video: SimpleVideo,
  }
  
  ...
});
```

Editor memiliki beberapa opsi sederhana yang memungkinkan Anda mengonfigurasi bagaimana video harus di-host di halaman:

1. Putar otomatis - akan memutar video secara otomatis saat halaman dimuat
1. dibisukan - apakah video tidak memiliki suara aktif secara default (diperlukan untuk putar otomatis)
1. kontrol - apakah video memiliki kontrol HTML default.

Di bawah ini adalah contoh cepat video yang disematkan (dan menampilkan beberapa opsi).

<figure><video src="/videos/2019-11-06-a-simple-video-insertion-tool-for-editorjs-0.mp4" alt="Showing Options for EditorJS simple video." autoplay muted></video></figure>

Ngomong-ngomong, saya senang membuat plugin kecil ini - tidak terlalu sulit untuk membuat dan satu-satunya hal yang saya lakukan adalah menunda konversi ke base64 yang menggunakan gambar sederhana dan sebagai gantinya hanya menggunakan Blob URL.