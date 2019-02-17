---
slug: ffmpeg-ideas
date: 2016-12-05
title: "Ideas for web apps with FFMPEG and ffmpeg.js"
tags: ["ffmpeg"]
---


J'ai récemment créé une application Web progressive qui prend un [screencast à partir de votre appareil Android puis encapsule la vidéo dans un cadre de périphérique](https://paulkinlan.github.io/deviceframe.es/) en utilisant [FFMPEG.js](https : //github.com/Kagami/ffmpeg.js) comme ça:

{{<youtube E_U6zvjW8so>}} J'ai également réussi à trier [la construction de ffmpeg.js](https://paul.kinlan.me/building-ffmpeg.js/) de manière à créer relativement facilement des versions optimisées de ffmpeg. et lancez-le dans le navigateur.

Je pense que les deux choses réunies offrent de nombreuses opportunités pour créer de nouvelles applications Web progressives de qualité, qui poussent ce que nous pensons que le Web est capable de faire en matière de manipulation audio et vidéo.

Il existe de nombreux utilitaires de vidéo sur le Web, mais à mes yeux, beaucoup sont construits comme des sites Web anciens et ne tirent pas parti des progrès du traitement côté client, ils sont chargés de publicité et ne peuvent pas travailler hors connexion. .

Je suis également très intéressé par la philosophie Unix de ["Faites une chose et faites-le bien"](https://en.wikipedia.org/wiki/Unix_philosophy#Do_One_Thing_and_Do_It_Well) donc plutôt que de construire une application de montage vidéo massivement monolithique, je Pensez qu’il existe de nombreuses applications Web qui peuvent être créées facilement et rapidement:

* Découper une vidéo (5 secondes avant, 3 arrière, etc.) * Tout format vidéo -> GIF * Beaucoup d'images -> Tout format vidéo * N'importe quel format vidéo -> N'importe quel format vidéo * Ajouter un filigrane * Redimensionner la vidéo * Réduire la vidéo * Ajouter des filigranes à une vidéo * Superposer des vidéos les unes sur les autres * Assembler des vidéos ensemble * Terrain de jeux FFMPEG (déposer des sources et un script) * [Si vous avez des idées, ajoutez-les à cette liste] github.com/PaulKinlan/paul.kinlan.me/edit/master/content/2016-12-05-ffmpeg-ideas.markdown)

Je pense que j'ai la plupart du code en place en tant que harnais d'interface utilisateur pour cela avec mon [référentiel de périphériques sur Github](https://github.com/PaulKinlan/deviceframe.es) et dans de nombreux cas, il s'agit d'ajuster le graphe de traitement ffmpeg et la mise à jour de l'interface utilisateur pour permettre une configuration.

Je vais en créer quelques-unes au cours des prochaines semaines, si quelqu'un veut y participer, puis entrer en contact!