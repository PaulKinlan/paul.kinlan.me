---
slug: reinventing-web-intents
date: 2017-08-25T13:20:31+01:00
title: "Reinventing Web Intents"
description: ""
tags: ["intents"]
image_header: /images/bridges.png
---
Saya tidak pernah melupakan [kematian Web Intents](/what-happened-to-web-intents/). Saya selalu merasa bahwa masih ada masalah serius di web, kami membangun [silo](/unintended-silos/) yang mengunci pengguna ke satu situs web dan kami tidak menghubungkan aplikasi kami bersama untuk membangun pengalaman yang lebih kaya. Kami memiliki tautan yang memungkinkan kami menavigasi ke situs lain, tetapi kami tidak menghubungkan aplikasi kami dengan fungsi yang dapat kami gunakan di situs kami. Baik itu memilih gambar dari layanan cloud untuk digunakan di aplikasi Anda, atau mengedit gambar di editor pilihan pengguna; kami hanya tidak menghubungkan layanan kami dengan cara kami menautkan halaman kami.

[Web Intents](https://en.wikipedia.org/wiki/Web_Intents) adalah upaya yang gagal untuk memperbaikinya. [Share API](/navigator.share/) memecahkan satu kasus penggunaan untuk situs dan aplikasi interkoneksi, tetapi umumnya IPC dan penemuan layanan tidak pernah diselesaikan dan saya pikir saya punya solusi ... Ok, saya tidak punya solusi, saya punya sebuah eksperimen yang sangat saya sukai.

Selama beberapa bulan terakhir, Surma di tim saya dan Ian Kilpatrick sedang mengerjakan shim untuk [Tasklet API](https://github.com/GoogleChromeLabs/tasklets). API Tasklet dirancang untuk memungkinkan API multi-thread ringan tersedia di web. Kelas ES6 dapat diekspos sebagai 'tasklet' dan Anda dapat memanggilnya tanpa memblokir thread utama - bagus untuk UI. API tasklet dengan sendirinya sangat menarik, tetapi bagian yang paling menarik bagi saya adalah bahwa mereka membangun Polyfill menggunakan Web Worker dan mengembangkan cara untuk mengekspos fungsionalitas kelas ES6 yang didefinisikan dalam Worker. Mereka telah mengabstraksikan semua kompleksitas API postMessage menjadi paket yang rapi dan model yang waras bagi pengembang JS.

Salah satu alasan kami membuat Web Intents API adalah karena pengalaman pengembang untuk membuat API dan layanan yang bekerja dengan API postMessage sangat kompleks, Anda harus berurusan dengan API postMessage dan kemudian Anda harus mengelola pesan yang rumit sistem pemrosesan dan mesin negara yang terkait.

<figure><img src="/images/worker-dx.png"><figcaption> Pekerja Tradisional </figcaption></figure>

Itu hanya rumit. Ini bahkan lebih buruk jika Anda ingin memiliki dua jendela yang saling berinteraksi. Jendela yang Anda buka harus memberi tanda pada 'pembuka' bahwa sudah siap sebelum Anda dapat mulai mengirimkan pesan. TL; DR - `window.open` terbuka` about: blank` sebelum menavigasi ke URL yang Anda tetapkan.

<figure><img src="/images/window-dx.png"><figcaption> Jendela pengalaman postMessage </figcaption></figure>

Ini menjadi lebih kompleks ketika Anda ingin mengirimkan pesan antara beberapa jendela atau pekerja di jendela lain.

<figure><img src="/images/complex-workers.png"><figcaption> Bahkan lebih rumit ... </figcaption></figure>

Saya pikir ini adalah salah satu alasan utama mengapa orang mengekspos sisi klien API. Itu terlalu sulit.

Polyfill tasklets memiliki solusi yang terkubur di dalamnya dan saya dengan culas bertanya kepada Surma apakah dia dapat mem-refactor API tasklet menjadi API Proxy sederhana, beberapa jam kemudian keluar [Comlink](https://github.com/GoogleChromeLabs/comlink/). Comlink adalah API kecil yang mengabstraksi API MessageChannel dan postMessage ke dalam API yang terlihat seperti Anda membuat instance kelas dan fungsi jarak jauh dalam konteks lokal. Sebagai contoh:


**Situs web**


```javascript
const worker = new Worker('worker.js');
const api = Comlink.proxy(worker);
const work = await new api.HardWork();
const results = await work.expensive();
```



** Web Worker **


```javascript
class HardWork {
  expensive() {
    for(let i = 0; i < 1e12; i++)
      sum += /* …omg so much maths… */
    return sum;
  }
}

Comlink.expose({HardWork}, self);
```


Kami mengekspos API pada layanan, kami mengkonsumsi API di klien melalui proxy.

Saya pikir itu sangat menarik dan Comlink dengan sendirinya memiliki kemampuan untuk merevolusi penggunaan pekerja Web dengan secara drastis meningkatkan pengalaman pengembang dengan menyediakan API sederhana agar tim mereka dapat menggunakannya.

Melakukan hal yang sama di antara jendela sama mudahnya.

<figure><img src="/images/comlink.png"><figcaption> Comlink </figcaption></figure>

Tapi saya memiliki pemikiran lain ... Saya dapat menemukan kembali sebagian kecil dari Intent Web yang diduga: meningkatkan penemuan layanan dan memudahkan pengembang untuk berinteraksi dengan layanan.

### Niat Web?

Salah satu hal yang rapi tentang API Comlink adalah bahwa secara otomatis akan mencoba menggunakan objek `Dipindahkan` untuk meneruskan data antara klien dan layanan, dan ternyata` MessagePorts` dapat dipindahtangankan. Ide yang saya miliki adalah bahwa jika saya bisa membuat API sederhana yang dirancang untuk hanya mengembalikan MessagePort berdasarkan beberapa kriteria (seperti kata kerja) kemudian sebagai klien, saya tidak akan peduli darimana MessagePort itu berasal.

Berikut adalah pemikiran saya: Saya akan memiliki situs yang bertindak sebagai perantara dan akan mempertahankan daftar layanan dan di mana mereka tinggal dan akan dapat menghubungkan klien yang meminta jenis layanan, seperti itu.


* Situs layanan akan dapat mengatakan kepada orang tengah "Saya menawarkan layanan X yang berfungsi pada data Y dan tinggal di halaman Z"
* Situs klien akan dapat mengatakan kepada orang tengah "Saya memerlukan layanan yang melakukan X pada data ini Y. Apa yang Anda miliki?"

Pemetaan ini kembali ke desain kasar, saya memerlukan Layanan yang memaparkan dua metode: `register` dan` pick`.

`register`, akan, mendaftarkan layanan dengan baik dengan orang tengah. `pick` di sisi lain sedikit lebih menarik dan saya telah memecahnya menjadi beberapa langkah.

<figure><img src="/images/webintents-step-1.png"><figcaption> Menghubungkan situs </figcaption></figure>

Alirannya tidak terlalu kompleks ketika Anda menyelaminya. Saya membuat [pembungkus dasar yang Anda sertakan di setiap layanan dan aplikasi klien](https://web-intents.glitch.me/scripts/service.js). Wrapper menangani interaksi pertama dengan perantara dan melakukan beberapa tata graha dasar dengan membungkus kompleksitas membuka jendela ke pemilih layanan di 'https://web-intents.glitch.me/pick'.

Setelah pemilih terbuka, ia akan menemukan semua layanan yang sesuai dengan kriteria yang dibutuhkan pengguna, kemudian akan menyajikannya kepada pengguna sebagai daftar sederhana. Pengguna membuka situs pilihan mereka dan di belakang layar yang mengekspos situs itu API kembali ke klien asli melalui perantara. Akhirnya, ketika koneksi selesai dan kita berbicara dengan layanan yang dipilih kita dapat menghapus perantara.

<figure><img src="/images/webintents-step-2.png"><figcaption> Menghapus perantara </figcaption></figure>

Prosesnya sebenarnya sedikit lebih kompleks daripada yang saya biarkan. Di bawah kap mesin kami melewati banyak MessagePorts antara windows tetapi konsumen dari API tidak pernah melihat kompleksitas ini. Hal yang baik adalah bahwa ketika klien dan layanan terhubung dan mereka berbicara langsung melalui API yang didefinisikan dengan layanan bagus dan mereka sebenarnya tidak tahu siapa yang ada di ujung. Rapi.

Di bawah ini adalah cara cepat memasukkan kode untuk menunjukkan betapa sederhananya kode itu.


** Layanan ** ([demo](https://web-intents-service-1.glitch.me/))

Layanan ini relatif sederhana, ia memiliki kelas yang berinteraksi dengan DOM dan mencatat beberapa output.

Kami mengekspos kelas `Tes` ke` ServiceRegistry` dan kami menawarkan cara untuk mendaftarkan kemampuan layanan ini.


```javascript
class Test {
  constructor() {}

  outputToPre(msg) {
    let output = document.getElementById('output');
    output.innerText += msg + '\n';
  }
}

let registry = new ServiceRegistry({ Test })
register.onclick = async () => {    
  let resolvedService = await registry.register('test-action','*', location.href);  
};
```



** Klien ** ([demo](https://web-intents-client.glitch.me/))

Kliennya sederhana, kami membuat instance dari registry dan memanggil `pick`.

`pick` menghubungkan ke perantara, dan menunggu pengguna untuk memilih layanan. Setelah pengguna memilih layanan, perantara (`ServiceRegistry`) meneruskan API yang dinyalakan oleh layanan jarak jauh ke klien. Kami kemudian dapat instantiate instance dari remote API dan memanggil metode di atasnya.


```javascript
let registry = new ServiceRegistry();
let resolvedService = await registry.pick('test-action','image/*');
remote = await new resolvedService.Test();
remote.outputToPre('calling from window.');
```


Saya cukup senang dengan ini sebagai eksperimen. Berikut ini adalah video Discovery Layanan dan permintaan kode di atas.

<figure> {{&lt;youtube 1igal-ehMB4&gt;}} <figcaption> ujung ke ujung demo </figcaption></figure>

Biarkan aku tahu apa yang Anda pikirkan. Terlalu banyak?