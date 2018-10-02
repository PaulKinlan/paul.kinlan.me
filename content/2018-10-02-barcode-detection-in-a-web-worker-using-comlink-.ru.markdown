---
slug: barcode-detection-in-a-web-worker-using-comlink-
date: 2018-10-02T21:05:31.366Z
title: 'Barcode detection in a Web Worker using Comlink '
link: https://github.com/PaulKinlan/qrcode/blob/production/app/scripts/qrworker.js
tags: [links, qrcode, worker, comlink]
---
Я большой поклонник QRCodes, они очень простой и опрятный способ обмена данными между реальным миром и цифровым миром. В течение нескольких лет у меня был небольшой побочный проект под названием [QRSnapper](https://qrsnapper.com) & mdash; ну, у него было несколько имен, но это тот, который я поселил в & mdash; который использует API `getUserMedia` для получения живых данных с камеры пользователя, чтобы он мог сканировать QR-коды в ближайшем реальном времени.

Целью приложения было поддерживать 60 кадров в секунду в пользовательском интерфейсе и почти мгновенное обнаружение QR-кода, это означало, что мне пришлось ввести код обнаружения в веб-рабочего (довольно стандартный материал). В этом посте я просто хотел быстро поделиться тем, как я использовал [комлинк](https://github.com/GoogleChromeLabs/comlink), чтобы значительно упростить логику в Рабочем.

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
#### qrworker.js (веб-работник)


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
Мне очень нравится Comlink, я думаю, что это игровой чейнджер библиотеки, особенно когда речь заходит о создании идиоматического JavaScript, который работает по потокам. В конце концов, здесь стоит упомянуть, что встроенный API обнаружения штрих-кода можно запустить внутри рабочего, так что вся логика инкапсулирована в сторону от пользовательского интерфейса.

[Читать полностью](https://github.com/PaulKinlan/qrcode/blob/production/app/scripts/qrworker.js).
