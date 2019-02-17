---
slug: file-web-share-target
date: 2019-02-15T15:52:03.183Z
title: 'File Web Share Target'
tags: [share, intents]
---

मैंने अक्सर कहा है कि वेब एप्लिकेशन के लिए ऐप्स की दुनिया में प्रभावी रूप से प्रतिस्पर्धा करने के लिए, उन्हें उन सभी स्थानों पर एकीकृत करने की आवश्यकता होती है, जो उपयोगकर्ता ऐप्स के होने की उम्मीद करते हैं। इंटर-ऐप संचार वेब प्लेटफ़ॉर्म के प्रमुख लापता टुकड़ों में से एक है, और विशेष रूप से अंतिम प्रमुख लापता विशेषताओं में से एक देशी स्तर साझाकरण है: वेब ऐप्स को [data out of their silo](/unintended-silos/) और अन्य वेब साइटों और ऐप्स में सक्षम होने की आवश्यकता है; उन्हें अन्य मूल ऐप्स और साइटों से डेटा प्राप्त करने में भी सक्षम होना चाहिए।

फ़ाइल शेयर लक्ष्य एपीआई एक एपीआई का एक गेम-परिवर्तक है जो अब क्रोम कैनरी में है। एपीआई उन [Web Share Target API](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md) को [Web Share Target API](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md) है जो ऐप और साइटों को वेब साइटों पर सरल लिंक और पाठ साझा करने की सुविधा [Web Share Target API](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md) जो उन्हें सिस्टम साझा करने की कार्यक्षमता में एकीकृत करते हैं।

