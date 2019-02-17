---
slug: grep-your-git-commit-log
date: 2018-10-23T09:59:01.080Z
title: 'Grep your git commit log'
description: 'Finding code that was changed in a commit'
tags: [git]
---


Ceci est plus pour ma référence dans le futur. Mais si vous souhaitez effectuer une recherche dans l'historique des validations pour un terme spécifique qui a changé dans l'un de vos validations, vous pouvez alors exécuter la commande suivante:


```
git grep your-regex-here $(git rev-list --all)
```


Par exemple, j'ai fait git grep "\" load "$ (git rev-list --all)` pour trouver le [commit qui m'avait enlevé "load"](/performance-and-resiliencestress-testing-third-parties-by-css-wizardry/).

Soigné.
