---
slug: barcode-detection
date: 2016-12-05
title: "Barcode detection using Shape Detection API"
---

The other week I talked about [Face Detection via the Shape
API](/face-detection/) that is in the Canary channel in Chrome. Now barcode
detection is in Chrome Canary too ([Miguel](https://twitter.com/yellowdoge) is
my hero ;)

Quick demo: [https://jsbin.com/hameva/latest](https://jsbin.com/hameva/3/edit)

That API was the [Shape Detection
API](https://wicg.github.io/shape-detection-api/#introduction) that is currently
in the [WICG](https://github.com/wicg/) in an incubation and experimentation
phase and is a nice incremental addition to the platform.

The Shape Detection API is interesting because it creates a standard interface
on top of some underlaying hardware features on the user's device and opens up a
new set of capabilities to the web platform. This time it is barcode detection
and on [Android it can detect a number of different 1D and
2D](https://developers.google.com/vision/barcodes-overview)

> 1D barcodes: EAN-13, EAN-8, UPC-A, UPC-E, Code-39, Code-93, Code-128, ITF,
> Codabar 
> 2D barcodes: QR Code, Data Matrix, PDF-417, AZTEC

Specifically:

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

The Shape Detection API is currently in Chrome Canary (M57) and can detect both
faces (talked about last week) and bar-codes (and QR Codes). You need to enable
it via
`chrome://flags/#enable-experimental-web-platform-features`

Like with face detection, the API is relatively simple to use. You invoke the 
API via `detect` and you get back a list of decoded barcodes.

```
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

Finally, here is a video of it in action

<iframe width="560" height="315" src="https://www.youtube.com/embed/LGB0n-dW_HM"
        frameborder="0" allowfullscreen></iframe>