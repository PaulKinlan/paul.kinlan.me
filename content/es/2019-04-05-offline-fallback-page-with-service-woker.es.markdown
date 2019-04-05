---
slug: offline-fallback-page-with-service-worker
date: 2019-04-05T18:17:22.207Z
title: 'Offline fallback page with service worker'
link: 'https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/index.html:6:9'
tags: [links, pwa, offline]
---
Hace años, hice una investigación sobre cómo las aplicaciones nativas respondían a una falta de conectividad de red. Si bien he perdido el enlace al análisis (podría jurar que estaba en Google+), la narrativa general fue que muchas aplicaciones nativas están inextricablemente ligadas a Internet y que simplemente se niegan a funcionar. Suena como una gran cantidad de aplicaciones web, aunque lo que los diferencia de la web es que la experiencia fue &quot;de marca&quot;, Bart Simpson le diría que necesita estar en línea (por ejemplo), y aún así para el La gran mayoría de las experiencias web te dan un &#39;Dino&#39; (ver chrome: // dino).

Hemos estado trabajando en Service Worker durante mucho tiempo, y mientras vemos que cada vez más sitios tienen páginas controladas por un Service Worker, la gran mayoría de los sitios ni siquiera tienen una experiencia de respaldo básica cuando la red no está disponible.

Le pregunté a mi buen amigo Jake si tenemos alguna duda sobre cómo construir una página de respaldo genérica suponiendo que no desea crear una experiencia totalmente fuera de línea, y en 10 minutos lo había creado. [Check it out](https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/sw.js:6:9) .

Para mayor brevedad, he pegado el código a continuación porque solo tiene unas 20 líneas. Almacena en caché los recursos fuera de línea, y luego, por cada captura que es una búsqueda de &#39;navegación&#39;, verá si se produce un error (debido a la red) y luego representa la página fuera de línea en lugar del contenido original.

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

Eso es todo. Cuando el usuario está en línea, verá la experiencia predeterminada.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-woker.jpeg"></figure>

Y cuando el usuario está fuera de línea, obtendrán la página alternativa.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-worker-1.jpeg"></figure>

Considero que este simple script es increíblemente poderoso, y sí, aunque aún se puede mejorar, creo que incluso un simple cambio en la forma en que hablamos con nuestros usuarios cuando hay un problema con la red tiene la capacidad de mejorar fundamentalmente La percepción de la web para los usuarios de todo el mundo.


