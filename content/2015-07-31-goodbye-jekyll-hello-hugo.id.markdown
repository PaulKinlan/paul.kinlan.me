---
slug: goodbye-jekyll-hello-hugo
date: 2015-07-31
title: "Goodbye Jekyll, Hello Hugo"
description: "Ruby frustrations and performance have frustrated me for a long time. Experimented with Hugo and ported blog in about 3 hours"
image_header: /images/hellogoodbye.png
---


Saya suka Jekyll. Ini telah membantu saya kembali ke blogging dan saya [memilihnya sebagai teknologi](https://github.com/Google/WebFundamentals/) untuk membangun [Dasar-Dasar Google Web](https://developers.google.com/web/fundamentals/) dengannya.

Namun ada sesuatu yang salah serius: ** Kinerja **.

Waktu pembangunan untuk blog pribadi saya (sekitar 400 halaman) membutuhkan waktu sekitar 45 detik. Dasar-dasar Web bahkan lebih buruk, sering mengambil banyak menit untuk membangun hanya satu paket bahasa dan kami mendukung 13 bahasa. Masalah kinerja ini sangat mempengaruhi tim kami dan tim penulis kami karena perubahan tunggal dalam lingkungan pementasan lokal membutuhkan waktu hingga 40 detik untuk dapat dilihat di browser.


* Mungkin * kita bisa memperbaikinya, tapi saya yakin karena tidak bisa mengetahui cara melakukannya. Saya tidak dapat mendereksinya dan kami terus-menerus memukul masalah dengan Ruby (kami bukan Ruby devs) secara khusus di sekitar versi permata dan pembaruan waktu proses.

Kami memiliki banyak hutang teknis dengan situs dan itu membawa saya dan tim banyak waktu hanya untuk menjaga hal-hal yang berjalan untuk situs statis. Saya punya firasat bahwa ini adalah mesin templating dan Ruby. Tapi ini hanya dugaanku saja.

Saya mencari-cari generator situs statis yang cepat dan beberapa orang di tim yang lebih luas telah mengisyaratkan bahwa [Hugo](http://gohugo.io/) (ditulis dalam Go) bagus, terstruktur dengan baik dan juga cepat.

Saya tidak akan 'masuk ke Hugo banyak. Ini adalah generator situs statis yang dapat menyerap file Markdown (seperti Jekyll) dan memuntahkan situs terstruktur berdasarkan pada template yang Anda tetapkan.

Saya akan membahas beberapa poin cepat:


* Jekyll build saya digunakan untuk mengambil 45 detik +, seluruh situs build Hugo adalah 300-450ms. 2 kali lipat lebih cepat.
* Templating melalui Go Templating language sedikit membiasakan tetapi * lebih bersih * daripada Liquid.
* Paginasi sangat mudah diintegrasikan meskipun saya memiliki masalah dengan dokumen.
* Dokumennya cukup kuat, ada beberapa contoh di mana contoh pada halaman yang Anda harapkan terkait tidak selalu terkadang menyebabkan kebingungan.
* Panduan migrasi Jekyll, untuk membangun Jekyll sederhana membuat saya mendapatkan sebagian besar jalan.
* Hugo tidak mendukung file penamaan sintaks Jekyll memiliki (YYYY-MM-DD-title) untuk memesan posting dan saya harus menulis skrip migrasi untuk menambahkan atribut `date` ke setiap halaman markdown dan juga` slug` atribut.
* Saya memiliki banyak file HTML yang sepertinya tidak termasuk dalam array .Site.Pages. Sekali lagi saya harus mengkonversikan semuanya dengan skrip baris perintah sederhana.

Namun, Kinerja menyala-nyala dan blog saya jauh lebih cepat dan tidak memiliki dependensi Ruby.

Saya tidak bisa mengatakan bahwa kami akan memindahkan Dasar-Dasar Web ke Hugo, ini adalah pekerjaan besar. Saya sangat senang dengan pembuatan dan pemasangan lokal yang saya miliki sekarang untuk saat ini.

Kredit Gambar Judul: https://commons.wikimedia.org/wiki/File:Hellogoodbye_logo.svg