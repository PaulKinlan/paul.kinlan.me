---
slug: offline-fallback-page-with-service-worker
date: 2019-04-05T18:17:22.207Z
title: 'Offline fallback page with service worker'
link: 'https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/index.html:6:9'
tags: [links, pwa, offline]
---
何年も前に、ネイティブアプリケーションがネットワーク接続の欠如にどのように対応したかについて調査しました。私は分析へのリンクを失いましたが（Google+にあったと誓うことができます）、多くのネイティブアプリケーションはインターネットに密接に結びついているため、まっすぐ機能しないことがわかりました。多くのWebアプリのように思えますが、それらはWebとは一線を画したものですが、その経験はまだ「オンブランド」であったということですが、Bart Simpsonはあなたがオンラインである必要があると語っています。ほとんどのWebエクスペリエンスでは、「Dino」が表示されます（chrome:// dinoを参照）。

Service Workerには長い間取り組んできましたが、Service Workerによってページが制御されるサイトがますます増えている一方で、ネットワークが機能していないときには、ほとんどのサイトで基本的なフォールバックエクスペリエンスさえ得られません。利用可能です。

私は、私が私達にあなたが完全にオフラインで最初の経験を作りたくないという仮定の上で一般的なフォールバックページを構築する方法についてのガイダンスがあるかどうか、そして彼がそれを作った10分以内に私の良い友達Jakeに尋ねた。 [Check it out](https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/sw.js:6:9) 。

説明を簡潔にするために、コードの長さは約20行にすぎないので、以下に貼り付けました。オフラインアセットをキャッシュし、「ナビゲーション」フェッチであるすべてのフェッチについて、エラーが発生したかどうか（ネットワークのため）を確認してから、元のコンテンツの代わりにオフラインページをレンダリングします。

```JavaScript
addEventListener('install', (event) => ; {
  event.waitUntil(async function() {
    const cache = await caches.open('static-v1');
    await cache.addAll(['offline.html', 'styles.css']);
  }());
});

addEventListener('fetch', (event) => {
  const { request } = event;

  // Always bypass for range requests, due to browser bugs
  if (request.headers.has('range')) return;
  event.respondWith(async function() {
    // Try to get from the cache:
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    try {
      // Otherwise, get from the network
      return await fetch(request);
    } catch (err) {
      // If this was a navigation, show the offline page:
      if (request.mode === 'navigate') {
        return caches.match('offline.html');
      }

      // Otherwise throw
      throw err;
    }
  }());
});
```

それがすべてです。ユーザーがオンラインのときは、デフォルトのエクスペリエンスが表示されます。

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-woker.jpeg"></figure>

また、ユーザーがオフラインのときは、フォールバックページが表示されます。

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-worker-1.jpeg"></figure>

私はこの単純なスクリプトが信じられないほど強力であることに気付きました、そして、それはまだ改善することができますが、ネットワークに問題があるときにユーザーに話す方法の単純な変更でさえ根本的に改善する能力があると思います世界中のユーザーに対するWebの認識。


