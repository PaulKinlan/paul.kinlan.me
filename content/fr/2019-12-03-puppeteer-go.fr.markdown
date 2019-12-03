---
slug: puppeteer-go
date: 2019-12-03T02:28:20.904Z
title: Puppeteer Go
link: 'https://github.com/PaulKinlan/puppeteer-go'
tags: [the headless web, puppeteer, headless]
---

J&#39;adore Puppeteer - cela me permet de jouer avec les idées de <a <span class="notranslate">href=&quot;https://paul.kinlan.me/the-headless-web/&quot; &gt;The Headless Web</a> - qui exécute le Web dans un navigateur sans navigateur visible et même construire des outils comme <a <span class="notranslate">href=&quot;https://paul.kinlan.me/domcurl/&quot; &gt;DOM-curl</a> (Curl qui exécute JavaScript). En particulier, j&#39;adore écrire des scripts dans le navigateur pour gratter, manipuler et interagir avec des pages.

Une démo que je voulais faire était inspirée par la <a <span class="notranslate">href=&quot;https://bitsofco.de/how-i-created-488-live-images/&quot; &gt;Capturing 422 live images</a> d&#39;Ire&gt; d&#39;Ire <a <span class="notranslate">href=&quot;https://bitsofco.de/how-i-created-488-live-images/&quot; &gt;Capturing 422 live images</a> lesquelles elle exécutait un script de marionnettiste qui lui permettrait de naviguer plusieurs pages et prenez une capture d&#39;écran. Au lieu d&#39;aller sur plusieurs pages, je voulais prendre de nombreuses captures d&#39;écran des éléments de la page.

Le problème que j&#39;ai avec Puppeteer est la strophe d&#39;ouverture sur laquelle vous devez faire quelque chose. Lancement, onglet Ouvrir, navigation - ce n’est pas complexe, c’est plus que ce que je veux créer pour de simples scripts. C&#39;est pourquoi j&#39;ai créé <a <span class="notranslate">href=&quot;https://github.com/PaulKinlan/puppeteer-go&quot; &gt;Puppeteer Go</a> . C&#39;est juste un petit script qui m&#39;aide à créer facilement des utilitaires CLI qui ouvrent le navigateur, accèdent à une page, effectuent l&#39;action _votre_ et se nettoient ensuite.

Vérifiez-le.

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

Le code ci-dessus va trouver l&#39;élément h1 dans mon blog et prendre une capture d&#39;écran. C’est loin d’être aussi bon que le travail d’Ire, mais j’ai pensé qu’il était intéressant de voir si nous pouvons rapidement extraire des captures d’écran de canisuse.com directement à partir de la page.

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

Prendre plaisir!

