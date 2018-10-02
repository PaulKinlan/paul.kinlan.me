---
slug: barcode-detection-in-a-web-worker-using-comlink-
date: 2018-10-02T21:05:31.366Z
title: 'Barcode detection in a Web Worker using Comlink '
link: https://github.com/PaulKinlan/qrcode/blob/production/app/scripts/qrworker.js
tags: [links, qrcode, worker, comlink]
---
Soy un gran fan de los códigos QR, son una forma muy simple y ordenada de intercambiar datos entre el mundo real y el mundo digital. Desde hace unos años he tenido un pequeño proyecto paralelo llamado [QRSnapper](https://qrsnapper.com) & mdash; bueno, ha tenido algunos nombres, pero este es el que me he fijado en & mdash; que utiliza la API `getUserMedia` para tomar datos en vivo de la cámara del usuario para que pueda escanear los códigos QR casi en tiempo real.

El objetivo de la aplicación era mantener 60 fps en la interfaz de usuario y la detección casi instantánea del código QR, lo que significaba que tenía que colocar el código de detección en un trabajador web (cosas bastante estándar). En este post solo quería compartir rápidamente cómo usé [comlink](https://github.com/GoogleChromeLabs/comlink) para simplificar enormemente la lógica en el Worker.

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
#### qrworker.js (trabajador web)


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
Realmente amo a Comlink, creo que es un cambio de juego de una biblioteca, especialmente cuando se trata de crear JavaScript idiomático que funciona a través de hilos. Finalmente, lo bueno aquí es que la API de detección de código de barras nativa se puede ejecutar dentro de un trabajador, por lo que toda la lógica está encapsulada fuera de la interfaz de usuario.

[Leer publicación completa](https://github.com/PaulKinlan/qrcode/blob/production/app/scripts/qrworker.js).
