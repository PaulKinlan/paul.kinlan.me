---
slug: grep-your-git-commit-log
date: 2018-10-23T09:59:01.080Z
title: 'Grep your git commit log'
description: 'Finding code that was changed in a commit'
tags: [git]
---


Đây là nhiều hơn để tôi tham khảo trong tương lai. Nhưng nếu bạn muốn tìm kiếm bạn cam kết lịch sử cho một cụm từ cụ thể đã thay đổi trong một trong các cam kết của bạn, thì bạn có thể đưa ra lệnh sau:


```
git grep your-regex-here $(git rev-list --all)
```


Ví dụ tôi đã làm `git grep" \ 'load "$ (git rev-list --all)` để tìm [commit mà tôi đã loại bỏ' load '](/performance-and-resiliencestress-testing-third-parties-by-css-wizardry/).

Khéo léo.
