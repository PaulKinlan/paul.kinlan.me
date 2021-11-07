---
slug: reinventing-web-intents
date: 2017-08-25T13:20:31.000Z
title: "Reinventing Web Intents"
description: ""
tags: ["intents"]
image_header: /images/bridges.png
---
Je n'ai jamais surmonté la [mort des intentions Web](/what-happened-to-web-intents/). J'ai toujours pensé qu'il y avait toujours un grave problème sur le Web, nous construisons des silos (1) qui bloquent l'utilisateur sur un seul site Web et nous ne connectons pas nos applications ensemble pour créer des expériences plus riches. Nous avons des liens qui nous permettent de naviguer vers un autre site, mais nous ne connectons pas nos applications à des fonctionnalités que nous pouvons utiliser sur nos sites. Qu'il s'agisse de choisir une image d'un service cloud à utiliser dans votre application ou de modifier une image dans l'éditeur préféré de l'utilisateur; Nous ne faisons tout simplement pas le lien entre nos services et la manière dont nous lions nos pages.

[Web Intents](https://en.wikipedia.org/wiki/Web_Intents) était une tentative infructueuse pour résoudre ce problème. L'API de partage (1) résout un cas d'utilisation pour l'interconnexion de sites et d'applications, mais généralement la découverte de services IPC et de services n'a jamais été résolue et je pense avoir une solution ... Ok, je n'ai pas de solution une expérience qui me passionne énormément.

Au cours des deux derniers mois, Surma, dans mon équipe, et Ian Kilpatrick travaillaient sur une cale pour l’API [Tasklets](https://github.com/GoogleChromeLabs/tasklets). L'API Tasklets a été conçue pour permettre à une API multi-thread légère d'exister sur le Web. Une classe ES6 pourrait être exposée en tant que «tasklet» et vous pourriez l'appeler sans bloquer le thread principal - idéal pour les interfaces utilisateur. L'API de la liste de tâches est en elle-même très intéressante, mais l'élément le plus intéressant pour moi a été la construction d'un Polyfill à l'aide d'un Web Worker et le développement d'une méthode permettant d'exposer les fonctionnalités de la classe ES6 définie dans Worker. Ils ont extrait toutes les complexités de l’API postMessage dans un paquet soigné et un modèle sain pour les développeurs JS.

L'une des raisons pour lesquelles nous avons créé l'API Web Intents est que l'expérience de développeur de la création d'une API et d'un service fonctionnant avec l'API postMessage était incroyablement complexe. Vous devez gérer l'API postMessage et gérer un message complexe. système de traitement et machine d'état associée.

<figure><img src="/images/worker-dx.png"><figcaption> Travailleur traditionnel </figcaption></figure>

C'est juste complexe. C'est encore pire si vous voulez avoir deux fenêtres en interaction. La fenêtre que vous ouvrez doit signaler le `ouvre 'qu'il est prêt avant que vous puissiez commencer à lui envoyer des messages. TL; DR - `window.open` ouvre` about: blank` avant de naviguer vers l'URL que vous définissez.

<figure><img src="/images/window-dx.png"><figcaption> Expériences post-message </figcaption></figure>

Cela devient encore plus complexe lorsque vous souhaitez transmettre des messages entre plusieurs fenêtres ou des utilisateurs d'autres fenêtres.

<figure><img src="/images/complex-workers.png"><figcaption> Encore plus complexe ... </figcaption></figure>

Je pense que c'est l'une des principales raisons pour lesquelles les gens exposent les API côté client. C'est trop dur.

La solution polyfill avait une solution enfouie à l’intérieur de celle-ci et j’ai effrontément demandé à Surma s’il pouvait réorganiser l’API des tasklets pour en faire une simple API proxy, quelques heures plus tard [Comlink](https://github.com/GoogleChromeLabs/comlink/). Comlink est une petite API qui extrait l'API MessageChannel et postMessage dans une API qui ressemble à une instance de classes et de fonctions distantes dans le contexte local. Par exemple:


**Site Internet**


```javascript
const worker = new Worker('worker.js');
const api = Comlink.proxy(worker);
const work = await new api.HardWork();
const results = await work.expensive();
```



** Web Worker **


```javascript
class HardWork {
  expensive() {
    for(let i = 0; i < 1e12; i++)
      sum += /* …omg so much maths… */
    return sum;
  }
}

Comlink.expose({HardWork}, self);
```


Nous exposons une API sur le service, nous consommons l'API dans le client via un proxy.

Je pense qu’il est incroyablement convaincant et que Comlink en tant que tel a la capacité de révolutionner l’utilisation de l’ouvrier Web en améliorant radicalement l’expérience des développeurs en fournissant une API simple à utiliser par leur équipe.

Faire la même chose entre Windows est tout aussi facile.

<figure><img src="/images/comlink.png"><figcaption> Comlink </figcaption></figure>

Mais j'avais une autre idée… Je peux réinventer une petite partie des Web Intents: améliorer la découverte des services et faciliter l’interaction des développeurs avec les services.

### Intentions Web?

L'une des choses intéressantes à propos de l'API Comlink est qu'elle essaiera automatiquement d'utiliser les objets `Transférable` pour transmettre des données entre le client et le service, et il s'avère que` MessagePorts` sont transférables. L'idée que j'ai eue est que si je pouvais créer une API simple conçue pour renvoyer un MessagePort basé sur certains critères (comme le verbe), en tant que client, je ne me soucierais pas d'où vient ce MessagePort.

Voici ma pensée: je vais avoir un site qui agira comme un intermédiaire et qui maintiendra une liste de services et où ils habitent et pourra brancher des clients qui demandent des types de services, un peu comme ça.


* Un site de service pourra dire à l’intermédiaire "Je propose un service X qui fonctionne sur des données Y et vit à la page Z"
* Un site client pourra dire à l’intermédiaire "j’ai besoin d’un service qui fait X sur cette donnée Y. qu’est-ce que vous avez?"

En repensant à une conception brute, j'ai besoin d'un service qui expose deux méthodes: «register» et «pick».

`register`, va bien enregistrer le service auprès de l’intermédiaire. «pick» en revanche est un peu plus intéressant et je l’ai divisé en deux étapes.

<figure><img src="/images/webintents-step-1.png"><figcaption> Sites de connexion </figcaption></figure>

Le flux n'est pas trop complexe lorsque vous plongez dedans. J'ai créé un [wrapper de base que vous incluez dans chaque application de service et client](https://web-intents.glitch.me/scripts/service.js). L'encapsuleur gère la première interaction avec l'intermédiaire et effectue quelques tâches de base en intégrant la complexité de l'ouverture d'une fenêtre sur le sélecteur de services à l'adresse https://web-intents.glitch.me/pick.

Une fois que le sélecteur est ouvert, il trouvera tous les services correspondant aux critères dont l'utilisateur a besoin, il les présentera ensuite à l'utilisateur sous la forme d'une simple liste. L'utilisateur ouvre son site préféré et en coulisse, ce site expose son API au client d'origine via l'intermédiaire. Enfin, lorsque la connexion est terminée et que nous parlons au service choisi, nous pouvons supprimer l’intermédiaire.

<figure><img src="/images/webintents-step-2.png"><figcaption> Suppression d&#39;un intermédiaire </figcaption></figure>

Le processus est en fait un peu plus complexe que ce que je laisse entendre. Sous le capot, nous transmettons beaucoup de messages entre les fenêtres, mais les utilisateurs de l’API n’en voient jamais la complexité. La bonne chose est que lorsque le client et le service sont connectés, ils parlent directement via une belle API définie par le service et ne savent pas réellement qui est à chaque extrémité. Soigné.

Vous trouverez ci-dessous une plongée rapide dans le code pour montrer sa simplicité.


** Service ** ([démo](https://web-intents-service-1.glitch.me/))

Le service est relativement simple, il a une classe qui interagit avec le DOM et enregistre certaines sorties.

Nous exposons la classe `Test` au` ServiceRegistry` et nous offrons un moyen d’enregistrer les capacités de ce service.


```javascript
class Test {
  constructor() {}

  outputToPre(msg) {
    let output = document.getElementById('output');
    output.innerText += msg + '\n';
  }
}

let registry = new ServiceRegistry({ Test })
register.onclick = async () => {    
  let resolvedService = await registry.register('test-action','*', location.href);  
};
```



** Client ** ([démo](https://web-intents-client.glitch.me/))

Le client est simple, nous créons une instance du registre et appelons `pick`.

`pick` se connecte à l’intermédiaire et attend que l’utilisateur sélectionne le service. Une fois que l'utilisateur sélectionne le service, l'intermédiaire (`ServiceRegistry`) transmet l'API exposée au client par le service distant. Nous pouvons alors instancier une instance de l'API distante et invoquer des méthodes dessus.


```javascript
let registry = new ServiceRegistry();
let resolvedService = await registry.pick('test-action','image/*');
remote = await new resolvedService.Test();
remote.outputToPre('calling from window.');
```


Je suis très satisfait de cette expérience. Voici une vidéo de la découverte du service et de l'appel du code ci-dessus.

<figure> {{&lt;youtube 1igal-ehMB4&gt;}} <figcaption> démo de bout en bout </figcaption></figure>

Laissez-moi savoir ce que vous pensez. Trop?