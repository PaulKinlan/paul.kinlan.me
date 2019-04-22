---
slug: offline-fallback-page-with-service-worker
date: 2019-04-05T18:17:22.207Z
title: 'Offline fallback page with service worker'
link: 'https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/index.html:6:9'
tags: [links, pwa, offline]
---
ਕਈ ਸਾਲ ਪਹਿਲਾਂ, ਮੈਂ ਖੋਜ ਵਿੱਚ ਕੁਝ ਖੋਜਾਂ ਕੀਤੀਆਂ ਕਿ ਨੈਟਵਰਕ ਕਨੈਕਟੀਵਿਟੀ ਦੀ ਕਮੀ ਵਿੱਚ ਮੂਲ ਕਾਰਜਾਂ ਨੇ ਕਿਵੇਂ ਜਵਾਬ ਦਿੱਤਾ. ਹਾਲਾਂਕਿ ਮੈਂ ਵਿਸ਼ਲੇਸ਼ਣ ਦੀ ਕੜੀ (ਮੈਂ ਗੁੰਮ ਸਕਦਾ ਹਾਂ ਕਿ ਇਹ Google+ ਵਿੱਚ ਹੈ) ਨੂੰ ਖਤਮ ਕਰ ਦਿੱਤਾ ਹੈ, ਬਹੁਤ ਜ਼ਿਆਦਾ ਵਿਆਖਿਆ ਕੀਤੀ ਗਈ ਸੀ ਕਿ ਬਹੁਤ ਸਾਰੇ ਸਥਾਨਕ ਅਨੁਪ੍ਰਯੋਗਾਂ ਨੂੰ ਅਸਾਧਾਰਣ ਤੌਰ ਤੇ ਇੰਟਰਨੈਟ ਨਾਲ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ ਕਿ ਉਹ ਸਿੱਧੇ ਕੰਮ ਕਰਨ ਤੋਂ ਇਨਕਾਰ ਕਰਦੇ ਹਨ ਬਹੁਤ ਸਾਰੇ ਵੈਬ ਐਪਸ ਦੀ ਆਵਾਜ਼ ਆਉਂਦੀ ਹੈ, ਉਹ ਚੀਜ ਜੋ ਉਹਨਾਂ ਨੂੰ ਵੈਬ ਤੋਂ ਅਲੱਗ ਕਰਦੀ ਹੈ ਹਾਲਾਂਕਿ ਇਹ ਅਨੁਭਵ ਅਜੇ ਵੀ &#39;ਆਨ-ਬ੍ਰਾਂਡ&#39; ਹੈ, Bart Simpson ਤੁਹਾਨੂੰ ਦੱਸੇਗਾ ਕਿ ਤੁਹਾਨੂੰ ਆਨਲਾਈਨ (ਉਦਾਹਰਨ ਲਈ) ਹੋਣ ਦੀ ਜ਼ਰੂਰਤ ਹੈ, ਅਤੇ ਅਜੇ ਤੱਕ ਵੱਡੀ ਗਿਣਤੀ ਦੇ ਵੈਬ ਦੇ ਅਨੁਭਵ ਤੁਹਾਨੂੰ &#39;ਡਿਨੋ&#39; (ਵੇਖੋ chrome: // dino) ਮਿਲਦੇ ਹਨ.

ਅਸੀਂ ਹੁਣ ਬਹੁਤ ਦੇਰ ਲਈ ਸੇਵਾ ਵਰਕਰ ਤੇ ਕੰਮ ਕਰ ਰਹੇ ਹਾਂ, ਅਤੇ ਜਦੋਂ ਅਸੀਂ ਦੇਖ ਰਹੇ ਹਾਂ ਕਿ ਜ਼ਿਆਦਾ ਤੋਂ ਜ਼ਿਆਦਾ ਸਾਈਟਾਂ ਕੋਲ ਇੱਕ ਸੇਵਾ ਵਰਕਰ ਦੁਆਰਾ ਨਿਯੰਤਰਿਤ ਕੀਤੇ ਪੇਜ ਹਨ, ਤਾਂ ਜ਼ਿਆਦਾਤਰ ਸਾਈਟਾਂ ਦੇ ਕੋਲ ਬੁਨਿਆਦੀ ਫ਼ਾਲਬੈਕ ਅਨੁਭਵ ਨਹੀਂ ਹੁੰਦਾ ਜਦੋਂ ਨੈਟਵਰਕ ਨਹੀਂ ਹੁੰਦਾ ਉਪਲੱਬਧ.

ਮੈਂ ਆਪਣੇ ਚੰਗੇ ਚਾਮ ਜੇਕ ਨੂੰ ਕਿਹਾ ਕਿ ਜੇ ਸਾਡੇ ਕੋਲ ਧਾਰਨਾ ਹੈ ਕਿ ਤੁਸੀਂ ਇੱਕ ਪੂਰੀ ਤਰ੍ਹਾਂ ਆਫਲਾਈਨ-ਪਹਿਲਾ ਅਨੁਭਵ ਨਹੀਂ ਬਣਾਉਣਾ ਚਾਹੁੰਦੇ, ਅਤੇ 10 ਮਿੰਟ ਦੇ ਅੰਦਰ ਉਸ ਨੇ ਇਸ ਨੂੰ ਬਣਾਇਆ ਹੈ ਤਾਂ ਆਮ ਪੱਧਰਾ ਪੰਨੇ ਨੂੰ ਕਿਵੇਂ ਬਣਾਇਆ ਜਾਵੇ ਬਾਰੇ ਕੋਈ ਸਾਵਧਾਨ ਹੈ. [Check it out](https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/sw.js:6:9)

