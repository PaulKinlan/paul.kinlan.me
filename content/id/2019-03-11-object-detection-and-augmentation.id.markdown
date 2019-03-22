---
slug: object-detection-and-augmentation
date: 2019-03-11T20:32:18.307Z
title: 'Object Detection and Augmentation'
link: 'https://github.com/jeeliz/jeelizFaceFilter/blob/master/README.md#features'
tags: [links, qrcode, shapedetection]
---
Saya telah sering bermain-main dengan [Shape Detection API](https://paul.kinlan.me/face-detection/ https://paul.kinlan.me/barcode-detection/ https://paul.kinlan.me/detecting-text-in-an-image/) di Chrome dan saya sangat suka potensi yang dimilikinya, misalnya [QRCode detector](https://qrsnapper.com) sangat sederhana yang saya tulis dulu memiliki polyfill JS, tetapi menggunakan `new BarcodeDetector()` API jika tersedia.

Anda dapat melihat beberapa demo lain yang saya buat di sini menggunakan kemampuan lain dari deteksi bentuk API: [Face Detection](https://paul.kinlan.me/face-detection/) , [Barcode Detection](https://paul.kinlan.me/barcode-detection/) dan [Text Detection](https://paul.kinlan.me/detecting-text-in-an-image/) .

Saya terkejut ketika saya menemukan [Jeeliz](https://jeeliz.com) di akhir pekan dan saya sangat terkesan dengan kinerja toolkit mereka - memang saya menggunakan Pixel3 XL, tetapi deteksi wajah tampak jauh lebih cepat dari yang mungkin terjadi dengan `FaceDetector` API.

[Checkout some of their demos](https://jeeliz.com/sunglasses) .

<figure>
  <img src="/images/2019-03-11-object-detection-and-augmentation.jpeg">
</figure>

Itu membuat saya banyak berpikir. Toolkit ini untuk Deteksi Objek (dan yang seperti itu) menggunakan API yang tersedia secara luas di Web khusus akses Kamera, WebGL dan WASM, yang tidak seperti API Deteksi Bentuk Chrome (yang hanya di Chrome dan tidak konsisten di semua platform yang diaktifkan Chrome ) dapat digunakan untuk membangun pengalaman yang kaya dengan mudah dan menjangkau miliaran pengguna dengan pengalaman yang konsisten di semua platform.

Augmentasi adalah hal yang menarik (dan benar-benar apa yang ingin saya pamerkan di pos ini) dan di mana Anda memerlukan pustaka middleware yang sekarang datang ke platform, kita dapat membangun aplikasi filter wajah snapchat-esque yang asyik tanpa pengguna memasang aplikasi MASSIVE yang memanen sejumlah besar data dari perangkat pengguna (karena tidak ada akses mendasar ke sistem).

Di luar demo yang menyenangkan, dimungkinkan untuk menyelesaikan kasus penggunaan yang sangat canggih dengan cepat dan sederhana untuk pengguna, seperti:

* Pemilihan Teks langsung dari kamera atau foto dari pengguna
* Terjemahan langsung bahasa dari kamera
* Deteksi QRCode sebaris sehingga orang tidak harus membuka WeChat sepanjang waktu :)
* Ekstrak URL situs web atau alamat dari suatu gambar
* Deteksi kartu kredit dan ekstraksi nomor (membuat pengguna mendaftar ke situs Anda lebih cepat)
* Pencarian produk visual di aplikasi web toko Anda.
* Pencarian barcode untuk lebih detail produk di aplikasi web toko Anda.
* Pemotongan cepat foto profil ke wajah orang.
* Fitur A11Y sederhana untuk memungkinkan pengguna mendengar teks yang ditemukan dalam gambar.

Saya hanya menghabiskan 5 menit untuk memikirkan kasus penggunaan ini - saya tahu ada lebih banyak - tetapi saya sadar bahwa kita tidak melihat banyak situs atau aplikasi web menggunakan kamera, malah kita melihat banyak situs bertanya pengguna untuk mengunduh aplikasi, dan saya pikir kita tidak perlu melakukan itu lagi.

** Perbarui ** Thomas Steiner di tim kami yang disebutkan dalam Obrolan tim kami bahwa sepertinya saya tidak suka API `ShapeDetection` saat ini. Saya suka fakta bahwa API ini memberi kami akses ke implementasi pengiriman asli dari masing-masing sistem, namun seperti yang saya tulis di [The Lumpy Web](/the-lumpy-web/) , Pengembang Web menginginkan konsistensi dalam platform dan ada sejumlah masalah dengan Shape Detection API yang dapat diringkas sebagai:

1. API hanya di Chrome
2. API di Chrome sangat berbeda di setiap platform karena implementasi yang mendasarinya berbeda. Android hanya memiliki poin untuk tengara seperti mulut dan mata, di mana macOS memiliki garis besar. Di Android, `TextDetector` mengembalikan teks yang terdeteksi, sedangkan pada macOS ia mengembalikan indikator &#39;Text Presence&#39; ... Ini belum lagi semua bug yang ditemukan Surma.

Web sebagai platform untuk distribusi sangat masuk akal untuk pengalaman seperti ini sehingga saya pikir tidak ada gunanya bagi kita untuk tidak melakukannya, tetapi dua kelompok masalah di atas membuat saya mempertanyakan kebutuhan jangka panjang untuk mengimplementasikan setiap fitur pada platform web secara asli, ketika kita dapat mengimplementasikan solusi yang baik dalam sebuah paket yang dikirimkan menggunakan fitur-fitur platform saat ini seperti WebGL, WASM dan di GPU Web masa depan.

Lagi pula, saya suka fakta bahwa kita bisa melakukan ini di web dan saya melihat ke depan untuk melihat situs yang disertakan bersama mereka.