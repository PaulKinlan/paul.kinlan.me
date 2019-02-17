---
slug: thoughts-on-importing-npm-modules-to-the-web-as-javascript-modules
date: 2018-07-20T12:39:24.232Z
title: 'Thoughts on importing npm modules to the web as JavaScript modules'
link: https://paul.kinlan.me/importing-npm-modules-to-the-web-as-es6-modules/
tags: [links, npm, mjs, modules, javascript]
---
Saya punya pikiran tentang posting yang saya lakukan kemarin tentang Modul ES

> I needed a quick way import a simple module get-urls into my project. The module is well tested and it does what I needed &#x2026; ignore the fact that it&#x2019;s pretty easy to implement in a couple of lines of JavaScript. The problem I had is that my project is built in ES6, uses modules and I didn&#x2019;t want to have to bundle up using CommonJS (require).
> 
> I couldn&#x2019;t find a lot of guidance on what to do here, so I went to experiement and this solution is the solution I came across:
> 
> 1. Create a file that imports the npm module I needed. module.exports = require('get-urls'); This module will be what&#x2019;s converted to ES6 style.
> 2. Create a rollup config that
>     1. Imports the node globals, and builtins.
>     2. Resolves all npm modules required for my usage of this module.
>     3. Pass the results through the commonjs plugin so that it&#x2019;s now in JavaScript module format.
>     4. Compress the output, because it&#x2019;s huge :
> 3. Include the bundled file in your project and rejoice.


[Baca posting lengkap](https://paul.kinlan.me/importing-npm-modules-to-the-web-as-es6-modules/).

Salah satu hal yang ingin saya coba dan artikulasikan dalam artikel asli tetapi saya putuskan untuk menarik keluar adalah bahwa ada sejumlah besar kode dalam ekosistem Node yang tidak benar-benar spesifik untuk Node per se tetapi telah digabungkan secara erat dengan Node melalui Common JS dan API Node lainnya yang sangat spesifik (Buffer, URL lama, dll.) Yang akan membutuhkan banyak upaya untuk menarik diri dan dengan demikian perubahan diperlukan untuk membuat Modul ES di mana-mana akan berpotensi cukup menyakitkan, dan sampai perubahan ekosistem kita akan perlu menggunakan banyak alat konversi dan bundler untuk dapat berbagi kode dengan bersih di berbagai platform (web / server).

Kami berada di mana kami berada, tidak ada kisah impor di web, kami tidak memiliki tumpukan primitif yang diperkenalkan Node dan sekarang banyak yang sekarang mempertimbangkan persyaratan platform de-facto, jadi saya harap ini adalah lebih dari pengakuan situasi daripada kritik.

Ada juga langkah untuk menggunakan '.mjs' sebagai ekstensi file yang standar di kedua node dan web. Saya merasa benar-benar nyaman dengan ini, namun .msj bukanlah file yang infrastruktur apapun belum mengenali sebagai 'teks / javascript' dan saya melihat ke depan untuk ini hanya sedang disortir sehingga secara otomatis disimpulkan oleh setiap server web di planet ini, jadi Saya tidak perlu menerapkan lebih banyak lagi perubahan konfigurasi pada infrastruktur layanan saya.

Banyak waktu yang menyenangkan di depan, saya untuk satu menanti-nantikan untuk dapat membawa lebih banyak fungsi ke web.
