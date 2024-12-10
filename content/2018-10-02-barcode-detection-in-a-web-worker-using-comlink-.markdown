---
date: 2018-10-02 21:05:31.366000+00:00
link: https://github.com/PaulKinlan/qrcode/blob/production/app/scripts/qrworker.js
slug: barcode-detection-in-a-web-worker-using-comlink-
summary: In this post, I share how I used Comlink to simplify the worker logic in
  my QRSnapper project, which aims to achieve 60fps UI and near-instant QR code detection
  using getUserMedia.  The code now utilizes the Barcode Detection API within a Web
  Worker for efficient QR code scanning. If the native API is available, the code
  uses it; otherwise, it falls back to a polyfill. This approach keeps the UI responsive
  while offloading the processing to a separate thread, significantly improving performance.
tags:
- QR Code
- Web Worker
- Comlink
- JavaScript
- Barcode Detection API
- Performance
- getUserMedia
title: 'Barcode detection in a Web Worker using Comlink '

---
I'm a big fan of QRCodes, they are very simple and neat way to exchange data between the real world and the digital world. For a few years now I've had a little side project called [QRSnapper](https://qrsnapper.com) &mdash; well it's had a few names, but this is the one I've settled on &mdash; that uses the `getUserMedia` API to take live data from the user's camera so that it can scan for QR Codes in near real time.

The goal of the app was to maintain 60fps in the UI and near instant detection of the QR Code, this meant that I had to put the detection code in to a Web Worker (pretty standard stuff). In this post I just wanted to quickly share how I used [comlink](https://github.com/GoogleChromeLabs/comlink) to massively simplify the logic in the Worker.

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
#### qrworker.js (web worker)

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
I really love Comlink, I think it is a game changer of a library especially when it comes to creating idiomatic JavaScript that works across threads. Finally a neat thing here, is that the native Barcode detection API can be run inside a worker so all the logic is encapsulated away from the UI.

[Read full post](https://github.com/PaulKinlan/qrcode/blob/production/app/scripts/qrworker.js).
