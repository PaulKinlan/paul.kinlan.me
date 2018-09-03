---
slug: hyperlinking-beyond-the-web---css-tricks
date: 2018-07-15T17:28:21.103Z
title: Hyperlinking Beyond the Web - CSS-Tricks
link: https://css-tricks.com/hyperlinking-beyond-the-web/
tags: ['link', 'intents']
---
Atishay Jain tentang Trik CSS menulis tentang sebuah area yang dekat dengan hati saya, menghubungkan:

> Hyperlinks are the oldest and the most popular feature of the web. The word hypertext (which is the ht in http/s) means text having hyperlinks. The ability to link to other people&#x2019;s hypertext made the web, a web &#x2014; a set of connected pages. This fundamental feature has made the web a very powerful platform and it is obvious that the world of apps needs this feature. All modern platforms support a way for apps to register a URI (custom protocol) and also have universal links (handling web links in an app).
> 
> Let&#x2019;s see why we&#x2019;d want to take advantage of this feature and how to do it.


[Baca posting lengkap](https://css-tricks.com/hyperlinking-beyond-the-web/).

Ini adalah artikel bagus yang mencakup semua jenis hyperlink yang tersedia untuk aplikasi dan situs. Saya telah melakukan banyak penelitian ke dalam ruang ini sejak Web Intents dan status link lanjutan di web meninggalkan banyak hal yang diinginkan, imo.

Salah satu alasan mengapa saya suka web, adalah bahwa di balik tautan adalah akses langsung ke sumber daya, saya tidak tahu platform lain yang dapat menggabungkan tautan dan sumber daya yang sebenarnya dengan cara yang sama, tetapi bisa jadi sangat banyak lebih. Link standar pada dasarnya menyediakan sebuah intent VIEW yang berisi keadaan (url) dan konteks (teks antara jangkar), dan Anda dapat meretasnya dengan protokol khusus, tetapi kita perlu melangkah lebih jauh.

* Kita perlu memperluas kosakata ke `registerProtocolHandler` ke semua akses lebih banyak ke skema yang lebih asli * Apa pun yang terdaftar dengan protokol handler harus memiliki sistem yang luas. * Kita harus dapat memiliki situs web untuk dapat menangani membuka berbagai jenis konten dan memiliki halaman yang tersedia untuk didaftarkan sebagai penangan file sistem. * Kami harus memiliki tindakan pesanan yang lebih tinggi yang tersedia bagi pengembang, LIHAT sangat bagus, kami memerlukan serangkaian tindakan inti yang disepakati seperti PILIH, SIMPAN, EDIT sehingga kami dapat lebih memahami kemampuan situs atau aplikasi, dan kemampuan untuk memperluas mereka dengan semantik orde tinggi. Android memiliki ini, Siri mendapatkan itu, baik menggunakan 'Intents', Web harus memilikinya juga.

Ini adalah salah satu alasan mengapa saya sangat tertarik tentang abstraksi pesan seperti [Comlink](https://github.com/GoogleChromeLabs/comlink) yang menghapus beban kegilaan postMessage dan membiarkan Anda berpikir tentang mengekspos fungsi ke lainnya aplikasi, dan setelah Anda mengekspos fungsi, Anda harus lebih mudah mengaktifkan penemuan fungsi itu ... dan itulah yang mengaktifkan tautan.
