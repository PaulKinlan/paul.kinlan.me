---
slug: rss-feed-to-google-chat-webhook-using-firebase-functions-and-superfeedr
date: 2018-08-25T16:16:29.749Z
title: 'RSS Feed to Google Chat Webhook using Cloud Functions for Firebase and Superfeedr'
link: https://github.com/PaulKinlan/superfeedr-to-chat
tags: [links,rss,firebase,superfeedr]
---
எங்கள் குழுவினருடன் தொடர்புகொள்வதற்கு நாங்கள் Google Chat ஐ உள்நாட்டில் நிறையப் பயன்படுத்துகிறோம் - அது எங்கள் மெதுவாகப் போகிறது; நாங்கள் ஆர்எஸ்எஸ் மூலமாக அணுகக்கூடிய நிறைய உள்ளடக்கங்களை உருவாக்கிக் கொள்கிறோம், நாங்கள் உங்களுக்கு [அனைவருக்கும் பார்க்கக்கூடிய குழு அணிவழக்கம்] உள்ளது (http://devwebfeed.appspot.com). சமீபத்தில் வரை இது [வெப்ஹூக்ஸ் வழியாக எளிமையான பிந்தைய-மட்டுமே போட்](https://developers.google.com/hangouts/chat/how-tos/webhooks) ஐ உருவாக்க மிகவும் எளிதானது என்று கண்டுபிடித்தேன் எனக்கு யோசனை அளித்தேன், ஆர்எஸ்எஸ் ஊட்டங்களைப் பெறும் ஒரு எளிய சேவையை நான் உருவாக்க முடியும், பின்னர் அவர்களை எங்கள் அணி அரட்டைக்கு நேரடியாக பதிவு செய்யக்கூடிய எங்கள் வெப் ஹூக்கை அனுப்புகிறது.

இது இறுதியில் மிகவும் எளிமையானது, மற்றும் நான் கீழே அனைத்து குறியீடு சேர்த்தேன். நான் Firebase செயல்பாடுகளை பயன்படுத்தினேன் - நான் இந்த மற்ற செயல்பாடு-போன்ற ஒரு சேவை தளங்களில் போல எளிதாக சந்தேகிக்கிறேன் - மற்றும் Superfeedr. [Superfeedr](https://superfeedr.com/) Pubsubhubbub pings (இப்போது WebSub) கேட்கும் ஒரு சேவையாகும், அது Pubsub அமைக்கப்படாத ஆர்எஸ்எஸ் ஊட்டங்களைப் பெறும். அது ஒரு ஊட்டத்தைக் கண்டுபிடிக்கும் போது புதிதாகத் தெரிந்த ஜூன் தரவு எக்ஸ்எம்எல் அல்லது JSON பிரதிநிதித்துவத்துடன் ஒரு கட்டமைக்கப்பட்ட URL ஐ (என் விஷயத்தில் என் கிளவுட் ஃபவுண்டேஷனில்) பிங் செய்வேன் - நீங்கள் செய்ய வேண்டியதெல்லாம் தரவுகளை அலசுவதோடு, ஏதாவது செய்ய வேண்டும்.


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


[முழு இடுகையைப் படிக்கவும்](https://github.com/PaulKinlan/superfeedr-to-chat).

நான் அமைதியாக இருந்ததைப் பற்றி எனக்கு ஆச்சரியமாகவும் மகிழ்ச்சியாகவும் இருந்தது.
