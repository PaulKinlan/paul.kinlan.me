---
slug: ricky-mondelloadoption-of-well-known-url-for-changing-passwords
date: 2019-01-31T22:02:32.092Z
title: 'Ricky Mondello: Adoption of Well-Known URL for Changing Passwords'
link: https://twitter.com/rmondello/status/1090702498220961793
tags: [links, safari, specs]
---
SafariチームのRicky Mondelloがつい最近、Twitterが./well-known/change-password仕様をどのように使用しているかについてのメモを共有しました。

> I just noticed that Twitter has adopted the Well-Known URL for Changing Passwords! Is anyone aware of other sites that have adopted it?
> 
> Twitter's implementation: https://twitter.com/.well-known/change-password;
> Github's: https://github.com/.well-known/change-password;
> Specification :https://github.com/WICG/change-password-url

[Read full post](https://twitter.com/rmondello/status/1090702498220961793) 。

よく知られた場所にファイルがあれば、ブラウザは複雑なUIをナビゲートすることなく素早くパスワードをリセットすることを可能にするUIをユーザに提供することができます。

この仕様は一見シンプルです。よく知られているファイルには、アクションを実行したいときにユーザーに指示するためのURLが含まれているだけです。これは私が考えることを私に導きました、私達がこれらの機能のより多くを提供できますか:

* GDPRベースの同意モデル（cookie同意）のよく知られた場所 - サイトの所有者は、ユーザーがすべてのcookieおよびその他のデータ同意アイテムを管理し、潜在的に取り消すことができるページへのリンクを提供できます。
*ブラウザの権限管理のためのよく知られた場所 - サイトの所有者は、ユーザーが地理的位置、通知、その他のプリミティブなどのものに対する権限を取り消すことができるようにするための迅速な場所を提供できます。
*アカウントの削除と変更のためのよく知られたパス
メーリングリスト購読管理のための*よく知られたパス

リストは続きます....私はユーザーが一般的なユーザーの行動を発見するのを手助けするための単純なリダイレクトファイル、そしてブラウザがそれを表面化させる方法のためのアイデアが本当に好きです。

*更新:* [issue to Chrome to see if we can get a similar implementation](https://bugs.chromium.org/p/chromium/issues/detail?id=927473)を追加し[issue to Chrome to see if we can get a similar implementation](https://bugs.chromium.org/p/chromium/issues/detail?id=927473) 。