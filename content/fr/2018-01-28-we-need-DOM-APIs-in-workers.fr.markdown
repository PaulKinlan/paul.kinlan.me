---
slug: we-need-DOM-APIs-in-workers
date: 2018-01-28T13:20:31.000Z
title: "We need DOM APIs in Workers"
description: "If we are to build HTML in Workers then we need some 'DOM' in them."
tags: ['DOM', 'javascript']
---


J'ai besoin d'API DOM dans les travailleurs pour différentes raisons que la plupart des gens. Beaucoup de gens aimeraient que le DOM dans Workers ne permette pas à la mise à jour du DOM de bloquer le thread principal. J'en ai besoin pour pouvoir analyser et manipuler efficacement les données XML _ et_ pour générer du HTML, et je pense que beaucoup d'autres personnes le font.

Dans un [projet récent](https://webgdedeck.com/), je souhaitais partager autant de logique que possible entre le serveur, l'agent de maintenance et le client. Le projet est essentiellement un simple lecteur de flux RSS, il prend des flux RSS, analyse les données et les fusionne dans un bel ensemble de colonnes (un peu comme TweetDeck), ainsi qu’une seule liste fusionnée.

Le projet fonctionne avec les données du flux RSS à trois endroits:

1. Sur le client & mdash; Lorsque la page est chargée pour la toute première fois, AJAX demande les données du flux RSS à un service proxy que je lance, puis met en cache les données brutes de l'objet `window.caches` pour une utilisation ultérieure avant de le rendre dans le client. 2. Dans le service worker & mdash; 1. Lorsque la page principale est chargée et que l'agent de maintenance est installé, l'agent de maintenance charge le shell et fusionne les données du flux RSS afin qu'aucune demande AJAX ne soit nécessaire sur le deuxième chargement, ce qui permet de maintenir le temps d'interactivité au maximum. 1. Lorsqu'une demande au proxy est faite à partir du client, le travailleur du service, une fois installé, intercepte la demande et transmet les données à partir de `window.caches`. Cela permet au site de fonctionner hors connexion. 3. Sur le serveur & mdash; Lorsque la page est demandée, nous pouvons prendre certaines des données mises en cache sur le serveur et les fusionner directement dans la réponse que nous envoyons au client. En rendant une partie du contenu directement à partir du serveur, nous pouvons avoir une fenêtre stable au premier chargement, ce qui est normalement important pour les connexions plus lentes sur le mobile (et SpeedIndex).

Dans chaque instance, un processus simple prend les données et les cartes RSS dans un objet JSON que je peux ensuite appliquer à un modèle pour générer du code HTML. Conserver un modèle et une logique unifiée sur le client, le serveur et l'agent de maintenance était une exigence essentielle. Maintenir un ensemble de modèles signifie que les données en entrée doivent être cohérentes sur tous les emplacements qui rendront les données.

Comme je lance un serveur proxy, il existe une solution simple: il suffit de transformer tous les flux RSS en un formulaire JSON cohérent sur le serveur. J'ai écarté cela parce que:

* Les transformations de données peuvent être intensives à traiter. * Les transformations de données peuvent être effectuées sur le client afin de réduire la charge partagée du service. Plus important encore, si un flux RSS est sur https et prend en charge CORS, il n'est pas nécessaire de passer par le service proxy. C'est l'état dans lequel je souhaite être intégré dans le futur car il permet au lecteur de flux de générer du contenu pouvant nécessiter l'authentification de l'utilisateur.

Le traitement des données sur le client est possible (et souhaité dans mon cas) car les navigateurs ont une API peu utilisée appelée «DOMParser». DOMParser est comme son nom l'indique: Un analyseur de XML brut et HTML qui construit un DOM. Une fois que vous avez un DOM, vous pouvez faire n'importe quoi avec les DOM normaux (appendChild, getAttribute, etc.).


```javascript
let parser = new DOMParser();
let dom = parser.parseFromString('<a><b>hello</b></a>', 'application/xml');
let bString = dom.querySelector('b').textContent;
```


Des trucs assez simples et je les utilise pour convertir les données RSS en une simple structure JSON afin que je puisse les transmettre à une fonction de template ([C'est ici si vous êtes intéressé à voir le code](https://github.com/ PaulKinlan / webgde-deck / blob / master / src / public / scripts / données / common.js # L98).)

Cela fonctionne parfaitement dans le client, mais il n'y a aucun DOM dans les ouvriers Web, les ouvriers de service, ni aucun DOM natif le serveur.

Heureusement, il existe une bibliothèque npm qui fonctionne partout. [`xml-dom`](https://www.npmjs.com/package/xmldom) est une implémentation conforme au niveau 2 du DOM W3C avec certaines fonctionnalités de niveau 3, et elle fonctionne à peu près comme prévu. Ce n'est pas la fin du monde, mais il semble idiot de devoir importer 64 Ko de JS, pour quelque chose que le navigateur a déjà intégré.

Je ne vois jamais le cas d'utilisation 'VDOM' pour les API DOM chez les travailleurs, et bien que je pense que c'est un cas d'utilisation important, je pense qu'il gêne un autre cas d'utilisation important: la manipulation des données du thread principal. Le fait que nous ne pouvons pas utiliser les travailleurs pour traiter les documents HTML et XML (ce que presque toutes les applications doivent faire) sans avoir à importer une énorme quantité de polyfill qui ne s'exécutera pas à la même vitesse qu'une implémentation native. compter sur les contributeurs OSS pour maintenir semble être quelque chose qui devrait être résolu.

Merci aux personnes qui maintiennent `xml-dom`. Les héros travaillent.