---
slug: grep-your-git-commit-log
date: 2018-10-23T09:59:01.080Z
title: 'Grep your git commit log'
description: 'Finding code that was changed in a commit'
tags: [git]
---


Ini lebih untuk referensi saya di masa depan. Tetapi jika Anda ingin mencari Anda melakukan sejarah untuk suatu istilah tertentu yang berubah di salah satu commit Anda, maka Anda dapat mengeluarkan perintah berikut:


```
git grep your-regex-here $(git rev-list --all)
```


Sebagai contoh saya melakukan `git grep" \ 'load "$ (git rev-list --all)` untuk menemukan [commit yang membuat saya menghapus' load '](/performance-and-resiliencestress-testing-third-parties-by-css-wizardry/).

Rapi.
