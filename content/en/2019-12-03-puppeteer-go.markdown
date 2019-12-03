---
slug: puppeteer-go
date: 2019-12-03T02:28:20.904Z
title: Puppeteer Go
link: 'https://github.com/PaulKinlan/puppeteer-go'
tags: [the headless web, puppeteer, headless]
---

I love Puppeteer - it lets me play around with the ideas of <a href="https://paul.kinlan.me/the-headless-web/">The Headless Web</a>&nbsp;- that is running the web in a browser without a visible browser and even build tools like <a href="https://paul.kinlan.me/domcurl/">DOM-curl</a>&nbsp;(Curl that runs JavaScript). Specifically I love scripting the browser to scrape, manipulate and interact with pages.

One demo I wanted to make was inspired by Ire's <a href="https://bitsofco.de/how-i-created-488-live-images/">Capturing 422 live images</a>&nbsp;post where she ran a puppeteer script that would navigate to many pages and take a screenshot. Instead of going to many pages, I wanted to take many screenshots of elements on the page.

The problem that I have with Puppeteer is the opening stanza that you need to do anything. Launch, Open tab, navigate - it's not complex, it's just more boilerplate than I want to create for simple scripts. That's why I created <a href="https://github.com/PaulKinlan/puppeteer-go">Puppeteer Go</a>. It's just a small script that helps me build CLI utilities easily that opens the browser, navigates to a page, performs _your_ action and then cleans up after itself.

Check it out.

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

The above code will find the h1 element in my blog and take a screenshot. This is nowhere near as good as Ire's work, but I thought it was neat to see if we can quickly pull screenshots from canisuse.com directly from the page.

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

Enjoy!

