---
slug: grep-your-git-commit-log
date: 2018-10-23T09:59:01.080Z
title: 'Grep your git commit log'
description: 'Finding code that was changed in a commit'
tags: [git]
---


Это больше для моей справки в будущем. Но если вы хотите искать, вы фиксируете историю для определенного термина, который был изменен в одном из ваших коммитов, тогда вы можете выполнить следующую команду:


```
git grep your-regex-here $(git rev-list --all)
```


Например, я сделал git grep «load» $ (git rev-list -all) `, чтобы найти [commit, который заставил меня удалить« load »](/performance-and-resiliencestress-testing-third-parties-by-css-wizardry/).

Ухоженная.
