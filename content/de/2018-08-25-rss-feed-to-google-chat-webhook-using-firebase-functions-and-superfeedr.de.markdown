---
slug: rss-feed-to-google-chat-webhook-using-firebase-functions-and-superfeedr
date: 2018-08-25T16:16:29.749Z
title: 'RSS Feed to Google Chat Webhook using Cloud Functions for Firebase and Superfeedr'
link: https://github.com/PaulKinlan/superfeedr-to-chat
tags: [links,rss,firebase,superfeedr]
---
Wir verwenden Google Chat intern sehr oft, um über unser Team zu kommunizieren - es ist ein bisschen wie unser Durchhang; Wir erstellen auch eine Menge Inhalte, die über RSS-Feeds zugänglich sind. Wir haben sogar einen [Team-Feed, den Sie alle ansehen können](http://devwebfeed.appspot.com). Erst vor kurzem habe ich herausgefunden, dass es ziemlich einfach ist, einen [einfachen Post-Only-Bot über WebHooks](https://developers.google.com/hangouts/chat/how-tos/webhooks) und das zu erstellen gab mir die Idee, ich kann einen einfachen Dienst erstellen, der RSS-Feeds abfragt und diese dann an unseren Webhook sendet, der direkt in unserem Team-Chat posten kann.

Es war am Ende ziemlich einfach, und ich habe den ganzen Code unten eingeschlossen. Ich habe Firebase-Funktionen verwendet - ich vermute, dass dies auf anderen Function-as-a-Service-Sites genauso einfach ist - und Superfeedr. [Superfeedr](https://superfeedr.com/) ist ein Dienst, der Pubsubhubbub-Pings (jetzt WebSub) hören kann und auch RSS-Feeds abfragt, für die Pubsub nicht eingerichtet ist. Wenn dann ein Feed gefunden wird, pingt er eine konfigurierte URL (in meinem Fall meine Cloud-Funktion in Firebase) mit einer XML- oder JSON-Darstellung der neu gefundenen Feed-Daten - alles, was Sie tun müssen, ist die Daten analysieren und etwas damit machen.


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


[Ganzen Beitrag lesen](https://github.com/PaulKinlan/superfeedr-to-chat).

Ich war überrascht und erfreut darüber, wie einfach es war, sich einzurichten.
