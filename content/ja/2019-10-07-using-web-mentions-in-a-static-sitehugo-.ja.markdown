---
slug: using-web-mentions-in-a-static-sitehugo-
date: 2019-10-07T20:11:30.489Z
title: 'Using Web Mentions in a static site (Hugo)'
link: ''
tags: [webmentions, hugo]
---

私のブログは完全に静的なサイトで、Hugoで構築され、Zeitでホストされています。これは私にとって素晴らしいソリューションです。シンプルなブログは非常にシンプルな展開プロセスを持ち、非常に高速にロードされます。

静的に生成されたサイトにはいくつかの欠点がありますが、最大のものは、動的なものをページに統合する必要がある場合です（コメントなど）。動的コンテンツを簡単にホストできないということは、最終的にはサードパーティのJavaScriptに依存してページにフルアクセスできるようになり、何をしているのかわからなくなることを意味します。ユーザーを追跡したり、ページを遅くしたりする可能性があります負荷。

私は最近、ユーザーがコメントにスクロールするときに（ `IntersectionObserver`を使用して）ロードするだけで、現在のコメントウィジェット（Disqus）をクリティカルレンダーパスから削除しました。すべて一緒に。

<a <span class="notranslate">href=&quot;https://webmention.net/draft/&quot; &gt;Webmention</a>仕様を入力し<a <span class="notranslate">href=&quot;https://webmention.net/draft/&quot; &gt;Webmention</a> 。 Webmentionは、別のサイトがサイト上のコンテンツに「メンション」を付けた（または「いいね！」）ときに、サイト作成者に連絡する方法を説明する仕様です。これにより、最終的にはサイトにリンクするコンテンツを発見するための分散化された方法が可能になり、できれば価値と洞察が得られます。

Webmention仕様では、「メンションサイト」が言ったことを伝えるために使用するデータ形式については説明していません。標準のマイクロフォーマットまたはページのコンテンツを理解する他のメカニズムを使用して解析する必要があります。これは素晴らしいことですが、 <a <span class="notranslate">href=&quot;https://webmention.io/&quot; &gt;webmention.io</a>などの集中化されたサービスにつながり、ページから意味を引き出すために非常に必要なインフラストラクチャを提供すると考えています。

私はWebmentionを使用するというアイデアが好きでしたが、誰かがあなたのサイトに言及したときの通知を取得（そしておそらく保存）するためにサーバー側のセットアップが必要です。これは私のサイトにあるような静的ビルダーでは常に可能ではありません。この投稿の残りの部分では、ZeitがホストするHugoビルドでホストされているいいね！、言及、再投稿の方法について簡単に説明します。

### ステップ1-Webmentionハブを見つける

webmention.ioを見つけました。着信するpingbackとメンションを処理します。また、呼び出し元のサイトが実際にコンテンツにリンクしていることを検証し、最終的にコンテキストを理解できるようにページからデータを解析します。

Webmention.ioは、オープン認証プロセスを介してサイトを所有していることを検証します（認証プロバイダーを指すrel = meを探すのはきれいでした）

### ステップ###を処理できることをページに伝えます

これは、次の2つの`link`タグを追加するのと同じくらい簡単です

```html
<link rel="webmention" href="https://webmention.io/paul.kinlan.me/webmention">
<link rel="pingback" href="https://webmention.io/paul.kinlan.me/xmlrpc">
```

### ステップ3-webmention.io APIをサイトに統合します

ここには2つのオプションがあります。webmention.ioAPIを呼び出すウィジェットをページに追加するか、webmention.io APIをビルドステップに統合できます。 JSをホストするサードパーティはできるだけ少なくしたいので、後者を選択しました。デプロイメントプロセスにWebmentionを統合しました。

ビルドが高速であるため、Hugoを使用します。これを念頭に置いて、Webmention APIを最適な方法でHugoに統合する方法を検討する必要がありました。厳しい制約は、サイトのすべてのページでAPIエンドポイントを呼び出さないことでした。私には多くのページがあり、まだ多くのコメントはありません。

幸いなことに、Webmention.ioサイトは、ドメインに関するすべての言及を受け取ることができる便利なエンドポイントを提供します。不幸なことに、このファイルには、サイトに対して行われたすべてのアクションに対して1つのエントリが含まれています。

Hugoには、特定のページのテンプレートに直接プルできるデータファイルの概念もあるため、Webmentionデータファイルを、Hugoテンプレート内で読みやすい新しい構造にマッピングする必要があります。

私が選択したプロセスは以下のとおりですが、要約は、アクションのリストから、APIによって公開されたアクション（再投稿や返信など）を含むURLの辞書に配列を変換し、最後のステップがURLの辞書を、URLのmd5ハッシュという名前の個々のファイルに分割します。

```javascript
"use strict";

const fs = require('fs');
const fetch = require('node-fetch');
const md5 = require('md5');

const processMentionsJson = (data) => {
  const urlData = {};
  data.children.forEach(item => {
    const wmProperty = item["wm-property"];
    const url = item[wmProperty];

    if(url in urlData === false) urlData[url] = {};
    const urlDataItem = urlData[url];

    if(wmProperty in urlDataItem === false) urlDataItem[wmProperty] = [];
    urlDataItem[wmProperty].push(item);
  });

  console.log(urlData);

  // For each URL in the blog we now have a JSON stucture that has all the like, mentions and reposts
  if(fs.existsSync('./data') === false) fs.mkdirSync('./data');
  Object.keys(urlData).forEach(key => {
    const item = urlData[key];
    const md5url = md5(key);
    console.log(key, md5url)
    fs.writeFileSync(`./data/${md5url}.json`, JSON.stringify(item));
  });
}

(async () => {
  const mentionsUrl = new URL(process.argv[2]); // Fail hard if it's not a uRL

  const mentionsResponse = await fetch(mentionsUrl);
  const mentiosnJson = await mentionsResponse.json();

  processMentionsJson(mentiosnJson);
})();
```

データが正しく解析されて保存されると、テンプレートのデータ属性に読み込むことができるように、テンプレートを簡単に設定できます。

```html
{{ $urlized := .Page.Permalink | md5 }}
{{ if index .Site.Data $urlized }}
  {{ $likes := index (index .Site.Data $urlized) "like-of" }}
  {{ $replys := index (index .Site.Data $urlized) "in-reply-to" }}
  {{ $reposts := index (index .Site.Data $urlized) "repost-of"}}
  <h4>Likes</h4>
  {{ range $i, $like := $likes }}
    <a href="{{$like.url}}"><img src="{{ $like.author.photo}}" alt="{{ $like.author.name }}" class="profile photo"></a>
  {{end}}

  <h4>Reposts</h4>
  {{ range $i, $repost := $reposts }}
    <a href="{{$repost.url}}"><img src="{{ $repost.author.photo}}" alt="{{ $repost.author.name }}" class="profile photo"></a>
  {{end}}

  <h4>Comments and Replies</h4>
  {{ range $i, $reply := $replys }}
    <a href="{{$reply.url}}"><img src="{{ $reply.author.photo}}" alt="{{ $reply.author.name }}" class="profile photo"></a>
  {{end}}
{{end}}
```

すべてがうまくいけば、ページの下部に実際の人がサイトとやり取りしているアイコンが表示されるはずです。

### ステップ4-コメントが発生したときにサイトを公開する

上記の手順でメンションを集約してサイトの出力に表示できますが、コメントが公開されるようにサイトを定期的に再構築する必要があります。

Zeitの展開APIを呼び出す単純なcronサービスを使用して、1時間ごとにサイトの再デポリーを強制することにしました。
