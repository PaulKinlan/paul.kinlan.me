---
slug: file-web-share-target
date: 2019-02-15T15:52:03.183Z
title: 'File Web Share Target'
tags: [share, intents]
---

Con frecuencia he dicho que para que las aplicaciones web puedan competir de manera efectiva en el mundo de las aplicaciones, deben integrarse en todos los lugares en los que los usuarios esperan que estén. La comunicación entre aplicaciones es una de las piezas faltantes más importantes de la plataforma web, y específicamente una de las últimas características faltantes más importantes es el uso compartido a nivel nativo: las aplicaciones web deben poder obtener [data out of their silo](/unintended-silos/) y otros sitios web y aplicaciones; también deben poder recibir los datos de otras aplicaciones y sitios nativos.

El API File Share Target es un cambio de juego de un API que ahora se encuentra en Chrome Canary. La API extiende el [Web Share Target API](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md) que permite que las aplicaciones y los sitios compartan enlaces y texto simples a los sitios web al integrarlos en la funcionalidad de compartir sistemas.

Este blog de archivos muy estáticos utiliza la API Web Share Target, por lo que puedo [share links](/web-share-target-api/) rápidamente, [share links](/web-share-target-api/) que me parece interesante desde cualquier aplicación de Android, y hasta la semana pasada [I enabled the File Share Target API so that I can upload images to my blog directly from the Camera app on Android](/testing-file-share-target-from-camera/) . Esta publicación trata sobre cómo lo hice (y le robé un código a Jake Archibald, aunque resolvió muchos de los errores de una integración que están haciendo en [squoosh.app](https://squoosh.app/) ).

[File Share Target API](https://wicg.github.io/web-share-target/level-2/#example-3-manifest-webmanifest) es una API muy novedosa porque es completamente progresiva. Si su aplicación puede manejar solicitudes del Formulario `POST` entonces puede integrarse fácilmente con esta API. El flujo básico es: cuando el usuario elige su aplicación del selector nativo, Chrome enviará una solicitud de Formulario `POST` a su servidor, depende de usted lo que haga con ella (manejar un trabajador de servicio o en el servidor).

Para agregar soporte para compartir archivos en su aplicación web, necesita hacer dos cosas:

1. Declare el soporte para compartir archivos a través del archivo de manifiesto, 2. Maneje la solicitud del formulario `POST` en su trabajador de servicio.

El manifiesto declara al sistema host cómo debe asignarse el uso compartido de la aplicación host a la aplicación web. En el siguiente manifiesto, básicamente dice &quot;Cuando un usuario comparte un archivo del tipo &#39;imagen / *&#39;, realice una solicitud de Formulario POST para &#39;/ compartir / imagen /&#39; y nombre el archivo &#39;datos&#39;&quot;.

* manifest.json *
```JSON
{
  "name": "Blog: Share Image",
  "short_name": "Blog: Share Image",
  "start_url": "/share/image/",
  "theme_color": "#000000",
  "background_color": "#000000",
  "icons": [ {
      "sizes": "192x192",
      "src": "/images/me.png",
      "type": "image/png"
  }],
  "share_target": {
    "action": "/share/image/",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "files": [
        {
          "name": "file",
          "accept": ["image/*"]
        }
      ]
    }
  },
  "display": "standalone",
  "scope": "/share/"
}
```

Una vez que el usuario comparte su aplicación web, Chrome realizará la solicitud web a su sitio con los datos del archivo como carga útil.

Se recomienda que maneje la solicitud POST dentro de su trabajador de servicio para que 1) sea rápida, 2) resistente a la red que no está disponible. Puede hacerlo de la siguiente manera:

* serviceworker.js * - [demo](/share/image/sw.js)

```Javascript
onfetch = async (event) => {
  if (event.request.method !== 'POST') return;
  if (event.request.url.startsWith('https://paul.kinlan.me/share/image/') === false) return;

  /* This is to fix the issue Jake found */
  event.respondWith(Response.redirect('/share/image/'));
  
  event.waitUntil(async function () {
    const data = await event.request.formData();
    const client = await self.clients.get(event.resultingClientId || event.clientId);
    // Get the data from the named element 'file'
    const file = data.get('file');

    console.log('file', file);
    client.postMessage({ file, action: 'load-image' });
  }());
};
```

Hay un par de cosas interesantes que suceden arriba, que pueden resumirse rápidamente como:

* Renderice la IU como resultado de la solicitud de `POST` realizando una redirección.
* Lea los datos que se envían a través del formulario a través de `event.request.formData()`
* Envíe los datos a la ventana abierta (esta será la IU a la que redirigimos al usuario en el primer punto).

Es totalmente de usted lo que hacer con los datos que han sido escritos a su trabajador de servicio, pero en el caso de mi aplicación Me necesitaba mostrar directamente en la interfaz de usuario, así que tengo que encontrar la ventana está utilizando el usuario y `postMessage` los datos allí.

* index.html * - [demo](/share/image/index.html)

```Javascript
navigator.serviceWorker.onmessage = (event) => {
  console.log(event);
  imageBlob = event.data.file;
  // Update the UI with the data that has been shared to it.
  imageShare.src = URL.createObjectURL(imageBlob);
};
```

Y eso es todo. Si ya tiene un punto final de API para sus formularios web, entonces esta es una adición simple pero poderosa que puede realizar en su sitio.

El Web Share Target API es una primitiva plataforma increíblemente poderosa que rompe otra barrera que las aplicaciones web han tenido en sus plataformas host.