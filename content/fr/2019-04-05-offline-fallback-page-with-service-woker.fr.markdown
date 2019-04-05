---
slug: offline-fallback-page-with-service-worker
date: 2019-04-05T18:17:22.207Z
title: 'Offline fallback page with service worker'
link: 'https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/index.html:6:9'
tags: [links, pwa, offline]
---
Il y a des années, j&#39;ai effectué des recherches sur la manière dont les applications natives répondaient au manque de connectivité réseau. Bien que j&#39;ai perdu le lien avec l&#39;analyse (je pouvais jurer que c&#39;était sur Google+), le récit général était que de nombreuses applications natives sont inextricablement liées à Internet et refusent tout simplement de fonctionner. Cela ressemble à de nombreuses applications Web. Ce qui les différencie du Web, c’est que l’expérience était encore &quot;sur la marque&quot;. Bart Simpson vous dirait que vous devez être en ligne (par exemple), et pourtant Dans la grande majorité des expériences Web, vous obtenez un &#39;Dino&#39; (voir chrome: // dino).

Nous travaillons depuis longtemps sur Service Worker, et même si nous constatons que de plus en plus de sites ont des pages contrôlées par un technicien, la grande majorité des sites n’a même pas une expérience de repli de base lorsque le réseau n’est pas disponible. disponible.

J&#39;ai demandé à mon bon ami Jake si nous avions des idées quant à la manière de créer une page générique de repli, en partant du principe que vous ne souhaitiez pas créer une première expérience totalement hors ligne, et en 10 minutes, il l&#39;avait créée. [Check it out](https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/sw.js:6:9) .

Par souci de brièveté, j&#39;ai collé le code ci-dessous car il ne compte que 20 lignes environ. Il met en cache les ressources hors connexion. Ensuite, pour chaque extraction qui est une extraction de «navigation», il verra s&#39;il y a une erreur (à cause du réseau), puis restituera la page hors connexion à la place du contenu d&#39;origine.

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

C&#39;est tout. Lorsque l&#39;utilisateur est en ligne, il verra l&#39;expérience par défaut.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-woker.jpeg"></figure>

Et lorsque l&#39;utilisateur est hors ligne, il obtiendra la page de secours.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-worker-1.jpeg"></figure>

Je trouve ce script simple incroyablement puissant, et oui, même s’il peut encore être amélioré, j’estime que même un simple changement dans la manière dont nous parlons avec nos utilisateurs en cas de problème avec le réseau a la capacité de s’améliorer fondamentalement. la perception du Web pour les utilisateurs du monde entier.


