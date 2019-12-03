---
slug: puppeteer-go
date: 2019-12-03T02:28:20.904Z
title: Puppeteer Go
link: 'https://github.com/PaulKinlan/puppeteer-go'
tags: [the headless web, puppeteer, headless]
---

Puppeteerが大好きです[The Headless Web](https://paul.kinlan.me/the-headless-web/)のアイデアで[The Headless Web](https://paul.kinlan.me/the-headless-web/)で[The Headless Web](https://paul.kinlan.me/the-headless-web/) -目に見えるブラウザーのないブラウザーでWebを実行し、さらに[DOM-curl](https://paul.kinlan.me/domcurl/) （JavaScriptを実行するCurl）のようなツールを作成します。具体的には、ページをスクレイピング、操作、および対話するためのブラウザのスクリプト作成が大好きです。

私が作りたかったデモの1つは、Ireの[Capturing 422 live images](https://bitsofco.de/how-i-created-488-live-images/)投稿に触発され、そこで彼女は多くのページにナビゲートしてスクリーンショットを撮る操り人形スクリプトを実行しました。多くのページに行く代わりに、ページ上の要素のスクリーンショットをたくさん撮りたかった。

私がPuppeteerで抱えている問題は、あなたが何でもする必要がある最初のスタンザです。起動、タブを開く、ナビゲート-複雑ではなく、単純なスクリプト用に作成するよりも定型的なだけです。それが[Puppeteer Go](https://github.com/PaulKinlan/puppeteer-go)を作成した[Puppeteer Go](https://github.com/PaulKinlan/puppeteer-go)です。これは、ブラウザを開いてページにナビゲートし、_your_アクションを実行し、その後自動的にクリーンアップするCLIユーティリティを簡単に作成するのに役立つ小さなスクリプトです。

見てみな。

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

上記のコードは私のブログでh1要素を見つけ、スクリーンショットを撮ります。これはIreの仕事ほど優れたものではありませんが、canisuse.comからページから直接スクリーンショットをすばやく取得できるかどうかを確認するのは素晴らしいと思いました。

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

楽しい！

