---
slug: the-web-is-my-api
date: 2017-08-27T13:20:31+01:00
title: "The Web is my API"
image_header: /images/bridges.png
tags: ["intents"]
---


[Michael Mahemoff](http://softwareas.com)はウェブの可能性についてたくさん教えてくれました。 Mikeと一緒に作業する前に、私はWeb上に構築しました。リンク可能性や発見などの利点を理解しましたが、可能なことを完全に把握することはできませんでした。

マイク氏は、「[Webは私のAPIです](http://softwareas.com/cors-scraping-and-microformats/)」と言って、マイクロフォーマットやその他の構造化データを使ってページ内の自分のサイトとデータを公開し、簡単なXMLHttpRequestとCORS APIを使用して、別のブラウザコンテキスト

>Anyway, what’s cool about this is you can treat the web as an API. The Web is
>my API. "Scraping a web page" may sound dirtier than "consuming a web service",
>but it’s the cleaner approach in principle. A website sitting in your browser
>is a perfectly human-readable depiction of a resource your program can get hold
>of, so it’s an API that’s self-documenting. The best kind of API. But a whole
>HTML document is a lot to chew on, so we need to make sure it’s structured
>nicely, and that’s where microformats come in, gloriously defining lightweight
>standards for declaring info in your web page. There’s another HTML5 tie-in
>here, because we now have a similar concept in the standard, microdata.


私は[Web Intents](https://en.wikipedia.org/wiki/Web_Intents)で作業を始めていたのとほぼ同じ時期でしたが、その精神は似ていました。別の起源のデータやサービスにユーザーがアクセスできるようにする。それはずっと複雑でした。私はサービスの発見を可能にし、その後それらのページとやりとりしたいと思っていました。マイク氏はウェブをデータとサービスへのアクセスを提供するように移行したかった。それは私と一緒にたどり着いた。 [私が元の帰属を忘れたとしても](https://twitter.com/Paul_Kinlan/status/913000817170534400)。

私は最近、ノルディックJSの話をしました。ここでは、ウェブ上でtruley相互接続されたサービスを実際にビルドしないことを強調しました。つまり、Webサイトは、サーバーを介してリモートサービスにすべてのAPIリクエストをルーティングし、それに伴うすべての複雑さを管理することによって、サードパーティサービスと統合します。

{{<figure src="/images/server-server.png" title="サーバー間の通信 - サービス間のトンネルの構築">}}

これは動作しますが、これを使ってウェブ全体を構築していますが、認証、承認、トランスポートプロトコル、RPCメソッド（REST、GraphQLなど）を考慮すると非常に複雑になります。 Mikeは、CORS対応のサイトとJavaScriptを使用して、サイトを使用してリモートサービスと直接話すことができる、より洗練されたものを提案していました。

{{<figure src="/images/server-rpc.png" title="私はクライアントとサーバーの関係を描いた私のひどい描写">}}

その間にいくつかの問題が発生しました。主な問題は、CORSがブラウザで広くサポートされているにもかかわらず、開発者はそれをめったに使用しないことです。 CORSはウェブ上で必要な保護機能ですが、セットアップとデバッグは難しく、「WebとしてのAPI」はあまりにも多くのことを押し進めていません。

{{<figure src="/images/server-rpc-nope.png" title="CORSは途中で">}}

私たちは、JSを使ってクライアントでサイトが生成され、ユーザーのためのセッションと状態がクライアント上で完全に管理されている世界へと移行しています。

私たちはまだサイトからリモートサービスに通信する能力が必要ですが、私は他のサイトやアプリケーションとの統合を分散させる必要があると強く信じていますが、まずサイトとアプリケーションをそれは単なるリンク以上のものです。私たちのサイトでは、機能と機能をユーザーシステムの他のウィンドウに直接公開する必要があります。

すべてのウェブサイトは、サイトの所有者が管理しているAPIを他のクライアントに直接公開することができます。

{{<figure src="/images/client-rpc.png" title="クライアントからクライアント">}}

良いニュースは、私たちがすでにそれを行うことができるということです。少なくとも7年間（ `postMessage`と` MessageChannel`）、そして `window.open`から永遠にプラットフォーム上にプリミティブを持っていますが、これらのツールは、CORSを使用しない理由と同様の理由でサイトとやりとりすることができます。シンプルで使いやすいAPIを定義することは難しく、巨大なサードパーティのライブラリを各サービスごとに引き出す必要はありませんあなたと交流したい

プラットフォームでは、メッセージングパッシングを使用してサイト間で通信することができます。つまり、APIを作成する場合はサービス所有者として、メッセージをある状態にシリアル化して反応させ、メッセージをクライアントに返してから、サービスを利用する開発者用のライブラリを作成する必要があります。信じられないほど複雑で畳み込まれています。私はWeb WorkersとクライアントサイドのAPIの採用が増えていない主な理由の1つです

{{<figure src="/images/window-dx.png" title="ウィンドウポストメッセージ開発者体験">}}

我々は助けるライブラリを持っている：[Comlink](https://github.com/GoogleChromeLabs/comlink)。

Comlinkは、ローカルのコンテキストでリモートクラスと関数をインスタンス化しているように見えるAPIに `MessageChannel`と` postMessage` APIを抽象化する小さなAPIです。例えば：


**ウェブサイト**


```javascript
// Set up.
const worker = w.open('somesite');
const api = Comlink.proxy(w);

// Use the API.
const work = await new api.Test();
const str = await work.say('Yo!');
console.log(str);
```



**ウェブワーカー**


```javascript
class Test {
  say() {
    return `Hi ${this.x++}, ${msg}`;
  }
}

// Expose the API to anyone who connects.
Comlink.expose({Test}, window);
```


{{<figure src="/images/comlink.png" title="Comlink">}}

サービスにAPIを公開し、プロキシ経由でクライアントでAPIを使用します。

###良い例がありますか？

私は[pubsubhubbubエンドポイントを購読するサイトとpingを受信したときにJSONメッセージを送信する](https://rss-to-web-push.glitch.me/)をユーザー定義のエンドポイントに構築しました。私は、この小さなアプリケーションのためのプッシュ通知インフラストラクチャを管理したくなかった、私が構築した別のサイト（[webpush.rocks](https://webpush.rocks/)）はすべてそれを行うことができる、私はそのサービスと統合したい。

しかし、webpush.rocksのクライアントに保持されているサブスクリプションURL（通知を送信するために必要なデータ）を自分のサイトに戻すにはどうすればよいですか？

最初にこのサイトを構築したときに、ユーザーがサイトを開いてからページ間にURLをコピー＆ペーストすることができました。どのサイトでも使用できるAPIを公開してみませんか？それが私のしたことです。

webpush.rocksは、 `subscriptionId`上に単一のメソッドを持つ` PushManager`というAPIを定義しています。ページが読み込まれると、次のようにしてこのAPIがウィンドウに表示されます。


```javascript
class PushManager {
  constructor() {
  }

  async subscriptionId() {
    //global var ick...
    let reg = await navigator.serviceWorker.getRegistration();
    let sub = await reg.pushManager.getSubscription();
    if(sub) {
        return `${location.origin}/send?id=${sub.endpoint}`;
    }
    else {
        return ``;
    }
  }
}

Comlink.expose({PushManager}, window);
```


APIはDOM内の `PushSubscriptionManager` APIとやり取りし、呼び出し元のサイトにカスタムURLを返します。ここで重要なことは、非同期に実行されているため、ユーザー検証を待つことができます（または実行しないことです）。

呼び出し元のクライアントサイト（サブスクリプションIDを取得するアプリ）に戻ります。ユーザーがリンクをクリックすると、直前に開いたウィンドウへの参照が取得され、 `Comlink`プロキシが接続されます。サービスAPIは現在クライアントに公開されており、ローカルサービスのように `PushManager` APIをインスタンス化できますが、他のウィンドウのリモートインスタンスサービスとやりとりしています。


```javascript
let endpointWindow = window.open('', 'endpointUrlWindow');

let pushAPI = Comlink.proxy(endpointWindow);
let pm = await new pushAPI.PushManager();
let id = await pm.subscriptionId();

// Update the UI.
endpointUrlEl.value = id;
```


ここでは、起こっていることの非常に簡単なビデオです。非常にシンプルで軽量なやり取りで、サービスを開き、必要なIDを取得します。

{{<youtube vTYZXx31EHc>}}

サービスプロバイダとして、私はクライアント上でのみ利用可能な制約付きの機能を他のサイトに公開しており、データをユーザーに返す前に、その情報を安全にしてユーザーの同意を求めることができますAPIを使用する。

_ウェブはAPIです._

正に、私たちはサイトがDOMや別の起源の状態を検査したり操作したりすることを許可しませんが、サイトのサービスと機能を管理し、ユーザーがどのように関与しているかを知っていれば、 （あなたが管理している）あなたのサービスを安全に使用したいクライアントへのサービスを提供します。


*あなたが上手であることに焦点を当てる。
*サイトとアプリがクライアント内にあるため、データ転送が高速になります。
*オフラインでもIPC。
*原点コンテキストでコードを実行する

###どのAPIがサイトに公開されるべきですか？

これは私がもっと探求したいものです。プッシュ通知サービスには基本的な機能がいくつか公開されていましたが、これはサイトの目的であるため、私にとって重要なのは、DOMのどの部分を他の開発者に還元したいのかということでした。

私は、すべてのサイトが一貫性のあるAPIをユーザーに公開し、他の機能やサービスを発見する方法を知りたい場所に行きたいと考えています。

各サイトの所有者は、CRUDベースの操作を実行できるように、コア機能だけをサービスに公開することができます。私たちは複雑な相互作用を持つことができました。

一つのことをうまくやっているユーザーのようなサービスをWeb上に置くことができ、ユーザはクライアント上でそれらをまとめてパイプすることができます。

各サイトは、サービス所有者によって定義されたページのサブセットの「VDOM」を公開することができるので、サイト間のDOMに基づいてデータを安全に引き出す一貫した方法が得られます。

Mikeが元の投稿のように、schema.orgベースのオブジェクトやページ上の他の構造化データ（動的に生成される可能性があります）にすばやくアクセスしたいと思うかもしれません。

[Comlink](https://github.com/GoogleChromeLabs/comlink)は、何年も前から存在していたプラットフォームプリミティブの上にサービスを迅速かつ簡単に公開し、消費する方法を提供します。私たちは最終的に、WebをAPIにするための多くの部分を用意しています。

_ウェブは私のAPIです。それもあなたのものにしてください。
