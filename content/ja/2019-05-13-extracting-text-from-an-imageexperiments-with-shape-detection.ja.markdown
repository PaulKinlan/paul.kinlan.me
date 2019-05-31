---
slug: extracting-text-from-an-imageexperiments-with-shape-detection
date: 2019-05-13T12:39:45.039Z
title: 'Extracting text from an image: Experiments with Shape Detection'
link: 'https://copy-image-text.glitch.me/'
tags: [links, shape detection, pwa, intent, lumpy]
---
私はGoogle IOの後少し休止時間がありました、そして私は私が持っていた長期のかゆみをかいたいです。ブラウザの画像の中にあるテキストをコピーできるようにしたいだけです。それがすべてです。私はそれが皆のためのきちんとした機能であろうと思います。

Chromeに機能を直接追加するのは簡単ではありませんが、Androidのインテントシステムを利用できることはわかっています。現在はWeb（または少なくともAndroidのChrome）を使用してこれを実行できます。

二つの新しいWebプラットフォームへの追加-共有ターゲットレベル2（または私はそれが共有ファイルを呼び出すために好きなように）と`TextDetector`形状検出APIで- [have allowed me to build a utility that I can Share images to and get the text held inside them](https://copy-image-text.glitch.me/) 。

基本的な実装は比較的簡単で、Service Workerで共有ターゲットとハンドラーを作成してから、ユーザーが共有したイメージを`TextDetector`したらそれ`TextDetector`を実行します。

`Share Target API`使用すると、Webアプリケーションをネイティブ共有サブシステムの一部にすることができます。この場合は、次のように`Web App Manifest`内で宣言することで、すべての`image/*`タイプを処理するように登録できます。

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

あなたのPWAがインストールされると、あなたは以下のようにあなたがから画像を共有するすべての場所でそれを見るでしょう:

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-0.jpeg"></figure>

`Share Target` APIは、共有ファイルをフォーム投稿のように扱います。ファイルがWebアプリケーションと共有されると、サービスワーカーがアクティブになり、 `fetch`ハンドラーがファイルデータと共に呼び出されます。データはService Worker内にありますが、処理できるように現在のウィンドウに必要です。サービスはどのウィンドウが要求を呼び出したのかを知っているので、クライアントをターゲットにしてデータを送信できます。

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

画像がユーザーインターフェイスに表示されたら、テキスト検出APIを使用して処理します。

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

最大の問題は、ブラウザが自然に画像を回転させないことです（下記参照）、そしてShape Detection APIはテキストを正しい読み方にする必要があります。

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-1.jpeg"></figure>

私は回転を検出するためにかなり使いやすい[EXIF-Js library](https://github.com/exif-js/exif-js)を使用して、それから画像を再配置するためにいくつかの基本的なキャンバス操作をします。

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

そして、もしあなたが画像をアプリと共有するならば、それは画像を回転させ、それからそれを分析してそれが見つけたテキストの出力を返すでしょう。

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-2.jpeg"></figure>

この小さな実験を作成するのは非常に楽しかったです、そしてそれは私にとってすぐに役に立ちました。ただし、 [inconsistency of the web platform](/the-lumpy-web/)は強調表示されてい[inconsistency of the web platform](/the-lumpy-web/) 。これらのAPIはすべてのブラウザで利用できるわけではなく、すべてのバージョンのChromeでも利用できるわけでもありません。 ... OMG、とてもクール。

