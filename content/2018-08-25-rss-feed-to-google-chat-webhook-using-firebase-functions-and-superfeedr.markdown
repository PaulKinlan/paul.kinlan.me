---
date: 2018-08-25 16:16:29.749000+00:00
link: https://github.com/PaulKinlan/superfeedr-to-chat
slug: rss-feed-to-google-chat-webhook-using-firebase-functions-and-superfeedr
summary: I created a simple service using Firebase Functions and Superfeedr to post
  new entries from RSS feeds to our Google Chat room. Superfeedr polls RSS feeds,
  including those without Pubsubhubbub, and pings my Cloud Function with the new feed
  data. The function then parses this data and posts it to our Google Chat webhook.  It's
  surprisingly easy to set up and works great for keeping our team updated with new
  content.
tags:
- google chat
- rss
- firebase
- cloud functions
- superfeedr
- webhook
- pubsubhubbub
- websub
title: RSS Feed to Google Chat Webhook using Cloud Functions for Firebase and Superfeedr

---
We use Google Chat internally a lot to communicate across our team - it's kinda
like our slack; We also create a lot of content that is accessible via RSS
feeds, we even have a [team feed that you can all
view](http://devwebfeed.appspot.com). It wasn't until recently that I found out
that it was pretty easy to create a [simple post-only bot via
WebHooks](https://developers.google.com/hangouts/chat/how-tos/webhooks) and that
gave me the idea, I can create a simple service that polls RSS feeds and then
sends them to our webhook that can post directly in to our team chat.

It was pretty simple in the end, and I've included all the code below. I used
Firebase functions - I suspect that this is just as easy on other
Function-as-a-service sites - and Superfeedr.
[Superfeedr](https://superfeedr.com/) is a service that can listen to
Pubsubhubbub pings (now WebSub) and it will also poll RSS feeds that don't have
Pubsub set up. Then when it finds a feed it will ping a configured URL (in my
case my Cloud Function in Firebase) with an XML or JSON representation of the newly found
feed data - all you have to do is parse the data and do something with it.

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

[Read full post](https://github.com/PaulKinlan/superfeedr-to-chat).

I was surprised and delighted about how easy it was to set up.
