---
slug: creating-a-popout-iframe-with-adoptnode-and-magic-iframes
date: 2019-10-06T20:58:16.791Z
title: 'Creating a pop-out iframe with adoptNode and "magic iframes"'
tags: [iframe, popout, adoptNode]
---

Atualização do ### : 8 de outubro - Problemas significativos com este documento.

Eu [Jake Archibald](https://jakearchibald.com/) com o [Jake Archibald](https://jakearchibald.com/) sobre este post porque achava que tinha algo novo. Durante a conversa, descobrimos muitas coisas que invalidam parte deste post e também aprendi muito no processo que não acho que a maioria dos desenvolvedores conhecer.

* Chamar `.append()` e `.appendChild()` adota o nó. Isso torna inútil o uso do `adoptNode` nesta instância, porque o algoritmo anexado garante que o nó seja adotado. Isso não foi mencionado nos documentos MDN, mas está no [spec](https://dom.spec.whatwg.org/#concept-node-append) . Preciso voltar e exercitar-me por que tive um problema anteriormente, mas suspeito que foi porque eu estava originalmente tentando anexar uma `DocumentFragment` . Isso significa que as `w.document.body.appendChild(document.adoptNode(airhornerIframe));` e `w.document.body.appendChild(airhornerIframe);` terão o mesmo efeito.
* Enquanto os elementos DOM mantêm seu estado (verifique o elemento personalizado), se um iframe for movido no DOM, ele será recarregado. Período. Isso significa que movê-lo entre iframes não manterá o estado como eu havia testado originalmente, acredito que isso ocorreu devido ao fato de o SW carregar a página incrivelmente rapidamente. A API de portais pode não ser afetada por isso - portanto, no futuro, essa experiência deve funcionar :)

O conceito de mover elementos entre documentos ainda é válido e interessante, mas o benefício para iframes não existe. Percebi que os elementos de vídeo foram redefinidos quando movidos entre janelas e eu deveria ter sido mais diligente ao verificar se o iframe não redefiniu seu estado.

Como sempre, você pode ver as [commit history for this post](https://github.com/PaulKinlan/paul.kinlan.me/commits/main/content/en/2019-10-06-creating-a-popout-iframe-with-adoptnode-and-magic-iframes.markdown) .

### Post original Quando entrei no Google em 2010, me deparei com um documento que mencionava um conceito no gmail chamado &#39; [magic iframes](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf) &#39;, que tinha um nome legal e o conceito era novo.

> * Targeted at apps with multiple windows
> * All code and data go into an IFRAME
> * If window hosting the IFRAME unloads, it gets adopted by another of the windows
> * In Gmail for example:
>   * Tearoff / pop-out compose creates bare window that is filled by code in IFRAME in main window
>   * If you close the main window, the code looks for a tear-off that can accept the IFRAME and moves it
>   * You finish your compose and can still send the email
> * Old way: create new instance of Gmail tailored to the task.

- [Adam de Boor](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf)

O conceito é que muitos aplicativos precisam carregar muito JavaScript complexo, mesmo para um &#39;pequeno componente&#39;, como a janela de composição no gmail, você pode carregar os componentes do aplicativo em uma `iframe` qual o usuário possa interagir na janela principal, que você pode &quot;destacar&quot; e passar para uma nova janela quando o botão &quot;compor em nova janela&quot; for usado. Eu não estava confiante o suficiente para falar com o autor (e ainda não o fiz, nem procurei na fonte do Gmail para ver se ele realmente foi usado), mas ele ficou na minha mente principalmente porque o nome era enigmático .

Pule 10 anos adiante, eu estava em uma longa viagem de trem e comecei a investigar uma área que eu não conhecia muito sobre a API `adoptNode` . Joguei com um [lot of ideas](https://nifty-meadowlark.glitch.me/) e percebi que é possível mover elementos DOM, seu estado atual e seus manipuladores de eventos anexados para novas janelas. Isso me lembrou &#39;iframes mágicos&#39; e, finalmente, levou à idéia de que você pode criar um iframe pop-out (um iframe pop-out é um vídeo Picture in Picture, mas para elementos iframe)

O código para o iframe pop-out é bastante simples:

```html
<iframe src="https://airhorner.com" id="airhorner"> </iframe>

<button id="adoptIframeButton">
  Popout iframe into new window (adoptNode)
</button>

<script>
 adoptIframeButton.addEventListener("click", () => {
    const airhornerIframe = document.getElementById("airhorner");
    const width = airhornerIframe.clientWidth;
    const height = airhornerIframe.clientHeight;
    const w = window.open("blank.html", "", `top=100,width=${width},height=${height}`);
    w.addEventListener("load", () => {
      w.document.body.appendChild(airhornerIframe);
    });
 });
</script>
```

<iframe src="https://airhorner.com" id="airhorner"> </iframe>

<button id="adoptIframeButton">
  Popout iframe into new window (adoptNode)
</button>

<script>
 adoptIframeButton.addEventListener("click", () => {
    const airhornerIframe = document.getElementById("airhorner");
    const width = airhornerIframe.clientWidth;
    const height = airhornerIframe.clientHeight;
    const w = window.open("/blank.html", "", `top=100,width=${width},height=${height}`);
    w.addEventListener("load", () => {
      w.document.body.appendChild(airhornerIframe);
    });
 });
</script>

`adoptNode` permite que você mova elementos DOM com seu estado atual, mantendo seus manipuladores de eventos vinculados existentes, entre documentos no navegador - que pode ser um novo DOM dentro da janela atual ou, como no caso desta demonstração, pode estar movendo um já `iframe` carregado em outra janela que está na mesma origem. (Veja a atualização acima).

Mover um iframe é interessante porque significa que você não precisa reiniciar o conteúdo do iframe; a instância é apenas movida. Existem algumas desvantagens:

1. O URL permanece na origem atual e não na origem iframe, embora isso possa ser algo que a API `<portal>` possa resolver.
2. Se você estiver movendo um elemento personalizado, ou algo que tenha sua lógica hospedada no abridor - se você fechar o abridor, a execução será interrompida.

Desvantagens à parte, achei que esse mecanismo IPC no nível DOM era muito, muito interessante. [demo page](https://nifty-meadowlark.glitch.me/) com o [demo page](https://nifty-meadowlark.glitch.me/) ( [src](https://glitch.com/edit/#!/nifty-meadowlark?path=script.js) ) e deixe-me saber se você tem alguma idéia interessante sobre onde isso pode ser usado.

