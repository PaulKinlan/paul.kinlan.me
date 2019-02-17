---
slug: rss-feed-to-google-chat-webhook-using-firebase-functions-and-superfeedr
date: 2018-08-25T16:16:29.749Z
title: 'RSS Feed to Google Chat Webhook using Cloud Functions for Firebase and Superfeedr'
link: https://github.com/PaulKinlan/superfeedr-to-chat
tags: [links,rss,firebase,superfeedr]
---
Мы часто используем Google Chat для общения через нашу команду - это похоже на нашу слабость; Мы также создаем много контента, доступного через RSS-каналы, у нас даже есть [команда, которую вы можете просмотреть) (http://devwebfeed.appspot.com). До недавнего времени я узнал, что создать простой [простой почтовый бот через WebHooks](https://developers.google.com/hangouts/chat/how-tos/webhooks) довольно легко. дал мне идею, я могу создать простой сервис, который опросает RSS-каналы, а затем отправляет их на наш веб-сайт, который может отправлять сообщения прямо в наш командный чат.

В конце концов это было довольно просто, и я включил весь код ниже. Я использовал функции Firebase - я подозреваю, что это так же просто на других сайтах Function-as-a-service - и Superfeedr. [Superfeedr](https://superfeedr.com/) - это служба, которая может прослушивать Pubsubhubbub pings (теперь WebSub), а также будет опробовать RSS-каналы, которые не имеют настройки Pubsub. Затем, когда он найдет фид, он проверит настроенный URL (в моем случае мою Облачную функцию в Firebase) с представлением XML или JSON только что найденных данных фида - все, что вам нужно сделать, это проанализировать данные и сделать с ними что-то.


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


[Читать полный пост](https://github.com/PaulKinlan/superfeedr-to-chat).

Я был удивлен и рад тому, как легко было настроить его.
