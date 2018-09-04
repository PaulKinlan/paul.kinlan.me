---
slug: hyperlinking-beyond-the-web---css-tricks
date: 2018-07-15T17:28:21.103Z
title: Hyperlinking Beyond the Web - CSS-Tricks
link: https://css-tricks.com/hyperlinking-beyond-the-web/
tags: ['link', 'intents']
---
CSS TricksのAtishay Jainは、私の心の近くの領域について書いています。

> Hyperlinks are the oldest and the most popular feature of the web. The word hypertext (which is the ht in http/s) means text having hyperlinks. The ability to link to other people&#x2019;s hypertext made the web, a web &#x2014; a set of connected pages. This fundamental feature has made the web a very powerful platform and it is obvious that the world of apps needs this feature. All modern platforms support a way for apps to register a URI (custom protocol) and also have universal links (handling web links in an app).
> 
> Let&#x2019;s see why we&#x2019;d want to take advantage of this feature and how to do it.


[全文を読む](https://css-tricks.com/hyperlinking-beyond-the-web/)。

これは、アプリやサイトで利用できるさまざまなタイプのハイパーリンクのすべてをカバーするすばらしい記事でした。私はWeb IntentsとWeb上での高度なリンクの状態がたいへん残っているので、これまでずっとこの空間について多くの研究を行ってきました。

私がウェブを愛している理由の1つは、リンクの背後にはリソースへの直接アクセスがあるということです。リンクと実際のリソースを同じ方法で組み合わせることができる他のプラットフォームはわかりませんが、もっと。標準リンクでは、状態（URL）とコンテキスト（アンカー間のテキスト）を含むVIEWインテントが基本的に提供されます。カスタムプロトコルでハックすることができますが、さらに進化する必要があります。

*より多くのネイティブスキームにアクセスできるように、registerProtocolHandlerに語彙を拡張する必要があります。*プロトコルハンドラに登録されているものはシステム全体である必要があります。 *さまざまな種類のコンテンツを開くことができ、ページをシステムファイルハンドラとして登録できるようにするために、Webサイトを用意する必要があります。 * VIEWは優れているため、サイトやアプリの機能をより効果的に理解できるように、PICK、SAVE、EDITなどのコアアクションを合意しておく必要があります。それらはより高次のセマンティクスを持つ。 Androidはこれを持っていて、Siriはそれを取得しています。両方とも 'Intents'を使用していますが、Webもそれを持っているはずです。

これは、postMessageの狂気の負担を取り除き、他の人に機能を公開することを考えるようにする[Comlink](https://github.com/GoogleChromeLabs/comlink)などのメッセージングの抽象化についてとても興奮している理由の1つですそして、あなたが関数を公開すると、その関数の発見をより簡単に可能にする必要があります。それがリンクが可能にするものです。
