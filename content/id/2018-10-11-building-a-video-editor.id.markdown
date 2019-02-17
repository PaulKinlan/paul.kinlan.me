---
slug: building-a-video-editor-on-the-web-with-the-web
date: 2018-10-11T11:00:00Z
title: 'Building a video editor on the web. Part 0.'
video_url: /videos/video-editor-part-0.webm
tags: ['video editor', 'wasm', 'webrtc', 'getusermedia', 'pwa']
---


Anda harus dapat membuat dan mengedit video hanya dengan menggunakan web di browser. Seharusnya mungkin untuk menyediakan antarmuka pengguna yang mirip dengan Screenflow yang memungkinkan Anda membuat video output yang menggabungkan beberapa video, gambar, dan audio ke dalam satu video yang dapat diunggah ke layanan seperti YouTube.

Posting ini benar-benar hanya pernyataan niat. Saya akan memulai proses panjang untuk mencari tahu apa yang ada dan tidak tersedia di peron dan melihat sejauh mana kita bisa mendapatkan hari ini.

Selama beberapa pemikiran tentang proyek ini, saya memiliki momen Carl Sagan - jadi daripada menciptakan alam semesta untuk membuat pai apel, saya harus setidaknya membuat semua alat yang dibutuhkan untuk membuat editor video, terutama jika saya ingin merekam proses melakukannya. Fakta bahwa posting ini ada adalah karena saya tahu saya memiliki beberapa bagian di tempat dan siap untuk pergi.

Saya tidak berpikir saya akan membuat satu 'editor video' yang sangat monolitik, yang dapat menjadi bisnis untuk orang lain, tetapi saya berencana untuk mencoba menyelesaikan semua bagian yang diperlukan sehingga saya dapat mempermudahnya membuat video hebat di web dan semoga dapat menunjukkan banyak orang apa yang mungkin dilakukan di web.

Di bawah ini adalah rencana proyek satu halaman kasar saya:


** Gunakan kasus yang saya miliki: **


* Saya biasanya harus merekam semua demo perangkat untuk Google I / O dan Chrome DevSummit serta menambahkan overlay dll. Semua orang di tim harus dapat melakukan hal ini.
* Tim sering merekam screencasts dan saya ingin memungkinkan mereka untuk melakukannya dengan cepat dari situs web sederhana dan dapat membersihkan hasil akhir.
* Saya perlu membuat beberapa produk agar tetap tajam. ;)


**Memasukkan:**


* [p0] Rekam audio dari mikrofon
* [p0] Rekam video dari kamera web [selesai - lihat di bawah]
* [p0] Sematkan video eksternal yang dihosting di web
* [p0] Rekam desktop
* [p1] Rekam aliran jarak jauh
* [p1] Rekam & lt; canvas & gt; elemen
* [p0] Muat file dari perangkat lokal
* [p1] Bagikan file dari perangkat lokal (maksud berbagi android)


**Manipulasi:**


* [p1] Tambahkan tanda air
* [p1] Tambahkan efek filter ke gambar
* [p0] Tambahkan gambar kustom sebagai layer
* [p0] Antrean video dan overlay
* [p0] Hamparkan trek audio dan video yang terpisah
* [p1] Teks overlay pada waktu tertentu
* [p0] Pangkas video ke ukuran
* [p0] Aktifkan pemosisian dan pengubahan ukuran video
* [p0] Pangkas video / audio
* [p0] Sambatan video / audio


**Keluaran:**


* [p0] File video dalam format webm
* [p1] informasi MTB
* [p1] File video dalam format xyz

[Kode untuk video ini](https://glitch.com/edit/\#!/camera-recorder?path=script.js:1:0) [Demo](https://camera-recorder.glitch.me/)


```javascript  
const init = () => {  
  let blobs;  
  let rec;  
  let stream;  
    
  captureBtn.onclick = async () => {  
    stream = await navigator.mediaDevices.getUserMedia({video: { width: 1280, 
height: 720 }, audio: true});

    videoElement.srcObject = stream;  
    let opts = {mimeType: 'video/webm; codecs=vp9,opus'};  
    blobs = [];  
    download.style.display = 'none'

    rec = new MediaRecorder(stream, opts);  
    rec.ondataavailable = (e) => blobs.push(e.data);  
    rec.onstop = async () => {  
      let blob = new Blob(blobs, {type: 'video/webm'});  
      let url = window.URL.createObjectURL(blob);  
      download.href = url;  
      download.download = 'test.webm';  
      download.style.display = 'block';  
    };  
    startBtn.disabled = false;  
    captureBtn.disabled = true;  
  };

  startBtn.onclick = () => {  
    startBtn.disabled = true;  
    stopBtn.disabled = false;  
    rec.start();  
  };

  stopBtn.onclick = () => {  
    captureBtn.disabled = false;  
    startBtn.disabled = true;  
    stopBtn.disabled = true;

    rec.stop();  
    stream.getTracks().forEach(s=>s.stop())  
    videoElement.srcObject = null  
    stream = null;  
  };  
};

window.addEventListener('load', init);  
```

