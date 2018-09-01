---
slug: configuring-hugo-server-to-servermjses-modules
date: 2018-07-20T14:17:29.072Z
title: "Configuring hugo server to serve 'mjs' ES modules"
link: https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5
tags: [links, hugo, es modules, javascript]
---
डिफ़ॉल्ट रूप से ह्यूगो सही सामग्री प्रकार के साथ .mjs फ़ाइलों की सेवा नहीं करता है। वास्तव में यह हाल ही में तब तक नहीं था जब ह्यूगो प्रति माइम-प्रकार के एक से अधिक फ़ाइल एक्सटेंशन की सेवा कर सके। ऐसा लगता है कि v0.43 के साथ यह तय किया गया है।

> [mediaTypes]
>   [mediaTypes."text/javascript"]
>      suffixes = ["js", "mjs"]


[पूर्ण पोस्ट पढ़ें](https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5)।

उपरोक्त कोड मुझे सही माइम-प्रकार के साथ ईएस मॉड्यूल के लिए एमजेएस फाइलों की सेवा करने देता है (नोट मॉड्यूल को 'टेक्स्ट / जावास्क्रिप्ट' के साथ परोसा जाना चाहिए)। यह केवल स्थानीय परीक्षण के लिए जरूरी है, होस्टिंग एक और मुद्दा है :)
