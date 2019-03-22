---
slug: object-detection-and-augmentation
date: 2019-03-11T20:32:18.307Z
title: 'Object Detection and Augmentation'
link: 'https://github.com/jeeliz/jeelizFaceFilter/blob/master/README.md#features'
tags: [links, qrcode, shapedetection]
---
私はChromeで[Shape Detection API](https://paul.kinlan.me/face-detection/ https://paul.kinlan.me/barcode-detection/ https://paul.kinlan.me/detecting-text-in-an-image/)てきましたが、その可能性を本当に気に入っています。たとえば、非常に単純な[QRCode detector](https://qrsnapper.com)にはJSポリフィルがありますが、 `new BarcodeDetector()` APIが使用可能な場合

形状検出APIの他の機能、 [Face Detection](https://paul.kinlan.me/face-detection/) 、 [Barcode Detection](https://paul.kinlan.me/barcode-detection/) 、および[Text Detection](https://paul.kinlan.me/detecting-text-in-an-image/)を使用してここで作成した他のデモをいくつか見ることができます。

私が偶然見つけたとき、私は驚きました[Jeeliz](https://jeeliz.com)週末に、私は彼らのツールキットのパフォーマンスに非常に感銘を受けました-付与された私はPixel3 XLを使用していたが、顔の検出がで可能であるものよりも大幅に速く見えた`FaceDetector` API。

[Checkout some of their demos](https://jeeliz.com/sunglasses) 。

<figure>
  <img src="/images/2019-03-11-object-detection-and-augmentation.jpeg">
</figure>

私はたくさん考えました。このオブジェクト検出用のツールキット（およびそれに類するもの）は、Web上で広く利用可能なAPI、特にカメラアクセス、WebGL、およびWASMを使用します。 ）豊富なエクスペリエンスを簡単に構築し、すべてのプラットフォームにわたって一貫したエクスペリエンスを持つ何十億ものユーザーに到達するために使用できます。

増強はそれが面白くなるところ（そして実際に私がこの記事で紹介したいもの）であり、そしてあなたが今プラットフォームに来ているミドルウェアライブラリを必要とするところで、私達はMASSIVEアプリをインストールせずに楽しいsnapchat-esqueフェイスフィルターアプリを構築できますこれは、ユーザーのデバイスから大量のデータを収集します（システムへの根本的なアクセスがないため）。

楽しいデモ以外では、次のように非常に高度なユースケースをすばやく簡単に解決できます。

*カメラから直接テキスト選択、またはユーザーからの写真
*カメラからの言語のライブ翻訳
*インラインQRコード検出機能なので、WeChatを常時開く必要はありません:)
*画像からWebサイトのURLまたはアドレスを自動抽出する
*クレジットカードの検出と番号抽出（より早くあなたのサイトにサインアップするユーザーを取得する）
あなたの店のウェブアプリで*ビジュアル商品検索。
あなたの店のWebアプリでより多くの製品の詳細については*バーコードルックアップ
*プロフィール写真を人の顔にすばやくトリミング。
*シンプルなA11Yは、ユーザーが画像にあるテキストを聞くことができるようにします。

私はたった5分でこれらのユースケースについて考えました - もっとたくさんあることを私は知っています - しかし私達はカメラを利用している多くのサイトやウェブアプリを見ていないことを襲ったユーザーがアプリをダウンロードする必要があります。これ以上行う必要はないと思います。

**最新情報**私たちのチームのThomas Steinerが私たちのチームチャットで、私は現在の`ShapeDetection` APIが好きではないように`ShapeDetection` 。このAPIがそれぞれのシステムそれぞれのネイティブ出荷実装へのアクセスを提供するという事実を私は気に入っていますが、 [The Lumpy Web](/the-lumpy-web/)で書いた[The Lumpy Web](/the-lumpy-web/) 、Web開発者はプラットフォームの一貫性を切望し、要約すると:

1. APIはChromeにのみあります
2. ChromeのAPIは、基盤となる実装が異なるため、プラットフォームごとに大きく異なります。 Androidには、口や目など、macOSにアウトラインがあるランドマーク用のポイントしかありません。 Androidでは、 `TextDetector`は検出されたテキストを返し、MacOSの場合は「テキストの存在」インジケータを返します。これは、Surmaが見つけたすべてのバグについて言及していないことです。

配布のためのプラットフォームとしてのウェブはこれらの経験にとってとても意味があるのでやりたくないと思いますが、上記の2つの問題のグループはすべての機能を長期にわたって実装する必要があることに疑問を投げかけます。 WebGL、WASM、そして将来のWeb GPUなど、今日のプラットフォームの機能を使用して出荷されるパッケージに優れたソリューションを実装することができれば、ネイティブなWebプラットフォーム。

とにかく、私たちがウェブ上でこれを行うことができるという事実が大好きです。