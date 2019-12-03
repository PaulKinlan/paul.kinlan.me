---
slug: extracting-text-from-an-imageexperiments-with-shape-detection
date: 2019-05-13T12:39:45.039Z
title: 'Extracting text from an image: Experiments with Shape Detection'
link: 'https://copy-image-text.glitch.me/'
tags: [links, shape detection, pwa, intent, lumpy]
---
Saya memiliki sedikit waktu luang setelah Google IO dan saya ingin menggaruk gatal jangka panjang yang saya alami. Saya hanya ingin dapat menyalin teks yang disimpan di dalam gambar di browser. Itu semuanya. Saya pikir itu akan menjadi fitur yang rapi untuk semua orang.

Tidak mudah untuk menambahkan fungsionalitas secara langsung ke Chrome, tetapi saya tahu saya dapat memanfaatkan sistem niat di Android dan sekarang saya dapat melakukannya dengan Web (atau setidaknya Chrome di Android).

Dua tambahan baru pada platform web - Target Target Level 2 (atau seperti saya suka menyebutnya File Share) dan `TextDetector` di Shape Detection API - [have allowed me to build a utility that I can Share images to and get the text held inside them](https://copy-image-text.glitch.me/) .

Implementasi dasar relatif lurus ke depan, Anda membuat Target Saham dan penangan di Pekerja Layanan, dan kemudian setelah Anda memiliki gambar bahwa pengguna telah berbagi Anda menjalankan `TextDetector` di atasnya.

`Share Target API` memungkinkan aplikasi web Anda menjadi bagian dari sub-sistem berbagi asli, dan dalam hal ini Anda sekarang dapat mendaftar untuk menangani semua jenis `image/*` dengan mendeklarasikannya di dalam `Web App Manifest` Anda sebagai berikut.

```javascript
"share_target": {
  "action": "/index.html",
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
}
```

Ketika PWA Anda diinstal maka Anda akan melihatnya di semua tempat Anda berbagi gambar sebagai berikut:

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-0.jpeg"></figure>

API `Share Target` memperlakukan file berbagi seperti pos formulir. Ketika file dibagikan ke Aplikasi Web pekerja layanan diaktifkan penangan `fetch` dipanggil dengan data file. Data sekarang di dalam Pekerja Layanan tetapi saya membutuhkannya di jendela saat ini sehingga saya bisa memprosesnya, layanan tahu jendela mana yang memohon, sehingga Anda dapat dengan mudah menargetkan klien dan mengirimkannya data.

```javascript
self.addEventListener('fetch', event => {
  if (event.request.method === 'POST') {
    event.respondWith(Response.redirect('/index.html'));
    event.waitUntil(async function () {
      const data = await event.request.formData();
      const client = await self.clients.get(event.resultingClientId || event.clientId);
      const file = data.get('file');
      client.postMessage({ file, action: 'load-image' });
    }());
    
    return;
  }
  ...
  ...
}

```

Setelah gambar berada di antarmuka pengguna, saya kemudian memprosesnya dengan API deteksi teks.

```javascript
navigator.serviceWorker.onmessage = (event) => {  
  const file = event.data.file;
  const imgEl = document.getElementById('img');
  const outputEl = document.getElementById('output');
  const objUrl = URL.createObjectURL(file);
  imgEl.src = objUrl;
  imgEl.onload = () => {
    const texts = await textDetector.detect(imgEl);
    texts.forEach(text => {
      const textEl = document.createElement('p');
      textEl.textContent = text.rawValue;
      outputEl.appendChild(textEl);
    });
  };
  ...
};
```

Masalah terbesar adalah bahwa browser tidak memutar gambar secara alami (seperti yang Anda lihat di bawah), dan Shape Detection API membutuhkan teks berada dalam orientasi membaca yang benar.

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-1.jpeg"></figure>

Saya menggunakan [EXIF-Js library](https://github.com/exif-js/exif-js) agak mudah digunakan untuk mendeteksi rotasi dan kemudian melakukan beberapa manipulasi kanvas dasar untuk mengarahkan ulang gambar.

```javascript
EXIF.getData(imgEl, async function() {
  // http://sylvana.net/jpegcrop/exif_orientation.html
  const orientation = EXIF.getTag(this, 'Orientation');
  const [width, height] = (orientation > 4) 
                  ? [ imgEl.naturalWidth, imgEl.naturalHeight ]
                  : [ imgEl.naturalHeight, imgEl.naturalWidth ];

  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  // We have to get the correct orientation for the image
  // See also https://stackoverflow.com/questions/20600800/js-client-side-exif-orientation-rotate-and-mirror-jpeg-images
  switch(orientation) {
    case 2: context.transform(-1, 0, 0, 1, width, 0); break;
    case 3: context.transform(-1, 0, 0, -1, width, height); break;
    case 4: context.transform(1, 0, 0, -1, 0, height); break;
    case 5: context.transform(0, 1, 1, 0, 0, 0); break;
    case 6: context.transform(0, 1, -1, 0, height, 0); break;
    case 7: context.transform(0, -1, -1, 0, height, width); break;
    case 8: context.transform(0, -1, 1, 0, 0, width); break;
  }
  context.drawImage(imgEl, 0, 0);
}
```

Dan Voila, jika Anda berbagi gambar ke aplikasi itu akan memutar gambar dan kemudian menganalisanya mengembalikan hasil teks yang telah ditemukan.

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-2.jpeg"></figure>

Sangat menyenangkan untuk membuat eksperimen kecil ini, dan ini langsung berguna bagi saya. Namun demikian, sorot [inconsistency of the web platform](/the-lumpy-web/) . API ini tidak tersedia di semua browser, mereka bahkan tidak tersedia di semua versi Chrome - ini berarti bahwa ketika saya menulis artikel ini Chrome OS, saya tidak bisa menggunakan aplikasi, tetapi pada saat yang sama, ketika saya bisa menggunakannya ... OMG, sangat keren.

