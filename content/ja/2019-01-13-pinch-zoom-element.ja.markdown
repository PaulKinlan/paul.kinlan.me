---
slug: pinch-zoom-element
date: 2019-01-13T17:21:19.288Z
title: 'pinch-zoom-element'
link: https://www.webcomponents.org/element/pinch-zoom-element
tags: [links, web components, custom element]
---
Jakeとチームは、ブラウザ独自のピンチズームのダイナミクス以外のHTMLのセットでピンチズームを管理するための、このかなり素晴らしいカスタム要素を構築しました（モバイルビューポートズームを考えてください）。この要素は、Chrome Dev Summitで構築およびリリースした[squoosh](https://squoosh.app/)アプリに必要な中心的コンポーネントの1つでした（...「Chrome Dev Summitでリリース」と言います[squoosh](https://squoosh.app/)は、China Google Developer Dayですべてのユーザーに公開しましたチームの他のメンバーが通商禁止になっていたとしても;）...）

> install: `npm install --save-dev pinch-zoom-element`
> 
> ```HTML
> <pinch-zoom>
>   <h1>Hello!</h1>
> </pinch-zoom>
> ```

[Read full post](https://www.webcomponents.org/element/pinch-zoom-element) 。

私はちょうどそれを私のブログに加えました（ほんの数分かかりました）、あなたは私が撮った写真を共有する私の「 [life](https://paul.kinlan.me/life/img_20170711_063830/) 」セクションでそれをチェックすることができます。タッチ対応デバイスを使用している場合は、複数の指の入力を処理できるトラックパッドを使用している場合は、要素をすばやくピンチズームできます。

この要素は、Webコンポーネントがユーザーインターフェイスコンポーネントを作成するためのモデルとして好きな理由の良い例です。 `pinch-zoom`要素は、ワイヤ上でわずか3kb（圧縮されていない）で最小限の依存関係にあり、使いにくくなるようなカスタムのアプリケーションレベルのロジックを束縛することなく、1つの仕事を非常にうまく行っています。 vs Squooshアプリから学んだことに基づいて共有するアプリロジックコンポーネント。

たとえば、この要素が多くのコマースサイトで見られる画像ズーム機能を置き換えたり標準化したりして、開発者からその苦痛を永遠に取り去ることができると私は想像できるでしょう。
