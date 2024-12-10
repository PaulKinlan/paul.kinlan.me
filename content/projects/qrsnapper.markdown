---
date: 2015-04-15 13:20:31+00:00
description: The fastest QR Code scanner on the web
slug: qrsnapper
summary: In 2014-15, I created QRSnapper to demonstrate the web's capability to host
  experiences comparable to native platforms.  Existing QR code readers relied on
  server-side processing, but I wanted a real-time, offline, client-side solution.  QRSnapper
  uses jsqrcode for scanning, but to maintain UI responsiveness, I offloaded the processing
  to a Web Worker.  This allowed for seemingly instant detection, even though the
  library itself isn't inherently fast.  QRSnapper also served as a testing ground
  for new web APIs like Full Frame Camera and BarCode Detection.
tags:
- web
- pwa
- qr code
- qr code scanner
- performance
- offline
- client-side
- web worker
- javascript
- camera
- barcode
- barcode detection api
- full frame camera api
title: QR Snapper

---

Around 2014-15, I wanted to show that the web was an amazingly capable platform
that was able to host experiences that were comparable to those of native
platforms.

An app that was touted as being impossible to do on the web was a QR code reader
because it needed access to a camera *and* it needed to do it performantly and
the only experiences on the web at the time were site that took the image via an
`<input type=file>` element and uploaded it on the server. I didn't want that, I
wanted to do it in real-time and be able to do it offline and thus client side.

I built [QRSnapper](https://qrsnapper.appspot.com/) as the sample experience
that proves that you can build these performant, installable and always
available experiences on the web.

I didn't write the QR code scanning library, that was
[jsqrcode](https://github.com/LazarSoft/jsqrcode). The library works well, but
it's not fast, in fact it can take many 10's to 100's of milliseconds to to
analyse and image and I needed to offer a UI that was always responsive and
didn't lock whilst it was detecting QR codes.

To keep the UI responsive and snappy I had to make the library work inside a
[Web
Worker](https://github.com/PaulKinlan/qrcode/tree/production/app/scripts/jsqrcode).
It was pretty simple in the end, I take the video stream and push a frame on to
a `<canvas>` element, I then take the raw image data from the Canvas and
transport it over to the Web Worker for processing. The Web Worker will only
process one frame at a time, but now that it's not on the main thread detection
feels instant.

This application also became the testing ground for a number of Media related
API's on the web, specifically the Full frame Camera API and also the
[BarCode](/barcode-detection/) detection API. These native APIs have
unfortunately not fully landed on the web platforms.