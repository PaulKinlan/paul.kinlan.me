---
date: 2018-10-23 09:59:01.080000+00:00
description: Finding code that was changed in a commit
slug: grep-your-git-commit-log
summary: This blog post provides a quick tip for searching your Git commit history
  for a specific term or regular expression.  Use the command `git grep your-regex-here
  $(git rev-list --all)` to find all commits where the specified term has changed.  As
  an example, the author used `git grep \"'load\" $(git rev-list --all)` to find a
  specific commit related to removing the word 'load'.
tags:
- git
- command line
- search
- commit history
- regex
- regular expression
- code changes
- version control
title: Grep your git commit log

---

This is more for my reference in the future. But if you want to search you commit history for a specific a term that changed in one of your commits, then you can issue the following command: 

```
git grep your-regex-here $(git rev-list --all)
```

For example I did `git grep "\'load" $(git rev-list --all)` to find the [commit that had me removing 'load'](/performance-and-resiliencestress-testing-third-parties-by-css-wizardry/).

Neat.
