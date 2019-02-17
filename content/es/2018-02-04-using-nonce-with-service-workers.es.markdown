---
slug: using-nonce-with-service-workers
date: 2018-02-04T13:20:31+01:00
title: "Using CSP Nonces effectively with service worker"
tags: ['service worker', 'csp', 'security', 'google analytics']
description: "CSP nonce values can help you securely run inline content on you site. But it can 
be hard to get it working with Service Workers... until now."
---


En un [proyecto reciente](https://webgdedeck.com/), quería compartir la mayor cantidad de lógica posible entre el servidor, el trabajador del servicio y el cliente. El proyecto es esencialmente un simple lector de fuentes RSS, toma canales RSS, analiza los datos y los fusiona en un buen conjunto de columnas (al igual que TweetDeck), y también una única lista combinada.

Como tomo RSS y lo visualizo en mi página, necesito estar tan seguro como sea posible de que no está haciendo nada nefasto. Puedo desinfectar la información tanto como quiera, sin embargo, conozco mis propias capacidades, y estoy seguro de que la gente podría manipular una fuente RSS de tal manera que terminaría ejecutando scripts, importando imágenes o cualquier otra persona de la tercera parte. contexto de mi sitio.

La plataforma web ofrece la capacidad de bloquear un sitio a través de Content-Security-Policy (CSP). CSP puede bloquear las fuentes externas desde las que podemos solicitar contexto, como secuencias de comandos, estilos, imágenes, etc. Incluso puede bloquear la capacidad de una página para ejecutar scripts en línea, lo que puede evitar todos los tipos de ataques de XSS.

Fue bastante simple agregarlo a la aplicación.


```
`default-src 'self';`
```


Sin embargo ... tuve varios problemas.

1. Genero estilos en línea en la página y, por lo tanto, necesitaba ejecutar scripts en línea. 2. Necesitaba incluir Google Analytics que requiere que se ejecute un script en línea en la página.

CSP le permite ejecutar secuencias de comandos y estilos en línea al permitirle activar una opción llamada `insafe-eval` de scripts, sin embargo, esto pasa por alto las protecciones que ofrece CSP.

Para ejecutar scripts en línea y aún tener las protecciones de CSP, CSP ofrece un par de herramientas. El que yo usé se llama 'nonce'. El nonce es una identificación aleatoria que configura en el encabezado HTTP CSP y que concuerda con un script en línea asociado.

** Cadena CSP en el encabezado HTTP **


```
`default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-script-${nonce.analytics}'; connect-src 'self'; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'nonce-style-${nonce.style}'
```


** Script en línea usando nonce **


```html
<script src="https://www.googletagmanager.com/gtag/js?id=1111"></script>
<script nonce="script-{nonce.analytics}">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '{{=it.config.then(config=>config.site.googleAnalytics)}}');
</script>
```


El código anterior funciona bien y hace que sea sencillo hacer que las analíticas funcionen correctamente cuando estamos asegurando el sitio con CSP.

Para cada solicitud web, debe tener un valor exclusivo 'nonce' y lo hago a través del `{nonce.analytics}` que es un valor que genero en el servidor y lo aplico a través de una plantilla. Si reutiliza un valor nonce, el navegador se negará a ejecutar el contenido en el script.

Tuve un pequeño problema generando valores nonce. Necesitaba algo que creara un valor único que no sería reutilizado por el mismo usuario. Sentí que un valor nonce del formato '[fuente] - [fecha.hora + solicitud-recuento]' sería suficiente.

La 'fuente' me permite agregar un espacio de nombres al nonce, y date.now () + un recuento de solicitudes cada vez mayor me da un conjunto relativamente estable de valores no repetibles.

Genero el nonce usando la siguiente función:


```javascript
function generateIncrementalNonce(source) {
  let val = 0;
  let max = Math.pow(10, 3); // Date + pow 3 gets us close to max number;

  const generate = () => {
    let now = max * +new Date();
    if(val >= max) val = 0;
    else val++;
    return (source !== undefined ? source : '') + (now + val).toString();
  }

  return generate;
};
```


Se ve bien. Sin embargo, guardo en caché todas mis páginas en un trabajador de servicio, lo que significa que si simplemente sirvió el contenido de la memoria caché, los valores nonce se reutilizarán y, por lo tanto, no se ejecutarán.

Afortunadamente, comparto la lógica entre mi servidor y el trabajador de servicios, lo que me permite generar todo lo que necesito en un lugar central de mi código. Utilizo el parámetro 'fuente' en mi función `generateIncrementalNonce` para anteponer 'server' o 'service-worker' al valor nonce e hice esto en cada uno de los manejadores de solicitudes tanto en el servidor como en el técnico de servicio. El uso de este parámetro fuente significa que puedo garantizar que un valor nonce generado a través del servidor nunca choque con una página cargada a través del trabajador del servicio.

Este patrón me ha servido bien. Me ha permitido permitir los scripts en línea requeridos para Google Analytics y evitar que un tercero inyecte o ejecute código no confiable en mi página.

A continuación se muestra el código que utilicé en el proyecto. Hay una cantidad de lugares diferentes en mis páginas que necesito valores nonce, los genero para cada solicitud y luego los aplico a mi función de creación de plantillas y al encabezado HTTP al mismo tiempo.

#### common.js - lógica compartida


```javascript
function generateCSPPolicy(nonce) {
  return `default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-script-${nonce.analytics}'; connect-src 'self'; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'nonce-style-${nonce.style}' 'nonce-style-${nonce.inlinedcss}';`;
};

function generateIncrementalNonce(source) {
  let val = 0;
  let max = Math.pow(10, 3); // Date + pow 3 gets us close to max number;

  const generate = () => {
    let now = max * +new Date();
    if(val >= max) val = 0;
    else val++;
    return (source !== undefined ? source : '') + (now + val).toString();
  }

  return generate;
};
```


#### service-worker.js - gestor de búsqueda


```javascript
const generator = generateIncrementalNonce('service-worker');
let nonce = {
  analytics: generator(),
  inlinedcss: generator(),
  style: generator()
};

// Call the route handler with all data needed
let response = all(nonce, {
  dataPath: paths.dataPath,
  assetPath: paths.assetPath
}).then(r => setHeader(r, 'Content-Security-Policy', generateCSPPolicy(nonce)));;
e.respondWith(response);
```


#### server.js - controlador de solicitud


```javascript
const generator = generateIncrementalNonce('server');

let nonce = {
  analytics: generator(),
  inlinedcss: generator(),
  style: generator()
};

res.setHeader('Content-Security-Policy', generateCSPPolicy(nonce));

// Call the route handler with all data needed
all(nonce, {
      dataPath: `${paths.dataPath}${hostname}.`,
      assetPath: paths.assetPath 
    })
    .then(response => {
      node.responseToExpressStream(res, response.body)
    });
```