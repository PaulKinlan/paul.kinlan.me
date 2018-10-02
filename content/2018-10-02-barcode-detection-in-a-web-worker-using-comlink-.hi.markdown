---
slug: barcode-detection-in-a-web-worker-using-comlink-
date: 2018-10-02T21:05:31.366Z
title: 'Barcode detection in a Web Worker using Comlink '
link: https://github.com/PaulKinlan/qrcode/blob/production/app/scripts/qrworker.js
tags: [links, qrcode, worker, comlink]
---
मैं क्यूआरकोड्स का एक बड़ा प्रशंसक हूं, वे असली दुनिया और डिजिटल दुनिया के बीच डेटा का आदान-प्रदान करने के लिए बहुत ही सरल और साफ तरीके हैं। कुछ सालों से अब मेरे पास एक छोटी सा परियोजना है [QRSnapper](https://qrsnapper.com) & mdash; ठीक है, इसमें कुछ नाम हैं, लेकिन यह वह है जिसे मैंने तय किया है & mdash; जो उपयोगकर्ता के कैमरे से लाइव डेटा लेने के लिए `getUserMedia` API का उपयोग करता है ताकि वह वास्तविक समय में क्यूआर कोडों के लिए स्कैन कर सके।

ऐप का लक्ष्य यूआई में 60 एफपीएस बनाए रखना और क्यूआर कोड के तत्काल पता लगाने के लिए था, इसका मतलब था कि मुझे एक वेब वर्कर (सुंदर मानक सामान) में पहचान कोड डालना पड़ा। इस पोस्ट में मैं बस वर्कर में तर्क को व्यापक रूप से सरल बनाने के लिए [comlink](https://github.com/GoogleChromeLabs/comlink) का उपयोग कैसे करता हूं, इसे तुरंत साझा करना चाहता था।

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
#### qrworker.js (वेब ​​वर्कर)


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
मुझे वास्तव में कॉमलिंक पसंद है, मुझे लगता है कि यह लाइब्रेरी का एक गेम चेंजर है, खासकर जब यह थियम्स पर काम करने वाली मूर्खतापूर्ण जावास्क्रिप्ट बनाने की बात आती है। अंततः यहां एक साफ चीज़ यह है कि मूल बारकोड पहचान एपीआई एक कार्यकर्ता के अंदर चलाया जा सकता है ताकि सभी तर्क यूआई से दूर हो जाएं।

[पूर्ण पोस्ट पढ़ें](https://github.com/PaulKinlan/qrcode/blob/production/app/scripts/qrworker.js)।
