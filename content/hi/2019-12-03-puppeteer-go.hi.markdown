---
slug: puppeteer-go
date: 2019-12-03T02:28:20.904Z
title: Puppeteer Go
link: 'https://github.com/PaulKinlan/puppeteer-go'
tags: [the headless web, puppeteer, headless]
---

मुझे [The Headless Web](https://paul.kinlan.me/the-headless-web/) पसंद है - यह मुझे [The Headless Web](https://paul.kinlan.me/the-headless-web/) के विचारों के साथ खेलने की सुविधा देता है - जो कि एक दृश्यमान ब्राउज़र के बिना वेब में चल रहा है और यहां तक कि [DOM-curl](https://paul.kinlan.me/domcurl/) (कर्ल जो जावास्क्रिप्ट चलाता है) जैसे उपकरण भी बनाता है। विशेष रूप से मुझे ब्राउज़र को स्क्रीप्ट करने, हेरफेर करने और पृष्ठों के साथ सहभागिता करने में स्क्रिप्टिंग पसंद है।

एक डेमो जो मैं बनाना चाहता था, वह [Capturing 422 live images](https://bitsofco.de/how-i-created-488-live-images/) के [Capturing 422 live images](https://bitsofco.de/how-i-created-488-live-images/) पोस्ट से प्रेरित था जहाँ उसने एक कठपुतली की स्क्रिप्ट चलाई थी जो कई पृष्ठों पर नेविगेट करेगी और एक स्क्रीनशॉट लेगी। कई पृष्ठों पर जाने के बजाय, मैं पृष्ठ पर तत्वों के कई स्क्रीनशॉट लेना चाहता था।

मेरे पास कठपुतली के साथ जो समस्या है, वह एक प्रारंभिक श्लोक है जिसे आपको कुछ भी करने की आवश्यकता है। लॉन्च, ओपन टैब, नेविगेट करें - यह जटिल नहीं है, यह सरल स्क्रिप्ट के लिए बनाने की तुलना में सिर्फ अधिक बॉयलरप्लेट है। इसलिए मैंने [Puppeteer Go](https://github.com/PaulKinlan/puppeteer-go) बनाया। यह सिर्फ एक छोटी सी स्क्रिप्ट है जो सीएलआई उपयोगिताओं को आसानी से बनाने में मदद करती है जो ब्राउज़र को खोलती है, एक पेज पर नेविगेट करती है, _your_ एक्शन करती है और उसके बाद खुद को साफ करती है।

इसकी जांच - पड़ताल करें।

```JavaScript
const { go } = require('puppeteer-go');

go('https://paul.kinlan.me', async (page) => {
    const elements = await page.$$("h1");
    let count = 0;
    for(let element of elements) {
      try {
        await element.screenshot({ path: `${count++}.png`});
      } catch (err) {
        console.log(count, err);
      }
    }
});
```

उपरोक्त कोड मेरे ब्लॉग में h1 तत्व को खोजेगा और स्क्रीनशॉट लेगा। यह कहीं नहीं के रूप में पास के काम के रूप में अच्छा है, लेकिन मैंने सोचा कि यह देखने के लिए साफ था कि क्या हम पेज से सीधे canisuse.com से स्क्रीनशॉट खींच सकते हैं।

```JavaScript
const { go } = require('puppeteer-go');

go('https://caniuse.com/#search=css', async (page) => {
    const elements = await page.$$("article.feature-block.feature-block--feature");
    let count = 0;
    for(let element of elements) {
      try {
        await element.screenshot({ path: `${count++}.png`});
      } catch (err) {
        console.log(count, err);
      }
    }
});
```

<figure><img src="/images/2019-12-03-puppeteer-go-0.jpeg" alt="4.png"></figure>

<figure><img src="/images/2019-12-03-puppeteer-go-1.jpeg" alt="3.png"></figure>

<figure><img src="/images/2019-12-03-puppeteer-go-2.jpeg" alt="2.png"></figure>

<figure><img src="/images/2019-12-03-puppeteer-go-3.jpeg" alt="1.png"></figure>

<figure><img src="/images/2019-12-03-puppeteer-go-4.jpeg" alt="0.png"></figure>

का आनंद लें!

