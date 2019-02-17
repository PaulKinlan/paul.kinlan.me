---
slug: using-nonce-with-service-workers
date: 2018-02-04T13:20:31+01:00
title: "Using CSP Nonces effectively with service worker"
tags: ['service worker', 'csp', 'security', 'google analytics']
description: "CSP nonce values can help you securely run inline content on you site. But it can 
be hard to get it working with Service Workers... until now."
---


एक [हालिया परियोजना](https://webgdedeck.com/) में, मैं सर्वर, सेवा कर्मचारी और ग्राहक के बीच जितना संभव हो उतना तर्क साझा करना चाहता था। यह प्रोजेक्ट अनिवार्य रूप से एक साधारण आरएसएस फ़ीड रीडर है, यह आरएसएस फ़ीड लेता है, डेटा को पार करता है और उन्हें कॉलम के एक अच्छे सेट (जैसे TweetDeck) में विलय करता है, और एक विलय सूची भी देता है।

क्योंकि मैं आरएसएस फ़ीड ले रहा हूं और अपने पेज में प्रदर्शित कर रहा हूं, इसलिए मुझे यह सुनिश्चित करने की ज़रूरत है कि यह कुछ भी बेकार नहीं कर रहा है। मैं जितना चाहूं इनपुट को स्वच्छ कर सकता हूं, हालांकि मुझे अपनी क्षमताओं को पता है, और मुझे यकीन है कि लोग आरएसएस फ़ीड को इस तरह से छेड़छाड़ कर सकते हैं कि मैं स्क्रिप्ट चलाने, छवियों या किसी अन्य तृतीय पक्ष को आयात करने में समाप्त करूंगा मेरी साइट का संदर्भ।

वेब प्लेटफॉर्म सामग्री-सुरक्षा-नीति (सीएसपी) के माध्यम से किसी साइट को लॉक करने की क्षमता प्रदान करता है। सीएसपी बाहरी स्रोतों को लॉक कर सकता है, जिससे हम स्क्रिप्ट, शैलियों, इमेज इत्यादि जैसे संदर्भ का अनुरोध कर सकते हैं। आप किसी पृष्ठ के स्क्रिप्ट को ऑनलाइन चलाने की क्षमता को भी लॉक कर सकते हैं - जो XSS प्रकार के हमलों के सभी मैनेजर को रोक सकता है।

इसे ऐप में जोड़ने के लिए बहुत आसान था।


```
`default-src 'self';`
```


हालांकि .... मेरे पास कई मुद्दे थे।

1. मैं पृष्ठ पर शैलियों की इनलाइन उत्पन्न करता हूं और इस प्रकार मुझे स्क्रिप्ट इनलाइन चलाने की आवश्यकता होती है। 2. मुझे Google Analytics को शामिल करने की आवश्यकता है जिसके लिए पृष्ठ पर एक इनलाइन स्क्रिप्ट चलाने की आवश्यकता है।

सीएसपी आपको स्क्रिप्ट के 'असुरक्षित' नामक विकल्प को चालू करने के लिए स्क्रिप्ट और शैलियों को इनलाइन चलाने देता है, हालांकि यह सीएसपी द्वारा प्रदान की जाने वाली किसी भी सुरक्षा से बहुत अधिक पास करता है।

इनलाइन स्क्रिप्ट चलाने के लिए और अभी भी सीएसपी की सुरक्षा है, सीएसपी कुछ टूल्स प्रदान करता है। जिसे मैंने इस्तेमाल किया वह 'nonce' कहा जाता है। Nonce एक यादृच्छिक आईडी है जिसे आपने सीएसपी HTTP शीर्षलेख पर सेट किया है और यह कि आप एक संबंधित इनलाइन स्क्रिप्ट के साथ मेल खाते हैं।

** HTTP शीर्षलेख पर सीएसपी स्ट्रिंग **


```
`default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-script-${nonce.analytics}'; connect-src 'self'; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'nonce-style-${nonce.style}'
```


** nonce का उपयोग कर इनलाइन स्क्रिप्ट **


```html
<script src="https://www.googletagmanager.com/gtag/js?id=1111"></script>
<script nonce="script-{nonce.analytics}">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '{{=it.config.then(config=>config.site.googleAnalytics)}}');
</script>
```


उपर्युक्त कोड अच्छी तरह से काम करता है और जब हम सीएसपी के साथ साइट को सुरक्षित कर रहे होते हैं तो विश्लेषिकी को सही तरीके से काम करना आसान बनाता है।

प्रत्येक वेब अनुरोध के लिए, आपको एक अद्वितीय 'nonce' मान होना चाहिए और मैं इसे '{nonce.analytics}' के माध्यम से करता हूं जो कि एक मान है जो मैं सर्वर पर उत्पन्न करता हूं और टेम्पलेट के माध्यम से आवेदन करता हूं। यदि आप एक गैर-मूल्य का पुन: उपयोग करते हैं तो ब्राउज़र स्क्रिप्ट में सामग्री निष्पादित करने से इंकार कर देगा।

मुझे गैर मूल्यों को उत्पन्न करने में थोड़ी परेशानी थी। मुझे ऐसा कुछ चाहिए जो एक अद्वितीय मूल्य बनाएगा जो उसी उपयोगकर्ता द्वारा पुन: उपयोग नहीं किया जाएगा। मुझे लगा कि प्रारूप का एक गैर मूल्य '[स्रोत] - [date.now + request-count]' पर्याप्त होगा।

'स्रोत' मुझे nonce में नामस्थान जोड़ने की अनुमति देता है, और date.now () + एक बढ़ती अनुरोध गिनती मुझे मूल्यों का एक अपेक्षाकृत स्थिर गैर-दोहराने योग्य सेट देता है।

मैं निम्नलिखित फ़ंक्शन का उपयोग करके nonce उत्पन्न करता हूं:


```javascript
function generateIncrementalNonce(source) {
  let val = 0;
  let max = Math.pow(10, 3); // Date + pow 3 gets us close to max number;

  const generate = () => {
    let now = max * +new Date();
    if(val >= max) val = 0;
    else val++;
    return (source !== undefined ? source : '') + (now + val).toString();
  }

  return generate;
};
```


अछा लगता है। हालांकि, मैं अपने सभी पृष्ठों को एक सेवा कार्यकर्ता में कैश करता हूं, जिसका अर्थ है कि अगर मैंने केवल कैश से सामग्री की सेवा की है तो गैर मूल्यों का पुन: उपयोग किया जाएगा और इस प्रकार निष्पादित नहीं किया जाएगा।

सौभाग्य से, मैं अपने सर्वर और सेवा कार्यकर्ता के बीच साझा तर्क हूं, जो मुझे मेरे कोड के एक केंद्रीय स्थान पर कुछ भी उत्पन्न करने की अनुमति देता है। मैं 'सर्वर' या 'सेवा-कार्यकर्ता' को गैर-मूल्य पर प्रीपेन्ड करने के लिए अपने 'generIncrementalNonce` फ़ंक्शन' में 'स्रोत' पैरामीटर का उपयोग करता हूं और मैंने सर्वर और सेवा कार्यकर्ता दोनों में प्रत्येक अनुरोध हैंडलर में यह किया है। इस स्रोत पैरामीटर का उपयोग करने का अर्थ है कि मैं गारंटी दे सकता हूं कि सर्वर के माध्यम से उत्पन्न एक गैर-मूल्य सेवा सेवा कर्मचारी के माध्यम से लोड किए गए पृष्ठ से कभी भी संघर्ष नहीं करेगा।

