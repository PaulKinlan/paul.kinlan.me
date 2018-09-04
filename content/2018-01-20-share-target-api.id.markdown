---
slug: breaking-down-silos-with-share-target-api
date: 2018-01-20T13:20:31+01:00
title: "Breaking down silos by sharing more on the web"
tags: ["intents", "silo", "share"]
image_header: /images/share_mobile_handler.png
---
Artikel ini lebih dari satu tahun terlambat. Itu terjebak dalam draf saya untuk waktu yang lama, namun saya pikir idenya adalah sesuatu yang perlu kita selesaikan pada 2018. Juga ternyata masalah lain muncul pada tahun lalu yang membuatnya sedikit lebih relevan.

Saya berada di Indonesia pada awal 2016 dengan iseng mengobrol dengan pengembang dan muncul dalam percakapan bahwa web kacau (mereka adalah kata-kata harfiah). Inti permasalahannya adalah pengguna hari ini, dan khususnya pengguna yang baru datang online untuk pertama kalinya, menciptakan konten di dalam silo. Dalam beberapa kasus, silo ini [terlihat dan terasa seperti web](/ rise-of-the-meta-platform /) tetapi konten hanya pernah tersedia di platform tersebut tetapi diabadikan oleh fakta bahwa setiap aplikasi asli memiliki kemampuan untuk berpartisipasi aktif dalam setiap interaksi yang dimiliki pengguna di perangkat komputasi mereka, tetapi web tidak, dan itu adalah pembunuh. Tidak mungkin untuk mendapatkan konten ke dalam pengalaman web, tetapi lebih mudah untuk mendapatkan konten.

Lebih konkret, ada sejumlah skenario yang kita diskusikan.

1. Anda mengambil gambar di aplikasi kamera Anda dan Anda ingin membagikan gambar. Anda menekan berbagi tetapi hanya aplikasi asli yang muncul dalam daftar. Web bukan bagian dari pilihan bagi pengguna, sehingga web tidak pernah dapat menangkap nilai itu. 2. Anda ingin berbagi halaman saat ini di browser. Anda menekan berbagi tetapi hanya aplikasi asli yang muncul dalam daftar. Tindakan berbagi informasi berarti kita kehilangan pengguna dari web ke pengalaman asli 3. Anda membuat beberapa konten langsung di dalam halaman web dan Anda ingin membagikannya, satu-satunya pilihan Anda adalah menyertakan widget yang dibagikan.

Pada awal tahun 2017, kami melihat peluncuran [navigator.share](/ navigator.share /) yang membawa berbagi asli ke web (baik, pengguna Chrome setidaknya). Ironisnya adalah bahwa API `navigator.share` melanggengkan aliran pengguna menggunakan aplikasi asli.

Pada 2018, saya ingin web menjadi lebih efektif dalam menghancurkan silo yang diabadikan pada platform asli. Web harus dapat berpartisipasi dalam setiap interaksi utama yang dimiliki pengguna dengan perangkat mereka.

Akhir tahun 2017, "Peningkatan tambahkan ke layar awal" diluncurkan di Chrome pada Android. Ini berarti bahwa setiap kali pengguna menginstal `Progressive Web App` Anda, APK yang sebenarnya dihasilkan untuk pengguna. Sebuah APK di Android berarti bahwa untuk semua maksud dan tujuan aplikasi web Anda dianggap sebagai aplikasi asli. Pada iterasi pertama dari "Improved add to home-screen" semua itu berarti bahwa setiap navigasi ke url di dalam lingkup PWA Anda akan terbuka langsung di PWA.

Masa depan sedikit lebih cerah. Chrome bekerja pada [Share target API](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md) yang memungkinkan Anda untuk menyatakan bahwa situs Anda akan berpartisipasi dalam penerimaan dari "saham". Itu berarti setiap kali pengguna berbagi tautan, PWA Anda akan dapat dicantumkan.

Saya cukup senang dengan perkembangan ini karena itu berarti situs besar seperti [Twitter Lite](https://lite.twitter.com) sekarang akan dapat dibagikan tanpa perlu pengguna untuk menggunakan aplikasi Native, tetapi itu juga berarti bahwa situs ceruk kecil yang hanya dapat digunakan oleh segelintir pengguna juga dapat menjadi bagian dari ekosistem yang sama.

API tidak dapat menangani gambar dan data biner dulu, tetapi melihat ekosistem Android niat ACTION_SEND adalah niat yang paling banyak digunakan dan itu terutama hanya untuk berbagi teks dan tautan.

Ini sebuah awal. Jaringan web menghancurkan satu silo sekaligus.
