---
slug: barcode-detection
date: 2016-12-05
title: "Barcode detection using Shape Detection API"
tags: ['api', 'javascript', 'shape-detection', 'qrcode']
---


L'autre semaine, j'ai parlé de [Détection de visage via l'API Shape](/ face-detection /) qui se trouve dans le canal Canary dans Chrome. Maintenant, la détection de codes à barres est également dans Chrome Canary ([Miguel](https://twitter.com/yellowdoge) est mon héros;)

Les codes barres sont énormes! ils sont sur presque tous les produits que nous achetons. Même le très décrié [QRCode est énorme en dehors des États-Unis et de l'Europe](https://www.clickz.com/why-have-qr-codes-taken-off-in-china/23662/). Le code à barres et le QRcode constituent un moyen simple de faire le pont entre le monde physique et le monde numérique en transférant de petites quantités de données entre le support et vous. Cela n'a peut-être pas été une énorme utilisation à l'ère du bureau, à l'ère du mobile, il est essentiel. Vous ne devriez jamais avoir à installer une application pour avoir accès à ces données.

L'API Shape Detection est intéressante car elle crée une interface standard sur certaines fonctionnalités matérielles sous-jacentes de l'appareil de l'utilisateur et ouvre de nouvelles fonctionnalités à la plate-forme Web, principalement la détection de visage et la détection de codes-barres.

L'API de détection de code à barres est basée sur [l'API de détection de forme](https://wicg.github.io/shape-detection-api/#introduction) qui se trouve actuellement dans [WICG](https://github.com/ wicg /) ce qui signifie qu’il est en phase d’incubation et d’expérimentation. Sur [Android, vous pouvez détecter différents codes 1D et 2D](https://developers.google.com/vision/barcodes-overview):

> 1D barcodes: EAN-13, EAN-8, UPC-A, UPC-E, Code-39, Code-93, Code-128, ITF,
> Codabar
>
> 2D barcodes: QR Code, Data Matrix, PDF-417, AZTEC


En outre:

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


L'API de détection de forme est actuellement dans Chrome Canary (M57) et vous devez l'activer via `chrome: // flags / # enable-experimental-web-platform-features`

Comme pour la détection des visages, l’API est relativement simple à utiliser. Vous appelez l'API via `detect` sur l'API` BarcodeDetector` et vous obtenez une promesse qui renvoie à une liste de codes-barres décodés.


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


Il prend un objet image (soit un CanvasImageSource, Blob, ImageData ou un ` <img> `element), puis le transmet à l&#39;API système sous-jacente et il retournera un tableau d&#39;objets` DetectedBarcode` qui implémentent `DetectedObject`, qui vous donne essentiellement les limites de chaque face de l&#39;image.

Je l'ai aussi intégré (https://github.com/PaulKinlan/qrcode/commit/21afa9ae4c316e4a8ced76d77f41eda2eb92852b) dans mon [Application QRCode Scanner](https://qrsnapper.appspot.com) mais j'attends un fixer à la terre qui me permet de passer dans un [Canvas](https://bugs.chromium.org/p/chromium/issues/detail?id=670977) ou [ImageData](https://bugs.chromium.org/ p / chromium / issues / detail? id = 670975) objet dans l'API.

La chose intéressante est que parce que j'ai déjà construit cette application en JS en utilisant [l'API jsqrcode de LazarSoft](https://github.com/LazarSoft/jsqrcode), je peux détecter la disponibilité de la numérisation de codes à barres native et si elle n'y est pas puis je retourne à la pure implémentation JS.

Voici quelques vidéos en action:

{{<youtube LGB0n-dW_HM>}}

{{<youtube Anq_N_SY17o>}}

Je ne l'ai pas mentionné dans l'article précédent, mais cela devrait également fonctionner sur un thread de travail (et par conséquent dans un Service Worker). Pour mon cas, c'est génial, car cela me permet de déléguer ma logique à un autre thread et de tout garder loin du thread de l'interface utilisateur.

Je pense que c'est un ajout très convaincant à la plate-forme Web et je suis ravi de voir cela utilisé.