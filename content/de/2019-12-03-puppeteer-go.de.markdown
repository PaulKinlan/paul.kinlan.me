---
slug: puppeteer-go
date: 2019-12-03T02:28:20.904Z
title: Puppeteer Go
link: 'https://github.com/PaulKinlan/puppeteer-go'
tags: [the headless web, puppeteer, headless]
---

Ich liebe Puppenspieler - hier kann ich mit den Ideen von [The Headless Web](https://paul.kinlan.me/the-headless-web/) - der das Web in einem Browser ohne sichtbaren Browser [DOM-curl](https://paul.kinlan.me/domcurl/) und sogar Tools wie [DOM-curl](https://paul.kinlan.me/domcurl/) (Curl, der JavaScript [DOM-curl](https://paul.kinlan.me/domcurl/) ) erstellt. Ich liebe es, Skripte für den Browser zu erstellen, um Seiten zu bearbeiten und mit ihnen zu interagieren.

Eine Demo, die ich machen wollte, wurde von [Capturing 422 live images](https://bitsofco.de/how-i-created-488-live-images/) Post inspiriert, in dem sie ein Puppenspielskript [Capturing 422 live images](https://bitsofco.de/how-i-created-488-live-images/) , das zu vielen Seiten navigierte und einen Screenshot machte. Anstatt auf viele Seiten zu gehen, wollte ich viele Screenshots von Elementen auf der Seite machen.

Das Problem, das ich mit Puppeteer habe, ist die Eröffnungs-Strophe, die Sie brauchen, um etwas zu tun. Starten, Tab öffnen, navigieren - es ist nicht komplex, es ist nur mehr Boilerplate, als ich für einfache Skripte erstellen möchte. Deshalb habe ich [Puppeteer Go](https://github.com/PaulKinlan/puppeteer-go) . Es ist nur ein kleines Skript, mit dem ich auf einfache Weise CLI-Dienstprogramme erstellen kann. Es öffnet den Browser, navigiert zu einer Seite, führt _Ihre_ Aktion aus und bereinigt sich anschließend von selbst.

Hör zu.

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

Der obige Code findet das Element h1 in meinem Blog und macht einen Screenshot. Dies ist bei weitem nicht so gut wie die Arbeit von Ire, aber ich fand es klasse zu sehen, ob wir Screenshots von canisuse.com schnell direkt von der Seite ziehen können.

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

Genießen!

