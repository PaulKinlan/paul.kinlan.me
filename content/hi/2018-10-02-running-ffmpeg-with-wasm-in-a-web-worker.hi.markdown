---
slug: running-ffmpeg-with-wasm-in-a-web-worker
date: 2018-10-02T16:17:19.798Z
title: 'Running FFMPEG with WASM in a Web Worker'
link: https://github.com/PaulKinlan/ffmpeg.js/blob/wasm/examples/async.html
tags: [links, ffmpeg, wasm]
---
मुझे [FFMPEG.js](https://github.com/Kagami/ffmpeg.js) पसंद है, यह एक साफ उपकरण है जिसे asm.js के साथ संकलित किया गया है और यह मुझे जेएस वेब ऐप्स बनाने देता है जो वीडियो को त्वरित रूप से संपादित कर सकता है। FFMPEG.js वेब श्रमिकों के साथ भी काम करता है ताकि आप मुख्य धागे को अवरुद्ध किए बिना वीडियो एन्कोड कर सकें।

मुझे भी पसंद है [कॉमलिंक](https://github.com/GoogleChromeLabs/comlink)। कॉमलिंक चलो मैं जटिल 'पोस्ट मैसेज' राज्य मशीन से निपटने के बिना कार्यों और कक्षाओं को उजागर करके वेब श्रमिकों से आसानी से बातचीत कर सकता हूं।

मुझे हाल ही में दोनों को एक साथ जोड़ना है। मैं [वेब असेंबली में निर्यात किए गए एफएफएमपीईजी का प्रयोग कर रहा था](https://github.com/PaulKinlan/ffmpeg.js/tree/wasm) (यह काम करता है - याय) और मैं वर्तमान FFMPEG.js प्रोजेक्ट में सभी पोस्ट मैसेज काम को साफ़ करना चाहता था। नीचे कोड अब जैसा दिखता है - मुझे लगता है कि यह बहुत साफ है। हमारे पास एक कार्यकर्ता है जो ffmpeg.js और comlink आयात करता है और यह केवल ffmpeg इंटरफ़ेस का खुलासा करता है, और उसके बाद हमारे पास वेबपृष्ठ है जो कार्यकर्ता को लोड करता है और फिर ffmpeg API में प्रॉक्सी बनाने के लिए कॉमलिंक का उपयोग करता है।

साफ।

#### worker.js
```javascript
importScripts('https://cdn.jsdelivr.net/npm/comlinkjs@3.0.2/umd/comlink.js');
importScripts('../ffmpeg-webm.js'); 
Comlink.expose(ffmpegjs, self);
```
#### client.html
```javascript
let ffmpegjs = await Comlink.proxy(worker);
let result = await ffmpegjs({
   arguments: ['-y','-i', file.name, 'output.webm'],
   MEMFS: [{name: file.name, data: data}],
   stdin: Comlink.proxyValue(() => {}),
   onfilesready: Comlink.proxyValue((e) => {
     let data = e.MEMFS[0].data;
     output.src = URL.createObjectURL(new Blob([data]))
     console.log('ready', e)
   }),
   print: Comlink.proxyValue(function(data) { console.log(data); stdout += data + "\n"; }),
   printErr: Comlink.proxyValue(function(data) { console.log('error', data); stderr += data + "\n"; }),
   postRun: Comlink.proxyValue(function(result) { console.log('DONE', result); }),
   onExit: Comlink.proxyValue(function(code) {
     console.log("Process exited with code " + code);
     console.log(stdout);
   }),
});
```
मुझे वास्तव में पसंद है कि कॉमलिंक, वर्कर्स और डब्ल्यूएएसएम संकलित मॉड्यूल कैसे खेल सकते हैं। मुझे मूर्खतापूर्ण जावास्क्रिप्ट मिलता है जो सीधे WASM मॉड्यूल के साथ इंटरैक्ट करता है और यह मुख्य धागे को चलाता है।

[पूर्ण पोस्ट पढ़ें](https://github.com/PaulKinlan/ffmpeg.js/blob/wasm/examples/async.html)।
