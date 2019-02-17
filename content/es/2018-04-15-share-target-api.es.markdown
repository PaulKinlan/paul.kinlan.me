---
slug: web-share-target-api
date: 2018-04-15T13:20:31+01:00
title: "Web Share Target API"
tags: ['pwa', 'intents', 'web intents']
description: "Share Target API is now in Chrome breaking down one of the last silos of native platforms"
---


Me preocupa constantemente que en la plataforma web creamos [silos no deseados](/unintended-silos) al dificultar la entrada y salida de datos de sitios web y aplicaciones, y lo que es más importante, me preocupa que los datos solo fluyan en una dirección: desde el web a las aplicaciones, porque las aplicaciones pueden estar en todos los lugares que los usuarios esperan que estén en sus dispositivos.

Estuve muy contento de que Chrome haya comenzado a trabajar [en la API de Web Share Target](/breaking-down-silos-with-share-target-api) que complementa el trabajo en [navigator.share](/navigator.share). Donde `navigator.share` le permite compartir información desde su sitio web a cualquier aplicación en el dispositivo de los usuarios que pueda recibir 'shares' (` Intent.ACTION_SEND` en el lenguaje de Android), Web Share Target le permite a su sitio web (o PWA) ) diga 'Yo también quiero jugar en ese juego'.

Estoy muy contento de decir que este trabajo ahora está disponible en Chrome Canary para Android.

La API de Web Share Target es una pequeña API que usted define en su Manifiesto de aplicación web. Si alguna vez ha usado `registerProtocolHandler` verá que no está a un millón de millas de distancia & mdash; usted define una plantilla de URL que tiene un número de variables que serán sustituidas cuando el usuario invoca la acción.

Primero crea una propiedad 'objeto' llamada `share_target` que contiene una propiedad llamada` url_template` que tiene la ruta que debe abrirse cuando el usuario elige nuestro servicio. En Android, puede usar los tres nombres de sustitución llamados: * `{title}` - Equivelent to `.title` en la API de navigator.share, o` Intent.EXTRA_SUBJECT` de un Android Intent. * `{text}` - Equivalente a `.text` en la API navigator.share, o` Intent.EXTRA_TEXT` de una intención de Android. * `{url}` - Equivalente a `.url` en la API de navigator.share, o los datos sin procesar de un Intento de Android.

Puede intentarlo hoy instalando [PWA de Twitter](https://mobile.twitter.com/). [El manifiesto de Twitter está abajo](https://mobile.twitter.com/manifest.json):


```javascript
{
    ...
    "name": "Twitter Lite",
    "share_target": {
        "url_template": "compose/tweet?title={title}&text={text}&url={url}"
    },
    ...
}
```


En este momento hay algunas limitaciones:

* Solo puedes tener uno por manifiesto, lo que significa que en el caso de Twitter no pueden tener un 'Compartir en DM'. * Hay algunas extensiones propuestas, como un evento de trabajador de servicio llamado `navigator.actions` que se activará sin tener que abrir una interfaz de usuario, pero aún no se han implementado. * Solo puede compartir "texto", lo que significa que si desea compartir una cantidad de datos, debe guardarlos con una URL que luego se compartirá. * Solo funciona en Android. * Debe tener instalado el PWA, por lo que no puede hacer un disco registrando un objetivo compartido. Cuando Chrome genera una "Web APK" ahora mira el `share_target` para ver si debe registrar el` `intent-filter> nativo. * Todavía no está estandarizado como parte de la especificación de manifiesto. : / oh - y también [podría cambiar](https://github.com/w3ctag/design-reviews/issues/221#issuecomment-376717885).

Limitaciones aparte, esta es una adición bastante sorprendente a la plataforma web que es el comienzo de romper las enormes barreras que tiene la web con respecto a la integración en las plataformas de host.

Si desea realizar un seguimiento de las actualizaciones de esta API, consulte [Estado de Chrome](https://www.chromestatus.com/feature/5662315307335680).
