---
slug: puppeteer-go
date: 2019-12-03T02:28:20.904Z
title: Puppeteer Go
link: 'https://github.com/PaulKinlan/puppeteer-go'
tags: [the headless web, puppeteer, headless]
---

ਮੈਂ ਪਪੀਟੀਰ ਨੂੰ ਪਿਆਰ ਕਰਦਾ ਹਾਂ - ਇਹ ਮੈਨੂੰ <a <span class="notranslate">href=&quot;https://paul.kinlan.me/the-headless-web/&quot; &gt;The Headless Web</a> ਦੇ ਵਿਚਾਰਾਂ ਨਾਲ ਖੇਡਣ ਦਿੰਦਾ ਹੈ - ਜੋ ਕਿ ਬਿਨਾਂ ਵੇਖੇ ਬਰਾ in <a <span class="notranslate">href=&quot;https://paul.kinlan.me/the-headless-web/&quot; &gt;The Headless Web</a> in <a <span class="notranslate">href=&quot;https://paul.kinlan.me/the-headless-web/&quot; &gt;The Headless Web</a> ਚਲਾ ਰਿਹਾ ਹੈ. ਅਤੇ ਇਥੋਂ ਤਕ ਕਿ ਟੂਲ <a <span class="notranslate">href=&quot;https://paul.kinlan.me/domcurl/&quot; &gt;DOM-curl</a> ਜਿਵੇਂ ਕਿ <a <span class="notranslate">href=&quot;https://paul.kinlan.me/domcurl/&quot; &gt;DOM-curl</a> (ਕਰਲ ਜੋ ਜਾਵਾ ਸਕ੍ਰਿਪਟ ਚਲਾਉਂਦਾ ਹੈ). ਖ਼ਾਸਕਰ ਮੈਨੂੰ ਪੰਨਿਆਂ ਨੂੰ ਖੁਰਚਣ, ਹੇਰਾਫੇਰੀ ਕਰਨ ਅਤੇ ਇੰਟਰੈਕਟ ਕਰਨ ਲਈ ਬ੍ਰਾ .ਜ਼ਰ ਨੂੰ ਸਕ੍ਰਿਪਟ ਕਰਨਾ ਪਸੰਦ ਹੈ.

ਇੱਕ ਡੈਮੋ ਜੋ ਮੈਂ ਬਣਾਉਣਾ ਚਾਹੁੰਦਾ ਸੀ ਉਹ ਆਇਰੀ ਦੇ <a <span class="notranslate">href=&quot;https://bitsofco.de/how-i-created-488-live-images/&quot; &gt;Capturing 422 live images</a> ਦੁਆਰਾ ਪ੍ਰੇਰਿਤ ਹੋਇਆ ਸੀ <a <span class="notranslate">href=&quot;https://bitsofco.de/how-i-created-488-live-images/&quot; &gt;Capturing 422 live images</a> ਪੋਸਟਾਂ ਨੂੰ <a <span class="notranslate">href=&quot;https://bitsofco.de/how-i-created-488-live-images/&quot; &gt;Capturing 422 live images</a> ਜਿੱਥੇ ਉਹ ਇੱਕ ਕਠਪੁਤਲੀ ਸਕ੍ਰਿਪਟ ਚਲਾਉਂਦੀ ਸੀ ਜਿਸ &#39;ਤੇ ਨੈਵੀਗੇਟ ਹੋਣਾ ਸੀ. ਬਹੁਤ ਸਾਰੇ ਪੰਨੇ ਅਤੇ ਇੱਕ ਸਕਰੀਨ ਸ਼ਾਟ ਲੈਂਦੇ ਹਨ. ਬਹੁਤ ਸਾਰੇ ਪੰਨਿਆਂ &#39;ਤੇ ਜਾਣ ਦੀ ਬਜਾਏ, ਮੈਂ ਪੇਜ&#39; ਤੇ ਤੱਤ ਦੇ ਬਹੁਤ ਸਾਰੇ ਸਕਰੀਨ ਸ਼ਾਟ ਲੈਣਾ ਚਾਹੁੰਦਾ ਸੀ.

ਪਪੀਟੀਅਰ ਨਾਲ ਜੋ ਸਮੱਸਿਆ ਮੇਰੇ ਕੋਲ ਹੈ ਉਹ ਉਦਘਾਟਨੀ ਪੜਾਅ ਹੈ ਜੋ ਤੁਹਾਨੂੰ ਕੁਝ ਵੀ ਕਰਨ ਦੀ ਜ਼ਰੂਰਤ ਹੈ. ਲਾਂਚ ਕਰੋ, ਟੈਬ ਖੋਲ੍ਹੋ, ਨੈਵੀਗੇਟ ਕਰੋ - ਇਹ ਗੁੰਝਲਦਾਰ ਨਹੀਂ ਹੈ, ਇਹ ਸਧਾਰਣ ਸਕ੍ਰਿਪਟਾਂ ਲਈ ਜੋ ਮੈਂ ਬਣਾਉਣਾ ਚਾਹੁੰਦਾ ਹਾਂ ਉਸ ਤੋਂ ਕਿਤੇ ਜ਼ਿਆਦਾ ਬੋਇਲਰਪਲੇਟ ਹੈ. ਇਸੇ ਲਈ ਮੈਂ <a <span class="notranslate">href=&quot;https://github.com/PaulKinlan/puppeteer-go&quot; &gt;Puppeteer Go</a> . ਇਹ ਸਿਰਫ ਇਕ ਛੋਟੀ ਜਿਹੀ ਸਕ੍ਰਿਪਟ ਹੈ ਜੋ ਸੀ ਐਲ ਆਈ ਸਹੂਲਤਾਂ ਨੂੰ ਆਸਾਨੀ ਨਾਲ ਬਣਾਉਣ ਵਿਚ ਮੇਰੀ ਮਦਦ ਕਰਦੀ ਹੈ ਜੋ ਬ੍ਰਾ .ਜ਼ਰ ਖੋਲ੍ਹਦੀ ਹੈ, ਇਕ ਪੰਨੇ &#39;ਤੇ ਜਾਂਦੀ ਹੈ, ਤੁਹਾਡੀ _ ਕਾਰਵਾਈ ਕਰਦੀ ਹੈ ਅਤੇ ਫਿਰ ਆਪਣੇ ਆਪ ਵਿਚ ਸਾਫ ਹੋ ਜਾਂਦੀ ਹੈ.

ਇਸ ਦੀ ਜਾਂਚ ਕਰੋ.

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

ਉਪਰੋਕਤ ਕੋਡ ਮੇਰੇ ਬਲੌਗ ਵਿੱਚ h1 ਤੱਤ ਲੱਭੇਗਾ ਅਤੇ ਸਕ੍ਰੀਨਸ਼ਾਟ ਲਵੇਗਾ. ਇਹ ਕਿਧਰੇ ਵੀ ਆਇਰੀ ਦੇ ਕੰਮ ਜਿੰਨਾ ਚੰਗਾ ਨਹੀਂ ਹੈ, ਪਰ ਮੈਂ ਸੋਚਿਆ ਕਿ ਇਹ ਸੁਨਿਸਚਿਤ ਸੀ ਕਿ ਕੀ ਅਸੀਂ canisuse.com ਤੋਂ ਸਿੱਧੇ ਪੇਜ ਤੋਂ ਸਿੱਧੇ ਸਕ੍ਰੀਨਸ਼ਾਟ ਖਿੱਚ ਸਕਦੇ ਹਾਂ.

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

ਅਨੰਦ ਲਓ!

