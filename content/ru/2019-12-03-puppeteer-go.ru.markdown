---
slug: puppeteer-go
date: 2019-12-03T02:28:20.904Z
title: Puppeteer Go
link: 'https://github.com/PaulKinlan/puppeteer-go'
tags: [the headless web, puppeteer, headless]
---

Я люблю Puppeteer - он позволяет мне поиграть с идеями <a <span class="notranslate">href=&quot;https://paul.kinlan.me/the-headless-web/&quot; &gt;The Headless Web</a> - который работает в браузере без видимого браузера. и даже создавать инструменты, такие как <a <span class="notranslate">href=&quot;https://paul.kinlan.me/domcurl/&quot; &gt;DOM-curl</a> (Curl, который запускает JavaScript). В частности, я люблю писать скрипты в браузере, чтобы очищать страницы, манипулировать ими и взаимодействовать с ними.

Одна демонстрация, которую я хотел сделать, была вдохновлена Ire&#39;s <a <span class="notranslate">href=&quot;https://bitsofco.de/how-i-created-488-live-images/&quot; &gt;Capturing 422 live images</a> где она запустила сценарий кукловода, который переместится к много страниц и сделай скриншот. Вместо того, чтобы переходить на много страниц, я хотел сделать много скриншотов элементов на странице.

Проблема, с которой я столкнулся с Puppeteer, - это вступительная строфа, в которой вам нужно что-то делать Запустить, открыть вкладку, перемещаться - это не сложно, это всего лишь шаблон, который я хочу создать для простых скриптов. Вот почему я создал <a <span class="notranslate">href=&quot;https://github.com/PaulKinlan/puppeteer-go&quot; &gt;Puppeteer Go</a> . Это всего лишь небольшой скрипт, который помогает мне легко создавать утилиты CLI, который открывает браузер, переходит на страницу, выполняет действие _your_, а затем убирает за собой.

Проверьте это.

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

Приведенный выше код найдет элемент h1 в моем блоге и сделает снимок экрана. Это далеко не так хорошо, как работа Ire, но я подумал, что было бы неплохо посмотреть, сможем ли мы быстро получить скриншоты с canisuse.com прямо со страницы.

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

Наслаждайтесь!

