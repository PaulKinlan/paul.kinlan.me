---
slug: barcode-detection
date: 2016-12-05
title: "Barcode detection using Shape Detection API"
tags: ['api', 'javascript', 'shape-detection', 'qrcode']
---


La otra semana hablé sobre [Detección de la cara a través de la API Shape](/ face-detection /) que está en el canal Canary en Chrome. Ahora la detección del código de barras también está en Chrome Canary ([Miguel](https://twitter.com/yellowdoge) es mi héroe;)

¡Los códigos de barras son enormes! están en casi todos los productos que compramos. Incluso el muy difamado [QRCode es enorme fuera de los EE. UU. Y Europa](https://www.clickz.com/why-have-qr-codes-taken-off-in-china/23662/). El código de barras y el QRcode brindan una manera sencilla de unir el mundo físico y el mundo digital transfiriendo pequeñas cantidades de datos entre el medio y usted. Esto podría no haber sido una gran cantidad de uso en la era del escritorio, en la era de los dispositivos móviles es fundamental. Nunca debe tener que instalar una aplicación solo para obtener acceso a esta información.

La API de detección de formas es interesante porque crea una interfaz estándar sobre algunas características de hardware subyacentes en el dispositivo del usuario y abre un nuevo conjunto de capacidades a la plataforma web, principalmente detección de rostros y detección de códigos de barras.

La API de detección de códigos de barras se basa en la [API de detección de formas](https://wicg.github.io/shape-detection-api/#introduction) que se encuentra actualmente en [WICG](https://github.com/ wicg /) lo que significa que está en una fase de incubación y experimentación. En [Android se pueden detectar varios códigos de barras 1D y 2D](https://developers.google.com/vision/barcodes-overview):

> 1D barcodes: EAN-13, EAN-8, UPC-A, UPC-E, Code-39, Code-93, Code-128, ITF,
> Codabar
>
> 2D barcodes: QR Code, Data Matrix, PDF-417, AZTEC


Además:

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


La API de detección de formas se encuentra actualmente en Chrome Canary (M57) y debes habilitarla a través de `chrome: // flags / # enable-experimental-web-platform-features`

Al igual que con la detección de rostros, la API es relativamente simple de usar. Usted invoca la API a través de `detectar` en la API` BarcodeDetector` y obtiene una promesa que se adapta a una lista de códigos de barras decodificados.


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


Toma un objeto de imagen (ya sea un CanvasImageSource, Blob, ImageData o un ` <img> `elemento) y luego pasa eso a la API del sistema subyacente y devolverá una matriz de objetos` DetectedBarcode` que implementan `DetectedObject` que esencialmente le da los límites de cada cara en la imagen.

También he [integrado](https://github.com/PaulKinlan/qrcode/commit/21afa9ae4c316e4a8ced76d77f41eda2eb92852b) en mi [Aplicación escáner QRCode](https://qrsnapper.appspot.com) pero estoy esperando un solución para la tierra que me permite pasar en [Canvas](https://bugs.chromium.org/p/chromium/issues/detail?id=670977) o [ImageData](https://bugs.chromium.org/ p / chromium / issues / detail? id = 670975) objeto en la API.

Lo interesante es que debido a que ya he creado esta aplicación en JS simple usando la [API de LazarSoft jsqrcode](https://github.com/LazarSoft/jsqrcode) puedo detectar la disponibilidad del escaneo de código de barras nativo y si no está allí luego vuelvo a la implementación pura de JS.

Aquí hay algunos videos de esto en acción:

{{<youtube LGB0n-dW_HM>}}

{{<youtube Anq_N_SY17o>}}

No lo mencioné en el artículo anterior, pero esto también debería funcionar en un hilo de trabajo (y consecuentemente dentro de un trabajador de servicio). Para mi caso de uso, esto es brillante porque me permite delegar mi lógica en otro hilo y mantener todo alejado del hilo de UI.

Creo que es una adición muy atractiva a la plataforma web y estoy emocionado de ver que esto se use.