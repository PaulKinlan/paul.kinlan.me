---
slug: file-web-share-target
date: 2019-02-15T15:52:03.183Z
title: 'File Web Share Target'
tags: [share, intents]
---

Webアプリがアプリの世界で効果的に競争するためには、アプリが期待されるすべての場所に統合される必要があるとよく言われます。インターアプリの通信は、Webプラットフォームの主要な不足している作品の一つであり、具体的には最後の主要な不足している機能の一つは、ネイティブレベルの共有です:Webアプリケーションが取得できるようにする必要があり[data out of their silo](/unintended-silos/)や他のウェブサイトやアプリへの。他のネイティブアプリやサイトからデータを受信できるようにする必要もあります。

File Share Target APIは、現在Chrome Canaryに含まれているAPIの変革者です。 APIは[Web Share Target API](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md)を拡張して、アプリやサイトが単純なリンクやテキストをWebサイトに共有し、それらをシステム共有機能に統合することを可能にします。

この非常に静的なファイルブログはWeb Share Target APIを利用しているので、私はすぐに[share links](/web-share-target-api/)に興味があることをあらゆるAndroidアプリケーションから、そして先週の[I enabled the File Share Target API so that I can upload images to my blog directly from the Camera app on Android](/testing-file-share-target-from-camera/)から見つけることができます。この記事は、私がどのようにしてそれを行ったかについてのものです（そして、Jake Archibaldからのコードをいくつか盗みました - 彼がWORDS2に行っている統合に関する多くのバグを[squoosh.app](https://squoosh.app/)ました）

[File Share Target API](https://wicg.github.io/web-share-target/level-2/#example-3-manifest-webmanifest)は完全にプログレッシブであるという点で非常に斬新なAPIです。アプリケーションがForm `POST`要求を処理できる場合は、このAPIと簡単に統合できます。基本的な流れは次のとおりです。ユーザーがネイティブピッカーからアプリケーションを選択すると、ChromeはForm `POST`リクエストをサーバーに送信します。それを使用するのはサービス担当者またはサーバー上の処理です。

Webアプリケーションにファイルを共有するためのサポートを追加するには、2つのことを行う必要があります。

1.マニフェストファイルを介してファイルを共有するためのサポートを宣言します`POST` .サービスワーカーでフォーム`POST`要求を処理します。

マニフェストは、ホストシステムからWebアプリケーションへの共有のマッピング方法をホストシステムに宣言します。以下のマニフェストでは、基本的に「ユーザーが &#39;image / *&#39;タイプのファイルを共有する場合は &#39;/ share / image /&#39;に対してForm POSTリクエストを行い、データに &#39;file&#39;という名前を付けます。

* manifest.json *
```JSON
{
  "name": "Blog: Share Image",
  "short_name": "Blog: Share Image",
  "start_url": "/share/image/",
  "theme_color": "#000000",
  "background_color": "#000000",
  "icons": [ {
      "sizes": "192x192",
      "src": "/images/me.png",
      "type": "image/png"
  }],
  "share_target": {
    "action": "/share/image/",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "files": [
        {
          "name": "file",
          "accept": ["image/*"]
        }
      ]
    }
  },
  "display": "standalone",
  "scope": "/share/"
}
```

ユーザーがWebアプリケーションを共有すると、ChromeはファイルデータをペイロードとしてサイトにWeb要求を送信します。

1）高速であること、2）利用できないネットワークに対して回復力があるように、サービスワーカー内でPOSTリクエストを処理することをお勧めします。次のようにしてこれを行うことができます。

* serviceworker.js * - [demo](/share/image/sw.js)

```Javascript
onfetch = async (event) => {
  if (event.request.method !== 'POST') return;
  if (event.request.url.startsWith('https://paul.kinlan.me/share/image/') === false) return;

  /* This is to fix the issue Jake found */
  event.respondWith(Response.redirect('/share/image/'));
  
  event.waitUntil(async function () {
    const data = await event.request.formData();
    const client = await self.clients.get(event.resultingClientId || event.clientId);
    // Get the data from the named element 'file'
    const file = data.get('file');

    console.log('file', file);
    client.postMessage({ file, action: 'load-image' });
  }());
};
```

上記で起こっている興味深いことがいくつかあります。

*リダイレクトを実行して、 `POST`要求の結果としてUIをレンダリングします。
* `event.request.formData()`介してフォームを介して送信されたデータを読む
*開いているウィンドウにデータを送信します（これが最初の時点でユーザーをリダイレクトしたUIになります）。

サービスワーカーに投稿されたデータをどうするかはあなた次第ですが、私のアプリの場合はUIで直接表示する必要があるので、ユーザーが使用しているウィンドウと`postMessage`を見つける必要があり`postMessage`そこにデータ。

* index.html * - [demo](/share/image/index.html)

```Javascript
navigator.serviceWorker.onmessage = (event) => {
  console.log(event);
  imageBlob = event.data.file;
  // Update the UI with the data that has been shared to it.
  imageShare.src = URL.createObjectURL(imageBlob);
};
```

そしてそれはそれについてです。 Webフォーム用のAPIエンドポイントがすでにある場合は、これはシンプルで強力な追加機能であり、サイトに追加できます。

Web Share Target APIは、Webアプリケーションがホストプラットフォームに持っていたもう1つの障壁を打破する、非常に強力なプラットフォームプリミティブです。