---
slug: configuring-hugo-server-to-servermjses-modules
date: 2018-07-20T14:17:29.072Z
title: "Configuring hugo server to serve 'mjs' ES modules"
link: https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5
tags: [links, hugo, es modules, javascript]
---
デフォルトでは、Hugoは正しいコンテンツタイプの.mjsファイルを提供しません。実際、最近までhugoはMIMEタイプごとに複数のファイル拡張子を提供することはできませんでした。これは修正されたv0.43のように見えます。

> [mediaTypes]
>   [mediaTypes."text/javascript"]
>      suffixes = ["js", "mjs"]


[全文を読む](https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5)。

上記のコードでは、正しいMIMEタイプのESモジュール用のmjsファイルを提供できます（メモモジュールは 'text / javascript'で提供する必要があります）。これはローカルテストにのみ必要です。ホスティングは別の問題です:)
