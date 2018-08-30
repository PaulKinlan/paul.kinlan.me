---
slug: rss-feed-to-google-chat-webhook-using-firebase-functions-and-superfeedr
date: 2018-08-25T16:16:29.749Z
title: 'RSS Feed to Google Chat Webhook using Cloud Functions for Firebase and Superfeedr'
link: https://github.com/PaulKinlan/superfeedr-to-chat
tags: [links,rss,firebase,superfeedr]
---
Nous utilisons beaucoup Google Chat pour communiquer au sein de notre équipe. Nous créons également beaucoup de contenu accessible via les flux RSS, nous avons même un [flux d'équipe que vous pouvez voir tous] (http://devwebfeed.appspot.com). Ce n'est que récemment que j'ai découvert qu'il était assez facile de créer un [simple post-only bot via WebHooks] (https://developers.google.com/hangouts/chat/how-tos/webhooks) et que m'a donné l'idée, je peux créer un service simple qui interroge les flux RSS et les envoie ensuite à notre webhook qui peut poster directement dans notre chat d'équipe.

C'était assez simple au final, et j'ai inclus tout le code ci-dessous. J'ai utilisé les fonctions de Firebase - je pense que c'est aussi simple sur d'autres sites fonctionnels que le service - et Superfeedr. [Superfeedr] (https://superfeedr.com/) est un service qui peut écouter les pings de Pubsubhubbub (maintenant WebSub) et interroge également les flux RSS pour lesquels Pubsub n’a pas été configuré. Ensuite, lorsqu'il trouve un flux, il envoie une requête ping à une URL configurée (dans mon cas, ma fonction Cloud dans Firebase) avec une représentation XML ou JSON des données de flux nouvellement trouvées. Il vous suffit d'analyser les données et de faire quelque chose.


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


[Lire l'article complet] (https://github.com/PaulKinlan/superfeedr-to-chat).

J'ai été surpris et ravi de la facilité d'installation.
