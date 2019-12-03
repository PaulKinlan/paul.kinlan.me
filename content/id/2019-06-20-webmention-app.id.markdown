---
slug: webmention-app
date: 2019-06-20T12:33:04.370Z
title: 'Webmention.app'
link: 'https://remysharp.com/2019/06/18/send-outgoing-webmentions'
tags: [links, webmention, zeit, hugo]
---
Saya menyukai gagasan [Webmentions](https://www.w3.org/TR/webmention/) , namun saya belum punya waktu untuk mengimplementasikannya di situs saya. Pada web tingkat tinggi, Anda dapat berkomentar, menyukai, dan membalas konten lain di web dan membuatnya dapat dilihat oleh konten itu tanpa dipusatkan dengan alat-alat seperti Disqus (yang ingin saya hapus dari situs saya).

Sebutan Web dibagi menjadi dua komponen, pengirim dan penerima. Penerima adalah situs tempat saya menulis posting dan mereka mungkin memiliki sesuatu di situs mereka yang menunjukkan tautan masuk atau reaksi ke blog mereka; dan pengirimnya adalah, yah, saya. Saya perlu membiarkan situs jarak jauh yang saya tulis atau bereaksi terhadap beberapa konten yang mereka buat.

[Remy Sharp](https://remysharp.com) agak luar [Remy Sharp](https://remysharp.com) menciptakan [webmention.app](https://webmention.app/) untuk menyelesaikan satu bagian dari masalah: mengirim ping. Alat Remy memudahkan untuk mengirim &#39;ping&#39; ke penerima potensial yang telah saya tautkan, hanya dengan memanggil skrip CLI.

Saya meng-host blog saya menggunakan Zeit menggunakan Hugo dan alat pembangun statis, jadi itu [relatively trivial for me to add in support for webmention app](https://github.com/PaulKinlan/paul.kinlan.me/commit/541cf5db0b48b1eb75bedfa326406f887e57e1a9) . Saya hanya `npm i webmention` dan kemudian memanggil versi CLI alat dari file `build.sh` saya - itu benar-benar sederhana.

Sekarang ketika saya membuat posting, itu harus mengirim ping cepat ke semua URL baru yang saya buat beberapa konten tentang situs mereka.

