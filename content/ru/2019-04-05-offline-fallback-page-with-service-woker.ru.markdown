---
slug: offline-fallback-page-with-service-worker
date: 2019-04-05T18:17:22.207Z
title: 'Offline fallback page with service worker'
link: 'https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/index.html:6:9'
tags: [links, pwa, offline]
---
Несколько лет назад я провел некоторое исследование того, как нативные приложения реагировали на отсутствие сетевого подключения. Хотя я потерял ссылку на анализ (могу поклясться, что это было в Google+), всеобъемлющим повествованием было то, что многие нативные приложения неразрывно связаны с Интернетом, и они просто отказываются работать. Похоже, что многие веб-приложения отличаются от веба тем, что этот опыт все еще остается «фирменным», Барт Симпсон скажет вам, что вам нужно быть онлайн (например), и все же для В подавляющем большинстве случаев вы получаете «Dino» (см. chrome: // dino).

Мы работаем над Service Worker в течение долгого времени, и, хотя мы видим, что все больше и больше сайтов имеют страницы, контролируемые Service Worker, подавляющее большинство сайтов даже не имеют базового варианта восстановления, когда сеть не работает. имеется в наличии.

Я спросил моего хорошего друга Джейка, есть ли у нас какие-либо рекомендации о том, как создать общую резервную страницу при условии, что вы не хотите создавать полностью автономный первый опыт, и в течение 10 минут он его создал. [Check it out](https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/sw.js:6:9) .

Для краткости, я вставил код ниже, потому что он всего около 20 строк. Он кэширует автономные ресурсы, а затем для каждой выборки, которая является «навигационной» выборкой, он увидит ошибки (из-за сети) и затем отобразит автономную страницу вместо исходного содержимого.

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

Это все. Когда пользователь онлайн, он увидит опыт по умолчанию.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-woker.jpeg"></figure>

И когда пользователь не в сети, он получит запасную страницу.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-worker-1.jpeg"></figure>

Я считаю этот простой сценарий невероятно мощным, и да, хотя он еще может быть улучшен, я верю, что даже простое изменение в том, как мы говорим с нашими пользователями, когда есть проблема с сетью, способно существенно улучшить восприятие Интернета для пользователей по всему миру.


