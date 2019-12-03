---
slug: puppeteer-go
date: 2019-12-03T02:28:20.904Z
title: Puppeteer Go
link: 'https://github.com/PaulKinlan/puppeteer-go'
tags: [the headless web, puppeteer, headless]
---

Adoro o Puppeteer - ele me permite brincar com as idéias do [The Headless Web](https://paul.kinlan.me/the-headless-web/) - que estão rodando a web em um navegador sem um navegador visível e até mesmo construir ferramentas como o [DOM-curl](https://paul.kinlan.me/domcurl/) (Curl que executa JavaScript). Adoro especificamente o script do navegador para raspar, manipular e interagir com as páginas.

Uma demonstração que eu queria fazer foi inspirada no post [Capturing 422 live images](https://bitsofco.de/how-i-created-488-live-images/) de Ire, onde ela executava um script de marionetista que navegava por muitas páginas e fazia uma captura de tela. Em vez de ir para muitas páginas, eu queria tirar muitas capturas de tela de elementos na página.

O problema que tenho com o Puppeteer é a estrofe de abertura de que você precisa fazer qualquer coisa. Iniciar, abrir guia, navegar - não é complexo, é apenas mais um padrão do que eu quero criar para scripts simples. Por isso criei o [Puppeteer Go](https://github.com/PaulKinlan/puppeteer-go) . É apenas um pequeno script que me ajuda a criar utilitários CLI facilmente, que abre o navegador, navega para uma página, executa sua ação e depois limpa-se.

Confira.

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

O código acima encontrará o elemento h1 no meu blog e fará uma captura de tela. Isso não é nem de longe tão bom quanto o trabalho de Ire, mas achei que era legal ver se conseguimos obter rapidamente capturas de tela do canisuse.com diretamente da página.

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

Apreciar!

