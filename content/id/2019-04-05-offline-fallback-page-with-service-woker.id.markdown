---
slug: offline-fallback-page-with-service-worker
date: 2019-04-05T18:17:22.207Z
title: 'Offline fallback page with service worker'
link: 'https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/index.html:6:9'
tags: [links, pwa, offline]
---
Bertahun-tahun yang lalu, saya melakukan riset tentang bagaimana aplikasi asli merespons kurangnya konektivitas jaringan. Sementara saya kehilangan tautan ke analisis (saya yakin itu ada di Google+), narasi menyeluruhnya adalah bahwa banyak aplikasi asli terkait dengan internet yang tidak dapat dipisahkan dari apa yang mereka tolak menolak untuk berfungsi. Kedengarannya seperti banyak aplikasi web, hal yang membedakannya dari web adalah bahwa pengalaman itu masih &#39;on-brand&#39;, Bart Simpson akan memberi tahu Anda bahwa Anda harus online (misalnya), namun untuk sebagian besar pengalaman web Anda mendapatkan &#39;Dino&#39; (lihat chrome: // dino).

Kami telah bekerja pada Pekerja Layanan untuk waktu yang lama sekarang, dan sementara kami melihat semakin banyak situs memiliki halaman yang dikontrol oleh Pekerja Layanan, sebagian besar situs bahkan tidak memiliki pengalaman dasar mundur ketika jaringan tidak tersedia.

Saya bertanya kepada teman baik saya, Jake, apakah kami memiliki petunjuk tentang cara membuat halaman cadangan umum dengan asumsi bahwa Anda tidak ingin membuat pengalaman yang sepenuhnya offline-pertama, dan dalam 10 menit dia telah membuatnya. [Check it out](https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/sw.js:6:9) .

Untuk singkatnya, saya telah menempelkan kode di bawah karena panjangnya hanya sekitar 20 baris. Itu cache aset offline, dan kemudian untuk setiap pengambilan yang merupakan &#39;navigasi&#39; mengambil itu akan melihat apakah itu kesalahan (karena jaringan) dan kemudian membuat halaman offline di tempat konten asli.

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

Itu semuanya. Ketika pengguna sedang online mereka akan melihat pengalaman default.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-worker-0.jpeg"></figure>

Dan ketika pengguna sedang offline, mereka akan mendapatkan halaman fallback.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-worker-1.jpeg"></figure>

Saya menemukan skrip sederhana ini sangat kuat, dan ya, sementara itu masih dapat ditingkatkan, saya percaya bahwa bahkan hanya perubahan sederhana dalam cara kami berbicara kepada pengguna kami ketika ada masalah dengan jaringan memiliki kemampuan untuk secara fundamental meningkatkan persepsi web untuk pengguna di seluruh dunia.

Pembaruan ** ** Jeffrey Posnick kinldy mengingatkan saya tentang penggunaan Navigasi Preload agar tidak harus menunggu boot SW untuk semua permintaan, ini sangat penting jika Anda hanya mengendalikan permintaan jaringan _failed_.
