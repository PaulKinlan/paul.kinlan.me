---
slug: barcode-detection
date: 2016-12-05
title: "Barcode detection using Shape Detection API"
tags: ['api', 'javascript', 'shape-detection', 'qrcode']
---


もう1週間、ChromeのCanaryチャンネルにある[Shape API経由の顔検出](/ face-detection /)についてお話しました。現在、バーコードの検出はChrome Canaryでも行われています（[Miguel](https://twitter.com/yellowdoge)は私のヒーローです）;

バーコードは巨大です！彼らは我々が購入するほとんどすべての製品にあります。多くの悪意を持った[QRコードは、米国とヨーロッパ以外の国でも巨大である](https://www.clickz.com/why-have-qr-codes-taken-off-in-china/23662/)。バーコードとQRコードは、メディアとあなたとの間で少量のデータを転送することによって、物理世界とデジタル世界をつなぐ簡単な方法を提供します。これはデスクトップの時代には莫大な量の使用ではないかもしれませんが、モバイルの時代にはそれは重要です。このデータにアクセスするためだけにアプリをインストールする必要はありません。

シェイプ検出APIは、ユーザーのデバイスの下にあるハードウェア機能の上に標準インタフェースを作成し、主に顔検出とバーコード検出という新しい機能セットをWebプラットフォームに開くため、面白いです。

バーコード検出APIは、現在[WICG](https://github.com/)にある[Shape Detection API](https://wicg.github.io/shape-detection-api/#introduction)に基づいています。 wicg /）は、インキュベーションおよび実験段階にあることを意味する。 [Androidではさまざまな1Dおよび2Dのバーコードを検出できます](https://developers.google.com/vision/barcodes-overview)バーコード：

> 1D barcodes: EAN-13, EAN-8, UPC-A, UPC-E, Code-39, Code-93, Code-128, ITF,
> Codabar
>
> 2D barcodes: QR Code, Data Matrix, PDF-417, AZTEC


さらに：

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


Shape Detection APIは現在Chrome Canary（M57）にあり、 `chrome：// flags /＃enable-experimental-web-platform-features`で有効にする必要があります

顔検出と同様に、APIは比較的簡単に使用できます。 `BarcodeDetector` APIで` detect`を使ってAPIを呼び出すと、デコードされたバーコードのリストに戻るという約束を得ることができます。


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


イメージオブジェクト（CanvasImageSource、Blob、ImageDataまたは ` <img> `Element）に渡し、それを基底のシステムAPIに渡します。そして` DetectedObject`を実装する `DetectedBarcode`オブジェクトの配列を返します。これは本質的に画像の各面の境界を与えます。

また、私の[QRCode Scanner Application](https://qrsnapper.appspot.com)にも（https://github.com/PaulKinlan/qrcode/commit/21afa9ae4c316e4a8ced76d77f41eda2eb92852b）それを統合しましたが、私はそれを待っています[Canvas](https://bugs.chromium.org/p/chromium/issues/detail?id=670977)または[ImageData](https://bugs.chromium.org/)で渡すことができます。 p / chromium / issues / detail？id = 670975）オブジェクトをAPIに追加します。

興味深いのは、私が[LazarSoft jsqrcode API](https://github.com/LazarSoft/jsqrcode)を使用してプレーンJSでこのアプリケーションを構築しているため、ネイティブのバーコードスキャンの可用性を検出でき、私は純粋なJSの実装に失敗します。

実際のビデオは次のとおりです。

{{<youtube LGB0n-dW_HM>}}

{{<youtube Anq_N_SY17o>}}

前回の記事では触れませんでしたが、これはワーカースレッド（および結果的にサービスワーカー）内でも機能するはずです。私のユースケースでは、これは私のロジックを別のスレッドに委譲し、すべてをUIスレッドから離しておくことができるので、素晴らしいです。

私はそれがウェブプラットフォームにとって非常に魅力的なものだと思うし、これが使われるのを見ることに興奮している。