इस पैटर्न ने मुझे अच्छी तरह से सेवा दी है। इसने मुझे किसी भी तृतीय पक्ष को इंजेक्शन या मेरे पृष्ठ में अविश्वसनीय कोड चलाने से रोकने के दौरान Google Analytics के लिए आवश्यक इनलाइन स्क्रिप्ट को अनुमति देने की अनुमति दी है।

नीचे कोड है जिसे मैंने प्रोजेक्ट में उपयोग किया था। मेरे पृष्ठों में कई अलग-अलग जगहें हैं जिन्हें मुझे गैर मूल्यों की आवश्यकता है, मैं उन्हें प्रत्येक अनुरोध के लिए उत्पन्न करता हूं और फिर इसे अपने टेम्पलेटिंग फ़ंक्शन और HTTP शीर्षलेख पर एक ही समय में लागू करता हूं।

#### common.js - साझा तर्क


```javascript
function generateCSPPolicy(nonce) {
  return `default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-script-${nonce.analytics}'; connect-src 'self'; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'nonce-style-${nonce.style}' 'nonce-style-${nonce.inlinedcss}';`;
};

function generateIncrementalNonce(source) {
  let val = 0;
  let max = Math.pow(10, 3); // Date + pow 3 gets us close to max number;

  const generate = () => {
    let now = max * +new Date();
    if(val >= max) val = 0;
    else val++;
    return (source !== undefined ? source : '') + (now + val).toString();
  }

  return generate;
};
```


#### सेवा-कार्यकर्ता.जेएस - हैंडलर लाएं


```javascript
const generator = generateIncrementalNonce('service-worker');
let nonce = {
  analytics: generator(),
  inlinedcss: generator(),
  style: generator()
};

// Call the route handler with all data needed
let response = all(nonce, {
  dataPath: paths.dataPath,
  assetPath: paths.assetPath
}).then(r => setHeader(r, 'Content-Security-Policy', generateCSPPolicy(nonce)));;
e.respondWith(response);
```


#### server.js - अनुरोध हैंडलर


```javascript
const generator = generateIncrementalNonce('server');

let nonce = {
  analytics: generator(),
  inlinedcss: generator(),
  style: generator()
};

res.setHeader('Content-Security-Policy', generateCSPPolicy(nonce));

// Call the route handler with all data needed
all(nonce, {
      dataPath: `${paths.dataPath}${hostname}.`,
      assetPath: paths.assetPath 
    })
    .then(response => {
      node.responseToExpressStream(res, response.body)
    });
```