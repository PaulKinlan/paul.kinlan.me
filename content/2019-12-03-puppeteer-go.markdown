---
date: 2019-12-03 02:28:20.904000+00:00
link: https://github.com/PaulKinlan/puppeteer-go
slug: puppeteer-go
summary: I've created Puppeteer Go, a small JavaScript library to simplify the process
  of creating CLI utilities with Puppeteer.  It handles the boilerplate of launching
  the browser, opening a tab, navigating to a URL, performing a specified action,
  and cleaning up.  This post demonstrates its usage by taking multiple screenshots
  of elements on a page, inspired by Ire Aderinokun's work.  Examples include capturing
  screenshots of `h1` elements on my blog and feature blocks on caniuse.com.
tags:
- puppeteer
- headless web
- automation
- javascript
- cli
- screenshots
- web scraping
title: Puppeteer Go

---

I love Puppeteer - it lets me play around with the ideas of [The Headless Web](https://paul.kinlan.me/the-headless-web/) - that is running the web in a browser without a visible browser and even build tools like [DOM-curl](https://paul.kinlan.me/domcurl/) (Curl that runs JavaScript). Specifically I love scripting the browser to scrape, manipulate and interact with pages.

One demo I wanted to make was inspired by Ire's [Capturing 422 live images](https://bitsofco.de/how-i-created-488-live-images/) post where she ran a puppeteer script that would navigate to many pages and take a screenshot. Instead of going to many pages, I wanted to take many screenshots of elements on the page.

The problem that I have with Puppeteer is the opening stanza that you need to do anything. Launch, Open tab, navigate - it's not complex, it's just more boilerplate than I want to create for simple scripts. That's why I created [Puppeteer Go](https://github.com/PaulKinlan/puppeteer-go). It's just a small script that helps me build CLI utilities easily that opens the browser, navigates to a page, performs _your_ action and then cleans up after itself.

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