ਸੰਖੇਪਤਾ ਲਈ, ਮੈਂ ਹੇਠਾਂ ਦਿੱਤੇ ਕੋਡ ਨੂੰ ਪੇਸਟ ਕਰ ਦਿੱਤਾ ਹੈ ਕਿਉਂਕਿ ਇਹ ਕੇਵਲ 20 ਲਾਈਨਾਂ ਦੀ ਲੰਬਾਈ ਹੈ ਇਹ ਆਫਲਾਇਨ ਅਸਟੇਟ ਕੈਚ ਕਰਦਾ ਹੈ, ਅਤੇ ਫੇਰ ਇਸ ਨੂੰ &#39;ਨੇਵੀਗੇਸ਼ਨ&#39; ਲਿਆਉਣ ਵਾਲੀ ਹਰੇਕ ਫੈਲਾਈ ਲਈ ਇਹ ਦੇਖਣ ਜਾਵੇਗਾ ਕਿ ਕੀ ਇਹ ਗਲਤੀਆਂ (ਨੈਟਵਰਕ ਦੇ ਕਾਰਨ) ਅਤੇ ਫਿਰ ਔਫਲਾਈਨ ਪੇਜ਼ ਅਸਲੀ ਸਮਗਰੀ ਦੇ ਸਥਾਨ ਦੇ ਰੂਪ ਵਿੱਚ ਪੇਸ਼ ਕਰਦਾ ਹੈ.

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

ਬਸ ਇੰਨਾ ਹੀ. ਜਦੋਂ ਉਪਭੋਗਤਾ ਔਨਲਾਈਨ ਹੁੰਦਾ ਹੈ ਤਾਂ ਉਹ ਡਿਫੌਲਟ ਅਨੁਭਵ ਦੇਖਣਗੇ.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-worker-0.jpeg"></figure>

ਅਤੇ ਜਦੋਂ ਉਪਭੋਗਤਾ ਔਫਲਾਈਨ ਹੁੰਦਾ ਹੈ, ਤਾਂ ਉਹ ਫਾਲਬੈਕ ਪੰਨਾ ਪ੍ਰਾਪਤ ਕਰਨਗੇ.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-worker-1.jpeg"></figure>

ਮੈਨੂੰ ਇਹ ਸਧਾਰਨ ਸਕਰਿਪਟ ਬਹੁਤ ਸ਼ਕਤੀਸ਼ਾਲੀ ਅਤੇ ਹਾਂ, ਜਦੋਂ ਵੀ ਇਸ ਵਿੱਚ ਸੁਧਾਰ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ, ਮੈਂ ਇਹ ਮੰਨਦਾ ਹਾਂ ਕਿ ਜਦੋਂ ਵੀ ਸਾਡੇ ਨੈੱਟਵਰਕ ਨਾਲ ਕੋਈ ਮੁੱਦਾ ਹੁੰਦਾ ਹੈ ਤਾਂ ਸਾਡੇ ਦੁਆਰਾ ਸਾਡੇ ਬੋਲਣ ਦੇ ਢੰਗ ਵਿੱਚ ਵੀ ਇੱਕ ਸਧਾਰਨ ਤਬਦੀਲੀ ਹੁੰਦੀ ਹੈ ਜਿਸ ਵਿੱਚ ਮੂਲ ਵਿੱਚ ਸੁਧਾਰ ਕਰਨ ਦੀ ਸਮਰੱਥਾ ਹੈ ਸਾਰੇ ਸੰਸਾਰ ਭਰ ਦੇ ਉਪਭੋਗਤਾਵਾਂ ਲਈ ਵੈਬ ਦੀ ਧਾਰਨਾ

** ਅੱਪਡੇਟ ** ਜੈਫਰੀ ਪੋਜਨੀਕ ਨੇ ਮੈਨੂੰ ਨੈਵੀਗੇਸ਼ਨ ਪ੍ਰੀਲਡ ਦੀ ਵਰਤੋਂ ਕਰਨ ਬਾਰੇ ਯਾਦ ਦਿਵਾਇਆ ਹੈ ਤਾਂ ਜੋ ਸਾਰੀਆਂ ਬੇਨਤੀਆਂ ਲਈ SW ਬੂਟ ਦੀ ਉਡੀਕ ਨਾ ਕੀਤੀ ਜਾ ਸਕੇ, ਇਹ ਖਾਸ ਤੌਰ &#39;ਤੇ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜੇਕਰ ਤੁਸੀਂ ਸਿਰਫ _ਫਾਇਲ_ ਨੈੱਟਵਰਕ ਬੇਨਤੀਆਂ ਤੇ ਕਾਬੂ ਕਰ ਰਹੇ ਹੋ
