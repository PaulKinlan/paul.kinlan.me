---
slug: debugging-web-pages-on-the-nokia-8110-with-kaios
date: 2019-03-21T21:41:53.555Z
title: 'Debugging Web Pages on the Nokia 8110 with KaiOS'
link: ''
tags: [links, kaios, debugging, firefox]
---
私たちは最近フィーチャーフォンで多くの開発をしてきました、そしてそれは大変でしたが、楽しいです。最も難しいのは、KaiOS上で、特に私たちが持っているハードウェア上で、Webページをデバッグすることが不可能であることがわかったということです（The Nokia 8110）。ノキアは素晴らしいデバイスです、それは私たちが知っているKaiOSで造られますそれはFirefox 48に似た何かに基づいています、しかしそれはロックされています、簡単にWebIDE。

2、3のブログを読むことと、 `adb`について少し知っていることの組み合わせを通して、私はそれをする方法を`adb`ました。他の人がそれを行うことができたかもしれないことに注意してください、しかしそれは一箇所に明確に文書化されていません。

<figure>
  <img src="/images/2019-03-21-debugging-web-pages-on-the-nokia-8110-with-kaios.jpeg">
</figure>

（上の画像はDevToolsとスクリーンショットツールの出力を示しています）

手順は次のとおりです。

1. USBケーブルを接続します。メインマシンに`adb`インストールされていることを確認してください。
[Firefox 48](https://archive.mozilla.org/pub/firefox/releases/48.0.2/)コピーをダウンロードする
3.携帯電話から`*#*#33284#*#*`入力して「開発者モード」を有効にします（ダイヤラは使用しないでください）。画面上部に小さな「バグ」アイコンが表示されます。 [[Source](https://groups.google.com/forum/#!topic/bananahackers/MIpcrSXTRBk) ]
4. USBケーブルを取り付けます
5.開発マシン上で以下のコマンドを実行します。
1. `adb start-server`
あなたの電話が接続されていることを確認するための`adb devices` 。
3. `adb forward tcp:6000 localfilesystem:/data/local/debugger-socket`これはあなたのマシンから電話のソケットへのチャンネルを設定します。これがWeb IDEが使用するものです。
6. Firefoxを`Web IDE`を起動し、[ツール]、[Web IDE]の`Web IDE`します。
7. Web IDEが開きます。[Remote Runtime]をクリックし、[localhost:6000]の[開く]ボタンをクリックします（これはTCP転送ポートです）。
8.電話でページを開くと、左側に表示されます。ほら。
