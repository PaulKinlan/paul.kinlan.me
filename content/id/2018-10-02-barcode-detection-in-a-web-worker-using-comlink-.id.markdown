---
slug: barcode-detection-in-a-web-worker-using-comlink-
date: 2018-10-02T21:05:31.366Z
title: 'Barcode detection in a Web Worker using Comlink '
link: https://github.com/PaulKinlan/qrcode/blob/production/app/scripts/qrworker.js
tags: [links, qrcode, worker, comlink]
---
Saya penggemar berat QRCodes, mereka sangat sederhana dan rapi untuk bertukar data antara dunia nyata dan dunia digital. Selama beberapa tahun, saya punya proyek sampingan kecil bernama [QRSnapper](https://qrsnapper.com) & mdash; baik itu memiliki beberapa nama, tapi ini adalah salah satu yang telah saya selesaikan & mdash; yang menggunakan API `getUserMedia` untuk mengambil data langsung dari kamera pengguna sehingga dapat memindai QR Codes dalam waktu dekat.

Tujuan dari aplikasi ini adalah untuk mempertahankan 60fps di UI dan dekat deteksi instan dari Kode QR, ini berarti bahwa saya harus memasukkan kode pendeteksian ke dalam Web Worker (barang standar yang lumayan). Dalam posting ini saya hanya ingin cepat berbagi bagaimana saya menggunakan [comlink](https://github.com/GoogleChromeLabs/comlink) untuk menyederhanakan logika secara besar-besaran dalam Pekerja.

#### qrclient.js


```javascript
import * as Comlink from './comlink.js';

const proxy = Comlink.proxy(new Worker('/scripts/qrworker.js')); 

export const decode = async function (context) {
  try {
    let canvas = context.canvas;
    let width = canvas.width;
    let height = canvas.height;
    let imageData = context.getImageData(0, 0, width, height);
    return await proxy.detectUrl(width, height, imageData);
  } catch (err) {
    console.log(err);
  }
};
```
#### qrworker.js (pekerja web)


```javascript
import * as Comlink from './comlink.js';
import {qrcode} from './qrcode.js';

// Use the native API's
let nativeDetector = async (width, height, imageData) => {
  try {
    let barcodeDetector = new BarcodeDetector();
    let barcodes = await barcodeDetector.detect(imageData);
    // return the first barcode.
    if (barcodes.length > 0) {
      return barcodes[0].rawValue;
    }
  } catch(err) {
    detector = workerDetector;
  }
};

// Use the polyfil
let workerDetector = async (width, height, imageData) => {
  try {
    return qrcode.decode(width, height, imageData);
  } catch (err) {
    // the library throws an excpetion when there are no qrcodes.
    return;
  }
}

let detectUrl = async (width, height, imageData) => {
  return detector(width, height, imageData);
};

let detector = ('BarcodeDetector' in self) ? nativeDetector : workerDetector;
// Expose the API to the client pages.
Comlink.expose({detectUrl}, self);
```
Saya sangat menyukai Comlink, saya pikir ini adalah game changer dari sebuah perpustakaan terutama ketika membuat JavaScript idiomatik yang berfungsi di seluruh thread. Akhirnya hal yang rapi di sini, adalah bahwa API deteksi Barcode asli dapat dijalankan di dalam pekerja sehingga semua logika diringkas dari UI.

[Baca pos lengkap](https://github.com/PaulKinlan/qrcode/blob/production/app/scripts/qrworker.js).
