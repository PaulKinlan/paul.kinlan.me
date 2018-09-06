---
slug: building-ffmpeg.js
date: 2016-12-03
title: "Building ffmpeg.js for Ubuntu"
tags: ["ffmpeg", 'wasm']
---


[FFMPEG.js](https://github.com/Kagami/ffmpeg.js)はすばらしいプロジェクトです。私の最新プロジェクト「Device Frame」（https://paulkinlan.github.io/）の構築に役立ちました。 deviceframe.es/）。これは基本的にffmpegを構築します（サイズを小さくしておくためのデフォルトの良いセットを使用しています）。デフォルトのビルドが必要なフィルタとエンコーダをサポートしていない場合は、それを自分で構築する必要があります。

これは私の将来のメモですが、これは私がそれを働かせるためにしたものです。 （注：私はmacOS sierraを試して、コンパイルエラーを起こしていました）。

####インストールDeps

1. `sudo apt-get install automake libtool build-essential cmake`を実行します。



#### ffmpeg.jsをダウンロード

1. `git clone git@github.com：Kagami / ffmpeg.js.git` 2.` cd ffmpeg.js` 3. `git submodule init` 4.` git submodule update --recursive`



####インストールEmscripten：

1. Linux：[ダウンロード](https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz)2. `./emsdk update` 3.` ./emsdk install latest `4.待って... 5.` ./emsdk activate latest` 6. `ソース。/ emsdk_env.sh`

####ビルドffmpeg.js

* `すべてを作る`

fribidiにエラーがある場合：

* `cdビルド/ fribidi / && ./bootstrap && configure`

次のようなエラーが表示されることがあります。


```shell
./configure: line 4255: syntax error near unexpected token `2.2'
./configure: line 4255: `LT_PREREQ(2.2)'
```
`libtool`がインストールされていることを確認してください。

####完了。
