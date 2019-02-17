---
slug: ffmpeg-ideas
date: 2016-12-05
title: "Ideas for web apps with FFMPEG and ffmpeg.js"
tags: ["ffmpeg"]
---


Saya baru-baru ini membangun Progressive Web App yang mengambil [screencast dari perangkat Android Anda dan kemudian membungkus video dalam bingkai perangkat](https://paulkinlan.github.io/deviceframe.es/) menggunakan [FFMPEG.js](https : //github.com/Kagami/ffmpeg.js) seperti:

{{<youtube E_U6zvjW8so>}} Saya juga berhasil memilah [membangun ffmpeg.js](https://paul.kinlan.me/building-ffmpeg.js/) sehingga dengan relatif mudah, buat build yang dioptimalkan khusus dari ffmpeg dan jalankan di browser.

Dua hal bersama-sama saya pikir menghadirkan banyak peluang untuk membangun beberapa Progressive Web Apps kecil baru yang mendorong apa yang menurut kami web mampu berkenaan dengan memanipulasi audio dan video.

Ada banyak utilitas video berbasis web di web, tetapi di mata saya banyak yang dibangun seperti situs web lama, dan tidak memanfaatkan kemajuan dalam pemrosesan sisi klien, mereka sarat dengan iklan dan tidak dapat bekerja secara offline .

Saya juga sangat tertarik pada filosofi Unix ["Lakukan satu hal dan kerjakan dengan baik"](https://en.wikipedia.org/wiki/Unix_philosophy#Do_One_Thing_and_Do_It_Well) jadi daripada membangun satu aplikasi pengeditan video monolitik yang masif, saya berpikir ada banyak aplikasi web berbeda yang dapat dibangun dengan mudah dan cepat:

* Pangkas video (ambil 5 detik dari depan, 3 dari belakang dll) * Format video apa saja -> GIF * Banyak gambar -> Format video apa saja * Format video apa pun -> Format video apa saja * Tambahkan tanda air * Ubah ukuran video * Kecilkan video * Tambahkan watermark ke video * Hamparkan video di atas satu sama lain * Video sambatan bersama * Playground FFMPEG (masukkan sumber dan skrip) * [Jika Anda punya ide tambahkan mereka ke daftar ini](https: // github.com/PaulKinlan/paul.kinlan.me/edit/master/content/2016-12-05-ffmpeg-ideas.markdown)

Saya pikir saya memiliki sebagian besar kode di tempat sebagai antarmuka UI untuk ini dengan [Device Frames repo on Github] saya (https://github.com/PaulKinlan/deviceframe.es) dan dalam banyak kasus itu adalah masalah penyesuaian grafik pemrosesan ffmpeg dan memperbarui UI untuk memungkinkan beberapa konfigurasi.

Saya akan membuat beberapa ini selama minggu-minggu mendatang, jika ada yang ingin bergabung, kemudian hubungi!