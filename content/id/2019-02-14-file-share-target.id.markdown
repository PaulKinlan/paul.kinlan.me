---
slug: file-web-share-target
date: 2019-02-15T15:52:03.183Z
title: 'File Web Share Target'
tags: [share, intents]
---

Saya sering mengatakan bahwa agar aplikasi web bersaing secara efektif di dunia aplikasi, mereka perlu diintegrasikan ke semua tempat yang diinginkan pengguna. Komunikasi antar-aplikasi adalah salah satu bagian utama yang hilang dari platform web, dan khususnya salah satu fitur utama yang hilang terakhir adalah berbagi tingkat asli: Aplikasi web harus bisa mendapatkan [data out of their silo](/unintended-silos/) dan masuk ke situs web dan aplikasi lain; mereka juga harus dapat menerima data dari aplikasi dan situs asli lainnya.

API Target Berbagi File adalah pengubah game dari API yang sekarang ada di Chrome Canary. API memperluas [Web Share Target API](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md) yang memungkinkan aplikasi dan situs berbagi tautan dan teks sederhana ke situs web dengan mengintegrasikannya ke dalam fungsi berbagi sistem.

Blog file yang sangat statis ini menggunakan Web Share Target API sehingga saya dapat dengan cepat [share links](/web-share-target-api/) yang menurut saya menarik untuk itu dari aplikasi Android mana pun, dan pada minggu lalu [I enabled the File Share Target API so that I can upload images to my blog directly from the Camera app on Android](/testing-file-share-target-from-camera/) . Posting ini adalah semua tentang bagaimana saya melakukannya (dan mencuri beberapa kode dari Jake Archibald - tbf dia menemukan banyak bug untuk integrasi yang mereka lakukan di [squoosh.app](https://squoosh.app/) .)

[File Share Target API](https://wicg.github.io/web-share-target/level-2/#example-3-manifest-webmanifest) adalah API yang sangat baru karena sepenuhnya progresif. Jika aplikasi Anda dapat menangani permintaan Formulir `POST` maka Anda dapat dengan mudah diintegrasikan dengan API ini. Alur dasarnya adalah: ketika pengguna memilih aplikasi Anda dari pemilih asli, Chrome akan mengirimkan permintaan Formulir `POST` ke server Anda, terserah Anda apa yang Anda lakukan dengannya (menangani pekerja layanan atau pada server).

Untuk menambahkan dukungan untuk berbagi file ke aplikasi web Anda, Anda perlu melakukan dua hal:

1. Menyatakan dukungan untuk berbagi file melalui file manifes, 2. Menangani permintaan Formulir `POST` di Pekerja Layanan Anda.

Manifes menyatakan ke sistem host bagaimana Berbagi harus dipetakan dari aplikasi host ke aplikasi web. Dalam manifes di bawah ini pada dasarnya mengatakan &quot;Ketika pengguna berbagi file tipe &#39;gambar / *&#39; membuat permintaan POST Formulir untuk &#39;/ berbagi / gambar /&#39; dan beri nama data &#39;file&#39;&quot;.

* manifest.json *
```JSON
{
  "name": "Blog: Share Image",
  "short_name": "Blog: Share Image",
  "start_url": "/share/image/",
  "theme_color": "#000000",
  "background_color": "#000000",
  "icons": [ {
      "sizes": "192x192",
      "src": "/images/me.png",
      "type": "image/png"
  }],
  "share_target": {
    "action": "/share/image/",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "files": [
        {
          "name": "file",
          "accept": ["image/*"]
        }
      ]
    }
  },
  "display": "standalone",
  "scope": "/share/"
}
```

Setelah pengguna berbagi ke aplikasi web Anda, Chrome akan membuat permintaan web ke situs Anda dengan data file sebagai payload.

Disarankan agar Anda menangani permintaan POST di dalam pekerja layanan Anda sehingga 1) cepat, 2) tangguh terhadap jaringan yang tidak tersedia. Anda dapat melakukan ini sebagai berikut:

* serviceworker.js * - [demo](/share/image/sw.js)

```Javascript
onfetch = async (event) => {
  if (event.request.method !== 'POST') return;
  if (event.request.url.startsWith('https://paul.kinlan.me/share/image/') === false) return;

  /* This is to fix the issue Jake found */
  event.respondWith(Response.redirect('/share/image/'));
  
  event.waitUntil(async function () {
    const data = await event.request.formData();
    const client = await self.clients.get(event.resultingClientId || event.clientId);
    // Get the data from the named element 'file'
    const file = data.get('file');

    console.log('file', file);
    client.postMessage({ file, action: 'load-image' });
  }());
};
```

Ada beberapa hal menarik yang terjadi di atas, yang dapat dengan cepat diringkas sebagai:

* `POST` UI sebagai hasil dari permintaan `POST` dengan melakukan pengalihan.
* Baca data yang dikirimkan melalui formulir via `event.request.formData()`
* Kirim data ke jendela yang terbuka (ini akan menjadi UI yang kami arahkan pengguna pada titik pertama).

Ini sepenuhnya terserah Anda apa yang Anda lakukan dengan data yang telah diposting ke pekerja layanan Anda, tetapi dalam kasus Aplikasi saya, saya perlu menunjukkannya langsung di UI jadi saya harus menemukan jendela yang digunakan pengguna dan `postMessage` datanya ada.

* index.html * - [demo](/share/image/index.html)

```Javascript
navigator.serviceWorker.onmessage = (event) => {
  console.log(event);
  imageBlob = event.data.file;
  // Update the UI with the data that has been shared to it.
  imageShare.src = URL.createObjectURL(imageBlob);
};
```

Dan itu saja. Jika Anda sudah memiliki titik akhir API untuk formulir web Anda, maka ini adalah tambahan sederhana namun kuat yang dapat Anda buat untuk situs Anda.

Web Share Target API platform primitif yang luar biasa kuat yang memecah penghalang lain yang dimiliki aplikasi web pada platform host mereka.