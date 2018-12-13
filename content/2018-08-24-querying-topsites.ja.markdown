---
slug: lighthouse-scores-for-in-domains
date: 2018-08-24T08:09:10.405Z
title: Getting Lighthouse scores from HTTPArchive for sites in India.
description: A quick dive in to how to use Lighthouse to try and understand how users in a country might experience the web.
tags: [webdev, bigquery, lighthouse, india]
---


私はインドへの短い旅に出掛けようとしています。私はこの地域のChromeとWebの長期的な開発者関係の仕事について考えてきました。ほとんどの旅行と同じように、私は少し時間をかけて研究をするのが好きなので、訪問している国の視点から見たWebをよりよく理解することができます。

私は過去数ヶ月にわたって[HTTPArchive](https://httparchive.org/)のアップデートを続けてきましたが、それは収集して保存するデータの種類の改善を見て驚くべきことでした[ BigQuery](https://github.com/HTTPArchive/legacy.httparchive.org/blob/master/docs/bigquery-gettingstarted.md)の表を参照してください。私に大きな関心を寄せている特定の情報の1つは、HTTPArchiveの実行ごとに生成される[Lighthouse](https://developers.google.com/web/tools/lighthouse/)データです。このデータを使用して、データのスナップショットを取得し、人々がその国でどのようにWebを体験するかについての高いレベルの理解を得るために使用できるかどうかを知りたいと思っていました。

良い知らせは、HTTPArchiveのLighthouseデータを分析するのが難しくないということです。

しかし、私が必要としていることは、特定の国のトップサイトをロックすることです。

ここで私はどのように問題を壊したのですか。各国にはウェブ用に構築された多くのタイプの開発者がおり、個人的に私は3つのグループに分かれています。外国市場をターゲットとするもの（私は輸出用にビルドする）;世界の視聴者をターゲットとするもの

上記の3つのグループについて考えると、サイトの意図とその背後にいる人々を解決することはほとんど不可能です。しかし、少なくともあなたがデータを推論して理解するのに役立つヒューリスティックがあります。

私の分析では、インドのユーザーが訪れたトップサイトのリストを得ることができないと考えていたので、インドの人々のために「.in」ドメインが*構築される可能性が高いという簡単な仮定をしました。 「インディアンサイト」の問題に対する感度と特異性は、「インドメイン」に焦点を当てることで100％ではありません。世界各地のユーザーは、単にTLDにロックされていない経験を利用したいと考えています。それは最初のパスとしてインドのサイトの状態のまともな尺度のように思える。

このタイプの分析は非常に簡単です。 [BigQuery](https://github.com/HTTPArchive/legacy.httparchive.org/blob/master/docs/bigquery-gettingstarted.md)を開いて、Lighthouseデータの実行を含む最新の表を探します[httparchive：lighthouse .2018_08_01_mobile]この場合、次のクエリを実行します。


```sql
SELECT
  url,
  JSON_EXTRACT(report, '$.categories.seo.score') AS [seo_score],
  JSON_EXTRACT(report, '$.categories.pwa.score') AS [pwa_score],
  JSON_EXTRACT(report, '$.categories.performance.score') AS [speed_score],
  JSON_EXTRACT(report, '$.categories.accessibility.score') AS [accessibility_score]
FROM
  [httparchive:lighthouse.2018_08_01_mobile]
WHERE
  url LIKE '%.in/'
```


上記のクエリは '.in'で終わるドメインでフィルタリングされ、LighthouseテストカテゴリごとにLighthouseスコアを返します。 LighthouseデータはJSONオブジェクトとして格納されます。これは、JSONのXPathのような構文で必要なコンポーネントを抽出する必要があります。

結果の数は実際にはかなり大きく、ここにはあまり使われていませんが、これらをヒストグラムにピボットしました。

<table><thead><th>スコアの範囲</th><th> SEOスコア</th><th> PWAスコア</th><th>スピードスコア</th><th> A11Yスコア</th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 46 </td><td> 279 </td><td> 25 </td></tr><tr><td> 0.5 </td><td> 84 </td><td> 13992 </td><td> 6502 </td><td> 3973 </td></tr><tr><td> 0.7 </td><td> 3391 </td><td> 1400 </td><td> 2222 </td><td> 7585 </td></tr><tr><td> 0.8 </td><td> 1438年</td><td> 19 </td><td> 1147 </td><td> 2374 </td></tr><tr><td> 0.9 </td><td> 2762 </td><td> 9 </td><td> 1545 </td><td> 1069 </td></tr><tr><td> 1 </td><td> 7752 </td><td> 13 </td><td> 3189 </td><td> 434 </td></tr></tbody></table>

特定の問題がスコアに影響を与えていることを正確に理解するためには、さらに詳細なデータのドリルダウンと分析が必要ですが、「PWAスコア」のような過去のサイトスコアを十分に把握しているどのような問題が全体的なスコアに影響し、私は今、私たちの前にいくつかの課題を見ることができます。

次へインドのユーザーが頻繁に訪れるサイトを手に入れようとする方法を見つけてください....ヒント、[こちら](/ crux-topsites-and-lighthouse-for-india /)