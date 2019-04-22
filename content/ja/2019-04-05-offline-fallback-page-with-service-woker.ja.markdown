---
slug: offline-fallback-page-with-service-worker
date: 2019-04-05T18:17:22.207Z
title: 'Offline fallback page with service worker'
link: 'https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/index.html:6:9'
tags: [links, pwa, offline]
---
何年も前に、ネイティブアプリケーションがネットワーク接続の欠如にどのように対応したかについて調査しました。私は分析へのリンクを失いましたが（Google+にあると誓うことができます）、多くのネイティブアプリケーションはインターネットに密接に結び付けられているため、機能を拒否することができます。多くのWebアプリのように思えますが、それらはWebとは一線を画したものですが、経験はまだ「オンブランド」であったということです。大部分のWebエクスペリエンスでは、「Dino」が表示されます（chrome:// dinoを参照）。

Service Workerには長い間取り組んできましたが、Service Workerによってページが制御されるサイトがますます増えている一方で、ネットワークが機能していないときには、ほとんどのサイトで基本的なフォールバックの経験がありません利用可能です。

私は私たちの良い友達Jakeに、あなたが完全にオフラインで最初のエクスペリエンスを作りたくないという仮定の下で一般的なフォールバックページをどのように作り上げるかについてのガイダンスがあるかと尋ねました。 [Check it out](https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/sw.js:6:9) 。

説明を簡潔にするために、コードの長さは約20行にすぎないので、以下に貼り付けました。オフラインアセットをキャッシュし、「ナビゲーション」フェッチであるすべてのフェッチについて、エラーが発生したかどうか（ネットワークが原因で）を確認し、元のコンテンツの代わりにオフラインページをレンダリングします。

```JavaScript
addEventListener('install', (event) => {
  event.waitUntil(async function() {
    const cache = await caches.open('static-v1');
    await cache.addAll(['offline.html', 'styles.css']);
  }());
});

// See https://developers.google.com/web/updates/2017/02/navigation-preload#activating_navigation_preload
addEventListener('activate', event => {
  event.waitUntil(async function() {
    // Feature-detect
    if (self.registration.navigationPreload) {
      // Enable navigation preloads!
      await self.registration.navigationPreload.enable();
    }
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
      // See https://developers.google.com/web/updates/2017/02/navigation-preload#using_the_preloaded_response
      const response = await event.preloadResponse;
      if (response) return response;

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

それがすべてです。ユーザーがオンラインのとき、彼らはデフォルトの経験を見るでしょう。

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-worker-0.jpeg"></figure>

ユーザーがオフラインのときは、フォールバックページが表示されます。

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-worker-1.jpeg"></figure>

私はこの単純なスクリプトが信じられないほど強力であることに気付きました、そして、それはまだ改善することができますが、ネットワークに問題があるときにユーザーに話す方法の単純な変更さえ根本的に改善する能力を持つ世界中のユーザーに対するWebの認識。

**更新** Jeffrey Posnick kinldyは、すべてのリクエストに対してSWの起動を待つ必要がないようにナビゲーションプリロードを使用することを思い出しました。これは、失敗したネットワークリクエストのみを制御している場合に特に重要です。
