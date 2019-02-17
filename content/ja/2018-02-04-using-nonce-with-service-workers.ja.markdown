---
slug: using-nonce-with-service-workers
date: 2018-02-04T13:20:31+01:00
title: "Using CSP Nonces effectively with service worker"
tags: ['service worker', 'csp', 'security', 'google analytics']
description: "CSP nonce values can help you securely run inline content on you site. But it can 
be hard to get it working with Service Workers... until now."
---


[最近のプロジェクト](https://webgdedeck.com/)では、できるだけ多くのロジックをサーバー、サービスワーカー、クライアントの間で共有したいと思っていました。このプロジェクトは本質的に単純なRSSフィードリーダーであり、RSSフィードを取得し、データを解析し、（TweetDeckによく似た）列の素晴らしいセット、および単一のマージされたリストにマージします。

私はRSSフィードを取得して自分のページに表示しているので、できるだけ不自然なことをしていないことを可能な限り確実にする必要があります。私は自分の能力を知っていますが、私は自分の能力を知っていますが、RSSフィードを操作してスクリプトを実行したり、画像や他のサードパーティを私のサイトのコンテキスト。

Webプラットフォームは、Content-Security-Policy（CSP）を介してサイトをロックダウンする機能を提供します。 CSPは、スクリプト、スタイル、画像などのコンテキストを要求できる外部ソースをロックダウンすることができます。スクリプトがインラインでスクリプトを実行する機能をロックすることもできます。これにより、XSSタイプの攻撃のすべての邪魔を防ぐことができます。

それをアプリに追加するのはかなり簡単でした。


```
`default-src 'self';`
```


しかし....私はいくつかの問題がありました。

1.私はページ上にスタイルをインラインで生成するので、スクリプトをインラインで実行する必要がありました。 2.ページにインラインスクリプトを実行する必要のあるGoogleアナリティクスを含める必要がありました。

CSPでは、スクリプトの `unsafe-eval`というオプションを有効にすることで、スクリプトとスタイルをインラインで実行できますが、これはCSPが提供する保護をほとんどバイパスします。

インラインスクリプトを実行してもCSPの保護機能を維持するために、CSPはいくつかのツールを提供しています。私が使ったのは「ノンス」と呼ばれています。 nonceは、CSP HTTPヘッダーに設定したランダムなIDで、関連付けられたインラインスクリプトで集計します。

** HTTPヘッダーのCSP文字列**


```
`default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-script-${nonce.analytics}'; connect-src 'self'; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'nonce-style-${nonce.style}'
```


**ノンセを使用したインラインスクリプト**


```html
<script src="https://www.googletagmanager.com/gtag/js?id=1111"></script>
<script nonce="script-{nonce.analytics}">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '{{=it.config.then(config=>config.site.googleAnalytics)}}');
</script>
```


上記のコードはうまく機能し、CSPでサイトをセキュリティで保護しているときに、アナリティクスが正しく機能するように簡単になります。

ウェブリクエストごとに一意の 'nonce'値が必要です。これはサーバー上で生成し、テンプレートを使って適用する値である `{nonce.analytics} 'で行います。ノンス値を再使用すると、ブラウザはスクリプト内のコンテンツの実行を拒否します。

ノンス値を生成するのに少し問題がありました。私は、同じユーザーによって再利用されないユニークな価値を創造するものが必要でした。私は '[source]  -  [date.now + request-count]という形式の一意の値で十分であると感じました。

'source'はナンススペースにナンススペースを追加することができます。date.now（）+リクエスト数が増えれば、比較的安定した値を返すことができます。

私は以下の関数を使ってノンスを生成します：


```javascript
function generateIncrementalNonce(source) {
  let val = 0;
  let max = Math.pow(10, 3); // Date + pow 3 gets us close to max number;

  const generate = () => {
    let now = max * +new Date();
    if(val >= max) val = 0;
    else val++;
    return (source !== undefined ? source : '') + (now + val).toString();
  }

  return generate;
};
```


いいね。しかし、私はすべてのページをサービスワーカーにキャッシュしています。つまり、単にキャッシュからコンテンツを提供すれば、ノンス値は再利用され、実行されません。

幸いにも、私は私のサーバーとサービスワーカーの間でロジックを共有しています。これにより、私のコードの中心的な場所に必要なものを生成できます。 `generateIncrementalNonce`関数で 'source'パラメータを使用して 'server'または 'service-worker'をnonce値の前に追加して、サーバーとサービスワーカーの両方のリクエストハンドラでこれを行いました。このソースパラメータを使用すると、サーバー経由で生成されたnonce値が、サービスワーカー経由でロードされたページと決して衝突しないことを保証できます。

このパターンは私によく役立っています。私のページに第三者が信頼できないコードを注入したり実行したりするのを阻止しながら、Google Analyticsに必要なインラインスクリプトを許可することができました。

以下は私がプロジェクトで使用したコードです。私のページには、nonce値が必要な場所がいくつかあります。要求ごとにそれらを生成し、テンプレート機能とHTTPヘッダーに同時に適用します。

#### common.js  - 共有ロジック


```javascript
function generateCSPPolicy(nonce) {
  return `default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-script-${nonce.analytics}'; connect-src 'self'; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'nonce-style-${nonce.style}' 'nonce-style-${nonce.inlinedcss}';`;
};

function generateIncrementalNonce(source) {
  let val = 0;
  let max = Math.pow(10, 3); // Date + pow 3 gets us close to max number;

  const generate = () => {
    let now = max * +new Date();
    if(val >= max) val = 0;
    else val++;
    return (source !== undefined ? source : '') + (now + val).toString();
  }

  return generate;
};
```


#### service-worker.js  - フェッチハンドラ


```javascript
const generator = generateIncrementalNonce('service-worker');
let nonce = {
  analytics: generator(),
  inlinedcss: generator(),
  style: generator()
};

// Call the route handler with all data needed
let response = all(nonce, {
  dataPath: paths.dataPath,
  assetPath: paths.assetPath
}).then(r => setHeader(r, 'Content-Security-Policy', generateCSPPolicy(nonce)));;
e.respondWith(response);
```


#### server.js  - リクエストハンドラ


```javascript
const generator = generateIncrementalNonce('server');

let nonce = {
  analytics: generator(),
  inlinedcss: generator(),
  style: generator()
};

res.setHeader('Content-Security-Policy', generateCSPPolicy(nonce));

// Call the route handler with all data needed
all(nonce, {
      dataPath: `${paths.dataPath}${hostname}.`,
      assetPath: paths.assetPath 
    })
    .then(response => {
      node.responseToExpressStream(res, response.body)
    });
```