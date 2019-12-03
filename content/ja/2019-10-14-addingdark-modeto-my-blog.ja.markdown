---
slug: adding-dark-mode-to-my-blog
date: 2019-10-14T12:17:17.251Z
title: 'Adding "dark mode" to my blog'
link: ''
tags: [links]
---

Jeremy Keithの[post about adding dark mode to his blog](https://adactio.com/journal/15941)を見て、簡単そうに見えたので、それを旋回することにしました。

すべてを見るための[diff of the work](https://github.com/PaulKinlan/paul.kinlan.me/compare/00862927187ef8b36433ee59679cb6367a21793a...main)は次の[diff of the work](https://github.com/PaulKinlan/paul.kinlan.me/compare/00862927187ef8b36433ee59679cb6367a21793a...main)です。それは驚くほど簡単でした（私の側のばかげたエラー以外）。 CSS変数をサポートするための小さなリファクタリングがあり、CSSカスタムプロパティをサポートしないブラウザーがある場合にフォールバックできるようにしましたが、それはそれに関するものです。私はジェレミーがやったのとほとんど同じことをしました。

Chromeには、設定されているダークモード（ [I hear it's coming](https://bugs.chromium.org/p/chromium/issues/detail?id=1004246) ）をエミュレートするDevToolsのサポートがなかったため、HTML要素に追加して動作を簡単にテストできる単純なCSSクラスを作成しました（以下を参照）。

```CSS
@media (prefers-color-scheme: dark) {
  html {
    --background-color: rgb(36, 36, 36);
    --text-color: #fefefe;
    --block-quote-before-color: #333;
    --link-color-visited: #7ad857;
    --post-shadow: #333;
  }

  .post.moi a[rel=me] img {
    filter: invert(0.8);
  }
}

html.dark {
  --background-color: rgb(36, 36, 36);
  --text-color: #fefefe;
  --block-quote-before-color: #333;
  --link-color: #1bcba2;
  --link-color-visited: #7ad857;
  --post-shadow: #333;
}

html.dark .post.moi a[rel=me] img {
  filter: invert(0.8);
}
```

### ダークモードではありません

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-0.jpeg"></figure>

### ダークモード

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-1.jpeg"></figure>

