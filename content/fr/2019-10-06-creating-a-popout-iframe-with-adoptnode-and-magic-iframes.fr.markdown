---
slug: creating-a-popout-iframe-with-adoptnode-and-magic-iframes
date: 2019-10-06T20:58:16.791Z
title: 'Creating a pop-out iframe with adoptNode and "magic iframes"'
tags: [iframe, popout, adoptNode]
---

### Mise à jour: 8 octobre - Problèmes importants avec ce doc.

J&#39;ai rattrapé [Jake Archibald](https://jakearchibald.com/) propos de ce post parce que je pensais avoir quelque chose de nouveau. Au cours de la conversation, nous avons découvert beaucoup de choses qui rendent certains de ces posts invalides, et j&#39;ai également beaucoup appris au cours du processus que la plupart des développeurs ne pensent pas connaître.

* L&#39;appel de `.append()` et `.appendChild()` adopte le nœud. Cela rend l&#39;utilisation de `adoptNode` dans cette instance inutile car l&#39;algorithme append garantit que le nœud est adopté. Cela n&#39;a pas été mentionné dans la documentation MDN, mais dans le [spec](https://dom.spec.whatwg.org/#concept-node-append) . J&#39;ai besoin de revenir en arrière et de m&#39;entraîner pour savoir pourquoi j&#39;avais un problème plus tôt, mais je suppose que c&#39;est parce que j&#39;essayais à l&#39;origine d&#39;ajouter un `DocumentFragment` . Cela signifie que `w.document.body.appendChild(document.adoptNode(airhornerIframe));` et `w.document.body.appendChild(airhornerIframe);` auront le même effet.
* Bien que les éléments DOM conservent leur état (cochez l&#39;élément personnalisé), si un iframe est déplacé dans le DOM, il est rechargé. Période. Cela signifie que le déplacer entre iframes ne gardera pas l&#39;état comme je l&#39;avais testé à l&#39;origine, je pense que cela était dû au fait que le SW chargeait la page incroyablement rapidement. Cela n&#39;affectera peut-être pas l&#39;API des portails - cette expérience devrait donc fonctionner à l&#39;avenir :)

Le concept de déplacement d&#39;éléments entre documents est toujours valable et intéressant, mais l&#39;avantage pour iframes n&#39;existe pas. J&#39;ai remarqué que les éléments vidéo ont été réinitialisés lorsqu&#39;ils ont été déplacés d&#39;une fenêtre à l&#39;autre et que j&#39;aurais dû faire plus attention en vérifiant que l&#39;iframe ne réinitialise pas réellement son état.

Comme toujours, vous pouvez voir le [commit history for this post](https://github.com/PaulKinlan/paul.kinlan.me/commits/main/content/en/2019-10-06-creating-a-popout-iframe-with-adoptnode-and-magic-iframes.markdown) .

### Original post Lorsque j&#39;ai rejoint Google en 2010, je suis tombé sur un document qui mentionnait un concept dans gmail appelé &quot; [magic iframes](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf) &quot;. [magic iframes](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf) nom était cool et le concept était nouveau.

> * Targeted at apps with multiple windows
> * All code and data go into an IFRAME
> * If window hosting the IFRAME unloads, it gets adopted by another of the windows
> * In Gmail for example:
>   * Tearoff / pop-out compose creates bare window that is filled by code in IFRAME in main window
>   * If you close the main window, the code looks for a tear-off that can accept the IFRAME and moves it
>   * You finish your compose and can still send the email
> * Old way: create new instance of Gmail tailored to the task.

- [Adam de Boor](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf)

Le concept est que beaucoup d&#39;applications doivent charger beaucoup de JavaScript complexe même pour un &quot;petit composant&quot; tel que la fenêtre de composition dans gmail, vous pouvez charger les composants de l&#39;application dans un `iframe` lequel l&#39;utilisateur peut interagir dans la fenêtre principale. que vous pouvez ensuite &quot;déchirer&quot; et passer à une nouvelle fenêtre lorsque vous cliquez sur le bouton &quot;composer dans une nouvelle fenêtre&quot;. Je n&#39;avais pas assez confiance en moi pour parler à l&#39;auteur (et je ne l&#39;ai toujours pas fait, pas plus que je n&#39;ai regardé la source de gmail pour voir s&#39;il a déjà été utilisé), mais cela est resté dans ma mémoire surtout parce que le nom était énigmatique. .

`adoptNode` je faisais un long trajet en train et j&#39;ai commencé à enquêter sur un domaine que je ne connaissais pas beaucoup au sujet de l’API `adoptNode` . J&#39;ai joué avec un [lot of ideas](https://nifty-meadowlark.glitch.me/) et j&#39;ai réalisé qu&#39;il était possible de déplacer des éléments DOM, leur état actuel et leurs gestionnaires d&#39;événements attachés dans de nouvelles fenêtres. Cela m’a rappelé les «iframes magiques» et a finalement conduit à l’idée que vous pouvez créer un iframe sortant (un iframe sortant est une vidéo Picture in Picture mais pour des éléments iframe).

Le code de l&#39;iframe sortant est assez simple:

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

`adoptNode` vous permet de déplacer les éléments DOM avec leur état actuel tout en conservant leurs gestionnaires d&#39;événements liés existants, entre les documents du navigateur. Il peut s&#39;agir d&#39;un nouveau DOM dans la fenêtre actuelle ou, dans le cas de cette démonstration, déplacer un élément déjà existant. chargé `iframe` dans une autre fenêtre ayant la même origine. (Voir mise à jour ci-dessus).

Déplacer une iframe est intéressant car cela signifie que vous n&#39;avez pas à redémarrer le contenu de l&#39;iframe, l&#39;instance est simplement déplacée. Il y a quelques inconvénients:

1. L&#39;URL reste sur l&#39;origine actuelle et non sur l&#39;iframe, bien que l&#39;API `<portal>` puisse résoudre ce problème.
2. Si vous déplacez un élément personnalisé ou quelque chose dont la logique est hébergée sur l&#39;ouvre-porte - si vous fermez l&#39;ouvre-porte, l&#39;exécution sera interrompue.

Inconvénients mis à part, je pensais que ce mécanisme IPC de niveau DOM était très très intéressant. Amusez-vous avec [demo page](https://nifty-meadowlark.glitch.me/) ( [src](https://glitch.com/edit/#!/nifty-meadowlark?path=script.js) ) et [src](https://glitch.com/edit/#!/nifty-meadowlark?path=script.js) -moi si vous avez des idées intéressantes pour savoir où cela pourrait être utilisé.

