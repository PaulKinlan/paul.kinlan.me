---
slug: offline-fallback-page-with-service-worker
date: 2019-04-05T18:17:22.207Z
title: 'Offline fallback page with service worker'
link: 'https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/index.html:6:9'
tags: [links, pwa, offline]
---
Vor einigen Jahren habe ich recherchiert, wie native Anwendungen auf fehlende Netzwerkkonnektivität reagierten. Ich habe zwar den Link zur Analyse verloren (ich könnte schwören, dass es auf Google+ war), die übergeordnete Erzählung lautete jedoch, dass viele native Anwendungen unlösbar an das Internet gebunden sind, dass sie einfach nicht funktionieren. Klingt nach einer Menge von Web - Apps, was sie jedoch vom Web abhebt, ist, dass die Erfahrung immer noch &quot;on - brand&quot; ist. Bart Simpson würde Ihnen sagen, dass Sie online sein müssen (zum Beispiel) und trotzdem für die Bei der Mehrheit der Web-Erlebnisse erhalten Sie einen &#39;Dino&#39; (siehe Chrom: // Dino).

Wir arbeiten seit langem an Service Worker, und während immer mehr Sites von einem Service Worker kontrollierte Seiten haben, hat die überwiegende Mehrheit der Sites nicht einmal ein grundlegendes Fallback-Erlebnis, wenn das Netzwerk dies nicht tut verfügbar.

Ich habe meinen guten Kumpel Jake gefragt, ob wir irgendwelche Anhaltspunkte dafür haben, wie man eine generische Fallback-Seite aufbaut, in der Annahme, dass man keine vollständig erste Offline-Erfahrung erstellen möchte. Innerhalb von 10 Minuten hatte er sie erstellt. [Check it out](https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/sw.js:6:9) .

Der Kürze halber habe ich den Code unten eingefügt, da er nur etwa 20 Zeilen lang ist. Es speichert die Offline-Assets zwischen, und dann wird bei jedem Abruf, der eine &quot;Navigation&quot; ist, der Abruf sehen, ob Fehler auftreten (aufgrund des Netzwerks), und dann die Offline-Seite anstelle des ursprünglichen Inhalts gerendert.

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

Das ist alles. Wenn der Benutzer online ist, wird die Standardeinstellung angezeigt.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-woker.jpeg"></figure>

Und wenn der Benutzer offline ist, erhält er die Fallback-Seite.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-worker-1.jpeg"></figure>

Ich finde dieses einfache Skript unglaublich mächtig und ja, obwohl es immer noch verbessert werden kann, glaube ich, dass selbst eine einfache Änderung in der Art und Weise, wie wir mit unseren Benutzern sprechen, wenn es Probleme mit dem Netzwerk gibt, die Fähigkeit hat, sich grundlegend zu verbessern die Wahrnehmung des Webs für Benutzer auf der ganzen Welt.


