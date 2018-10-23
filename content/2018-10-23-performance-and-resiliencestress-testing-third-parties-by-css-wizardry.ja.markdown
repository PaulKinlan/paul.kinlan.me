---
slug: performance-and-resiliencestress-testing-third-parties-by-css-wizardry
date: 2018-10-23T09:53:10.359Z
title: 'Performance and Resilience: Stress-Testing Third Parties by CSS Wizardry'
link: https://csswizardry.com/2017/07/performance-and-resilience-stress-testing-third-parties/
tags: [links, performance, qrcode]
---
私は数週間前にGoogle Developer Dayで中国にいましたが、皆さんに私の[QRCode scanner](https://qrsnapper.com)を公開していました。オフラインになるまではうまくいっていました。ユーザーがオフライン（または部分的に接続されている）の場合、カメラは起動せず、QRコードをスナップできませんでした。私は何が起こっているのか分かりませんでした。私は誤って `onload`イベントでカメラを起動していました.Googleアナリティクスのリクエストはハングアップし、適時に解決されませんでした。それは[それを修正したこのコミット](https://github.com/PaulKinlan/qrcode/commit/e3b58c6821fd97defcd959f7d7f3de10ea4f4b12#diff-4a23ac1286faa3273c8cdc9b4bb5078dR578)でした。

> Because these types of assets block rendering, the browser will not paint anything to the screen until they have been downloaded (and executed/parsed). If the service that provides the file is offline, then that&#x2019;s a lot of time that the browser has to spend trying to access the file, and during that period the user is left potentially looking at a blank screen. After a certain period has elapsed, the browser will eventually timeout and display the page without the asset(s) in question. How long is that certain period of time?
> 
> It&#x2019;s 1 minute and 20 seconds.
> 
> If you have any render-blocking, critical, third party assets hosted on an external domain, you run the risk of showing users a blank page for 1.3 minutes.
> 
> Below, you&#x2019;ll see the DOMContentLoaded and Load events on a site that has a render-blocking script hosted elsewhere. The browser was completely held up for 78 seconds, showing nothing at all until it ended up timing out.


[全文を読む](https://csswizardry.com/2017/07/performance-and-resilience-stress-testing-third-parties/)

私はあなたに大きな洞察力がたくさんあるので、投稿を読むことをお勧めします。
