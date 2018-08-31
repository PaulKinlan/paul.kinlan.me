---
slug: rss-feed-to-google-chat-webhook-using-firebase-functions-and-superfeedr
date: 2018-08-25T16:16:29.749Z
title: 'RSS Feed to Google Chat Webhook using Cloud Functions for Firebase and Superfeedr'
link: https://github.com/PaulKinlan/superfeedr-to-chat
tags: [links,rss,firebase,superfeedr]
---
私たちはGoogleチャットを内部的に使用してチーム全体でコミュニケーションを取っています。また、RSSフィードを介してアクセスできる多くのコンテンツを作成し、[すべて見ることができるチームフィード]（http://devwebfeed.appspot.com）を持っています。最近まで、[WebHooks]（https://developers.google.com/hangouts/chat/how-tos/webhooks）経由で単純なポストオンリーボットを作成することはかなり簡単であることがわかりました。私にはアイデアが与えられました。私はRSSフィードをポーリングして、私たちのチームチャットに直接投稿できるWebhookに送信する簡単なサービスを作成できます。

最後はかなりシンプルで、以下のコードをすべて含めました。私はFirebaseの機能を使用しました - これは他のサービス機能サイトやSuperfeedrと同じように簡単だと思われます。 [Superfeedr]（https://superfeedr.com/）はPubsubhubbub ping（現在WebSub）を聞くことができるサービスで、Pubsubが設定されていないRSSフィードもポーリングします。フィードが見つかると、新しく見つかったフィードデータをXMLまたはJSON形式で構成されたURL（私の場合、FirebaseのCloud機能）にpingを実行します。データを解析して何かをするだけです。


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


[完全な記事を読む]（https://github.com/PaulKinlan/superfeedr-to-chat）。

私は驚いて、セットアップがいかに簡単かについて喜んでいました。
