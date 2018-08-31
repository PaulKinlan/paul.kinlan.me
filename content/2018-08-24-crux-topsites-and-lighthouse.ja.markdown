---
slug: crux-topsites-and-lighthouse-scores-for-india
date: 2018-08-24T08:19:10.405Z
title: Using HTTPArchive and Chrome UX report to get Lighthouse score for top visited sites in India.
description: A quick dive in to how to use Lighthouse,HTTPArchive and Chrome UX report to try and understand how users in a country might experience the web.
tags: [webdev, bigquery, lighthouse, crux]
---


[前の記事](/ lighthouse-for-in-domains /)で触れたように、私はインドでより多くのデベロッパーリレーションズの仕事を計画し始めています。インドのユーザーがウェブをどのように経験しているか。その記事では、インドのサイトを決定するための非常に簡単なヒューリスティックを持っていました。それは「.in」ドメインです。私はこれがこれを見ている最善の方法ではないことを知っていましたが、それは良い最初のように感じました。

私が本当に欲しかったのは、インドのユーザーが訪問したサイトを理解して、サイトの人気度でランク付けしたサイトを理解する方法でした。

幸いなことに、[Chrome UXレポート](https://developers.google.com/web/tools/chrome-user-experience-report/)にはそのデータの一部が含まれています。 ChromeのUXレポートには、BigQueryの一連の表があります。この表には、インドのユーザーが訪れた多くのトップ原点のリストが含まれています（表は `chrome-ux-report.country_in.20180`です。国）。 Chrome UXレポートには、実際のユーザーの集計されたサイトの速度など、各原点ごとにさらに多くのデータがありますが、実際にはURLだけが必要でした。

ChromeのUXレポートのデータを使用して、前述のHTTPArchive灯台のスコアとともに、HTTPアーカイブのAlexaランキング表と組み合わせることで、インドのユーザーが実際に見るものをよりよく把握できます。




```sql
SELECT
  url, rank,
  JSON_EXTRACT(report, '$.categories.seo.score') AS seo_score,
  JSON_EXTRACT(report, '$.categories.pwa.score') AS pwa_score,
  JSON_EXTRACT(report, '$.categories.performance.score') AS speed_score,
  JSON_EXTRACT(report, '$.categories.accessibility.score') AS accessibility_score
FROM
  `httparchive.lighthouse.2018_08_01_mobile`
JOIN (
  SELECT
    DISTINCT origin,
    Alexa_rank AS rank
  FROM
    `httparchive.urls.20170315`
  JOIN
    `chrome-ux-report.country_in.201807`
  ON
    NET.REG_DOMAIN(origin) = Alexa_domain) AS crux
  ON
    url = CONCAT(origin, '/')
ORDER BY
  rank ASC, url ASC
```


上記のクエリを実行すると、Googleスプレッドでは大量のデータが返されるため、上位16,000サイト（Alexaランキングでは最大約7,000件）までしか分析しませんでした。以下は、コメントなしで集計されたデータです。

####トップ7k

<table><thead><th>スコアの範囲</th><th> SEOスコア</th><th> PWAスコア</th><th>スピードスコア</th><th> A11Yスコア</th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 25 </td><td> 149 </td><td> 10 </td></tr><tr><td> 0.5 </td><td> 45 </td><td> 12253 </td><td> 7841 </td><td> 3925 </td></tr><tr><td> 0.7 </td><td> 1907 </td><td> 3609 </td><td> 2725 </td><td> 6498 </td></tr><tr><td> 0.8 </td><td> 1713 </td><td> 54 </td><td> 1188 </td><td> 2610 </td></tr><tr><td> 0.9 </td><td> 3016 </td><td> 30 </td><td> 1180 </td><td> 1788 </td></tr><tr><td> 1 </td><td> 9278 </td><td> 21 </td><td> 2283 </td><td> 1157 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

#### Alexa Top 100

<table><thead><th>スコアの範囲</th><th> SEOスコア</th><th> PWAスコア</th><th>スピードスコア</th><th> A11Yスコア</th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 0 </td><td> 3 </td><td> 2 </td></tr><tr><td> 0.5 </td><td> 0 </td><td> 2279 </td><td> 1231 </td><td> 519 </td></tr><tr><td> 0.7 </td><td> 87 </td><td> 703 </td><td> 484 </td><td> 1348年</td></tr><tr><td> 0.8 </td><td> 199 </td><td> 0 </td><td> 198 </td><td> 587 </td></tr><tr><td> 0.9 </td><td> 375 </td><td> 0 </td><td> 261 </td><td> 302 </td></tr><tr><td> 1 </td><td> 2316 </td><td> 0 </td><td> 694 </td><td> 219 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

#### Alexa Top 1000

<table><thead><th>スコアの範囲</th><th> SEOスコア</th><th> PWAスコア</th><th>スピードスコア</th><th> A11Yスコア</th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 1 </td><td> 19 </td><td> 2 </td></tr><tr><td> 0.5 </td><td> 16 </td><td> 5471 </td><td> 3517 </td><td> 1942 </td></tr><tr><td> 0.7 </td><td> 546 </td><td> 1867年</td><td> 1272 </td><td> 2941 </td></tr><tr><td> 0.8 </td><td> 757 </td><td> 9 </td><td> 507 </td><td> 1212 </td></tr><tr><td> 0.9 </td><td> 1077 </td><td> 16 </td><td> 567 </td><td> 719 </td></tr><tr><td> 1 </td><td> 4962 </td><td> 6 </td><td> 1241 </td><td> 550 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

私は、ツール開発者や企業が現在手にしているのは、ユーザーが実際にウェブの経験をどのように感じているかについて、合理的かつ原理的な決定を下す能力に大きな違いをもたらすと考えています。私にとっては、このデータは、私たちが見ることができるベースラインを提供して、私たちのdevrel作業の戦略が長期的に生態系に影響を与えるかどうかを見ています。