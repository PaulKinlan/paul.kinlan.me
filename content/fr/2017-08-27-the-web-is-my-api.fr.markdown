---
slug: the-web-is-my-api
date: 2017-08-27T13:20:31.000Z
title: "The Web is my API"
image_header: /images/bridges.png
tags: ["intents"]
---


[Michael Mahemoff](http://softwareas.com) m'a beaucoup appris sur les possibilités du web. Avant de travailler avec Mike, j'ai construit sur le Web et j'ai compris les avantages tels que la liaison et la découverte, mais je n'ai jamais vraiment eu une idée complète de ce qui serait possible.

Une chose que Mike a dite était "[le Web est mon API](http://softwareas.com/cors-scraping-and-microformats/)", où il parlait de la possibilité d'exposer votre site et vos données sur une page via des microformats et d'autres données structurées et d'y accéder directement depuis un autre autre contexte de navigateur, utilisant un XMLHttpRequest simple et l'API CORS:

>Anyway, what’s cool about this is you can treat the web as an API. The Web is
>my API. "Scraping a web page" may sound dirtier than "consuming a web service",
>but it’s the cleaner approach in principle. A website sitting in your browser
>is a perfectly human-readable depiction of a resource your program can get hold
>of, so it’s an API that’s self-documenting. The best kind of API. But a whole
>HTML document is a lot to chew on, so we need to make sure it’s structured
>nicely, and that’s where microformats come in, gloriously defining lightweight
>standards for declaring info in your web page. There’s another HTML5 tie-in
>here, because we now have a similar concept in the standard, microdata.


C'était à peu près au même moment que je commençais à travailler sur [Web Intents](https://en.wikipedia.org/wiki/Web_Intents), dont l'esprit était similaire & mdash; donner aux utilisateurs l'accès aux données et aux services d'une autre origine & mdash; mais c'était beaucoup plus complexe. Je voulais permettre la découverte de services et ensuite interagir avec ces pages. Et Mike voulait déplacer le Web pour fournir un accès aux données et aux services. Il est resté avec moi. [Même si j'ai oublié l'attribution originale](https://twitter.com/Paul_Kinlan/status/913000817170534400).

J'ai récemment fait un exposé pour JS Nordic, où j'ai souligné que nous ne construisions pas vraiment des services interconnectés sur le Web, et lorsque nous le faisons, nous suivons un modèle d'interactions entre serveurs. C'est-à-dire qu'un site Web s'intègrera à un service tiers en acheminant toutes les demandes d'API via leur serveur vers le service distant et en gérant toutes les complexités inhérentes.

{{<figure src = "/ images / server-server.png" title = "Serveur à serveur - comme créer un tunnel entre services">}}

Cela fonctionne, nous avons un site Web entièrement construit avec cela, mais il peut être incroyablement complexe lorsque vous considérez l'authentification, l'autorisation, les protocoles de transport et les différentes méthodes RPC (REST, GraphQL, etc.). Mike proposait quelque chose de beaucoup plus élégant: avec les sites compatibles CORS et un peu de JavaScript, nous pouvons parler directement au service distant en utilisant le site.

{{<figure src = "/ images / server-rpc.png" title = "Mon dessin terrible que je décrivais Client à serveur">}}

Il y a eu quelques problèmes entre les deux. Le principal problème est que même si CORS est largement pris en charge dans les navigateurs, les développeurs l’utilisent rarement. CORS est une protection dont nous avons besoin sur le Web, mais il est difficile à configurer et à déboguer, et le "Web en tant qu'API" n'a pas vraiment été trop poussé.

{{<figure src = "/ images / server-rpc-nope.png" title = "CORS se met en travers de la route">}}

Nous évoluons vers un monde où les sites Web générés par JS sont générés et où les sessions et l’état de l’utilisateur sont entièrement gérés par le client.

Nous avons toujours besoin de la capacité de communiquer de nos sites à un service distant, et je crois fermement que nous devons décentraliser nos intégrations avec d'autres sites et applications, mais la première chose à faire est de connecter nos sites et nos applications ensemble. loin c'est plus qu'un simple lien. Nous avons besoin que nos sites exposent leurs capacités et fonctionnalités directement à d'autres fenêtres sur le système des utilisateurs.

Chaque site Web doit pouvoir exposer une API que le propriétaire du site contrôle directement aux autres clients.

{{<figure src = "/ images / client-rpc.png" title = "Client au client">}}

La bonne nouvelle est que nous pouvons déjà le faire, nous avons les primitives sur la plate-forme depuis au moins 7 ans (`postMessage` et` MessageChannel`), et pour toujours depuis `window.open`, mais nous n'utilisons pas Ces outils pour interagir avec des sites pour des raisons similaires pour lesquelles nous n'utilisons pas CORS: C'est difficile et il est presque impossible de définir une API saine, simple et cohérente à utiliser et qui ne nécessite pas de tirer des bibliothèques tierces énormes pour chaque service. avec lequel vous voulez interagir.

La plate-forme vous permet uniquement de communiquer entre les sites en utilisant la transmission de messages, ce qui signifie qu'en tant que propriétaire de service, vous devez créer une machine d'état qui sérialise les messages dans un état, y réagit et envoie ensuite un message. message au client, puis vous devez créer une bibliothèque qui le fait pour le développeur qui consomme votre service. C'est incroyablement complexe et compliqué et je pense que c'est l'une des principales raisons pour lesquelles nous n'avons pas vu plus d'adoption de Web Workers et d'API côté client.

{{<figure src = "/ images / window-dx.png" title = "Expérience du développeur de la fenêtre postMessage">}}

Nous avons une bibliothèque qui aide: [Comlink](https://github.com/GoogleChromeLabs/comlink).

Comlink est une petite API qui résume les API `MessageChannel` et` postMessage` dans une API qui ressemble à une instance de classes et de fonctions distantes dans le contexte local. Par exemple:


**Site Internet**


```javascript
// Set up.
const worker = w.open('somesite');
const api = Comlink.proxy(w);

// Use the API.
const work = await new api.Test();
const str = await work.say('Yo!');
console.log(str);
```



** Web Worker **


```javascript
class Test {
  say() {
    return `Hi ${this.x++}, ${msg}`;
  }
}

// Expose the API to anyone who connects.
Comlink.expose({Test}, window);
```


{{<figure src = "/ images / comlink.png" title = "Comlink">}}

Nous exposons une API sur le service, nous consommons l'API dans le client via un proxy.

### Y a-t-il un meilleur exemple?

J'ai construit un [site qui s'abonne à un noeud final pubsubhubbub et, lorsqu'il reçoit un ping, il envoie un message JSON](https://rss-to-web-push.glitch.me/) à un noeud final défini par l'utilisateur. Je ne voulais pas gérer l'infrastructure de notification push pour cette petite application, un autre site que j'ai construit ([webpush.rocks](https://webpush.rocks/)) peut faire tout cela, je veux juste utiliser l'intégration avec ce service.

Mais comment puis-je récupérer l'URL de l'abonnement (la donnée dont j'ai besoin pour envoyer des notifications) dans le client de webpush.rocks sur mon site?

Lorsque j'ai initialement créé ce site, tout ce que vous pouviez faire était de laisser l'utilisateur ouvrir le site, puis de copier et coller l'URL entre les pages. Pourquoi ne pas simplement exposer une API que n'importe quel site pourrait utiliser? C'est ce que j'ai fait.

webpush.rocks définit une API appelée `PushManager` qui contient une méthode unique` subscriptionId`. Lorsque la page se charge, elle expose cette API à la fenêtre comme suit:


```javascript
class PushManager {
  constructor() {
  }

  async subscriptionId() {
    //global var ick...
    let reg = await navigator.serviceWorker.getRegistration();
    let sub = await reg.pushManager.getSubscription();
    if(sub) {
        return `${location.origin}/send?id=${sub.endpoint}`;
    }
    else {
        return ``;
    }
  }
}

Comlink.expose({PushManager}, window);
```


L'API interagit avec l'API `PushSubscriptionManager` dans le DOM et renvoie une URL personnalisée au site appelant. L'important est que, comme il s'exécute de manière asynchrone, je peux attendre la vérification de l'utilisateur qu'il souhaite effectuer l'action (ou non).

Retour sur le site client appelant (l'application qui veut obtenir l'ID d'abonnement). Lorsqu'un utilisateur clique sur le lien, nous obtenons une référence à la fenêtre que nous venons d'ouvrir et connectons-lui notre proxy `Comlink`. L'API de service est maintenant exposée à notre client et nous pouvons instancier l'API `PushManager` comme s'il s'agissait d'un service local, mais interagit avec le service d'instance distante dans l'autre fenêtre.


```javascript
let endpointWindow = window.open('', 'endpointUrlWindow');

let pushAPI = Comlink.proxy(endpointWindow);
let pm = await new pushAPI.PushManager();
let id = await pm.subscriptionId();

// Update the UI.
endpointUrlEl.value = id;
```


Voici une vidéo très rapide de ce qui se passe. Une interaction très simple et légère, il ouvre le service et obtient alors l'ID dont il a besoin.

{{<youtube vTYZXx31EHc>}}

En tant que fournisseur de services, j'ai exposé un ensemble limité de fonctionnalités uniquement disponibles sur le client sur un autre site et je peux le sécuriser et demander le consentement de l'utilisateur en même temps avant de renvoyer les données à l'utilisateur, le tout avec un simple utiliser l'API.

_Le Web est l'API._

À juste titre, nous ne permettons pas aux sites d’inspecter ou de manipuler le DOM ou l’état d’une autre origine, mais j’affirme que si vous contrôlez les services et les fonctionnalités de votre site et comment les utilisateurs s’y livrent, vous pouvez exposer les informations les plus importantes. et des services à tout client qui souhaite utiliser votre service en toute sécurité (vous avez le contrôle) et vous permet de:


* Concentrez-vous sur ce que vous êtes bon.
* Transfert de données rapide entre les sites et les applications car tout est dans le client.
* IPC même hors ligne.
* Exécuter le code dans le contexte d'origine

### Quelles API les sites devraient-ils exposer?

C'est quelque chose que j'aimerais explorer davantage. J'ai exposé certaines fonctionnalités de base à un service de notifications Push car c'est le but du site, mais l'élément important pour moi était que je contrôlais les parties du DOM que je voulais redonner aux autres développeurs.

Je voudrais aller à un endroit où chaque site peut exposer une API cohérente aux utilisateurs et un moyen de découvrir d'autres fonctionnalités et services.

Chaque propriétaire de site pourrait exposer uniquement les fonctionnalités de base à son service afin que nous puissions effectuer des opérations basées sur CRUD. Nous pourrions avoir des interactions complexes.

Nous pourrions accéder à un site Web sur lequel nous avons des services similaires à Unix qui font une chose bien et un utilisateur les regroupe tous sur le client.

Chaque site pourrait exposer un «VDOM» d'un sous-ensemble de la page défini par le propriétaire du service, de sorte que nous ayons un moyen cohérent d'extraire des données de mouvement basées sur le DOM entre des sites en toute sécurité.

Je pourrais imaginer que nous pourrions avoir besoin d'un accès rapide à tous les objets basés sur schema.org ou à d'autres données structurées sur la page (ils pourraient être générés dynamiquement) comme l'a fait Mike dans son message original.

[Comlink](https://github.com/GoogleChromeLabs/comlink) nous permet d'exposer et de consommer des services rapidement et facilement par-dessus les primitives de plate-forme qui existent depuis des années. Nous avons enfin beaucoup de pièces en place qui nous permettent de faire du Web l’API.

_Le Web est mon API. Faites le vôtre aussi._
