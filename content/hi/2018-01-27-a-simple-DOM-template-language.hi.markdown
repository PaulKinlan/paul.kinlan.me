---
slug: a-simple-DOM-template-language
date: 2018-01-27T13:20:31.000Z
title: "A simple clientside templating langauge"
tags: ["templating", 'javascript']
description: "Templating libraries needn't be so hard"
---


एक [हालिया परियोजना](https://webgdedeck.com/) में, मैं कुछ जेएसओएन डेटा को किसी भी पुस्तकालयों को आयात किए बिना एक डोम तत्व में बांधने का एक आसान तरीका चाहता था और मुझे लगता है कि मैं एक सुंदर साफ समाधान के साथ आया हूं (मेरी आंखों में ) जो परियोजना के लिए मेरी सभी जरूरतों को पूरा करता है।

समाधान 'डेटा-बाइंड- *' नामक डीओएम डेटा विशेषताओं के अंदर टेम्पलेटिंग निर्देशों को एन्कोड करता है, जो डेटासेट संपत्ति में डीओएम तत्व पर पहुंच योग्य होते हैं और यह ऊंट-केस के साथ स्वचालित रूप से होता है (यानी, 'आंतरिक टेक्स्ट' सेट करने के लिए एक विशेषता 'डेटा-बाइंड_इनर-टेक्स्ट' होगी - हाइफ़न नोट करें)।

परियोजना से नमूना टेम्पलेट यहां दिया गया है:


```html
<template id="itemTemplate">
  <div class="item new" data-bind_id="guid" id="">
    <h3><span data-bind_inner-text="title"></span></h3>
    <p class="description" data-bind_inner-text="content:encoded|description"></p>
    <div>
      <a data-bind_href="link" data-bind_inner-text="pubDate" data-bind_title="title" href="" title=""></a>
      <svg class="share" url="" title="" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
        <path fill="none" d="M0 0h24v24H0z"></path><path d="M18 16c-.8 0-1.4.4-2 .8l-7-4v-1.5l7-4c.5.4 1.2.7 2 .7 1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3v.7l-7 4C7.5 9.4 6.8 9 6 9c-1.7 0-3 1.3-3 3s1.3 3 3 3c.8 0 1.5-.3 2-.8l7.2 4.2v.6c0 1.6 1.2 3 2.8 3 1.6 0 3-1.4 3-3s-1.4-3-3-3z"></path>
      </svg>
    </div>
  </div>
</template>
```


जैसा कि आप देख सकते हैं, हम &#39;का उपयोग करते हैं <template> यह सुनिश्चित करने के लिए तत्व है कि हम अपने एचटीएमएल को डीओएम में रख सकते हैं और इसे निष्क्रिय रख सकते हैं (यह वास्तव में संलेखन अनुभव में सुधार करता है)। ध्यान दें, इसे टेम्पलेट तत्व नहीं होना चाहिए, यह डोम के अंदर कुछ भी ले सकता है।

उपर्युक्त डीओएम को वास्तविक तत्व में मैप करने के लिए उस पर लागू सभी लाइव डेटा के साथ, मैं निम्नलिखित मूल एल्गोरिदम का उपयोग करता हूं:

1. डेटा को बाध्य करने के लिए तत्व को क्लोन करें। 2. तत्वों के पार और प्रत्येक तत्व के लिए Iterate: 1. यह देखने के लिए जांचें कि क्या यह 'data-bind_`' फ़ॉर्म का गुण है। 2. '' 'से अलग' डेटा 'पर लुकअप करने के लिए कुंजी प्राप्त करें। 3. 'डेटा-बाइंड_`' द्वारा परिभाषित नोड की विशेषता पर इनपुट 'डेटा` से पहले पाए गए कुंजी का मान सीधे 3. मानचित्र न करें। नया नोड लौटाएं।

इसके लिए कोड बहुत आसान है, अगर एक टैड terse।


```javascript
const applyTemplate = (templateElement, data) => {
  const element = templateElement.content.cloneNode(true);    
  const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, () => NodeFilter.FILTER_ACCEPT);

  while(treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    for(let bindAttr in node.dataset) {
      let isBindableAttr = (bindAttr.indexOf('bind_') == 0) ? true : false;
      if(isBindableAttr) {
        let dataKeyString = node.dataset[bindAttr];
        let dataKeys = dataKeyString.split("|");
        let bindKey = bindAttr.substr(5);
        for(let dataKey of dataKeys) {
          if(dataKey in data && data[dataKey] !== "") {
            node[bindKey] = data[dataKey];
            break;
          }
        }
      }
    }
  }

  return element;
}
```


मैं किसी से भी इसका उपयोग करने की उम्मीद नहीं करता हूं, लेकिन मैं यह दिखाना चाहता था कि आप एक पूर्ण पुस्तकालय या ढांचे का उपयोग किए बिना सरल कार्यों के लिए डेटा बाइंडिंग टूल कैसे बना सकते हैं।