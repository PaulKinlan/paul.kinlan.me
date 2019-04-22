---
slug: offline-fallback-page-with-service-worker
date: 2019-04-05T18:17:22.207Z
title: 'Offline fallback page with service worker'
link: 'https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/index.html:6:9'
tags: [links, pwa, offline]
---
Anos atrás, fiz algumas pesquisas sobre como os aplicativos nativos responderam à falta de conectividade de rede. Embora eu tenha perdido o link para a análise (eu poderia jurar que estava no Google+), a narrativa abrangente era que muitos aplicativos nativos estão inextricavelmente ligados à internet e que eles apenas se recusam a funcionar. Parece um monte de aplicativos web, o que os diferencia da web é que a experiência ainda era &#39;on-brand&#39;, Bart Simpson diria que você precisa estar online (por exemplo), e ainda para o Na grande maioria das experiências na web, você obtém um &#39;Dino&#39; (veja chrome: // dino).

Estamos trabalhando no Service Worker há muito tempo e, embora vejamos cada vez mais sites com páginas controladas por um Service Worker, a grande maioria dos sites nem sequer tem uma experiência básica de fallback quando a rede não é acessível.

Eu perguntei ao meu bom amigo, Jake, se temos alguma orientação sobre como construir uma página genérica de retorno, supondo que você não queira criar uma primeira experiência totalmente off-line, e em 10 minutos ele a criou. [Check it out](https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/sw.js:6:9) .

Para simplificar, colei o código abaixo porque ele tem apenas 20 linhas. Ele armazena em cache os ativos off-line e, para cada busca que é uma busca de &#39;navegação&#39;, ela verifica se há erros (por causa da rede) e, em seguida, renderiza a página off-line no lugar do conteúdo original.

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

Isso é tudo. Quando o usuário está online, ele verá a experiência padrão.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-worker-0.jpeg"></figure>

E quando o usuário estiver offline, ele receberá a página de fallback.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-worker-1.jpeg"></figure>

Eu acho este script simples incrivelmente poderoso, e sim, enquanto ele ainda pode ser melhorado, eu acredito que mesmo apenas uma simples mudança na maneira como falamos com nossos usuários quando há um problema com a rede tem a capacidade de melhorar fundamentalmente a percepção da web para usuários em todo o mundo.

** Atualização ** Jeffrey Posnick kinldy me lembrou sobre o uso do Pré-carregamento de Navegação para não ter que esperar pela inicialização do SW para todas as solicitações, isso é especialmente importante se você estiver controlando apenas solicitações de rede _failed_.
