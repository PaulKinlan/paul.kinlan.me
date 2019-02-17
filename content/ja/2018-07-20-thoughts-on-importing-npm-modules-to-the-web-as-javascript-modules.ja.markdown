---
slug: thoughts-on-importing-npm-modules-to-the-web-as-javascript-modules
date: 2018-07-20T12:39:24.232Z
title: 'Thoughts on importing npm modules to the web as JavaScript modules'
link: https://paul.kinlan.me/importing-npm-modules-to-the-web-as-es6-modules/
tags: [links, npm, mjs, modules, javascript]
---
私はESモジュールについて昨日投稿した投稿を考えています

> I needed a quick way import a simple module get-urls into my project. The module is well tested and it does what I needed &#x2026; ignore the fact that it&#x2019;s pretty easy to implement in a couple of lines of JavaScript. The problem I had is that my project is built in ES6, uses modules and I didn&#x2019;t want to have to bundle up using CommonJS (require).
> 
> I couldn&#x2019;t find a lot of guidance on what to do here, so I went to experiement and this solution is the solution I came across:
> 
> 1. Create a file that imports the npm module I needed. module.exports = require('get-urls'); This module will be what&#x2019;s converted to ES6 style.
> 2. Create a rollup config that
>     1. Imports the node globals, and builtins.
>     2. Resolves all npm modules required for my usage of this module.
>     3. Pass the results through the commonjs plugin so that it&#x2019;s now in JavaScript module format.
>     4. Compress the output, because it&#x2019;s huge :
> 3. Include the bundled file in your project and rejoice.


[全文を読む](https://paul.kinlan.me/importing-npm-modules-to-the-web-as-es6-modules/)。

私が元の記事で試してみたかったことの一つだが、私が取り上げることにしたのは、ノードのエコシステムには膨大な量のコードがあり、それは実際にはノードそのものに固有のコードではないが、 Common JSや他の非常に特殊なNode API（バッファ、古いURLなど）を介してNodeを起動すると、ESモジュールをユビキタスにするために必要な変更が必要になる可能性がありますさまざまなプラットフォーム（Web /サーバー）でコードをきれいに共有できるようにするために、多くの変換ツールとバンドルを使用する必要があるエコシステムが変わります。

私たちはどこにいるのですか、Web上での話がありませんでした.Nodeが導入したプリミティブのヒープがなかったので、実際には多くのプラットフォームの要件が考慮されるようになりました。状況の批判よりも多くの肯定的な評価。

また、ノードとウェブの両方で標準的なファイル拡張子として '.mjs'を使用する動きもあります。しかし、私はこれを完全に快適に感じていますが、.msjはインフラストラクチャがまだ「text / javascript」と認識しているファイルではなく、これをソートして惑星上のすべてのWebサーバーによって自動的に推測されることを楽しみにしています。私は、サービングインフラストラクチャにさらに多くの構成変更を展開する必要はありません。

楽しい時間がたくさんあります。私は1つはWebにもっと多くの機能をもたらすことを楽しみにしています。
