---
slug: got-web-performance-problemsjust-wait
date: 2019-03-09T08:10:52.804Z
title: 'Got web performance problems? Just wait...'
link: 'https://twitter.com/kosamari/status/1104021989881270272'
tags: [links, performance, developing markets]
---
Saya melihat tweet dari teman dan kolega yang baik, [Mariko](https://twitter.com/kosamari) , tentang pengujian pada serangkaian perangkat kelas bawah yang membuat Anda tetap [Mariko](https://twitter.com/kosamari) tanah.

Konteks dari tweet ini adalah kita melihat seperti apa Pengembangan Web ketika membangun untuk pengguna yang hidup setiap hari di kelas perangkat ini.

<figure>
  <img src="/images/2019-03-09-got-web-performance-problemsjust-wait.jpeg">
</figure>

Tim sedang melakukan banyak pekerjaan sekarang di ruang ini, tetapi saya menghabiskan satu hari membangun situs dan itu sangat sulit untuk membuat sesuatu bekerja pada tingkat kinerja yang bahkan sedikit masuk akal - berikut adalah beberapa masalah yang saya hadapi:

* Keanehan tampilan, dan pengenalan misterius 300ms klik-tunda (dapat bekerja di sekitar).
* Repaints besar seluruh layar, dan lambat.
* Jaringan lambat
* Memori terbatas, dan GC berikutnya mengunci utas selama beberapa detik
* Sangat lambat eksekusi JS
* Manipulasi DOM lambat

Untuk banyak halaman yang sedang saya bangun, bahkan pada koneksi wifi yang cepat, halaman butuh beberapa detik untuk memuat, dan interaksi selanjutnya sangat lambat. Itu sulit, itu melibatkan mencoba untuk mendapatkan sebanyak mungkin dari utas utama, tetapi juga sangat memuaskan pada tingkat teknis untuk melihat perubahan dalam algoritma dan logika yang saya tidak akan lakukan untuk semua pengembangan web tradisional saya, hasil peningkatan besar dalam kinerja.

Saya tidak yakin apa yang harus dilakukan dalam jangka panjang, saya curiga sejumlah besar pengembang yang bekerja sama dengan kami di pasar yang lebih maju akan memiliki reaksi &#39;Saya tidak membangun situs untuk pengguna di [masukkan negara x]&#39;, dan pada tingkat tinggi sulit untuk memperdebatkan pernyataan ini, tetapi saya tidak dapat mengabaikan fakta bahwa 10 dari jutaan pengguna baru datang ke komputasi setiap tahun dan mereka akan menggunakan perangkat ini dan kami ingin web menjadi * platform * pilihan untuk konten dan aplikasi agar kita tidak senang dengan [rise of the meta platform](https://paul.kinlan.me/rise-of-the-meta-platforms/) .

Kita harus terus mendorong kinerja untuk waktu yang lama. Kami akan terus membuat alat dan panduan untuk membantu pengembang memuat dengan cepat dan memiliki antarmuka pengguna yang lancar :)
