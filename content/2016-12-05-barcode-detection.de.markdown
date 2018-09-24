---
slug: barcode-detection
date: 2016-12-05
title: "Barcode detection using Shape Detection API"
tags: ['api', 'javascript', 'shape-detection', 'qrcode']
---


Die andere Woche sprach ich über [Gesichtserkennung über die Shape-API](/ Gesichtserkennung /), die in Chrome auf dem Kanarischen Kanal ist. Jetzt ist die Barcode-Erkennung auch in Chrome Canary ([Miguel](https://twitter.com/yellowdoge) ist mein Held;)

Barcodes sind riesig! Sie sind auf fast jedem Produkt, das wir kaufen. Selbst der viel geschmähte [QRCode ist außerhalb der USA und Europa riesig](https://www.clickz.com/why-have-qr-codes-taken-off-in-china/23662/). Der Barcode und der QRcode bieten eine einfache Möglichkeit, die physische Welt und die digitale Welt zu überbrücken, indem kleine Datenmengen zwischen dem Medium und Ihnen übertragen werden. In der Ära des Desktops war das vielleicht keine große Nutzung, in der Ära des Mobiles ist es jedoch entscheidend. Sie sollten niemals eine App installieren müssen, nur um auf diese Daten zugreifen zu können.

Die Shape-Detection-API ist interessant, da sie eine Standardschnittstelle auf einigen unterlegenden Hardware-Funktionen auf dem Gerät des Benutzers erstellt und der Web-Plattform neue Funktionen eröffnet, vor allem Gesichtserkennung und Barcode-Erkennung.

Die Barcode-Erkennungs-API basiert auf der [Shape Detection API](https://wicg.github.io/shape-detection-api/#introduction), die sich derzeit in der [WICG] befindet (https://github.com/wicg/) was bedeutet, dass es in einer Inkubations- und Experimentierphase ist. Unter [Android können Sie verschiedene 1D- und 2D-Barcodes erkennen (https://developers.google.com/vision/barcodes-overview) Barcodes:

> 1D barcodes: EAN-13, EAN-8, UPC-A, UPC-E, Code-39, Code-93, Code-128, ITF,
> Codabar
>
> 2D barcodes: QR Code, Data Matrix, PDF-417, AZTEC


Außerdem:

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


Das Shape Detection API befindet sich derzeit in Chrome Canary (M57) und Sie müssen es über `chrome: // flags / # enable-experimental-web-platform-features` aktivieren

Wie bei der Gesichtserkennung ist die API relativ einfach zu verwenden. Sie rufen die API über `detect` auf der` BarcodeDetector`-API auf und Sie erhalten ein Versprechen, das zu einer Liste decodierter Barcodes führt.


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


Es wird ein Bildobjekt (entweder eine CanvasImageSource, ein Blob, ImageData oder ein ` <img> (Element) und übergibt das dann an die zugrunde liegende System-API und es wird ein Array von DetectedBarcode-Objekten zurückgegeben, die DetectedObject implementieren, das im Wesentlichen die Grenzen jeder Fläche im Bild angibt.

Ich habe auch [integriert](https://github.com/PaulKinlan/qrcode/commit/21afa9ae4c316e4a8ced76d77f41eda2eb92852b) es in meine [QRCode Scanner Application](https://qrsnapper.appspot.com), aber ich warte auf eine fix to land, das mich in [Canvas](https://bugs.chromium.org/p/chromium/issues/detail?id=670977) oder [ImageData](https://bugs.chromium.org/) passieren lässt p / chrom / issues / detail? id = 670975) in die API ein.

Das Interessante daran ist, dass ich, da ich diese App bereits in JS mit der [LazarSoft jsqrcode API] erstellt habe (https://github.com/LazarSoft/jsqrcode), die Verfügbarkeit von nativem Barcode-Scan erkennen kann und ob es nicht dort ist dann scheitere ich auf die reine JS-Implementierung zurück.

Hier sind einige Videos davon in Aktion:

{{<youtube LGB0n-dW_HM>}}

{{<youtube Anq_N_SY17o>}}

Ich habe es im vorherigen Artikel nicht erwähnt, aber dies sollte auch bei einem Arbeitsthread (und folglich bei einem Service Worker) funktionieren. Für meinen Anwendungsfall ist das hervorragend, weil ich dadurch meine Logik in einen anderen Thread delegieren und alles vom UI-Thread fernhalten kann.

Ich denke, es ist eine sehr überzeugende Ergänzung der Web-Plattform, und ich bin begeistert, dass dies sich gewöhnen wird.