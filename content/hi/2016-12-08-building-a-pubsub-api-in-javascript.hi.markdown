---
slug: building-a-pubsub-api-in-javascript
date: 2016-12-08T13:20:31.000Z
title: "Building a simple PubSub system in JavaScript"
tags: ['pubsub', 'javascript']
---


हाल ही में एक परियोजना में एक [वेब पुश](/ डिजाइनिंग-ए-वेबपश-सेवा /) सेवा निर्माण करना चाहता था, मैं चाहता था कि मेरा यूआई आवेदन स्तर की घटनाओं (अर्थात् यदि आप करेंगे) को जवाब दे, क्योंकि वहां कुछ घटक थे जिनके लिए जानकारी की आवश्यकता होती है प्रणाली लेकिन एक-दूसरे के साथ निर्भर नहीं है और मैं चाहता हूं कि वे खुद को 'व्यापार तर्क' से स्वतंत्र रूप से प्रबंधित कर सकें।

मैंने मदद करने के लिए कई अलग-अलग औजारों पर चारों ओर देखा, लेकिन क्योंकि मेरे पास अक्सर एनआईएच सिंड्रोम का भारी मामला होता है और तथ्य यह है कि मुझे लगता है कि लोग अपने स्वयं के आधारभूत तत्वों को बहुत तेज़ी से कार्यान्वित कर सकते हैं, मैंने तुरंत एक साधारण ग्राहक को दस्तक देने का फैसला किया- साइड पबसब सेवा & mdash; यह मेरी जरूरतों के लिए बहुत अच्छी तरह से काम किया।

मैंने बहस की कि क्या मुझे एक कस्टम डोम 'इवेंट' का उपयोग करना चाहिए और मौजूदा बुनियादी ढांचे का उपयोग करना चाहिए जो डीओएम पहले ही डेवलपर्स को प्रदान करता है & mdash; 'addEventListener` का उपयोग करके घटनाओं और उपभोग करने वाली घटनाओं की क्षमता & mdash; लेकिन एकमात्र समस्या यह थी कि आपको इवेंट हैंडलर को डोम एलिमेंट या विंडो से लटका देना है क्योंकि आपके पास ऐसा मॉडल नहीं है जो 'EventTarget` में विरासत या मिश्रण हो।

_ ** विचार: ** किसी ऑब्जेक्ट के रूप में 'EventTarget` रखने से कस्टम PubSub सिस्टम बनाने की आवश्यकता को कम करने में मदद मिलेगी ._

इस बाधा को ध्यान में रखते हुए, किसी चीज को कोड करने की इच्छा, और मेरे द्वारा बनाई गई बग को ध्यान में रखने की प्रवृत्ति, मैंने किसी न किसी योजना को स्केच किया:


```javascript
/* When a user is added, do something useful (like update UI) */
EventManager.subscribe('useradded', function(user) {
  console.log(user)
});

/* The UI submits the data, lets publish the event. */
form.onsubmit(function(e) {
  e.preventDefault();

  // do something with user fields

  EventManager.publish('useradded', user);
})
```


यह सब नया नहीं है। रेडक्स और कई अन्य सिस्टम पहले से ही ऐसा करते हैं और कई मामलों में वे आपको राज्य का प्रबंधन करने में भी मदद करते हैं। मेरे सिर में, मेरे पास वास्तव में ऐसा राज्य नहीं है जिसके लिए एक मॉडल की आवश्यकता है जो पहले से ही ब्राउज़र में राज्य से अलग हो।

कार्यान्वयन लागू करने के लिए बहुत आसान है और कम से कम मेरे लिए अमूर्तता काफी उपयोगी है।


```javascript
var EventManager = new (function() {
  var events = {};

  this.publish = function(name, data) {
    var handlers = events[name];
    if(!!handlers === false) return;
    handlers.forEach(function(handler) {
      handler.call(this, data);
    });
  };

  this.subscribe = function(name, handler) {
    var handlers = events[name];
    if(!!handlers === false) {
      handlers = events[name] = [];
    }
    handlers.push(handler);
  };

  this.unsubscribe = function(name, handler) {
    var handlers = events[name];
    if(!!handlers === false) return;

    var handlerIdx = handlers.indexOf(handler);
    handlers.splice(handlerIdx);
  };
});
```
संपादित करें: वादे के उपयोग को हटा दिया।

और वहां हम हैं। एक साधारण पबब प्रणाली जो संभवतः बग से भरा है, लेकिन मुझे यह पसंद है। :) यदि आप इसमें रूचि रखते हैं तो मैंने इसे [github](https://github.com/PaulKinlan/EventManager) पर रखा है।