यह बहुत ही स्थिर फ़ाइल ब्लॉग वेब शेयर लक्ष्य एपीआई का उपयोग करता है ताकि मैं जल्दी से [share links](/web-share-target-api/) कर [share links](/web-share-target-api/) कि मुझे यह किसी भी एंड्रॉइड एप्लिकेशन से दिलचस्प लगता है, और पिछले सप्ताह के [I enabled the File Share Target API so that I can upload images to my blog directly from the Camera app on Android](/testing-file-share-target-from-camera/) रूप में। यह पोस्ट इस बारे में है कि मैंने यह कैसे किया (और जेक आर्चीबाल्ड से कुछ कोड चुराया - tbf उसने एक एकीकरण के लिए बहुत सारे कीड़े काम किए जो वे [squoosh.app](https://squoosh.app/) में कर रहे हैं।)

[File Share Target API](https://wicg.github.io/web-share-target/level-2/#example-3-manifest-webmanifest) एक बहुत ही उपन्यास API है जिसमें यह पूरी तरह से प्रगतिशील है। यदि आपका आवेदन फॉर्म `POST` अनुरोधों को संभाल सकता है तो आप इस एपीआई के साथ आसानी से एकीकृत कर सकते हैं। मूल प्रवाह यह है: जब उपयोगकर्ता आपके आवेदन को देशी बीनने वाले से चुनता है, तो Chrome आपके सर्वर पर एक फॉर्म `POST` अनुरोध `POST` , यह आपके ऊपर है कि आप इसके साथ क्या करते हैं (सेवा कर्मचारी या सर्वर पर हैंडल)।

अपने वेब ऐप में फ़ाइलें साझा करने के लिए समर्थन जोड़ने के लिए आपको दो काम करने होंगे:

1. मैनिफ़ेस्ट फ़ाइल के माध्यम से फ़ाइलों को साझा करने के लिए समर्थन की घोषणा करें, 2. अपने वर्कर वर्कर में फॉर्म `POST` अनुरोध को हैंडल करें।

यह घोषणा होस्ट सिस्टम को बताती है कि होस्ट एप्लिकेशन से वेब ऐप पर शेयरिंग को कैसे मैप किया जाना चाहिए। नीचे दिए गए घोषणापत्र में यह अनिवार्य रूप से कहा गया है कि &quot;जब कोई उपयोगकर्ता किसी प्रकार की छवि &#39;/ * की फ़ाइल साझा करता है, तो&#39; / शेयर / छवि / &#39;के लिए एक फॉर्म पोस्ट अनुरोध करें और डेटा&#39; फ़ाइल &#39;नाम दें।

* Manifest.json *
```JSON
{
  "name": "Blog: Share Image",
  "short_name": "Blog: Share Image",
  "start_url": "/share/image/",
  "theme_color": "#000000",
  "background_color": "#000000",
  "icons": [ {
      "sizes": "192x192",
      "src": "/images/me.png",
      "type": "image/png"
  }],
  "share_target": {
    "action": "/share/image/",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "files": [
        {
          "name": "file",
          "accept": ["image/*"]
        }
      ]
    }
  },
  "display": "standalone",
  "scope": "/share/"
}
```

एक बार जब उपयोगकर्ता आपके वेब एप्लिकेशन को साझा करता है, तो क्रोम आपकी साइट पर पेलोड के रूप में फ़ाइल डेटा के साथ वेब अनुरोध करेगा।

यह अनुशंसा की जाती है कि आप अपने सेवा कार्यकर्ता के अंदर POST अनुरोध को संभालें ताकि 1) यह तेज़ हो, 2) नेटवर्क उपलब्ध होने के लिए लचीला है। आप इस प्रकार कर सकते हैं:

* serviceworker.js * - [demo](/share/image/sw.js)

```Javascript
onfetch = async (event) => {
  if (event.request.method !== 'POST') return;
  if (event.request.url.startsWith('https://paul.kinlan.me/share/image/') === false) return;

  /* This is to fix the issue Jake found */
  event.respondWith(Response.redirect('/share/image/'));
  
  event.waitUntil(async function () {
    const data = await event.request.formData();
    const client = await self.clients.get(event.resultingClientId || event.clientId);
    // Get the data from the named element 'file'
    const file = data.get('file');

    console.log('file', file);
    client.postMessage({ file, action: 'load-image' });
  }());
};
```

ऊपर कुछ दिलचस्प बातें हो रही हैं, जिन्हें जल्दी से संक्षेप में बताया जा सकता है:

* रीडायरेक्ट करके कार्य को `POST` अनुरोध के परिणाम के रूप में UI रेंडर करें।
* डेटा के माध्यम से फ़ॉर्म के माध्यम से प्रस्तुत की है कि पढ़ें `event.request.formData()`
* डेटा को खुली खिड़की पर भेजें (यह यूआई होगा जिसे हमने उपयोगकर्ता को पहले बिंदु पर पुनर्निर्देशित किया है)।

यह पूरी तरह से आप पर निर्भर करता है कि आप उस डेटा के साथ क्या करते हैं जो आपके सेवा कार्यकर्ता को पोस्ट किया गया है, लेकिन मेरे ऐप के मामले में मुझे इसे सीधे UI में दिखाना होगा, इसलिए मुझे उस विंडो को ढूंढना होगा जिसका उपयोग उपयोगकर्ता कर रहा है और `postMessage` वहाँ डेटा।

* index.html * - [demo](/share/image/index.html)

```Javascript
navigator.serviceWorker.onmessage = (event) => {
  console.log(event);
  imageBlob = event.data.file;
  // Update the UI with the data that has been shared to it.
  imageShare.src = URL.createObjectURL(imageBlob);
};
```

और इसके बारे में है। यदि आपके पास पहले से ही अपने वेब रूपों के लिए एक एपीआई एंडपॉइंट है, तो यह एक सरल, अभी तक शक्तिशाली जोड़ है जो आप अपनी साइट पर बना सकते हैं।

वेब शेयर टारगेट एपीआई अविश्वसनीय रूप से शक्तिशाली प्लेटफॉर्म आदिम है जो एक और बाधा को तोड़ता है जो वेब ऐप अपने मेजबान प्लेटफार्मों पर पड़ा है।