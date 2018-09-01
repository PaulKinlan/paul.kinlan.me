---
slug: importing-npm-modules-to-the-web-as-es6-modules
date: 2018-07-19T18:06:53.251Z
title: 'Importing npm modules to the web as JavaScript modules'
tags: [npm, rollup, javascript]
---


私は静的なサイトにコンテンツをプッシュするのを簡単にする方法に取り組んできました。もう1つのポストでもっと共有することは楽しい小さなエクササイズでした。この記事では、ほぼすべてのnpmモジュールをJavaScriptモジュールを使用してフロントエンドプロジェクトにインポートするために使用した `rollup`設定を共有したいと思います。

私はプロジェクトに簡単なモジュール `get-urls`を簡単にインポートする必要がありました。モジュールは十分にテストされていて、私が必要なことをしてくれます... JavaScriptの2行で実装するのはかなり簡単だという事実を無視してください。私が持っていた問題は、私のプロジェクトがES6でビルドされ、モジュールを使用していて、CommonJS（ `require`）を使ってバンドルしたくないということでした。

私はここで何をすべきかについて多くの指針を見つけることができませんでしたので、私は実験に行きました。このソリューションは私が遭遇した解決策です：

1.必要なnpmモジュールをインポートするファイルを作成します。 `module.exports = require（ 'get-urls'）;`このモジュールはES6スタイルに変換されます。 2.ロールアップ設定を作成します。1.ノードのグローバルと組み込み関数をインポートします。 1.このモジュールの使用に必要なすべてのnpmモジュールを解決します。 1.結果を `commonjs`プラグインに渡して、JavaScriptモジュール形式になるようにします。 1.巨大なので、出力を圧縮します：\ 3.あなたのプロジェクトに同梱のファイルを含めて喜んでください。


``` javascript
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import closure from 'rollup-plugin-closure-compiler-js';

export default {
  input: 'static/javascripts/get-urls.js',
  output: {
      file: 'static/javascripts/get-urls.bundle.mjs',
      format: 'es',
      browser: true
    },
  plugins: [
    globals(),
    builtins(),
    resolve({
      preferBuiltins: false,
      browser: true,
      // pass custom options to the resolve plugin
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    commonjs(),
    closure({
      compilationLevel: 'WHITESPACE',
      languageIn: 'ES6',
      languageOut: 'ES6'
    })
  ]
};
```


おそらくこれよりも良い方法があると思いますが、比較的シンプルな関数（70kb）の出力は出力されますが、ここでは自分のページにnpmのモジュールを直接使用できます。


```
<script type="module">
    import getUrls from '/javascripts/get-urls.bundle.mjs';
    ...
```


きちんとした...
