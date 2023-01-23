---
slug: barcode-detection
date: 2016-12-05
title: "Barcode detection using Shape Detection API"
tags: ['api', 'javascript', 'shape-detection', 'qrcode']
---

The other week I talked about [Face Detection via the Shape
API](/face-detection/) that is in the Canary channel in Chrome. Now barcode
detection is in Chrome Canary too ([Miguel](https://twitter.com/yellowdoge) is
my hero ;)

Barcodes are huge! they are on nearly every product we buy. Even the much
maligned [QRCode is huge outside of the US and
Europe](https://www.clickz.com/why-have-qr-codes-taken-off-in-china/23662/). The
barcode and the QRcode provide a simple way for you to bridge the physical world
and the digital world by transferring small amounts of data between the medium
and you. This might not have been a huge amount of use in the era of the
desktop, in the era of mobile it is critical. You should never have to install
an app just to get access to this data.

The Shape Detection API is interesting because it creates a standard interface
on top of some underlaying hardware features on the user's device and opens up a
new set of capabilities to the web platform, primarily Face Detection and
barcode detection.

The barcode detection API is built upon the [Shape Detection
API](https://wicg.github.io/shape-detection-api/#introduction) that is currently
in the [WICG](https://github.com/wicg/) which means it is in an incubation and
experimentation phase. On [Android you can detect a number of different 1D and
2D](https://developers.google.com/vision/barcodes-overview) barcodes:

> 1D barcodes: EAN-13, EAN-8, UPC-A, UPC-E, Code-39, Code-93, Code-128, ITF,
> Codabar
>
> 2D barcodes: QR Code, Data Matrix, PDF-417, AZTEC

Furthermore:

> It automatically parses QR Codes, Data Matrix, PDF-417, and Aztec values, for
> the following supported formats:
>
> * URL
> * Contact information (VCARD, etc.)
> * Calendar event
> * Email
> * Phone
> * SMS
> * ISBN
> * WiFi
> * Geo-location (latitude and longitude)
> * AAMVA driver license/ID

The Shape Detection API is currently in Chrome Canary (M57) and you need to
enable it via `chrome://flags/#enable-experimental-web-platform-features`

Like with face detection, the API is relatively simple to use. You invoke the
API via `detect` on the `BarcodeDetector` API and you get back a promise that 
resolves to a list of decoded barcodes.

```javascript
var barcodeDetector = new BarcodeDetector();
barcodeDetector.detect(image)
  .then(barcodes => {
    barcodes.forEach(barcode => console.log(barcodes.rawValue))
  })
  .catch((e) => {
    console.error("Boo, BarcodeDetection failed: " + e);
  });
```

It takes an image object (either a CanvasImageSource, Blob, ImageData or an
`<img>` element) and then passes that to the underlying system API and it will
return an array of `DetectedBarcode` objects that implement `DetectedObject`
which essentially gives you the bounds of each face in the image.

I've also
[integrated](https://github.com/PaulKinlan/qrcode/commit/21afa9ae4c316e4a8ced76d77f41eda2eb92852b)
it in to my [QRCode Scanner Application](https://qrsnapper.appspot.com) but I am
waiting for a fix to land that lets me pass in a
[Canvas](https://bugs.chromium.org/p/chromium/issues/detail?id=670977) or
[ImageData](https://bugs.chromium.org/p/chromium/issues/detail?id=670975) object
into the API. 

The interesting thing is that because I have already built this app in
plain JS using the [LazarSoft jsqrcode API](https://github.com/LazarSoft/jsqrcode)
I can detect the availability of native Barcode scanning and if it is not there
then I fail back to the pure JS implementation.

Here are some videos of it in action:

{{< fast-youtube LGB0n-dW_HM >}}

{{< fast-youtube Anq_N_SY17o >}}

I didn't mention it in the previous article, but this should also work on a 
worker thread (and consequentially inside a Service Worker). For my use-case this
is brilliant because it allows me to delegate my logic in to another thread and
keep everything away from the UI thread.

I think it is a very compelling addition to the web platform and I am excited to
see this get used.
