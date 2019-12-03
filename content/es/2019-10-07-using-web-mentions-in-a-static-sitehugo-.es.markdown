---
slug: using-web-mentions-in-a-static-sitehugo-
date: 2019-10-07T20:11:30.489Z
title: 'Using Web Mentions in a static site (Hugo)'
link: ''
tags: [webmentions, hugo]
---

Mi blog es un sitio completamente estático, construido con Hugo y alojado con Zeit. Esta es una gran solución para mí, un blog simple tiene un proceso de implementación bastante simple y se carga increíblemente rápido.

Los sitios generados estáticamente tienen algunos inconvenientes, el más grande es cuando necesita algo dinámico para integrarse en su página (comentarios, por ejemplo). No poder alojar fácilmente contenido dinámico significará que terminará confiando en JavaScript de terceros que luego tendrá acceso completo a su página y no sabrá lo que está haciendo: podría estar rastreando a sus usuarios o ralentizando su página carga.

Recientemente, retiré mi widget de comentarios actual (Disqus) de la ruta crítica de renderización cargándolo solo cuando el usuario se desplaza a los comentarios (usando `IntersectionObserver` ) y aunque esta era una solución razonable para el rendimiento de carga y los problemas de seguimiento, realmente quería eliminar Disqus todos juntos.

Ingrese la especificación [Webmention](https://webmention.net/draft/) . Webmention es una especificación que describe cómo se puede contactar al autor de un sitio cuando otro sitio &#39;menciona&#39; (o le gusta) el contenido de su sitio. En última instancia, esto permite un método descentralizado para descubrir contenido que se vincule a su sitio, con la esperanza de proporcionar valor e información.

La especificación de webmention no describe ningún formato de datos que deba usarse para comunicar lo que ha dicho el &quot;sitio de mención&quot;, que se deja analizar mediante microformatos estándar u otros mecanismos para comprender el contenido de la página. Esto es genial, sin embargo, creo que conduce a servicios centralizados como [webmention.io](https://webmention.io/) proporciona la infraestructura necesaria para obtener el significado de la página.

Me gustó la idea de usar Webmention, pero requiere una configuración del lado del servidor para recibir (y posiblemente almacenar) notificaciones de cuando alguien menciona su sitio, esto no siempre es posible con un generador estático como el que tengo en mi sitio. El resto de esta publicación describirá rápidamente cómo obtuve Me gusta, menciones y reposts alojados en mi Zeit Hosted Build de Hugo.

### Paso uno: encuentre un centro de menciones web

Encontré webmention.io y funciona. Maneja los pingbacks y menciones entrantes, también validará que el sitio que realiza la llamada realmente se esté vinculando a su contenido y finalmente analizará los datos fuera de la página para que tenga una cierta comprensión del contexto.

Webmention.io validará que usted es el propietario del sitio a través de un proceso de autenticación abierto (estaba ordenado, busca rel = me que apunta a un proveedor de autenticación)

### Paso dos: diga a las páginas que puede manejar menciones

Esto es tan simple como agregar las dos siguientes etiquetas `link`

```html
<link rel="webmention" href="https://webmention.io/paul.kinlan.me/webmention">
<link rel="pingback" href="https://webmention.io/paul.kinlan.me/xmlrpc">
```

### Paso tres: integre la API webmention.io en su sitio

Tiene dos opciones aquí, puede agregar un widget a su página que llamará a la API webmention.io, o puede integrar la API webmention.io en su paso de compilación. Me gustaría tener la menor cantidad posible de JS alojados por terceros, así que elegí este último. Integré webmenciones en mi proceso de implementación.

Uso a Hugo porque la construcción es rápida, y con eso en mente, tuve que encontrar la manera de integrar la API de webmention en Hugo de una manera óptima. La restricción difícil era no llamar al punto final de la API para cada página de mi sitio, tengo muchas páginas y todavía no hay muchos comentarios.

Afortunadamente, el sitio Webmention.io proporciona un punto final útil que le permitirá recibir todas las menciones para su dominio. Lo desafortunado es que este archivo contiene una entrada por cada acción que se haya realizado contra su sitio.

Hugo también tiene la noción de archivos de datos que se pueden extraer directamente en la plantilla para cualquier página, por lo que debe asignar el archivo de datos de Webmention a una nueva estructura que facilite la lectura dentro de una plantilla de Hugo.

El proceso que elegí está a continuación, pero el resumen es que convierto la matriz de una lista de acciones en un diccionario de URL que contienen las acciones expuestas por la API (como, volver a publicar y responder), y el paso final es entonces divida el diccionario de URL en archivos individuales que se denominan hash md5 de la url.

```javascript
"use strict";

const fs = require('fs');
const fetch = require('node-fetch');
const md5 = require('md5');

const processMentionsJson = (data) => {
  const urlData = {};
  data.children.forEach(item => {
    const wmProperty = item["wm-property"];
    const url = item[wmProperty];

    if(url in urlData === false) urlData[url] = {};
    const urlDataItem = urlData[url];

    if(wmProperty in urlDataItem === false) urlDataItem[wmProperty] = [];
    urlDataItem[wmProperty].push(item);
  });

  console.log(urlData);

  // For each URL in the blog we now have a JSON stucture that has all the like, mentions and reposts
  if(fs.existsSync('./data') === false) fs.mkdirSync('./data');
  Object.keys(urlData).forEach(key => {
    const item = urlData[key];
    const md5url = md5(key);
    console.log(key, md5url)
    fs.writeFileSync(`./data/${md5url}.json`, JSON.stringify(item));
  });
}

(async () => {
  const mentionsUrl = new URL(process.argv[2]); // Fail hard if it's not a uRL

  const mentionsResponse = await fetch(mentionsUrl);
  const mentiosnJson = await mentionsResponse.json();

  processMentionsJson(mentiosnJson);
})();
```

Una vez que los datos se analizan y guardan correctamente, es un proceso rápido de configuración de la plantilla para que pueda leerse en el atributo Datos de la plantilla.

```html
{{ $urlized := .Page.Permalink | md5 }}
{{ if index .Site.Data $urlized }}
  {{ $likes := index (index .Site.Data $urlized) "like-of" }}
  {{ $replys := index (index .Site.Data $urlized) "in-reply-to" }}
  {{ $reposts := index (index .Site.Data $urlized) "repost-of"}}
  <h4>Likes</h4>
  {{ range $i, $like := $likes }}
    <a href="{{$like.url}}"><img src="{{ $like.author.photo}}" alt="{{ $like.author.name }}" class="profile photo"></a>
  {{end}}

  <h4>Reposts</h4>
  {{ range $i, $repost := $reposts }}
    <a href="{{$repost.url}}"><img src="{{ $repost.author.photo}}" alt="{{ $repost.author.name }}" class="profile photo"></a>
  {{end}}

  <h4>Comments and Replies</h4>
  {{ range $i, $reply := $replys }}
    <a href="{{$reply.url}}"><img src="{{ $reply.author.photo}}" alt="{{ $reply.author.name }}" class="profile photo"></a>
  {{end}}
{{end}}
```

Si todo va bien, debería ver algunos iconos en la parte inferior de la página que son personas reales que interactúan con el sitio.

### Paso 4: publique el sitio cuando se produzcan comentarios

Si bien los pasos anteriores me permitirán agregar las menciones y presentarlas en la salida de los sitios, todavía tengo que asegurarme de que el sitio se reconstruya regularmente para que los comentarios aparezcan públicamente.

Elegí usar un servicio cron simple que llamará a la API de implementación de Zeit para forzar una redistribución del sitio cada hora más o menos.
