---
slug: a-simple-video-insertion-tool-for-editorjs
date: 2019-11-05T00:48:57.389Z
title: A simple video insertion tool for EditorJS
link: 'https://github.com/PaulKinlan/simple-video'
tags: [links, editor]
---

Saya sangat suka [EditorJS](https://editorjs.io/) . Biarkan saya membuat antarmuka web-host yang sangat sederhana untuk blog Hugo statis saya.

EditorJS memiliki sebagian besar dari apa yang saya butuhkan dalam editor berbasis blok sederhana. Ini memiliki plugin untuk header, kode, dan bahkan cara sederhana untuk menambahkan gambar ke editor tanpa memerlukan infrastruktur hosting. Tidak ada cara sederhana untuk menambahkan video ke editor, sampai sekarang.

Aku mengambil [simple-image](https://github.com/editor-js/simple-image) repositori plugin yang dan berubah itu (hanya anak laki-laki) untuk membuat [simple-video](https://github.com/PaulKinlan/simple-video) plugin ( [npm module](https://www.npmjs.com/package/simple-video-editorjs) ). Sekarang saya dapat memasukkan video dengan mudah di blog ini.

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