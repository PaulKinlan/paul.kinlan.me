---
slug: thoughts-on-importing-npm-modules-to-the-web-as-javascript-modules
date: 2018-07-20T12:39:24.232Z
title: 'Thoughts on importing npm modules to the web as JavaScript modules'
link: https://paul.kinlan.me/importing-npm-modules-to-the-web-as-es6-modules/
tags: [links, npm, mjs, modules, javascript]
---
J'ai des réflexions sur le post que j'ai fait hier à propos des modules ES

> I needed a quick way import a simple module get-urls into my project. The module is well tested and it does what I needed &#x2026; ignore the fact that it&#x2019;s pretty easy to implement in a couple of lines of JavaScript. The problem I had is that my project is built in ES6, uses modules and I didn&#x2019;t want to have to bundle up using CommonJS (require).
> 
> I couldn&#x2019;t find a lot of guidance on what to do here, so I went to experiement and this solution is the solution I came across:
> 
> 1. Create a file that imports the npm module I needed. module.exports = require('get-urls'); This module will be what&#x2019;s converted to ES6 style.
> 2. Create a rollup config that
>     1. Imports the node globals, and builtins.
>     2. Resolves all npm modules required for my usage of this module.
>     3. Pass the results through the commonjs plugin so that it&#x2019;s now in JavaScript module format.
>     4. Compress the output, because it&#x2019;s huge :
> 3. Include the bundled file in your project and rejoice.


[Lire l'article complet](https://paul.kinlan.me/importing-npm-modules-to-the-web-as-es6-modules/).

L'une des choses que je voulais essayer et articuler dans l'article original, mais que j'ai décidé de retirer, c'est qu'il y a énormément de code dans l'écosystème Node qui n'est pas spécifique à Node en soi mais qui est étroitement lié à Node via Common JS et d'autres API de nœuds très spécifiques (Buffer, ancienne URL, etc.) qui nécessiteront beaucoup d'efforts pour se relever et, par conséquent, le changement sera nécessaire pour rendre les modules ES omniprésents, et ce jusqu'à ce que L'écosystème change, nous allons devoir utiliser beaucoup d'outils de conversion et de bundles pour pouvoir partager le code correctement sur plusieurs plates-formes (Web / serveur).

Nous sommes là où nous sommes, il n’y avait pas d’histoire d’importation sur le Web, nous n’avions pas un tas de primitives introduites par Node et nous en sommes maintenant à ce que beaucoup considéreraient maintenant comme des exigences de plate-forme de facto. plus une reconnaissance de la situation qu'une critique.

Il y a également un mouvement pour utiliser «.mjs» comme extension de fichier standard à la fois sur le noeud et sur le Web. Je me sens totalement à l'aise avec cela, cependant .msj n'est pas un fichier que toute infrastructure reconnaît encore comme 'text / javascript' et j'ai hâte que cela soit juste trié afin qu'il soit automatiquement inféré par chaque serveur web de la planète, Je n'ai pas besoin de déployer encore plus de modifications de configuration sur mon infrastructure de desserte.

Beaucoup de bons moments à venir, je suis impatient de pouvoir apporter beaucoup plus de fonctionnalités au Web.
