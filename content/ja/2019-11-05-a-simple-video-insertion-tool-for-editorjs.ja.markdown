---
slug: a-simple-video-insertion-tool-for-editorjs
date: 2019-11-05T00:48:57.389Z
title: A simple video insertion tool for EditorJS
link: 'https://github.com/PaulKinlan/simple-video'
tags: [links, editor]
---

<a <span class="notranslate">href=&quot;https://editorjs.io/&quot; &gt;EditorJS</a>本当に好き<a <span class="notranslate">href=&quot;https://editorjs.io/&quot; &gt;EditorJS</a> 。静的なHugoブログ用に、非常にシンプルなWebホストインターフェイスを作成できます。

EditorJSには、単純なブロックベースのエディターで必要なものがほとんど揃っています。ヘッダー、コードのプラグインがあり、ホスティングインフラストラクチャを必要とせずにエディターに画像を追加する簡単な方法さえあります。今まで、ビデオをエディターに追加する簡単な方法はありません。

<a <span class="notranslate">href=&quot;https://github.com/editor-js/simple-image&quot; &gt;simple-image</a>プラグインリポジトリを取得し、それを（ほんの少し）変更して<a <span class="notranslate">href=&quot;https://github.com/PaulKinlan/simple-video&quot; &gt;simple-video</a>を作成しました<a <span class="notranslate">href=&quot;https://github.com/PaulKinlan/simple-video&quot; &gt;simple-video</a>プラグイン（ <a <span class="notranslate">href=&quot;https://www.npmjs.com/package/simple-video-editorjs&quot; &gt;npm module</a> ）。これで、このブログにビデオを簡単に含めることができます。

EditorJSに慣れている場合、プロジェクトに含めるのはかなり簡単です。次のようにインストールするだけです

```
npm i simple-video-editorjs
```

そして、必要に応じてプロジェクトに含めるだけです。

```
const SimpleVideo = require('simple-video-editorjs');

var editor = EditorJS({
  ...
  
  tools: {
    ...
    video: SimpleVideo,
  }
  
  ...
});
```

エディターには、ページでビデオをホストする方法を構成できるいくつかの簡単なオプションがあります。

1.自動再生-ページの読み込み時にビデオが自動的に再生されます
1.ミュート-デフォルトでは動画の音声はオンになりません（自動再生に必要）
1.コントロール-ビデオにはデフォルトのHTMLコントロールがあります。

以下は、埋め込まれたビデオの簡単な例です（オプションの一部を示しています）。

<figure><video src="/videos/2019-11-06-a-simple-video-insertion-tool-for-editorjs-0.mp4" alt="Showing Options for EditorJS simple video." autoplay muted></video></figure>

とにかく、この小さなプラグインを作成するのは楽しかったです-作成するのはそれほど難しくなく、simple-imagesが使用するbase64への変換を延期し、代わりにBlob URLを使用するだけでした。