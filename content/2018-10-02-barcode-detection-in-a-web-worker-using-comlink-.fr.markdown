---
slug: barcode-detection-in-a-web-worker-using-comlink-
date: 2018-10-02T21:05:31.366Z
title: 'Barcode detection in a Web Worker using Comlink '
link: https://github.com/PaulKinlan/qrcode/blob/production/app/scripts/qrworker.js
tags: [links, qrcode, worker, comlink]
---
Je suis un grand fan des QRCodes, ils sont un moyen très simple et pratique d'échanger des données entre le monde réel et le monde numérique. Depuis quelques années, j'ai un petit projet parallèle appelé [QRSnapper](https://qrsnapper.com) & mdash; Eh bien, il porte quelques noms, mais c’est celui sur lequel j’ai opté pour & mdash; qui utilise l’API `getUserMedia` pour extraire des données en direct de la caméra de l’utilisateur afin de lui permettre de rechercher les codes QR en temps quasi réel.

Le but de l'application était de maintenir 60 images par seconde dans l'interface utilisateur et de détecter le code QR de manière quasi instantanée. Cela signifiait que je devais mettre le code de détection dans un Web Worker (élément plutôt standard). Dans cet article, je voulais simplement partager rapidement la façon dont j'ai utilisé [comlink](https://github.com/GoogleChromeLabs/comlink) pour simplifier massivement la logique du travailleur.

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
#### qrworker.js (travailleur Web)


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
J'aime vraiment Comlink, je pense que c'est un changeur de jeu d'une bibliothèque, en particulier lorsqu'il s'agit de créer du code JavaScript idiomatique qui fonctionne sur plusieurs threads. Enfin, il est intéressant de noter que l’API de détection de code à barres native peut être exécutée à l’intérieur d’un serveur, de sorte que toute la logique soit encapsulée à l’écart de l’UI.

[Lire l'article complet](https://github.com/PaulKinlan/qrcode/blob/production/app/scripts/qrworker.js).
