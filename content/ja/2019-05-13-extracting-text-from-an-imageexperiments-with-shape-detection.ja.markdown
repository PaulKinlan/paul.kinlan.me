---
slug: extracting-text-from-an-imageexperiments-with-shape-detection
date: 2019-05-13T12:39:45.039Z
title: 'Extracting text from an image: Experiments with Shape Detection'
link: 'https://copy-image-text.glitch.me/'
tags: [links, shape detection, pwa, intent, lumpy]
---
Google IOの後に少しダウンタイムがあり、長期にわたるかゆみを掻きたいと思いました。ブラウザの画像内に保持されているテキストをコピーしたいだけです。以上です。誰にとっても素晴らしい機能になると思います。

Chromeに機能を直接追加するのは簡単ではありませんが、Androidのインテントシステムを利用できることはわかっています。Web（または少なくともAndroidのChrome）でそれを実行できるようになりました。

二つの新しいWebプラットフォームへの追加-共有ターゲットレベル2（または私はそれが共有ファイルを呼び出すために好きなように）と`TextDetector`形状検出APIで- [have allowed me to build a utility that I can Share images to and get the text held inside them](https://copy-image-text.glitch.me/) 。

基本的な実装は比較的単純で、Service Workerで共有ターゲットとハンドラーを作成し、ユーザーが共有したイメージを`TextDetector`したら、 `TextDetector`を実行します。

`Share Target API`使用すると、Webアプリケーションをネイティブ共有サブシステムの一部にすることができます。この場合、次のように`Web App Manifest`内で宣言することにより、すべての`image/*`タイプを処理するように登録できます。

```javascript
"share_target": {
  "action": "/index.html",
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
}
```

PWAをインストールすると、次のように、画像を共有するすべての場所でPWAが表示されます。

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-0.jpeg"></figure>

`Share Target` APIは、共有ファイルをフォームポストのように扱います。ファイルがWebアプリと共有されると、サービスワーカーがアクティブになり、ファイルデータを使用して`fetch`ハンドラーが呼び出されます。現在、データはService Worker内にありますが、現在のウィンドウで必要になります。処理できるように、サービスはどのウィンドウがリクエストを呼び出したかを知っているので、クライアントを簡単にターゲットにしてデータを送信できます。

```javascript
self.addEventListener('fetch', event => {
  if (event.request.method === 'POST') {
    event.respondWith(Response.redirect('/index.html'));
    event.waitUntil(async function () {
      const data = await event.request.formData();
      const client = await self.clients.get(event.resultingClientId || event.clientId);
      const file = data.get('file');
      client.postMessage({ file, action: 'load-image' });
    }());
    
    return;
  }
  ...
  ...
}

```

画像がユーザーインターフェイスに表示されたら、テキスト検出APIで処理します。

```javascript
navigator.serviceWorker.onmessage = (event) => {  
  const file = event.data.file;
  const imgEl = document.getElementById('img');
  const outputEl = document.getElementById('output');
  const objUrl = URL.createObjectURL(file);
  imgEl.src = objUrl;
  imgEl.onload = () => {
    const texts = await textDetector.detect(imgEl);
    texts.forEach(text => {
      const textEl = document.createElement('p');
      textEl.textContent = text.rawValue;
      outputEl.appendChild(textEl);
    });
  };
  ...
};
```

最大の問題は、ブラウザが画像を自然に回転させないことです（以下を参照）。ShapeDetection APIでは、テキストを正しい読み方向にする必要があります。

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-1.jpeg"></figure>

かなり使いやすい[EXIF-Js library](https://github.com/exif-js/exif-js)を使用して回転を検出し、基本的なキャンバス操作を行って画像の向きを変更しました。

```javascript
EXIF.getData(imgEl, async function() {
  // http://sylvana.net/jpegcrop/exif_orientation.html
  const orientation = EXIF.getTag(this, 'Orientation');
  const [width, height] = (orientation > 4) 
                  ? [ imgEl.naturalWidth, imgEl.naturalHeight ]
                  : [ imgEl.naturalHeight, imgEl.naturalWidth ];

  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  // We have to get the correct orientation for the image
  // See also https://stackoverflow.com/questions/20600800/js-client-side-exif-orientation-rotate-and-mirror-jpeg-images
  switch(orientation) {
    case 2: context.transform(-1, 0, 0, 1, width, 0); break;
    case 3: context.transform(-1, 0, 0, -1, width, height); break;
    case 4: context.transform(1, 0, 0, -1, 0, height); break;
    case 5: context.transform(0, 1, 1, 0, 0, 0); break;
    case 6: context.transform(0, 1, -1, 0, height, 0); break;
    case 7: context.transform(0, -1, -1, 0, height, width); break;
    case 8: context.transform(0, -1, 1, 0, 0, width); break;
  }
  context.drawImage(imgEl, 0, 0);
}
```

そして出来事、あなたがアプリに画像を共有する場合、それは画像を回転させてから、それを見つけて見つけたテキストの出力を返します。

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-2.jpeg"></figure>

この小さな実験を作成するのは信じられないほど楽しかったです、そして、それは私にとってすぐに役に立ちました。ただし、 [inconsistency of the web platform](/the-lumpy-web/)強調表示し[inconsistency of the web platform](/the-lumpy-web/) 。これらのAPIはすべてのブラウザで利用できるわけではなく、Chromeのすべてのバージョンで利用できるわけでもありません-つまり、この記事を書いているChrome OSではアプリを使用できませんが、同時に使用できるのです... OMG、とてもクール。

