---
slug: building-ffmpeg.js
date: 2016-12-03
title: "Building ffmpeg.js for Ubuntu"
tags: ["ffmpeg", 'wasm']
---


[FFMPEG.js](https://github.com/Kagami/ffmpeg.js) adalah proyek luar biasa dan membantu saya membangun salah satu proyek terbaru saya: [Kerangka Perangkat](https://paulkinlan.github.io/ deviceframe.es/). Ini pada dasarnya membangun ffmpeg (dengan set default yang bagus untuk menjaga ukuran kecil & mdash; sekecil mungkin). Jika build default tidak mendukung filter dan pembuat enkode yang Anda butuhkan, maka Anda harus membuatnya sendiri.

Ini lebih merupakan catatan untuk saya di masa depan, tetapi inilah yang saya lakukan untuk membuatnya bekerja. (Catatan: Saya mencoba di macOS sierra dan mendapatkan kesalahan kompilasi).

#### Instal Deps

1. `sudo apt-get install automake libtool build-essential cmake`



#### Unduh ffmpeg.js

1. `git clone git@github.com: Kagami / ffmpeg.js.git` 2.` cd ffmpeg.js` 3. `git submodule init` 4. Update git submodule --recursive`



#### Instal Emscripten:

1. Linux: [Unduh](https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz) 2. `./emsdk pembaruan` 3.` ./emsdk install terbaru `4. Tunggu ... 5.` ./emsdk aktifkan terbaru` 6. sumber `. / Emsdk_env.sh`

#### Bangun ffmpeg.js

* `buat semua`

Jika ada kesalahan dengan fribidi:

* `cd build / fribidi / && ./bootstrap && configure`

Anda mungkin melihat kesalahan seperti:


```shell
./configure: line 4255: syntax error near unexpected token `2.2'
./configure: line 4255: `LT_PREREQ(2.2)'
```
Pastikan Anda telah menginstal `libtool`.

#### Selesai.
