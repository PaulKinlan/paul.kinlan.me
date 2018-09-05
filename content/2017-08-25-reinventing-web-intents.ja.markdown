---
slug: reinventing-web-intents
date: 2017-08-25T13:20:31+01:00
title: "Reinventing Web Intents"
description: ""
tags: ["intents"]
image_header: /images/bridges.png
---
私は[Web Intentsの死](/ what-happened-to-web-intents /)を乗り越えたことはありません。私はいつもウェブに深刻な問題があると感じました。ユーザーを1つのWebサイトにロックする[サイロ](/意図しないサイロ/)を構築し、アプリケーションをいっしょにして豊かな経験を構築しません。私たちは別のサイトに移動するためのリンクを持っていますが、私たちのサイトで使用できる機能にはアプリケーションを接続していません。クラウドサービスから画像を選択してアプリで使用したり、ユーザーが好きなエディタで画像を編集したりできます。私たちは私たちのページをリンクする方法だけではなく、私たちのサービスをリンクしています。

[Web Intents](https://en.wikipedia.org/wiki/Web_Intents)はそれを修正しようとして失敗しました。 [Share API](/ navigator.share /)は、サイトやアプリケーションを相互接続するためのユースケースを1つ解決しますが、一般的にIPCとサービスの発見は解決されていません。ソリューションがあると思います...ソリューション、私は非常に興奮している実験をしています。

私のチームのSurmaとIan Kilpatrickは過去数ヶ月間、[Tasklets API](https://github.com/GoogleChromeLabs/tasklets)のシムに取り組んでいました。 Tasklets APIは、Web上に軽量のマルチスレッドAPIが存在するように設計されています。 ES6クラスは「タスクレット」として公開され、メインスレッドをブロックせずに呼び出すことができます。これはUIに最適です。タスクレットAPI自体は非常に興味深いですが、最も興味深いのは、Webワーカーを使用してPolyfillを構築し、Workerで定義されたES6クラスの機能を公開する方法を開発したことです。彼らは、postMessage APIの複雑さのすべてを、JS開発者にとってきちんとしたパッケージとまともなモデルに抽象化しました。

Web Intents APIを構築した理由の1つは、postMessage APIで動作するAPIとサービスを作成する開発者の経験が非常に複雑で、postMessage APIを処理しなければならず、複雑なメッセージ処理システムおよび関連する状態機械を含む。

<figure><img src="/images/worker-dx.png"><figcaption>伝統的労働者</figcaption></figure>

それはちょうど複雑です。 2つのウィンドウを相互にやりとりさせたい場合は、さらに悪化します。開いたウィンドウは、メッセージを送信し始める前に準備が整っている「オープナー」を返信する必要があります。 TL; DR  -  `window.open`は、あなたが定義したURLにナビゲートする前に` about：blank`を開きます。

<figure><img src="/images/window-dx.png"><figcaption>ウィンドウポストメッセージ体験</figcaption></figure>

複数のウィンドウ間や他のウィンドウ内のワーカー間でメッセージをやり取りする場合は、さらに複雑になります。

<figure><img src="/images/complex-workers.png"><figcaption>さらに複雑な... </figcaption></figure>

私はこれがクライアント側のAPIを公開する主な理由の1つだと思います。難しすぎる。

タスクレットpolyfillにはソリューションが埋め込まれていて、タスクレットAPIをシンプルなProxy APIにリファクタリングできるかどうか尋ねるとSurmaに尋ねました。数時間後に[Comlink](https://github.com/GoogleChromeLabs/comlink /)。 Comlinkは、ローカルのコンテキストでリモートクラスや関数をインスタンス化しているように見えるAPIにMessageChannel APIとpostMessage APIを抽象化する小さなAPIです。例えば：

**ウェブサイト**


```javascript
const worker = new Worker('worker.js');
const api = Comlink.proxy(worker);
const work = await new api.HardWork();
const results = await work.expensive();
```


**ウェブワーカー**


```javascript
class HardWork {
  expensive() {
    for(let i = 0; i < 1e12; i++)
      sum += /* …omg so much maths… */
    return sum;
  }
}

Comlink.expose({HardWork}, self);
```


サービスにAPIを公開し、プロキシ経由でクライアントでAPIを使用します。

私はそれが信じられないほど魅力的だと思うし、Comlink自身が、彼らのチームが使うことができるように簡単なAPIを提供することによって開発者の経験を大幅に改善することによってWebワーカーの使用法に革命を起こす能力を持っている。

ウィンドウ間で同じことをするのも簡単です。

<figure><img src="/images/comlink.png"><figcaption> Comlink </figcaption></figure>

しかし私は別の考えを持っていました... Web Intentsの小さな部分を改革することができます：サービスの発見を改善し、開発者がサービスとやりとりするのを容易にします。

### Web Intents？

Comlink APIに関するすばらしいものの1つは、自動的にTransferableオブジェクトを使用してクライアントとサービスの間でデータをやり取りしようとすることで、 `MessagePorts`は転送可能であることがわかります。私が持っていたアイデアは、いくつかの基準（動詞など）に基づいてMessagePortを返し、クライアントとして返すように設計された単純なAPIを作成できれば、そのMessagePortがどこから来たのか気にしませんでした。

ここに私の考えがあります：私は中堅の人として働くサイトを持ち、サービスのリストとそれらがどこに住んでいるのかを維持し、サービスの種類をそういうものを求めているクライアントにつながります。

*サービスサイトは中間の人に「データYで動作し、Zページに住むサービスXを提供します」と言うことができる*クライアントサイトは中間の人に「Xこのデータには何がありますか？

これを大まかな設計に戻すには、「register」と「pick」の2つのメソッドを公開するServiceが必要です。

登録すると、真ん中の人にサービスが登録されます。一方、「pick」はもう少し面白く、私はそれをいくつかのステップに分けました。

<figure><img src="/images/webintents-step-1.png"><figcaption>サイトの接続</figcaption></figure>

あなたがそれに潜入するとき、流れはあまりにも複雑ではありません。すべてのサービスとクライアントアプリケーションに含める[基本ラッパー](https://web-intents.glitch.me/scripts/service.js)を作成しました。ラッパーは、仲介者との最初の対話を処理し、ウィンドウを開くという複雑さを 'https://web-intents.glitch.me/pick'のサービスピッカーにラップすることによって基本的なハウスキーピングを行います。

ピッカーが開かれると、ユーザーが必要とする基準に一致するすべてのサービスが検索され、単純なリストとしてユーザーに提示されます。ユーザーは優先サイトを開き、そのサイトがそのAPIを公開している舞台裏で、仲介業者経由で元のクライアントに戻します。最後に、接続が完了し、選択されたサービスと話しているときに、中産者を取り除くことができます。

<figure><img src="/images/webintents-step-2.png"><figcaption>仲買人の削除</figcaption></figure>

このプロセスは、実際には私がやっているより少し複雑です。このフードの下では、ウィンドウ間に多くのMessagePortsを渡していますが、APIのコンシューマはこのような複雑さを全く見ません。良いことは、クライアントとサービスが接続され、素晴らしいサービス定義のAPIを介して直接話し合って、どちらがどちらの側にいるのか実際にはわからないということです。きちんとした

以下は、コードの簡単な説明です。

**サービス**（[デモ](https://web-intents-service-1.glitch.me/)）

このサービスは比較的簡単で、DOMとやり取りして出力を記録するクラスを持っています。

`Test`クラスを` ServiceRegistry`に公開し、このサービスの機能を登録する手段を提供します。


```javascript
class Test {
  constructor() {}

  outputToPre(msg) {
    let output = document.getElementById('output');
    output.innerText += msg + '\n';
  }
}

let registry = new ServiceRegistry({ Test })
register.onclick = async () => {    
  let resolvedService = await registry.register('test-action','*', location.href);  
};
```


**クライアント**（[デモ](https://web-intents-client.glitch.me/)）

クライアントはシンプルで、レジストリのインスタンスを作成し、 `pick`を呼び出します。

`pick`は仲介者に接続し、ユーザーがサービスを選択するのを待ちます。ユーザーがサービスを選択すると、仲介人（ `ServiceRegistry`）は、リモートサービスがクライアントに公開しているAPIを渡します。次に、リモートAPIのインスタンスをインスタンス化し、そのインスタンス上でメソッドを呼び出すことができます。


```javascript
let registry = new ServiceRegistry();
let resolvedService = await registry.pick('test-action','image/*');
remote = await new resolvedService.Test();
remote.outputToPre('calling from window.');
```


私はこれを実験として非常に満足しています。ここでは、Service Discoveryのビデオと上記のコードの呼び出しを示します。

<figure> {{&lt;youtube 1igal-ehMB4&gt;}} <figcaption>デモの終わりから終わりまで</figcaption></figure>

どう考えているか教えてください。過度に？