---
slug: barcode-detection-in-a-web-worker-using-comlink-
date: 2018-10-02T21:05:31.366Z
title: 'Barcode detection in a Web Worker using Comlink '
link: https://github.com/PaulKinlan/qrcode/blob/production/app/scripts/qrworker.js
tags: [links, qrcode, worker, comlink]
---
Tôi là một fan hâm mộ lớn của QRCodes, họ rất đơn giản và gọn gàng để trao đổi dữ liệu giữa thế giới thực và thế giới kỹ thuật số. Trong một vài năm nay tôi đã có một dự án nhỏ bên gọi là [QRSnapper](https://qrsnapper.com) & mdash; nó cũng có một vài cái tên, nhưng đây là cái tôi đã giải quyết trên & mdash; sử dụng API `getUserMedia` để lấy dữ liệu trực tiếp từ máy ảnh của người dùng để nó có thể quét mã QR trong thời gian thực gần.

Mục tiêu của ứng dụng là duy trì 60 khung hình / giây trong giao diện người dùng và gần ngay lập tức phát hiện Mã QR, điều này có nghĩa là tôi phải đặt mã phát hiện vào một Công nhân Web (những thứ khá chuẩn). Trong bài viết này, tôi chỉ muốn chia sẻ nhanh cách tôi sử dụng [comlink](https://github.com/GoogleChromeLabs/comlink) để đơn giản hóa logic trong Worker.

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
#### qrworker.js (nhân viên web)


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
Tôi thực sự yêu Comlink, tôi nghĩ rằng đó là một sự thay đổi trò chơi của một thư viện đặc biệt là khi nói đến việc tạo JavaScript thành ngữ hoạt động trên các chủ đề. Cuối cùng là một điều gọn gàng ở đây, đó là API phát hiện mã vạch gốc có thể được chạy bên trong một nhân viên để tất cả logic được gói gọn khỏi giao diện người dùng.

[Đọc toàn bộ bài đăng](https://github.com/PaulKinlan/qrcode/blob/production/app/scripts/qrworker.js).
