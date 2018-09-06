---
slug: ffmpeg-ideas
date: 2016-12-05
title: "Ideas for web apps with FFMPEG and ffmpeg.js"
tags: ["ffmpeg"]
---


私は最近、[FFMPEG.js]を使って[Androidデバイスからスクリーンキャストしてデバイスフレームにビデオをラップする](https://paulkinlan.github.io/deviceframe.es/)というProgressive Web Appを作成しました（https ：//github.com/Kagami/ffmpeg.js）ように：

{{<youtube E_U6zvjW8so>}}また、[building ffmpeg.js](https://paul.kinlan.me/building-ffmpeg.js/)を整理して、比較的容易にffmpegのカスタム最適化ビルドを作成できるようにしましたブラウザで実行します。

私が考えている2つのことは、オーディオとビデオの操作に関してWebができると思うものを押し進める、新しい小さなプログレッシブなWebアプリケーションを構築する機会がたくさんあると思います。

Web上には多くのWebベースのビデオユーティリティがありますが、私の目には多くのものが古いWebサイトのように構築されており、クライアント側の処理の進歩を利用せず、広告を積んでいてオフラインで作業することはできません。

私は、Unixの哲学である「一つのことをやって、うまくやる」（https://en.wikipedia.org/wiki/Unix_philosophy#Do_One_Thing_and_Do_It_Well）を大変盛り込んでいます。簡単かつ迅速に構築できるさまざまなWebアプリがたくさんあると思う：

*ビデオをトリムする（前面から5秒掛かる、バックから3秒かかるなど）*すべてのビデオフォーマット - > GIF *たくさんの画像 - >任意のビデオフォーマット*任意のビデオフォーマット - >任意のビデオフォーマット*ウォーターマークの追加*ビデオのサイズ変更*ビデオを縮小する*ビデオにウォーターマークを加える*お互いの上にビデオを重ねる*ビデオを一緒にスプライスする* FFMPEGプレイグラウンド（ソースとスクリプトをドロップする）* [アイデアがあればこのリストに追加する](https：// github.com/PaulKinlan/paul.kinlan.me/edit/master/content/2016-12-05-ffmpeg-ideas.markdown)

私は私の[Device Frames repo on Github](https://github.com/PaulKinlan/deviceframe.es)を使ってこのためのUIハーネスとしてコードの大部分を整えていると思います。多くの場合、それは調整の問題ですffmpeg処理グラフといくつかの設定を可能にするためにUIを更新する。

誰かが参加したいと思ったら、今後数週間にわたってこれらの2つを作成し、連絡を取り合おうと思います！