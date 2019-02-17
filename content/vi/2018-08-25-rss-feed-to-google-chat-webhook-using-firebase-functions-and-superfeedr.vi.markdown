---
slug: rss-feed-to-google-chat-webhook-using-firebase-functions-and-superfeedr
date: 2018-08-25T16:16:29.749Z
title: 'RSS Feed to Google Chat Webhook using Cloud Functions for Firebase and Superfeedr'
link: https://github.com/PaulKinlan/superfeedr-to-chat
tags: [links,rss,firebase,superfeedr]
---
Chúng tôi sử dụng Google Trò chuyện trong nội bộ rất nhiều để giao tiếp trong nhóm của chúng tôi - nó giống như chùng của chúng tôi; Chúng tôi cũng tạo nhiều nội dung có thể truy cập thông qua nguồn cấp dữ liệu RSS, thậm chí chúng tôi có [feed nhóm mà tất cả các bạn có thể xem](http://devwebfeed.appspot.com). Cho đến gần đây tôi mới phát hiện ra rằng việc tạo [bot đơn giản chỉ sau qua WebHooks] thật đơn giản (https://developers.google.com/hangouts/chat/how-tos/webhooks) và rằng đã cho tôi ý tưởng, tôi có thể tạo ra một dịch vụ đơn giản để thăm dò nguồn cấp dữ liệu RSS và sau đó gửi chúng đến webhook của chúng tôi có thể đăng trực tiếp vào cuộc trò chuyện nhóm của chúng tôi.

Nó đã được khá đơn giản cuối cùng, và tôi đã bao gồm tất cả các mã dưới đây. Tôi đã sử dụng các chức năng Firebase - Tôi nghi ngờ rằng điều này cũng dễ dàng trên các trang web chức năng như một dịch vụ khác - và Superfeedr. [Superfeedr](https://superfeedr.com/) là một dịch vụ có thể nghe các ping Pubsubhubbub (nay là WebSub) và nó cũng sẽ thăm dò các nguồn cấp dữ liệu RSS không có Pubsub được thiết lập. Sau đó, khi tìm thấy nguồn cấp dữ liệu, nó sẽ ping một URL được cấu hình (trong trường hợp của tôi là Cloud Function của tôi trong Firebase) với một biểu diễn XML hoặc JSON của dữ liệu nguồn cấp dữ liệu mới được tìm thấy - tất cả những gì bạn phải làm là phân tích cú pháp dữ liệu và thực hiện điều gì đó với nó.


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


[Đọc toàn bộ bài đăng](https://github.com/PaulKinlan/superfeedr-to-chat).

Tôi đã rất ngạc nhiên và vui mừng về cách dễ dàng để thiết lập.
