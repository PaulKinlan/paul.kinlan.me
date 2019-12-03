---
slug: webmention-app
date: 2019-06-20T12:33:04.370Z
title: 'Webmention.app'
link: 'https://remysharp.com/2019/06/18/send-outgoing-webmentions'
tags: [links, webmention, zeit, hugo]
---
私は[Webmentions](https://www.w3.org/TR/webmention/)のアイデアが大好きですが、それを自分のサイトに実装する時間がありませんでした。高レベルのWeb言及では、Web上の他のコンテンツにコメント、いいね、返信したり、Disqus（私のサイトから削除したい）などのツールで一元化することなく、そのコンテンツに表示することができます。

Webメンションは、送信者と受信者の2つのコンポーネントに分割されます。受信者は、私が投稿を書いているサイトであり、彼らのサイトには、インバウンドリンクやブログへの反応を示す何かがあるかもしれません。そして、送信者は私です。私が作成したリモートサイトに、作成したコンテンツに反応させる必要があります。

かなり素晴らしい[Remy Sharp](https://remysharp.com)が[webmention.app](https://webmention.app/)を作成して、問題の一部を解決しました[webmention.app](https://webmention.app/)送信です。 Remyのツールを使用すると、CLIスクリプトを呼び出すだけで、リンクした潜在的な受信者に「ping」を簡単に送信できます。

私は、Hugoと静的ビルダーツールを使用してZeitを使用してブログをホストしているため、 [relatively trivial for me to add in support for webmention app](https://github.com/PaulKinlan/paul.kinlan.me/commit/541cf5db0b48b1eb75bedfa326406f887e57e1a9) 。 `npm i webmention`だけを`npm i webmention`してから、 `build.sh`ファイルからCLIバージョンのツールを`build.sh`ます。これは本当に簡単です。

投稿を作成すると、サイトに関するコンテンツを作成したすべての新しいURLに簡単なpingが送信されます。

