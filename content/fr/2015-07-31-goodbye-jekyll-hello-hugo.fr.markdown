---
slug: goodbye-jekyll-hello-hugo
date: 2015-07-31
title: "Goodbye Jekyll, Hello Hugo"
description: "Ruby frustrations and performance have frustrated me for a long time. Experimented with Hugo and ported blog in about 3 hours"
image_header: /images/hellogoodbye.png
---


J'aime bien Jekyll. Cela m'a aidé à revenir dans les blogs et j'ai [choisi comme technologie](https://github.com/Google/WebFundamentals/) de construire [Google Web Fundamentals](https://developers.google.com/web/fundamentals/) avec elle.

Quelque chose ne va vraiment pas bien: ** Performance **.

Le temps de création de mon blog personnel (environ 400 pages) prend environ 45 secondes. Les bases du Web sont encore pires, il faut souvent plusieurs minutes pour créer un seul pack de langue et nous prenons en charge 13 langues. Ce problème de performance affecte sérieusement notre équipe et notre équipe de rédaction car des modifications uniques dans un environnement de stockage local prennent plus de 40 secondes pour être visibles dans le navigateur.


* Peut-être que * nous pouvons l'améliorer, mais je ne peux certainement pas savoir comment le faire. Je ne peux pas l’instrumenter et nous rencontrons constamment des problèmes avec Ruby (nous ne sommes pas des développeurs Ruby), en particulier en ce qui concerne la gestion des versions de Gems et des mises à jour d’exécution.

Nous avons beaucoup de dettes techniques avec le site et il me faut beaucoup de temps, à moi et à l’équipe, pour faire fonctionner un site statique. J'ai le pressentiment que c'est le moteur de template et Ruby. Mais c'est juste moi qui devine.

Je cherchais des générateurs de sites rapides et statiques et quelques membres de l'équipe au sens large ont laissé entendre que [Hugo](http://gohugo.io/) (écrit en Go) est bon, bien structuré et aussi rapide.

Je n'irai pas beaucoup dans Hugo. C'est un générateur de site statique qui peut ingérer des fichiers Markdown (comme Jekyll) et cracher un site structuré basé sur les modèles que vous définissez.

Je vais passer en revue quelques points rapides:


* Ma version de Jekyll prenait 45 secondes +, la construction du site entier de Hugo est de 300-450ms. 2 ordres de grandeur plus rapides.
* Templating via le langage de gabarit Go a pris un peu de temps pour s'y habituer, mais il est * beaucoup plus propre * que Liquid.
* La pagination était assez facile à intégrer même si j'avais des problèmes avec les docs.
* Les documents sont assez solides, il y a des exemples où les exemples sur une page que vous pensez être liés ne causent pas toujours de confusion.
* Le guide de migration Jekyll, pour une simple construction Jekyll m'a eu le plus clair du chemin.
* Hugo ne supportait pas la syntaxe de nommage des fichiers de Jekyll (AAAA-MM-JJ-titre) pour la commande des messages et je devais écrire un script de migration pour ajouter un attribut `date` à chaque page de marquage et un slug` attribut.
* J'avais un tas de fichiers HTML qui ne semblaient pas être inclus dans le tableau .Site.Pages. Encore une fois, je devais tous les convertir avec un simple script de ligne de commande.

Pourtant, la performance est fulgurante et mon blog est beaucoup plus rapide et ne comporte aucune dépendance Ruby.

Je ne peux pas dire que nous allons transférer les fondamentaux du Web à Hugo, c'est un gros travail. Je suis très satisfait de la configuration locale et de la configuration de déploiement que j'ai pour le moment.

Crédit de l'image du titre: https://commons.wikimedia.org/wiki/File:Hellogoodbye_logo.svg