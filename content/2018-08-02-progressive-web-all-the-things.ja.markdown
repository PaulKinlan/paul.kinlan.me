---
slug: pwa-progressive-web-all-the-things
date: 2018-08-02T14:56:13.506Z
title: 'PWA: Progressive Web All-the-things'
description: ""
tags: ['pwa']
---


PWA。プログレッシブウェブアプリ。 Frances BerrimanとAlex Russellは2015年に「プログレッシブウェブアプリ：私たちの魂を失うことなくタブをエスケープする」（「プログレッシブウェブアプリ：https://infrequently.org/2015/06/progressive -apps-escaping-tabs-without-losing-our-soul /）」のようになります。

3年後、我々は長い道のりを歩んだ。当初は1つのブラウザエンジンでしか実装されていなかったサービスワーカー、マニフェスト、ホーム画面に追加、Web Pushというゆるやかな技術の集まりから、企業や開発者と業界全体に密着し始めたブランド、ブラウザベンダーは大多数の 'PWA'スタックを実装しています。

私たちは今[app](https://appsco.pe/)[ディレクトリ](https://pwa-directory.appspot.com/)、[tools](https://blog.tomayac.com/ PWAのメリットについてのケーススタディが多数公開されています。 （https://developers.google.com/web/showcase/)。しかし、PWAは何を定義していますか？フランシスとアレックスはこの特徴のリストを思いついた：

> **[Responsive](http://alistapart.com/article/responsive-web-design)**[:](http://alistapart.com/article/responsive-web-design) 
> to fit any form factor  
> **Connectivity independent**: Progressively-enhanced with [Service 
> Workers](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) 
> to let them work offline  
> **App-like-interactions**: Adopt a Shell + Content application model to create 
> appy navigations & interactions  
> **Fresh**: Transparently always up-to-date thanks to the Service Worker update 
> process  
> **Safe**: Served via TLS (a Service Worker requirement) to prevent snooping  
> **Discoverable**: Are identifiable as "applications" thanks to 
> [W3C](https://w3c.github.io/manifest/) 
> [Manifests](https://developers.google.com/web/updates/2014/11/Support-for-installable-web-apps-with-webapp-manifest-in-chrome-38-for-Android) 
> and Service Worker registration scope allowing search engines to find them  
> **Re-engageable**: Can access the re-engagement UIs of the OS; e.g. [Push 
> Notifications](https://developers.google.com/web/updates/2015/03/push-notificatons-on-the-open-web)  
> **[Installable](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en)**[: 
> to the home screen through browser-provided 
> prompts](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en), 
> allowing users to "keep" apps they find most useful without the hassle of an 
> app store  
> **Linkable**: meaning they're zero-friction, zero-install, and easy to share.
> The social [power of
> URLs](http://www.theatlantic.com/technology/archive/2012/10/dark-social-we-have-the-whole-history-of-the-web-wrong/263523/)
> _matters_.


重要なことは、この説明は、ウェブを見たいと思ったことを少しはっきりさせたところであり、私たちは[ツール](https://developers.google.com/web/tools/lighthouse/)を手に入れました私たちのサイトが「PWA」であるかどうかわかります。 Alexはさらに進んで、[PWA]をPWAにする技術的側面のいくつかを定義しました（https://infrequently.org/2016/09/what-exactly-makes-something-a-progressive-web-app/ ）。

このポストの誇大宣言が途方に暮れると、なぜ誰もがこれらのものをつくるのではないのですか？ [まあ、それは難しいかもしれません。非常に難しい](/ challenge-for-web-developers /)私たちは開発者や企業に多くのことを求めています。場合によっては、AppShellに焦点を当てることは、サイトの完全な再構築であり、他の場合には[AppShellは正しいアーキテクチャではありません](/ progressive-progressive-web-apps /)です。多くの場合、価値観や物語は必ずしも明確ではありません。

私は幸運にもビジネスや開発者に、ウェブ上での構築に対する懸念、特にビジネスや開発者がPWAについて語っていることを聞いた事柄について直接話すことができるようになりました：

> We've got our site... but we are also making a PWA.


> &mdash; Many B2B sites we spoke (actually, I saw this a lot in India)


面白い。彼らは違いますか？頻繁にはないが、PWAは彼らが知っている「もの」であり、それは打ち上げるための別の製品だ。 m。*サイトと同じように、モバイル版のデスクトップサイトでは、PWAは別のものにすることができます。

> I've got a PWA. It just does Push notifications.


> &mdash; Too many people.


ワウ。それはPWAではなく、ネイティブアプリが持っていた技術を使っているだけです。

> I'm only building a blog... it's not a PWA


> &mdash; Many bloggers we spoke to.


うーん。コンテンツサイトがなぜ動くのが重要なのかを明確にすることはできませんでした。

> I don't care about making it installable.. I don't need a Service Worker.


> &mdash; Many publishers we spoke to.


ハァッ。人々はAppとインストールを関連づけ、サイトや経験がAppインストールのように行動しなければならないと考えて、一部の人々をコンセプト全体から外してしまいます。 2015年には、ニンジンに関する非常に興味深い議論がありました（https://trib.tv/2015/10/11/progressive-apps/）。

> I don't need an app on desktop. I just need users to click 'checkout'


> &mdash; Many retailers we spoke to.


OK。それはかなり明確です。ユーザーまたはビジネスへの価値は存在せず、PWAの特性に優先順位を付けるビジネスを停止するだけで十分です。

> Progressive Web Apps are just better sites.


> &mdash; Many developers we speak to.


実際、私は多くの偉大なWeb開発者からこのことをたくさん聞いています。

PWAで長年に渡って「PW」を押し続けていた[Jeremy Keith](https://adactio.com/)の記事をチェックすることをお勧めします。最近の講演では、

> There's a common misconception that making a Progressive Web App means
> creating a Single Page App with an app-shell architecture. But the truth is
> that literally any website can benefit from the performance boost that results
> from the combination of HTTPS + Service Worker + Web App Manifest.


> &mdash; Jeremy Keith. "[Any Site can be a Progressive Web 
> App](https://noti.st/adactio/d1zSa7/any-site-can-be-a-progressive-web-app)" 


私の個人的な気持ちは、誰もPWAのAで本当にハングアップしているということです。それはコンセプトのブランド化の成功と失敗です。 「App」は名前の中にあり、「App」は多くのユーザーや企業を意識しているため、団体はかなり明確です。

私たちのチームの間では、自分自身や他の多くの人々が、PWAのコンテキストで、特にモバイルネイティブの経験と競合するという点で、「App」という言葉を強く押しました。 [Andrew Bettsの記事](https://trib.tv/2016/06/05/progressively-less-progressive/)は私たちのオリジナルのポジショニングに対して良い要約をしていましたが、間違っているとは思わないのですが、それほどモバイル中心ではなかったフォームファクタを中心に、より幅広い話を具体的に手助けする機会を逃しています。

私は、Chromeウェブストアについて話していたときにこれを視聴者に尋ねていました。 Gmailはアプリですか、サイトですか？簡単なアプリです。 Twitterはアプリですか、サイトですか？ App ..それは？私がちょうどコンテンツを読んでいるなら、それはまだウェブサイトのように感じます。 Wikipediaはアプリですか？サイト、絶対に;それはそれですか？エディタとしては、ツールのような感じです。

最終的には、サイトがアプリであるかアプリケーションがサイトである場合、実際にはあまり重要ではないと私は考えています。人々はWeb上で「アプリ」、ゲーム、VRボビン、小売店、伝統的な「サイト」のすべてを作成することができ、メディア、エンターテインメント、出版、ユーティリティ、コマースなどの特定のユースケースに対応できます。

「インストール性」（「白菜の袋」を参照）を除いて、PWAの元の定義を分かれば、私は開発者がアレックスのポイントのいずれかで自分のサイトを改善しても、ユーザーはより良いエクスペリエンスを得ることができ、ユーザーがより良い経験を得ると、Webを大切にしている人々はWebと有意義な関係を保ち、Webを使い続けることができます。どのようにすべてのビジネスと開発者が焦点を当てるべきかを知る方法でPWAの語りを適用するにはどうすればよいですか？

---

私は、業界で見たような挑戦に基づいて、若干のピボットを考えていましたが、私は開発者とビジネスが彼らの努力に集中できる場所の重要性に優先順位をつけようとしました。 （注：私は[BizKin](https://twitter.com/business_kinlan)を呼び出すかもしれない）

私たちは、次のようなウェブのユニークな機能を活用することで、ビジネスと開発者が成功することを望んでいます。ボタンをクリックするだけで、できるだけ多くのユーザーにアプローチできます。単一のコードセットを使用してデバイス間で最高のエクスペリエンスを実現することで、ユーザーを保持する。ユーザーとの直接的かつ友好的な関係を構築することによって、ユーザーと有意義な関係を築くことができます。

私は、Webを使用する際にユーザーが感じるべき原則のセットとしてこれを明確にしようとしました。あなたの経験は以下の通りでなければなりません：発見可能、安全、速く、滑らかで、信頼できる、意味ある

発見可能にする：ユーザーが自分の経験を見つけることを可能にする。ウェブはリンクとページで構成されています。理想的には、すべてのページと状態には、アグリゲータ、メッセージ、電子メール、または看板など、あらゆるサイトから誰かに送信できるように、ディープリンクが必要です。レンダラーがそれを読むことができるように、コンテンツを提供する必要があります。

安全にする：ユーザーとコンテンツ所有者は、Web上に構築された経験を信頼して、アイデンティティ、機密性、データの完全性を保護することができます。

速くする：ユーザーがあなたのサイトへのリンクを持っていたら、彼らはあなたの経験にあり、ユーザーが持っているネットワークやデバイスとは無関係に、利用し始めることができます。

それをスムーズにする：ユーザーがあなたのサイトにいるとき、その経験はすべてのユーザーのジェスチャーに反応し、インタラクティブです。アニメーションは滑らかで鮮明で、フィードバックは瞬時に、スクロールは絹で、ナビゲーションは瞬時に行われます。理想的には、ウェブのパフォーマンスを[RAIL](https://developers.google.com/web/fundamentals/performance/rail)という観点から考えると、あなたは「RAI」に集中しています。

それを信頼できるものにする：信頼できないネットワークやデバイスに直面した場合、サイトのユーザーはできるだけ中断することがほとんどありません。ユーザーがどこにいても、その経験はうまくいくはずです。

価値あるものを提供する：貴重な価値を提供し、価値を提供する高品質な体験を通じて、ユーザーのニーズを満たす必要があります。これはかなりふわふわしているかもしれませんが、[Dion Almaerはそれについてよく説明しました](https://medium.com/ben-and-dion/mission-improve-the-web-ecosystem-for-developers-3a8b55f46411)。焦点は、ユーザーのニーズを解決する、エンターテインメントであること、購入を円滑にすること、知識の向上や仕事の迅速な完了といったサイトのことです。それはすべてのUXについてです。

**これらの基本的な目標を満たす現代的な経験。**高速で、信頼性が高く、安全で滑らかです。それは、現代のAPIを使用して**ますます**可能な**となっており、オープンなウェブの範囲とその中心を活用することで、**発見可能**となります。 PWAは、ユーザーの期待に基づいてこれらの「基本目標」を自然に満たすべきであり、より多くの技術と機能が登場するにつれてその経験を引き続き構築する必要があります。

<span><span id='pw'>プログレッシブウェブ</span> <span id=name>アプリ</span></span> - プログレッシブウェブオール - ザ - もの。

これは私が来年にわたってPWAを推進したいところです。どう思いますか？

_ハーレーンバトラに感謝します._

{{ <html> }}

<style> dt {   font-weight: 600;   margin-bottom: 0.8em; } dd {   margin-bottom: 1em; } #pw {   font-weight: 700;   font-size: 1em; } #name {   font-size: 1em;   font-weight: 100; } </style><script>   const nameEl = document.getElementById('name');   const names = ['Apps', 'Sites', 'Stores', 'Blogs', 'Forums', 'Magazines', 'Block-chain doo-dads', 'Experiences', 'Wikis', 'Utilities', 'Games'];   let counter = 1;   setInterval(()=> {      nameEl.textContent = names[counter];     counter = (counter + 1) % names.length;     nameEl.animate([{opacity: 0}, {opacity: 1}], {duration: 1000, easing: 'cubic-bezier(1,.01,1,.99)'})   }, 2000) </script> {{ </html> }}