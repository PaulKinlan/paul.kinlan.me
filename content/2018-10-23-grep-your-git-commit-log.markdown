---
slug: grep-your-git-commit-log
date: 2018-10-23T09:59:01.080Z
title: 'Grep your git commit log'
description: 'Finding code that was changed in a commit'
tags: [git]
---

This is more for my reference in the future. But if you want to search you commit history for a specific a term that changed in one of your commits, then you can issue the following command: 

```
git grep your-regex-here $(git rev-list --all)
```

For example I did `git grep "\'load" $(git rev-list --all)` to find the [commit that had me removing 'load'](/performance-and-resiliencestress-testing-third-parties-by-css-wizardry/).

Neat.
