---
slug: barcode-detection-in-a-web-worker-using-comlink-
date: 2018-10-02T21:05:31.366Z
title: 'Barcode detection in a Web Worker using Comlink '
link: https://github.com/PaulKinlan/qrcode/blob/production/app/scripts/qrworker.js
tags: [links, qrcode, worker, comlink]
---
நான் QRCodes ஒரு பெரிய ரசிகர், அவர்கள் உண்மையான உலக மற்றும் டிஜிட்டல் உலக இடையே தரவு பரிமாறி மிகவும் எளிமையான மற்றும் சுத்தமாகவும் இருக்கும். சில ஆண்டுகளுக்கு இப்போது நான் ஒரு சிறிய பக்க திட்டம் [QRSnapper](https://qrsnapper.com) & mdash; நன்றாக இது ஒரு சில பெயர்கள், ஆனால் இது நான் & mdash; அது 'கௌசர்மிடியா` API ஐ பயன்படுத்துகிறது, இது பயனரின் கேமராவிலிருந்து நேரடி தரவை எடுக்கிறது, இதன் மூலம் உண்மையான நேரத்திற்கு QR குறியீடுகள் ஸ்கேன் செய்ய முடியும்.

பயன்பாட்டின் குறிக்கோள், UI இல் 60fps ஐ மற்றும் QR கோட் உடனடி கண்டறிதலை உடனடியாக கண்டறிவதே ஆகும், இதன் பொருள் ஒரு வலை பணியாளர் (அழகிய நிலையான பொருள்) இல் கண்டறிதல் குறியீட்டை வைக்க வேண்டியிருந்தது. இந்த இடுகையில் நான் தொழிலாளிடமிருந்து தர்க்கத்தை எளிதில் எளிதாக்குவது எப்படி [comlink](https://github.com/GoogleChromeLabs/comlink) ஐப் பயன்படுத்தி விரைவாக பகிர்ந்து கொள்ள விரும்புகிறேன்.

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
#### qrworker.js (வலைத் தொழிலாளி)


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
நான் உண்மையில் Comlink நேசிக்கிறேன், நான் நூல்கள் முழுவதும் வேலை என்று முட்டாள் ஜாவாஸ்கிரிப்ட் உருவாக்கும் குறிப்பாக போது அது ஒரு நூலகம் ஒரு விளையாட்டு மாற்றும் என்று நினைக்கிறேன். கடைசியாக ஒரு நேர்த்தியான விஷயம் என்னவென்றால், சொந்த பார்கோடு கண்டறிதல் ஏபிஐ ஒரு தொழிலாளிக்குள் இயங்க முடியும், எனவே அனைத்து தர்க்கமும் UI இலிருந்து அகற்றப்படும்.

[முழு இடுகையைப் படிக்கவும்](https://github.com/PaulKinlan/qrcode/blob/production/app/scripts/qrworker.js).
