---
slug: barcode-detection
date: 2016-12-05
title: "Barcode detection using Shape Detection API"
tags: ['api', 'javascript', 'shape-detection', 'qrcode']
---


Minggu yang lain saya berbicara tentang [Deteksi Wajah melalui API Bentuk](/ deteksi wajah /) yang ada di saluran Canary di Chrome. Sekarang deteksi barcode ada di Chrome Canary juga ([Miguel](https://twitter.com/yellowdoge) adalah pahlawan saya;)

Barcode sangat besar! mereka berada di hampir setiap produk yang kami beli. Bahkan yang banyak difitnah [QRCode sangat besar di luar AS dan Eropa](https://www.clickz.com/why-have-qr-codes-taken-off-in-china/23662/). Barcode dan QRcode menyediakan cara sederhana bagi Anda untuk menjembatani dunia fisik dan dunia digital dengan mentransfer sejumlah kecil data antara media dan Anda. Ini mungkin tidak terlalu banyak digunakan di era desktop, di era ponsel sangat penting. Anda tidak perlu menginstal aplikasi hanya untuk mendapatkan akses ke data ini.

The Shape Detection API menarik karena menciptakan antarmuka standar di atas beberapa fitur perangkat keras di bawah perangkat pengguna dan membuka set kemampuan baru ke platform web, terutama Deteksi Wajah dan deteksi kode batang.

API deteksi barcode dibangun berdasarkan [Shape Detection API](https://wicg.github.io/shape-detection-api/#introduction) yang saat ini ada di [WICG](https://github.com/ wicg /) yang berarti dalam fase inkubasi dan percobaan. Di [Android, Anda dapat mendeteksi sejumlah 1D dan 2D] yang berbeda (https://developers.google.com/vision/barcodes-overview) barcode:

> 1D barcodes: EAN-13, EAN-8, UPC-A, UPC-E, Code-39, Code-93, Code-128, ITF,
> Codabar
>
> 2D barcodes: QR Code, Data Matrix, PDF-417, AZTEC


Selanjutnya:

> It automatically parses QR Codes, Data Matrix, PDF-417, and Aztec values, for
> the following supported formats:
>
> * URL
> * Contact information (VCARD, etc.)
> * Calendar event
> * Email
> * Phone
> * SMS
> * ISBN
> * WiFi
> * Geo-location (latitude and longitude)
> * AAMVA driver license/ID


The Shape Detection API saat ini ada di Chrome Canary (M57) dan Anda harus mengaktifkannya melalui `chrome: // flags / # enable-experimental-web-platform-features`

Seperti dengan deteksi wajah, API relatif mudah digunakan. Anda menjalankan API melalui `detect` pada API` BarcodeDetector` dan Anda mendapatkan kembali sebuah janji yang akan kembali ke daftar barcode yang didekodekan.


```javascript
var barcodeDetector = new BarcodeDetector();
barcodeDetector.detect(image)
  .then(barcodes => {
    barcodes.forEach(barcode => console.log(barcodes.rawValue))
  })
  .catch((e) => {
    console.error("Boo, BarcodeDetection failed: " + e);
  });
```


Dibutuhkan objek gambar (baik CanvasImageSource, Blob, ImageData atau ` <img> `elemen) dan kemudian meneruskannya ke API sistem yang mendasari dan akan mengembalikan array objek` DetectedBarcode` yang menerapkan `DetectedObject` yang pada dasarnya memberi Anda batas-batas setiap wajah dalam gambar.

Saya juga [terintegrasi](https://github.com/PaulKinlan/qrcode/commit/21afa9ae4c316e4a8ced76d77f41eda2eb92852b) ke [QRCode Scanner Application] saya (https://qrsnapper.appspot.com) tetapi saya sedang menunggu perbaiki lahan yang memungkinkan saya lulus dalam [Canvas](https://bugs.chromium.org/p/chromium/issues/detail?id=670977) atau [ImageData](https://bugs.chromium.org/ p / chromium / masalah / detail? id = 670975) objek ke dalam API.

Yang menarik adalah karena saya sudah membangun aplikasi ini di JS polos menggunakan [LazarSoft jsqrcode API](https://github.com/LazarSoft/jsqrcode) Saya dapat mendeteksi ketersediaan pemindaian Barcode asli dan jika tidak ada maka saya gagal kembali ke implementasi JS murni.

Berikut beberapa video dalam aksi:

{{<youtube LGB0n-dW_HM>}}

{{<youtube Anq_N_SY17o>}}

Saya tidak menyebutkannya di artikel sebelumnya, tetapi ini juga harus bekerja pada pekerja thread (dan akibatnya di dalam Service Worker). Untuk kasus penggunaan saya ini brilian karena memungkinkan saya untuk mendelegasikan logika saya ke untaian lain dan menjauhkan semuanya dari utas UI.

Saya pikir ini adalah tambahan yang sangat menarik ke platform web dan saya senang melihat ini digunakan.