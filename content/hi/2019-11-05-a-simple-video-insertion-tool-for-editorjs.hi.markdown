---
slug: a-simple-video-insertion-tool-for-editorjs
date: 2019-11-05T00:48:57.389Z
title: A simple video insertion tool for EditorJS
link: 'https://github.com/PaulKinlan/simple-video'
tags: [links, editor]
---

मुझे वास्तव में [EditorJS](https://editorjs.io/) पसंद है। यह मुझे अपने स्थैतिक ह्यूगो ब्लॉग के लिए एक बहुत ही सरल वेब-होस्टेड इंटरफ़ेस बनाने देता है।

EditorJS के पास एक साधारण ब्लॉक-आधारित संपादक में मेरी सबसे अधिक जरूरत है। इसमें हेडर, कोड, और यहां तक कि होस्टिंग इंफ्रास्ट्रक्चर की आवश्यकता के बिना संपादक में छवियां जोड़ने का एक सरल तरीका है। यह संपादक के लिए अब तक वीडियो जोड़ने का एक आसान तरीका नहीं है।

मैंने [simple-image](https://github.com/editor-js/simple-image) प्लगिन रिपॉजिटरी ली और इसे बदल दिया (सिर्फ एक tad) बनाने के लिए एक [simple-video](https://github.com/PaulKinlan/simple-video) प्लगइन ( [npm module](https://www.npmjs.com/package/simple-video-editorjs) )। अब मैं इस ब्लॉग में आसानी से वीडियो शामिल कर सकता हूं।

यदि आप EditorJS के साथ पारिवारिक हैं, तो अपनी परियोजनाओं में शामिल करना सरल है। बस इसे निम्नानुसार स्थापित करें

```
npm i simple-video-editorjs
```

और फिर इसे अपनी परियोजना में शामिल करें जैसा कि आप फिट देखते हैं।

```
const SimpleVideo = require('simple-video-editorjs');

var editor = EditorJS({
  ...
  
  tools: {
    ...
    video: SimpleVideo,
  }
  
  ...
});
```

संपादक के पास कुछ सरल विकल्प हैं जो आपको कॉन्फ़िगर करते हैं कि वीडियो को पृष्ठ में कैसे होस्ट किया जाना चाहिए:

1. ऑटोप्ले - पेज लोड होने पर वीडियो अपने आप प्ले हो जाएगा
1. म्यूट किया गया - क्या वीडियो में डिफ़ॉल्ट रूप से ध्वनि नहीं होगी (ऑटोप्ले के लिए आवश्यक)
1. नियंत्रण - क्या वीडियो में डिफ़ॉल्ट HTML नियंत्रण होगा।

नीचे एक वीडियो का एक त्वरित उदाहरण है जो एम्बेडेड है (और कुछ विकल्पों को दिखा रहा है)।

<figure><video src="/videos/2019-11-06-a-simple-video-insertion-tool-for-editorjs-0.mp4" alt="Showing Options for EditorJS simple video." autoplay muted></video></figure>

वैसे भी, मुझे इस छोटे से प्लगइन को बनाने में मज़ा आया - यह बनाने में बहुत मुश्किल नहीं था और केवल एक चीज के बारे में जो मैंने किया था उसे बेस 64 में रूपांतरण को स्थगित कर दिया गया था जो कि सरल-चित्र का उपयोग करता है और इसके बजाय बस ब्लॉब यूआरएल का उपयोग करता है।