---
slug: thoughts-on-importing-npm-modules-to-the-web-as-javascript-modules
date: 2018-07-20T12:39:24.232Z
title: 'Thoughts on importing npm modules to the web as JavaScript modules'
link: https://paul.kinlan.me/importing-npm-modules-to-the-web-as-es6-modules/
tags: [links, npm, mjs, modules, javascript]
---
मुझे कल पोस्ट पर विचार मिला है जो मैंने कल ES मॉड्यूल के बारे में किया था

> I needed a quick way import a simple module get-urls into my project. The module is well tested and it does what I needed &#x2026; ignore the fact that it&#x2019;s pretty easy to implement in a couple of lines of JavaScript. The problem I had is that my project is built in ES6, uses modules and I didn&#x2019;t want to have to bundle up using CommonJS (require).
> 
> I couldn&#x2019;t find a lot of guidance on what to do here, so I went to experiement and this solution is the solution I came across:
> 
> 1. Create a file that imports the npm module I needed. module.exports = require('get-urls'); This module will be what&#x2019;s converted to ES6 style.
> 2. Create a rollup config that
>     1. Imports the node globals, and builtins.
>     2. Resolves all npm modules required for my usage of this module.
>     3. Pass the results through the commonjs plugin so that it&#x2019;s now in JavaScript module format.
>     4. Compress the output, because it&#x2019;s huge :
> 3. Include the bundled file in your project and rejoice.


[पूर्ण पोस्ट पढ़ें](https://paul.kinlan.me/importing-npm-modules-to-the-web-as-es6-modules/)।

उन चीजों में से एक जो मैं मूल लेख में कोशिश करना और स्पष्ट करना चाहता था, लेकिन मैंने यह पता लगाने का फैसला किया कि नोड पारिस्थितिकी तंत्र में बहुत अधिक मात्रा में कोड है जो वास्तव में नोड प्रति से विशिष्ट नहीं है लेकिन कसकर इसके साथ मिलकर बना हुआ है कॉमन जेएस और अन्य बहुत विशिष्ट नोड एपीआई (बफर, पुराना यूआरएल इत्यादि) के माध्यम से नोड खुद को खींचने के लिए बहुत प्रयास करने जा रहा है और इस प्रकार ईएस मॉड्यूल बनाने के लिए परिवर्तन की आवश्यकता हो सकती है सर्वव्यापी संभावित रूप से काफी दर्दनाक होगा, और जब तक पारिस्थितिकी तंत्र में परिवर्तनों को हमें कई प्लेटफ़ॉर्म (वेब ​​/ सर्वर) में कोड को साफ़ रूप से साझा करने में सक्षम होने के लिए बहुत से रूपांतरण टूल और बंडलर का उपयोग करने की आवश्यकता होगी।

हम हैं जहां हम हैं, वेब पर एक आयात करने वाली कहानी नहीं थी, हमारे पास नोड ने पेश किए गए प्राइमेटिव्स का ढेर नहीं था और अब अब कई लोग वास्तव में प्लेटफार्म आवश्यकताओं पर विचार करेंगे, इसलिए मुझे उम्मीद है कि यह है एक आलोचना की तुलना में स्थिति की एक स्वीकृति से अधिक।

फ़ाइल एक्सटेंशन के रूप में '.mjs' का उपयोग करने के लिए एक कदम भी है जो नोड और वेब दोनों में मानक है। मैं इसके साथ पूरी तरह से सहज महसूस करता हूं, हालांकि .msj एक फ़ाइल नहीं है जिसे किसी भी आधारभूत संरचना को अभी तक 'टेक्स्ट / जावास्क्रिप्ट' के रूप में पहचाना जाता है और मैं इसके लिए बस इस तरह की तलाश कर रहा हूं ताकि यह ग्रह पर हर वेब सर्वर द्वारा स्वचालित रूप से अनुमानित हो सके, इसलिए मुझे अपने सेवारत बुनियादी ढांचे में अभी तक और अधिक विन्यास परिवर्तनों को तैनात करने की आवश्यकता नहीं है।

आगे के बहुत सारे मज़ेदार समय, मैं एक के लिए वेब पर बहुत अधिक कार्यक्षमता लाने में सक्षम होने की उम्मीद कर रहा हूं।
