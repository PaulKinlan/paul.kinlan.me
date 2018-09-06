---
slug: barcode-detection
date: 2016-12-05
title: "Barcode detection using Shape Detection API"
tags: ['api', 'javascript', 'shape-detection', 'qrcode']
---


На другой неделе я говорил о [Обнаружение лиц через API-интерфейс формы](/ face-detection /), который находится на канале Канала в Chrome. Теперь обнаружение штрих-кода в Chrome Canary тоже ([Miguel](https://twitter.com/yellowdoge) - мой герой;)

Штрих-коды огромны! они находятся почти на каждом продукте, который мы покупаем. Даже очень злокачественный [QRCode является огромным за пределами США и Европы](https://www.clickz.com/why-have-qr-codes-taken-off-in-china/23662/). Штрих-код и QR-код обеспечивают простой способ для вашего физического мира и цифрового мира путем переноса небольших объемов данных между средой и вами. Это, возможно, не было огромным количеством использования в эпоху рабочего стола, в эпоху мобильных это критически важно. Вам не нужно устанавливать приложение, чтобы получить доступ к этим данным.

API обнаружения формы интересен тем, что создает стандартный интерфейс поверх некоторых подкладочных аппаратных функций на устройстве пользователя и открывает новый набор возможностей для веб-платформы, в первую очередь обнаружения лиц и обнаружения штрих-кода.

API обнаружения штрих-кода построен на [API обнаружения формы](https://wicg.github.io/shape-detection-api/#introduction), который в настоящее время находится в [WICG](https://github.com/ wicg /), что означает, что он находится на стадии инкубации и эксперимента. На [Android вы можете обнаружить несколько различных 1D и 2D](https://developers.google.com/vision/barcodes-overview) штрих-кодов:

> 1D barcodes: EAN-13, EAN-8, UPC-A, UPC-E, Code-39, Code-93, Code-128, ITF,
> Codabar
>
> 2D barcodes: QR Code, Data Matrix, PDF-417, AZTEC


Более того:

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


API обнаружения формы теперь находится в Chrome Canary (M57), и вам нужно включить его через `chrome: // flags / # enable-experimental-web-platform-features`

Как и при обнаружении лица, API относительно прост в использовании. Вы вызываете API через `detect` в API` BarcodeDetector`, и вы возвращаете обещание, которое переписывается в список декодированных штрих-кодов.


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


Он принимает объект изображения (либо CanvasImageSource, Blob, ImageData, либо ` <img> `), а затем передает это базовому системному API, и он вернет массив объектов DetectedBarcode, которые реализуют` DetectedObject`, который по существу дает вам границы каждой грани изображения.

Я также [интегрировал](https://github.com/PaulKinlan/qrcode/commit/21afa9ae4c316e4a8ced76d77f41eda2eb92852b) в мой [приложение сканера QRCode](https://qrsnapper.appspot.com), но я жду исправить на землю, что позволяет мне перейти на [холст](https://bugs.chromium.org/p/chromium/issues/detail?id=670977) или [ImageData](https://bugs.chromium.org/ p / chromium / issues / detail? id = 670975) в API.

Интересно то, что, поскольку я уже создал это приложение в простой JS, используя [LazarSoft jsqrcode API](https://github.com/LazarSoft/jsqrcode), я могу обнаружить доступность собственного сканирования штрих-кодов, и если его нет то я не вернусь к чистой реализации JS.

Вот несколько видеороликов в действии:

{{<youtube LGB0n-dW_HM>}}

{{<youtube Anq_N_SY17o>}}

Я не упоминал об этом в предыдущей статье, но это также должно работать на рабочем потоке (и, следовательно, внутри Работника службы). Для моего прецедента это блестяще, потому что это позволяет мне делегировать мою логику в другой поток и держать все в стороне от потока пользовательского интерфейса.

Я думаю, что это очень привлекательное дополнение к веб-платформе, и я очень рад, что это привыкает.