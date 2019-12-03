---
slug: puppeteer-go
date: 2019-12-03T02:28:20.904Z
title: Puppeteer Go
link: 'https://github.com/PaulKinlan/puppeteer-go'
tags: [the headless web, puppeteer, headless]
---

Saya suka Puppeteer - ini memungkinkan saya bermain-main dengan ide-ide [The Headless Web](https://paul.kinlan.me/the-headless-web/) - yang menjalankan web di browser tanpa browser yang terlihat dan bahkan membangun alat-alat seperti [DOM-curl](https://paul.kinlan.me/domcurl/) (Curl yang menjalankan JavaScript). Secara khusus saya suka membuat skrip pada browser untuk mengikis, memanipulasi, dan berinteraksi dengan halaman.

Satu demo yang ingin saya buat terinspirasi oleh posting [Capturing 422 live images](https://bitsofco.de/how-i-created-488-live-images/) Ire di mana ia menjalankan skrip dalang yang akan menavigasi ke banyak halaman dan mengambil tangkapan layar. Alih-alih pergi ke banyak halaman, saya ingin mengambil banyak screenshot elemen di halaman.

Masalah yang saya miliki dengan Dalang adalah bait pembuka yang perlu Anda lakukan apa pun. Luncurkan, Buka tab, navigasi - ini tidak rumit, hanya lebih sederhana daripada yang ingin saya buat untuk skrip sederhana. Itu sebabnya saya membuat [Puppeteer Go](https://github.com/PaulKinlan/puppeteer-go) . Itu hanya skrip kecil yang membantu saya membangun utilitas CLI dengan mudah yang membuka browser, menavigasi ke halaman, melakukan tindakan _your_ dan kemudian membersihkan sendiri.

Saksikan berikut ini.

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

Kode di atas akan menemukan elemen h1 di blog saya dan mengambil tangkapan layar. Ini sama sekali tidak sebagus karya Ire, tapi saya pikir itu rapi untuk melihat apakah kita dapat dengan cepat menarik tangkapan layar dari canisuse.com langsung dari halaman.

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

Nikmati!

