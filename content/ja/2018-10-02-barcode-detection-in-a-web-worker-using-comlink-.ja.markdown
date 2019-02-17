---
slug: barcode-detection-in-a-web-worker-using-comlink-
date: 2018-10-02T21:05:31.366Z
title: 'Barcode detection in a Web Worker using Comlink '
link: https://github.com/PaulKinlan/qrcode/blob/production/app/scripts/qrworker.js
tags: [links, qrcode, worker, comlink]
---
私はQRコードの大ファンです。実世界とデジタル世界の間でデータを交換するための非常にシンプルできれいな方法です。数年前から、私は[QRSnapper](https://qrsnapper.com)と呼ばれる小さなプロジェクトを持っていました。まあそれはいくつかの名前を持っていますが、これは私が解決したものです＆mdash;これは `getUserMedia` APIを使用してユーザのカメラからライブデータを取得し、ほぼリアルタイムでQRコードをスキャンすることができます。

このアプリの目標は、UIで60fpsを維持し、QRコードをすぐに検出できるようにすることでした。これは、検出コードをWebワーカー（かなり標準的なもの）に入れなければならないことを意味しました。この記事では、[comlink](https://github.com/GoogleChromeLabs/comlink)を使ってワーカーのロジックを大幅に単純化する方法を簡単に共有したいと思っていました。

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
#### qrworker.js（ウェブワーカー）


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
私は本当にComlinkが大好きです。特に、スレッド間で動作する慣用JavaScriptを作成する場合、ライブラリのゲームチェンジャーだと思います。最後にここでうまくいくのは、ネイティブのバーコード検出APIをワーカー内で実行できるため、すべてのロジックがUIからカプセル化されているからです。

[全文を読む](https://github.com/PaulKinlan/qrcode/blob/production/app/scripts/qrworker.js)
