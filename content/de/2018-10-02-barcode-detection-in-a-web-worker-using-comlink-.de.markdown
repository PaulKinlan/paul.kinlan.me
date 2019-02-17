---
slug: barcode-detection-in-a-web-worker-using-comlink-
date: 2018-10-02T21:05:31.366Z
title: 'Barcode detection in a Web Worker using Comlink '
link: https://github.com/PaulKinlan/qrcode/blob/production/app/scripts/qrworker.js
tags: [links, qrcode, worker, comlink]
---
Ich bin ein großer Fan von QRCodes, sie sind eine sehr einfache und nette Möglichkeit, Daten zwischen der realen Welt und der digitalen Welt auszutauschen. Seit ein paar Jahren habe ich ein kleines Nebenprojekt namens [QRSnapper](https://qrsnapper.com) & mdash; Nun, es hatte ein paar Namen, aber das ist die, auf die ich mich festgelegt habe & mdash; Diese nutzt die API "getUserMedia", um Live-Daten von der Kamera des Benutzers zu empfangen, so dass sie fast in Echtzeit nach QR-Codes scannen kann.

Das Ziel der App war es, 60 fps in der Benutzeroberfläche zu halten und fast sofort den QR-Code zu erkennen. Das bedeutete, dass ich den Erkennungscode in einen Web-Worker stecken musste (ziemlich normales Zeug). In diesem Post wollte ich nur schnell mitteilen, wie ich [comlink](https://github.com/GoogleChromeLabs/comlink) benutzt habe, um die Logik im Worker massiv zu vereinfachen.

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
#### qrworker.js (Web-Arbeiter)


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
Ich liebe wirklich Comlink, ich denke, es ist ein Game Changer einer Bibliothek, besonders wenn es darum geht, idiomatisches JavaScript zu erstellen, das über Threads hinweg funktioniert. Schließlich ist es eine nette Sache, dass die native Barcode-Erkennungs-API in einem Worker ausgeführt werden kann, sodass die gesamte Logik außerhalb der Benutzeroberfläche gekapselt ist.

[Ganzen Beitrag lesen](https://github.com/PaulKinlan/qrcode/blob/production/app/scripts/qrworker.js).
