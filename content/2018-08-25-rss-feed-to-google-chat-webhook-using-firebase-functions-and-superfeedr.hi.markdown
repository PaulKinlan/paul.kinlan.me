---
slug: rss-feed-to-google-chat-webhook-using-firebase-functions-and-superfeedr
date: 2018-08-25T16:16:29.749Z
title: 'RSS Feed to Google Chat Webhook using Cloud Functions for Firebase and Superfeedr'
link: https://github.com/PaulKinlan/superfeedr-to-chat
tags: [links,rss,firebase,superfeedr]
---
हम अपनी टीम में संवाद करने के लिए आंतरिक रूप से Google चैट का उपयोग करते हैं - यह हमारे ढीले की तरह है; हम आरएसएस फ़ीड के माध्यम से बहुत सी सामग्री भी उपलब्ध कराते हैं, हमारे पास एक [टीम फीड भी है जिसे आप सभी देख सकते हैं](http://devwebfeed.appspot.com)। यह हाल ही में तब तक नहीं था जब मुझे पता चला कि [वेबहूक के माध्यम से एक साधारण पोस्ट-केवल बॉट] बनाना आसान था (https://developers.google.com/hangouts/chat/how-tos/webhooks) और वह मुझे यह विचार दिया, मैं एक साधारण सेवा बना सकता हूं जो आरएसएस फ़ीड को खिलाती है और फिर उन्हें हमारे वेबकूक पर भेजती है जो सीधे हमारी टीम चैट में पोस्ट कर सकती है।

अंत में यह बहुत आसान था, और मैंने नीचे दिए गए सभी कोड शामिल किए हैं। मैंने फायरबेस फ़ंक्शन का उपयोग किया - मुझे संदेह है कि यह अन्य फ़ंक्शन-ए-ए-सर्विस साइट्स और सुपरफेडर ​​पर जितना आसान है। [सुपरफेडर](https://superfeedr.com/) एक ऐसी सेवा है जो Pubsubhubbub पिंग्स (अब वेबसब) सुन सकती है और यह आरएसएस फ़ीड को भी मतदान करेगी जिसमें पब्सब सेट नहीं है। फिर जब यह एक फीड पाता है तो यह एक कॉन्फ़िगर किए गए यूआरएल (मेरे मामले में फायरबेस में मेरे क्लाउड फ़ंक्शन) को एक्सएमएल या जेएसओएन के नए पाए गए फ़ीड डेटा के प्रतिनिधित्व के साथ पिंग करेगा - आपको बस डेटा को पार्स करना होगा और इसके साथ कुछ करना होगा।


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


[पूर्ण पोस्ट पढ़ें](https://github.com/PaulKinlan/superfeedr-to-chat)।

मैं आश्चर्यचकित और प्रसन्न था कि इसे स्थापित करना कितना आसान था।
