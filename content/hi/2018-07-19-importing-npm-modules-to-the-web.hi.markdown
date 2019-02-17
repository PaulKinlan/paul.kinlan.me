---
slug: importing-npm-modules-to-the-web-as-es6-modules
date: 2018-07-19T18:06:53.251Z
title: 'Importing npm modules to the web as JavaScript modules'
tags: [npm, rollup, javascript]
---


मैं अपनी स्थिर साइट में सामग्री को धक्का देना आसान बनाने के लिए काम कर रहा हूं और यह एक मजेदार थोड़ा अभ्यास रहा है जिसे मैं एक और पोस्ट में अधिक साझा करूंगा। इस पोस्ट में मैं 'रोलअप' कॉन्फ़िगरेशन साझा करना चाहता हूं जिसे मैं लगभग किसी भी एनपीएम मॉड्यूल को जावास्क्रिप्ट मॉड्यूल का उपयोग करके फ्रंटएंड प्रोजेक्ट में आयात करने के लिए उपयोग करता था।

मुझे अपनी परियोजना में एक सरल मॉड्यूल 'get-urls` आयात करने का एक त्वरित तरीका चाहिए। मॉड्यूल अच्छी तरह से परीक्षण किया जाता है और यह वही करता है जो मुझे चाहिए ... इस तथ्य को अनदेखा करें कि जावास्क्रिप्ट की कुछ पंक्तियों में इसे लागू करना बहुत आसान है। मेरी समस्या यह थी कि मेरी परियोजना ईएस 6 में बनाई गई है, मॉड्यूल का उपयोग करती है और मैं कॉमनजेएस (`आवश्यकता`) का उपयोग करके बंडल नहीं करना चाहता था।

मुझे यहां क्या करना है, इस पर बहुत मार्गदर्शन नहीं मिला, इसलिए मैं प्रयोग में गया और यह समाधान वह समाधान है जो मैंने पार किया:

1. एक फ़ाइल बनाएं जो मुझे आवश्यक एनपीएम मॉड्यूल आयात करे। `module.exports = की आवश्यकता है ('get-urls'); 'यह मॉड्यूल ईएस 6 शैली में परिवर्तित हो जाएगा। 2. एक रोलअप कॉन्फ़िगरेशन बनाएं जो 1. नोड ग्लोबल्स और बिल्टिन आयात करता है। 1. इस मॉड्यूल के उपयोग के लिए आवश्यक सभी एनपीएम मॉड्यूल को हल करता है। 1. 'commonjs' प्लगइन के माध्यम से परिणाम पास करें ताकि यह अब जावास्क्रिप्ट मॉड्यूल प्रारूप में हो। 1. आउटपुट को संपीड़ित करें, क्योंकि यह बहुत बड़ा है: \ 3. अपनी प्रोजेक्ट में बंडल फ़ाइल शामिल करें और आनंद लें।


``` javascript
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import closure from 'rollup-plugin-closure-compiler-js';

export default {
  input: 'static/javascripts/get-urls.js',
  output: {
      file: 'static/javascripts/get-urls.bundle.mjs',
      format: 'es',
      browser: true
    },
  plugins: [
    globals(),
    builtins(),
    resolve({
      preferBuiltins: false,
      browser: true,
      // pass custom options to the resolve plugin
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    commonjs(),
    closure({
      compilationLevel: 'WHITESPACE',
      languageIn: 'ES6',
      languageOut: 'ES6'
    })
  ]
};
```


मुझे लगता है कि इससे बेहतर तरीके हैं, अपेक्षाकृत सरल कार्य के लिए आउटपुट विशाल (70 केबी) है, लेकिन अब इसका मतलब है कि मैं सीधे अपने पृष्ठ में एनपीएम से मॉड्यूल का उपयोग कर सकता हूं।


```
<script type="module">
    import getUrls from '/javascripts/get-urls.bundle.mjs';
    ...
```


साफ ...
