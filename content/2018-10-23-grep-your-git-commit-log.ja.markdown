---
slug: grep-your-git-commit-log
date: 2018-10-23T09:59:01.080Z
title: 'Grep your git commit log'
description: 'Finding code that was changed in a commit'
tags: [git]
---


これは私が将来参考にしたものです。しかし、コミットの1つで変更された特定の用語の履歴を検索する場合は、次のコマンドを発行できます。


```
git grep your-regex-here $(git rev-list --all)
```


たとえば、私は `git grep '\' load" $（git rev-list --all） `を実行して[load 'を削除したコミット](/performance-and-resiliencestress-testing-third-parties-by-css-wizardry/)を見つけました。

きちんとした
