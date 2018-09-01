---
slug: web-share-target-api
date: 2018-04-15T13:20:31+01:00
title: "Web Share Target API"
tags: ['pwa', 'intents', 'web intents']
description: "Share Target API is now in Chrome breaking down one of the last silos of native platforms"
---


私は常にWebプラットフォーム上で、Webサイトやアプリケーションにデータを出し入れすることを困難にすることで、[意図しないサイロ](意図しないサイロ)を作り出していると心配しています。 ：ウェブからアプリまで、アプリはユーザーが自分のデバイス上にいると期待している場所にすべて存在することがあるからです。

私はChromeが[navigator.share](/ navigator.share)の作業を補完する[Web共有ターゲットAPI上で動作するようになりました](/ブレークダウンサイロと共有ターゲットのapi)ことに非常に満足しています。 `navigator.share`はあなたのウェブサイトからの情報を、あなたのウェブサイト（またはAndroidの言葉では` Intent.ACTION_SEND`）を受け取ることができるユーザーのデバイス上のどのアプリケーションとも共有できる場所で、Web Share TargetはWebサイト）私はそのゲームでもプレーしたいと言っています。

私はこの作品がAndroidのChrome Canaryで利用できるようになったと非常にうれしく思います。

Web Share Target APIは、Web App Manifestで定義する小さなAPIです。 `registerProtocolHandler`を使用したことがあるなら、それが100万マイル離れた場所ではないことがわかります。ユーザーがアクションを呼び出すときに置換される多数の変数を持つURLテンプレートを定義します。

最初に、ユーザがサービスを選択したときに開くべきパスを持つ `url_template`という1つのプロパティを含む` share_target`という名前の 'オブジェクト'プロパティを作成します。 Androidでは、* `{title}`という3つの置換名を使うことができます。これはnavigator.share APIで `.title`、Android Intentから` Intent.EXTRA_SUBJECT`です。 * `{text}`  -  navigator.share APIの `.text`やAndroid Intentの` Intent.EXTRA_TEXT`に相当します。 * `{url}`  -  navigator.share APIの `.url`やAndroid Intentの生データに相当します。

あなたは[TwitterのPWA](https://mobile.twitter.com/)をインストールすることで、これを今日試すことができます。 [Twitterのマニフェストは以下です](https://mobile.twitter.com/manifest.json)：


```javascript
{
    ...
    "name": "Twitter Lite",
    "share_target": {
        "url_template": "compose/tweet?title={title}&text={text}&url={url}"
    },
    ...
}
```


今、いくつかの制限があります：

*マニフェストごとに1つしか設定できません。これは、Twitterのケースでは、「DMと共有する」ことができないことを意味します。 * UIサーフェイスを開かなくても起動される `navigator.actions`というサービスワーカーイベントなど、いくつかの拡張が提案されていますが、まだ実装されていません。 *あなたは「テキスト」を共有することができます。つまり、データのBlobを共有したい場合は、共有するURLを保存する必要があります。 * Android上でのみ動作します。 * PWAをインストールしておく必要があるため、共有ターゲットを登録してドライブを実行することはできません。 Chromeが 'Web APK'を生成すると、 `share_target`を参照して、ネイティブ` <intent-filter> 'を登録する必要があるかどうかを確認します。 *マニフェスト仕様の一部としてまだ標準化されていません。 ：/ああ - それはまた変わるかもしれない（https://github.com/w3ctag/design-reviews/issues/221#issuecomment-376717885）。

これ以外にも制限はありませんが、これはWebプラットフォームにとって非常に驚くべきものです。これは、Webがホストプラットフォーム上での統合に関して持っている巨大な障壁を打破することの始まりです。

このAPIの更新をトラッキングする場合は、[Chromeステータス](https://www.chromestatus.com/feature/5662315307335680)をご覧ください。
