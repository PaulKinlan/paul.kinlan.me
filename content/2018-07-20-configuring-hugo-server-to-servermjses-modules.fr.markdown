---
slug: configuring-hugo-server-to-servermjses-modules
date: 2018-07-20T14:17:29.072Z
title: "Configuring hugo server to serve 'mjs' ES modules"
link: https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5
tags: [links, hugo, es modules, javascript]
---
Par défaut, Hugo ne fournit pas les fichiers .mjs avec le type de contenu correct. En fait, ce n'est que récemment que hugo pourrait servir plus d'une extension de fichier par type MIME. Il semble que la version 0.43 ait été corrigée.

> [mediaTypes]
>   [mediaTypes."text/javascript"]
>      suffixes = ["js", "mjs"]


[Lire l'article complet](https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5).

Le code ci-dessus me permet de servir des fichiers mjs pour les modules ES avec le type MIME correct (les modules doivent être servis avec 'text / javascript'). Ceci n'est nécessaire que pour les tests locaux, l'hébergement est un autre problème :)
