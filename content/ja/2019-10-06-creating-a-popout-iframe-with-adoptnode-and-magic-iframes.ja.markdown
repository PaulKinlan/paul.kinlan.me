---
slug: creating-a-popout-iframe-with-adoptnode-and-magic-iframes
date: 2019-10-06T20:58:16.791Z
title: 'Creating a pop-out iframe with adoptNode and "magic iframes"'
tags: [iframe, popout, adoptNode]
---

### 更新:10月8日-このドキュメントに関する重要な問題。

私はこの投稿について[Jake Archibald](https://jakearchibald.com/)に追いつきました。何か新しいものがあると思ったからです。会話の中で、この投稿の一部を無効にする多くのことを発見しました。また、ほとんどの開発者が知っています。

* `.append()`と`.appendChild()`を呼び出すと、ノードが採用されます。これにより、append Algorithmによりノードが確実に採用されるため、このインスタンスでの`adoptNode`の使用は役に立たなくなります。これはMDNドキュメントでは言及されていませんでしたが、 [spec](https://dom.spec.whatwg.org/#concept-node-append)ます。前に戻って問題を解決する必要があるのですが、 `DocumentFragment`を追加しようとしていたためだと`DocumentFragment`ます。これは、 `w.document.body.appendChild(document.adoptNode(airhornerIframe));`と`w.document.body.appendChild(airhornerIframe);`両方が同じ効果を持つことを意味します。
* DOM要素は状態を保持しますが（カスタム要素を確認します）、iframeがDOM内で移動されると、再読み込みされます。期間。つまり、iframe間で移動しても、最初にテストしたような状態が維持されないということです。これは、SWがページを非常に速くロードしたためだと思います。ポータルAPIはこれによる影響を受けない可能性があります。したがって、将来このエクスペリエンスは機能するはずです:)

ドキュメント間で要素を移動するという概念は依然として有効で興味深いものですが、iframeの利点はそこにはありません。ウィンドウ間を移動するとビデオ要素がリセットされることに気づきました。iframeが実際に状態をリセットしなかったことを確認するためにもっと熱心にすべきだったはずです。

いつものように、 [commit history for this post](https://github.com/PaulKinlan/paul.kinlan.me/commits/main/content/en/2019-10-06-creating-a-popout-iframe-with-adoptnode-and-magic-iframes.markdown)を見ることができます。

### 元の投稿2010年にGoogleに入社したとき、「 [magic iframes](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf) 」というGmailの概念に言及したドキュメントに出くわしました。クールな名前が付けられ、概念は斬新でした。

> * Targeted at apps with multiple windows
> * All code and data go into an IFRAME
> * If window hosting the IFRAME unloads, it gets adopted by another of the windows
> * In Gmail for example:
>   * Tearoff / pop-out compose creates bare window that is filled by code in IFRAME in main window
>   * If you close the main window, the code looks for a tear-off that can accept the IFRAME and moves it
>   * You finish your compose and can still send the email
> * Old way: create new instance of Gmail tailored to the task.

[Adam de Boor](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf)

コンセプトは、多くのアプリケーションがGmailの作成ウィンドウのような「小さなコンポーネント」であっても多くの複雑なJavaScriptをロードする必要があることです。ユーザーがメインウィンドウで操作できる`iframe`アプリケーションのコンポーネントをロードできます。ユーザーが「新しいウィンドウで作成」ボタンをクリックすると、「ティアオフ」して新しいウィンドウに移動できることを確認します。私は作者と話すのに十分自信がありませんでした（そして、Gmailのソースを実際に使用したかどうかを確認するためにまだソースを確認したこともありませんでした）。 。

10年後、私は長い電車に乗っていて、 `adoptNode` APIについてあまり知らないエリアを調査し始めました。 [lot of ideas](https://nifty-meadowlark.glitch.me/)遊んだところ、DOM要素、それらの現在の状態、および添付されたイベントハンドラーを新しいウィンドウに移動できることが[lot of ideas](https://nifty-meadowlark.glitch.me/) 。これは「魔法のiframe」を思い出させ、最終的にはポップアウトiframeを作成できるという考えにつながりました（ポップアウトiframeはPicture in Pictureビデオですが、iframe要素用です）

ポップアウトiframeのコードは非常に簡単です。

```html
<iframe src="https://airhorner.com" id="airhorner"> </iframe>

<button id="adoptIframeButton">
  Popout iframe into new window (adoptNode)
</button>

<script>
 adoptIframeButton.addEventListener("click", () => {
    const airhornerIframe = document.getElementById("airhorner");
    const width = airhornerIframe.clientWidth;
    const height = airhornerIframe.clientHeight;
    const w = window.open("blank.html", "", `top=100,width=${width},height=${height}`);
    w.addEventListener("load", () => {
      w.document.body.appendChild(airhornerIframe);
    });
 });
</script>
```

<iframe src="https://airhorner.com" id="airhorner"> </iframe>

<button id="adoptIframeButton">
  Popout iframe into new window (adoptNode)
</button>

<script>
 adoptIframeButton.addEventListener("click", () => {
    const airhornerIframe = document.getElementById("airhorner");
    const width = airhornerIframe.clientWidth;
    const height = airhornerIframe.clientHeight;
    const w = window.open("/blank.html", "", `top=100,width=${width},height=${height}`);
    w.addEventListener("load", () => {
      w.document.body.appendChild(airhornerIframe);
    });
 });
</script>

`adoptNode`使用すると、ブラウザ内のドキュメント間で既存のバインドされたイベントハンドラを維持しながら、現在の状態でDOM要素を移動できます。これは、現在のウィンドウ内の新しいDOMであるか、このデモのように既に移動している可能性があります同じ起源にある別のウィンドウに`iframe`をロードし`iframe` 。 （上記の更新を参照）。

iframeを移動すると、iframeのコンテンツを再起動する必要がなく、インスタンスが移動するだけなので、興味深いです。欠点がいくつかあります。

1. URLはiframeオリジンではなく現在のオリジンに残りますが、これは`<portal>` APIで解決できる`<portal>`ます。
2.カスタム要素、またはオープナーでホストされているロジックを持つものを移動する場合-オープナーを閉じると、実行が停止します。

欠点はさておき、このDOMレベルのIPCメカニズムは非常に興味深いと思いました。 [demo page](https://nifty-meadowlark.glitch.me/) （ [src](https://glitch.com/edit/#!/nifty-meadowlark?path=script.js) ）で[src](https://glitch.com/edit/#!/nifty-meadowlark?path=script.js)でみて、これがどこで使用できるかについて面白いアイデアがあれば教えてください。

