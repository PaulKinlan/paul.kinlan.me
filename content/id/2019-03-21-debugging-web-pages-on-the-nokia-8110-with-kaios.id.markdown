---
slug: debugging-web-pages-on-the-nokia-8110-with-kaios
date: 2019-03-21T21:41:53.555Z
title: 'Debugging Web Pages on the Nokia 8110 with KaiOS'
link: ''
tags: [links, kaios, debugging, firefox]
---
Kami telah melakukan banyak pengembangan pada ponsel fitur baru-baru ini dan itu sulit, tetapi menyenangkan. Bagian tersulitnya adalah bahwa pada KaiOS kami merasa tidak mungkin untuk men-debug halaman web, terutama pada perangkat keras yang kami miliki (Nokia 8110). Nokia adalah perangkat yang hebat, dibangun dengan KaiOS yang kami tahu didasarkan pada sesuatu yang mirip dengan Firefox 48, tetapi terkunci, tidak ada mode pengembang tradisional seperti yang Anda dapatkan di perangkat Android lainnya, yang berarti Anda tidak dapat menghubungkan Firefox WebIDE dengan mudah.

Melalui kombinasi membaca beberapa blog, dan mengetahui sedikit tentang `adb` saya berhasil melakukannya. Catatan, yang lain mungkin bisa melakukannya, tetapi tidak didokumentasikan di satu tempat dengan bersih.

<figure>
  <img src="/images/2019-03-21-debugging-web-pages-on-the-nokia-8110-with-kaios.jpeg">
</figure>

(Gambar di atas menunjukkan DevTools dan juga output dari alat tangkapan layar)

Berikut langkah-langkahnya:

1. Hubungkan kabel USB. Pastikan Anda telah menginstal `adb` di mesin utama Anda.
2. Unduh salinan [Firefox 48](https://archive.mozilla.org/pub/firefox/releases/48.0.2/) (ini adalah satu-satunya yang saya dapat mulai bekerja)
3. Aktifkan &#39;Mode Pengembang&#39; dengan memasukkan `*#*#33284#*#*` dari ponsel Anda (perhatikan, jangan gunakan dialer) Anda akan melihat ikon &#39;bug&#39; kecil di bagian atas layar. [[Source](https://groups.google.com/forum/#!topic/bananahackers/MIpcrSXTRBk) ]
4. Pasang kabel USB Anda
5. Pada mesin pengembangan Anda jalankan perintah berikut
1. `adb start-server`
2. `adb devices` untuk memeriksa telepon Anda terhubung.
3. `adb forward tcp:6000 localfilesystem:/data/local/debugger-socket` ini mengatur saluran dari mesin Anda ke soket di telepon. Inilah yang digunakan IDE Web.
6. Mulai `Web IDE` dengan membuka Firefox, pergi ke Tools dan kemudian Web IDE
7. Web IDE akan terbuka, klik &#39;Remote Runtime&#39; dan klik tombol buka yang memiliki &#39;localhost: 6000&#39;. (Ini adalah port forwarding tcp).
8. Buka halaman di telepon, dan Anda akan melihatnya di sebelah kiri. Voila.
