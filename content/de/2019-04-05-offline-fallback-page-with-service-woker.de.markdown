---
slug: offline-fallback-page-with-service-worker
date: 2019-04-05T18:17:22.207Z
title: 'Offline fallback page with service worker'
link: 'https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/index.html:6:9'
tags: [links, pwa, offline]
---
Vor einigen Jahren habe ich untersucht, wie native Anwendungen auf mangelnde Netzwerkkonnektivität reagierten. Ich habe zwar den Link zur Analyse verloren (ich könnte schwören, dass es auf Google+ war), die übergeordnete Erzählung lautete jedoch, dass viele native Anwendungen unlösbar mit dem Internet verbunden sind, dass sie einfach nicht funktionieren. Klingt nach einer Menge Web - Apps, was sie jedoch vom Web abhebt, ist, dass die Erfahrung immer noch &quot;on - brand&quot; ist. Bart Simpson würde Ihnen sagen, dass Sie online sein müssen (zum Beispiel) und trotzdem für das Internet Bei der Mehrzahl der Web-Erlebnisse erhalten Sie einen &#39;Dino&#39; (siehe Chrom: // Dino).

Wir arbeiten schon lange an Service Worker, und während immer mehr Sites von einem Service Worker kontrollierte Seiten haben, hat die überwiegende Mehrheit der Sites nicht einmal ein grundlegendes Fallback-Erlebnis, wenn das Netzwerk dies nicht tut verfügbar.

Ich fragte meinen guten Kumpel Jake, ob wir irgendwelche Anhaltspunkte dafür haben, wie man eine generische Fall-Back-Seite erstellt, unter der Annahme, dass man keine vollständig erste Offline-Erfahrung erstellen möchte, und innerhalb von 10 Minuten hatte er sie erstellt. [Check it out](https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/sw.js:6:9) .

Der Einfachheit halber habe ich den Code unten eingefügt, da er nur etwa 20 Zeilen lang ist. Es speichert die Offline-Assets zwischen, und dann wird bei jedem Abruf, der eine &quot;Navigation&quot; ist, der Abruf sehen, ob Fehler auftreten (aufgrund des Netzwerks), und dann die Offline-Seite anstelle des ursprünglichen Inhalts gerendert.

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

Das ist alles. Wenn der Benutzer online ist, wird die Standardeinstellung angezeigt.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-worker-0.jpeg"></figure>

Wenn der Benutzer offline ist, erhält er die Fallback-Seite.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-worker-1.jpeg"></figure>

Ich finde dieses einfache Skript unglaublich mächtig und ja, obwohl es immer noch verbessert werden kann, glaube ich, dass selbst eine einfache Änderung in der Art und Weise, wie wir mit unseren Benutzern sprechen, wenn ein Problem mit dem Netzwerk vorliegt, die Möglichkeit hat, sich grundlegend zu verbessern die Wahrnehmung des Webs für Benutzer auf der ganzen Welt.

** Update ** Jeffrey Posnick erinnerte mich an die Verwendung von Navigation Preload, um nicht auf alle SW-Boot-Vorgänge warten zu müssen. Dies ist besonders wichtig, wenn Sie nur _failed_-Netzwerkanforderungen steuern.
