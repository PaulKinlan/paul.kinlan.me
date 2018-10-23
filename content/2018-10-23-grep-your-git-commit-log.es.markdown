---
slug: grep-your-git-commit-log
date: 2018-10-23T09:59:01.080Z
title: 'Grep your git commit log'
description: 'Finding code that was changed in a commit'
tags: [git]
---


Esto es más para mi referencia en el futuro. Pero si desea buscar en el historial de confirmaciones para un término específico que cambió en una de sus confirmaciones, puede emitir el siguiente comando:


```
git grep your-regex-here $(git rev-list --all)
```


Por ejemplo, hice `git grep" \ 'load "$ (git rev-list --all)` para encontrar el [commit que me hizo eliminar' load '](/performance-and-resiliencestress-testing-third-parties-by-css-wizardry/).

Ordenado.
