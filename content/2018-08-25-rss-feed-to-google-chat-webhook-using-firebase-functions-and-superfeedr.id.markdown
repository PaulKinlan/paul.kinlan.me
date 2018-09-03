---
slug: rss-feed-to-google-chat-webhook-using-firebase-functions-and-superfeedr
date: 2018-08-25T16:16:29.749Z
title: 'RSS Feed to Google Chat Webhook using Cloud Functions for Firebase and Superfeedr'
link: https://github.com/PaulKinlan/superfeedr-to-chat
tags: [links,rss,firebase,superfeedr]
---
Kami menggunakan Google Chat secara internal untuk berkomunikasi di seluruh tim kami - ini seperti kendur kami; Kami juga membuat banyak konten yang dapat diakses melalui umpan RSS, kami bahkan memiliki [umpan tim yang dapat Anda semua lihat](http://devwebfeed.appspot.com). Baru-baru ini saya menemukan bahwa cukup mudah untuk membuat [bot pasca-hanya yang sederhana melalui WebHooks](https://developers.google.com/hangouts/chat/how-tos/webhooks) dan itu memberi saya ide, saya dapat membuat layanan sederhana yang mengumpulkan umpan RSS dan kemudian mengirimnya ke webhook kami yang dapat dikirim langsung ke obrolan tim kami.

Itu sangat sederhana pada akhirnya, dan saya sudah memasukkan semua kode di bawah ini. Saya menggunakan fungsi Firebase - saya curiga bahwa ini sama mudahnya di situs fungsi-as-a-service lainnya - dan Superfeedr. [Superfeedr](https://superfeedr.com/) adalah layanan yang dapat mendengarkan ping Pubsubhubbub (sekarang WebSub) dan ini juga akan mensurvei umpan RSS yang tidak memiliki Pubsub diatur. Kemudian ketika menemukan umpan, ia akan melakukan ping ke URL yang dikonfigurasi (dalam kasus saya, Cloud Function saya di Firebase) dengan representasi XML atau JSON dari data feed yang baru ditemukan - yang harus Anda lakukan hanyalah menguraikan data dan melakukan sesuatu dengannya.


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


[Baca posting lengkap](https://github.com/PaulKinlan/superfeedr-to-chat).

Saya terkejut dan senang tentang betapa mudahnya mengaturnya.
