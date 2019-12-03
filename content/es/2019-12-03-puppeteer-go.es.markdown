---
slug: puppeteer-go
date: 2019-12-03T02:28:20.904Z
title: Puppeteer Go
link: 'https://github.com/PaulKinlan/puppeteer-go'
tags: [the headless web, puppeteer, headless]
---

Me encanta Puppeteer, me permite jugar con las ideas de [The Headless Web](https://paul.kinlan.me/the-headless-web/) , que es ejecutar la web en un navegador sin un navegador visible e incluso crear herramientas como [DOM-curl](https://paul.kinlan.me/domcurl/) (Curl que ejecuta JavaScript). Específicamente, me encanta crear scripts en el navegador para raspar, manipular e interactuar con las páginas.

Una demostración que quería hacer se inspiró en la publicación [Capturing 422 live images](https://bitsofco.de/how-i-created-488-live-images/) de Ire, donde ejecutó un guión titiritero que [Capturing 422 live images](https://bitsofco.de/how-i-created-488-live-images/) por muchas páginas y tomaría una captura de pantalla. En lugar de ir a muchas páginas, quería tomar muchas capturas de pantalla de elementos en la página.

El problema que tengo con Puppeteer es la estrofa de apertura que necesitas para hacer cualquier cosa. Iniciar, abrir pestaña, navegar: no es complejo, es más repetitivo de lo que quiero crear para scripts simples. Por eso creé [Puppeteer Go](https://github.com/PaulKinlan/puppeteer-go) . Es solo un pequeño script que me ayuda a crear utilidades CLI fácilmente que abre el navegador, navega a una página, realiza su acción y luego se limpia después de sí mismo.

Echale un vistazo.

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

El código anterior encontrará el elemento h1 en mi blog y tomará una captura de pantalla. Esto no es tan bueno como el trabajo de Ire, pero pensé que era bueno ver si podemos obtener rápidamente capturas de pantalla de canisuse.com directamente desde la página.

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

¡Disfrutar!

