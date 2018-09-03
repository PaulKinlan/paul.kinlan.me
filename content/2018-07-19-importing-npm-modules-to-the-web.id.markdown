---
slug: importing-npm-modules-to-the-web-as-es6-modules
date: 2018-07-19T18:06:53.251Z
title: 'Importing npm modules to the web as JavaScript modules'
tags: [npm, rollup, javascript]
---


Saya telah bekerja dengan cara untuk mempermudah mendorong konten ke situs statis saya dan ini merupakan latihan kecil yang menyenangkan yang akan saya bagikan lebih banyak di pos lain. Dalam posting ini saya ingin berbagi konfigurasi `rollup` yang saya gunakan untuk mengimpor hampir semua modul npm ke proyek frontend menggunakan modul JavaScript.

Saya membutuhkan cara cepat mengimpor modul sederhana `get-urls` ke dalam proyek saya. Modul ini diuji dengan baik dan melakukan apa yang saya butuhkan ... mengabaikan fakta bahwa itu cukup mudah diterapkan dalam beberapa baris JavaScript. Masalah yang saya miliki adalah bahwa proyek saya dibangun di ES6, menggunakan modul dan saya tidak ingin harus menggabungkan menggunakan CommonJS (`require`).

Saya tidak dapat menemukan banyak petunjuk tentang apa yang harus dilakukan di sini, jadi saya pergi ke pengalaman dan solusi ini adalah solusi yang saya temui:

1. Buat file yang mengimpor modul npm yang saya butuhkan. `module.exports = require ('get-urls');` Modul ini akan menjadi apa yang dikonversi ke gaya ES6. 2. Buat konfigurasi rollup yang 1. Mengimpor globals node, dan builtins. 1. Menyelesaikan semua modul npm yang diperlukan untuk saya menggunakan modul ini. 1. Berikan hasilnya melalui plugin `commonjs` sehingga sekarang dalam format modul JavaScript. 1. Kompres output, karena besar: \ 3. Masukkan file yang dibundel dalam proyek Anda dan bersukacita.


``` javascript
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import closure from 'rollup-plugin-closure-compiler-js';

export default {
  input: 'static/javascripts/get-urls.js',
  output: {
      file: 'static/javascripts/get-urls.bundle.mjs',
      format: 'es',
      browser: true
    },
  plugins: [
    globals(),
    builtins(),
    resolve({
      preferBuiltins: false,
      browser: true,
      // pass custom options to the resolve plugin
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    commonjs(),
    closure({
      compilationLevel: 'WHITESPACE',
      languageIn: 'ES6',
      languageOut: 'ES6'
    })
  ]
};
```


Saya pikir mungkin ada cara yang lebih baik daripada ini, output untuk apa yang merupakan fungsi yang relatif sederhana sangat besar (70kb), tetapi sekarang berarti saya dapat menggunakan modul dari npm langsung di halaman saya.


```
<script type="module">
    import getUrls from '/javascripts/get-urls.bundle.mjs';
    ...
```


Rapi...
