---
slug: pinch-zoom-element
date: 2019-01-13T17:21:19.288Z
title: 'pinch-zoom-element'
link: https://www.webcomponents.org/element/pinch-zoom-element
tags: [links, web components, custom element]
---
Jake dan tim membangun elemen kustom yang agak luar biasa ini untuk mengelola pinch zooming pada set HTML apa pun di luar dinamika pinch-zoom browser sendiri (pikirkan zoom mobile viewport). Elemen itu adalah salah satu komponen utama yang kami butuhkan untuk aplikasi [squoosh](https://squoosh.app/) yang kami buat dan rilis di Chrome Dev Summit (... Saya katakan &#39;dirilis di Chrome Dev Summit&#39; - Jake menunjukkannya kepada semua orang di China Google Developer Day. meskipun anggota tim lainnya berada di bawah embargo;) ...)

> install: `npm install --save-dev pinch-zoom-element`
> 
> ```HTML
> <pinch-zoom>
>   <h1>Hello!</h1>
> </pinch-zoom>
> ```

[Read full post](https://www.webcomponents.org/element/pinch-zoom-element) .

Saya baru saja menambahkannya ke blog saya (hanya butuh beberapa menit), Anda dapat memeriksanya di bagian &#39; [life](https://paul.kinlan.me/life/img_20170711_063830/) &#39; tempat saya berbagi foto yang telah saya ambil. Jika Anda menggunakan perangkat yang mendukung sentuhan, Anda dapat dengan cepat mencubit-zoom pada elemen, jika Anda menggunakan track-pad yang dapat menangani beberapa input jari yang berfungsi juga.

Elemen ini adalah contoh yang bagus mengapa saya suka komponen web sebagai model untuk membuat komponen antarmuka pengguna. Elemen `pinch-zoom` tepat di bawah 3kb pada kabel (tidak terkompresi) dan dependensi minimal untuk membangun dan itu hanya melakukan satu pekerjaan dengan sangat baik, tanpa mengikat setiap logika tingkat aplikasi kustom yang akan membuatnya sulit untuk digunakan (saya punya beberapa pemikiran tentang logika UI vs komponen logika aplikasi yang akan saya bagikan berdasarkan pembelajaran saya dari aplikasi Squoosh).

Saya akan senang melihat elemen seperti ini mendapatkan lebih banyak kesadaran dan penggunaan, misalnya saya bisa membayangkan bahwa elemen ini dapat menggantikan atau membakukan fungsi zoom gambar yang Anda lihat di banyak situs perdagangan dan selamanya menghilangkan rasa sakit dari pengembang.
