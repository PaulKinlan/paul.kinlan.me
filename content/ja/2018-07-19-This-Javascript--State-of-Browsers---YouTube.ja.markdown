---
slug: this-javascript--state-of-browsers---youtube
date: 2018-07-19T15:06:53.251Z
title: 'This.Javascript: State of Browsers - YouTube'
link: https://www.youtube.com/watch?v=67etFbKTOFA
tags: [links, browsers, chrome, mozilla, edge, beaker, brave, pwa]
---
This DotのTracy Leeは、ブラウザのベンダーの多くが取り組んでいることの概要を示すために、かなりきれいなライブストリームを編成しました。

> Browser representatives from Brave, Beaker, Edge, Chrome, & Mozilla get together to talk about recent updates and the state of browsers.
> 
> Featured Speakers:
> 
> + Brendan Eich - &#x00a0;Creator of Javascript, Co-founder & CEO at Brave Software
> + Paul Frazee - Works on Beaker Browser
> + Matthew Claypotch - Developer Advocate at Mozilla
> + Paul Kinlan - Senior Developer Advocate at Google
> + Patrick Kettner - Edge at Microsoft
> + Amal Hussein - Senior Open Web Engineer at Bocoup
> + Tracy Lee - GDE,&#x2008;RxJs&#x2008;Core&#x2008;Team, This Dot Co-founder


[全文を読む](https://www.youtube.com/watch?v=67etFbKTOFA)

私はライブストリームを徹底的に楽しんだし、みんなが何をしているか聞くのは素晴らしいことだった。私はBeaker Browserが分散型Webのために持っているビジョンが大好きです。私たちが最後に会って以来、多くの仕事をしてきました。

リンクされたビデオを見ることをお勧めします.Edgeには、フルService Workerサポート、可変フォントなどの膨大なアップデートがあり、WebPも導入しています。 MozillaはWebアセンブリと開発者向けツールに非常に重点を置いており、Beakerは驚くほどのことをしています。分散コンピューティングとBraveはBATに沿って動き出しています。

私たちのチームが現時点で行っている作業に焦点を当て、ディスカバリー、スピードと信頼性、UIレスポンス、UX  - 物事を遂行し、セキュリティとプライバシーを概説しています。もう少し具体的には：

*ディスカバリー - インデクサーやエンベッダーなどのヘッドレスサービスでレンダリングするJSを使用して開発者がサイトを構築しやすくする必要があります。つまり、インデクサの仕組みとそのテスト方法、そして優れたSSR体験を構築する方法について、開発者を教育することに焦点を当てる必要があります。 *スピードと信頼性 - すべてのサイトは、メディアンデバイス（MotoG 4/5）上で3gネットワーク上のTTIを5秒以下にする必要があり、FID（最初の入力遅延）を最適化する必要があります。 FIDは新しいメトリックなので、ユーザーが野生でサイトをどのように体験しているかを表現することを意図していることを理解しておくことが重要です.TTIは測定が難しく、FIDを簡単にする必要があります。あなたがFIDをテストするのに使うことができるpolyfillがあります（github.com/GoogleChromeLabs/first-input-delay）* UIレスポンス -  Webはどこでも60fpsになりたいと思っています。 ＆＃x20;＆＃x2019; FLIP＆＃x2019;わかりやすく、Houdiniを構築することで、開発者にレンダリングのエンゲージメントをより詳細に制御できるようになり、img.decodeなどのツールを使用してできるだけ多くの作業をできるだけ動かそうとしています。使いやすい。 * UX  - 成果を上げよう - 我々はプラットフォームに来る新機能について話をする方法を本当に変えたいと思っています。具体的には、ユーザーエクスペリエンスを向上させるためにテクノロジを効果的に使うべき場所を示して、できるだけ中断することなく*セキュリティとプライバシー - 私は、AppleのIntelligent Tracking防止がWebに長期的な影響を与えると考えており、開発者はWebサポートのプライバシーを構築することについてもっと考え始める必要があります。もし何かGDPRがEUのウェブを「面白い」経験にしているならば。

最後に、誰もが[Web Intents](https://en.wikipedia.org/wiki/Web_Intents)を返そうとしていると聞いて、謙虚さと心温まるものでした。
