---
slug: grep-your-git-commit-log
date: 2018-10-23T09:59:01.080Z
title: 'Grep your git commit log'
description: 'Finding code that was changed in a commit'
tags: [git]
---


Dies ist mehr für meine Referenz in der Zukunft. Wenn Sie jedoch nach einem bestimmten Begriff suchen möchten, der sich in einem Ihrer Commits geändert hat, können Sie den folgenden Befehl eingeben:


```
git grep your-regex-here $(git rev-list --all)
```


Zum Beispiel habe ich `git grep '\' load" $ (git rev-list --all) `gefunden, um das [commit zu finden, bei dem ich 'load' entfernen wollte](/performance-and-resiliencestress-testing-third-parties-by-css-wizardry/).

Ordentlich.
