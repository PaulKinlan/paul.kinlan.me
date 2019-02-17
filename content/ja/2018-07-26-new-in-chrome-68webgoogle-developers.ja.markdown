---
slug: new-in-chrome-68webgoogle-developers
date: 2018-07-26T22:46:46.011Z
title: 'Add to homescreen changes in Chrome 68 - Pete LePage'
link: https://developers.google.com/web/updates/2018/07/nic68
tags: [links, pwa, a2hs]
---
Pete LePageは、Chromeのホーム画面に追加するという重要な変更について書きます

> ## Add to Home Screen changes
> If your site meets the add to home screen criteria, Chrome will no longer show the add to home screen banner. Instead, you&#x2019;re in control over when and how to prompt the user.
> 
> To prompt the user, listen for the `beforeinstallprompt` event, then, save the event and add a button or other UI element to your app to indicate it can be installed.


[全文を読む](https://developers.google.com/web/updates/2018/07/nic68)

多くの人が `beforeinstallprompt`イベントを処理していないので、Web APKのインストール数が急激に減少することを意味していたため、これは元々気になりましたが、実際には正しいことだと思います。

目標はWeb上で起こっている迷惑なプロンプトの数を減らすことです。業界で最後に必要となるのは、ユーザーがPWAをインストールしたいと思ったときに表示される比較的大きなプロンプトです。あなたがいつどこで**あなたがインストールを促すかを考えて、あなたはユーザージェスチャーに応じてそれをしなければなりません。

きちんとしたことは、私たち（Chrome）が、体験をインストールできることをユーザーに知らせるためのより多くの周囲の方法を導入していることです。最初の負荷に現れる小さなボトムバーです。ユーザーに行動を起こせることを知らせるより微妙な方法。
