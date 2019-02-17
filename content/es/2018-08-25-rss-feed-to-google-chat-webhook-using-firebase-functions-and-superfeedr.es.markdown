---
slug: rss-feed-to-google-chat-webhook-using-firebase-functions-and-superfeedr
date: 2018-08-25T16:16:29.749Z
title: 'RSS Feed to Google Chat Webhook using Cloud Functions for Firebase and Superfeedr'
link: https://github.com/PaulKinlan/superfeedr-to-chat
tags: [links,rss,firebase,superfeedr]
---
Usamos Google Chat internamente mucho para comunicarnos en todo nuestro equipo; es algo así como nuestra holgura; También creamos una gran cantidad de contenido que se puede acceder a través de fuentes RSS, incluso tenemos un [feed de equipo que todos pueden ver](http://devwebfeed.appspot.com). No fue hasta hace poco que descubrí que era bastante fácil crear un [bot simple solo por correo a través de WebHooks](https://developers.google.com/hangouts/chat/how-tos/webhooks) y eso Me dio la idea, puedo crear un servicio simple que sondee los feeds RSS y luego los envíe a nuestro webhook para que se publiquen directamente en el chat de nuestro equipo.

Al final fue bastante simple, y he incluido todo el código a continuación. Utilicé las funciones de Firebase. Sospecho que esto es igual de fácil en otros sitios de Función como servicio y Superfeedr. [Superfeedr](https://superfeedr.com/) es un servicio que puede escuchar Pubsubhubbub ping (ahora WebSub) y también sondeará canales RSS que no tienen configurado Pubsub. Luego, cuando encuentre un feed, hará ping a una URL configurada (en mi caso, mi Función de nube en Firebase) con una representación XML o JSON de los nuevos datos de feed: todo lo que tienes que hacer es analizar los datos y hacer algo con ellos.


```javascript
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.post('/', (req, res) => {
  const { webhook_url } = req.query;
  const { body } = req;
  if (body.items === undefined || body.items.length === 0) {
    res.send('');
    return;
  }

  const item = body.items[0];
  const actor = (item.actor && item.actor.displayName) ? item.actor.displayName : body.title;

  fetch(webhook_url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      "text": `*${actor}* published <${item.permalinkUrl}|${item.title}>. Please consider <https://twitter.com/intent/tweet?url=${encodeURIComponent(body.items[0].permalinkUrl)}&text=${encodeURIComponent(body.items[0].title)}|Sharing it>.`
    })  
  }).then(() => {
    return res.send('ok');
  }).catch(() => {
    return res.send('error')
  });
})
// Expose Express API as a single Cloud Function:
exports.publish = functions.https.onRequest(app);
```


[Leer la publicación completa](https://github.com/PaulKinlan/superfeedr-to-chat).

Me sorprendió y me deleitó lo fácil que fue configurarlo.
