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
> **[Responsive](http://alistapart.com/article/responsive-web-design)**[:](http://alistapart.com/article/responsive-web-design) 

> to fit any form factor  
> to fit any form factor  

> **Connectivity independent**: Progressively-enhanced with [Service 
> **Connectivity independent**: Progressively-enhanced with [Service 

> Workers](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) 
> Workers](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) 

> to let them work offline  
> to let them work offline  

> **App-like-interactions**: Adopt a Shell + Content application model to create 
> **App-like-interactions**: Adopt a Shell + Content application model to create 

> appy navigations & interactions  
> appy navigations & interactions  

> **Fresh**: Transparently always up-to-date thanks to the Service Worker update 
> **Fresh**: Transparently always up-to-date thanks to the Service Worker update 

> process  
> process  

> **Safe**: Served via TLS (a Service Worker requirement) to prevent snooping  
> **Safe**: Served via TLS (a Service Worker requirement) to prevent snooping  

> **Discoverable**: Are identifiable as "applications" thanks to 
> **Discoverable**: Are identifiable as "applications" thanks to 

> [W3C](https://w3c.github.io/manifest/) 
> [W3C](https://w3c.github.io/manifest/) 

> [Manifests](https://developers.google.com/web/updates/2014/11/Support-for-installable-web-apps-with-webapp-manifest-in-chrome-38-for-Android) 
> [Manifests](https://developers.google.com/web/updates/2014/11/Support-for-installable-web-apps-with-webapp-manifest-in-chrome-38-for-Android) 

> and Service Worker registration scope allowing search engines to find them  
> and Service Worker registration scope allowing search engines to find them  

> **Re-engageable**: Can access the re-engagement UIs of the OS; e.g. [Push 
> **Re-engageable**: Can access the re-engagement UIs of the OS; e.g. [Push 

> Notifications](https://developers.google.com/web/updates/2015/03/push-notificatons-on-the-open-web)  
> Notifications](https://developers.google.com/web/updates/2015/03/push-notificatons-on-the-open-web)  

> **[Installable](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en)**[: 
> **[Installable](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en)**[: 

> to the home screen through browser-provided 
> to the home screen through browser-provided 

> prompts](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en), 
> prompts](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en), 

> allowing users to "keep" apps they find most useful without the hassle of an 
> allowing users to "keep" apps they find most useful without the hassle of an 

> app store  
> app store  

> **Linkable**: meaning they're zero-friction, zero-install, and easy to share.
> **Linkable**: meaning they're zero-friction, zero-install, and easy to share.

> The social [power of
> The social [power of

> URLs](http://www.theatlantic.com/technology/archive/2012/10/dark-social-we-have-the-whole-history-of-the-web-wrong/263523/)
> URLs](http://www.theatlantic.com/technology/archive/2012/10/dark-social-we-have-the-whole-history-of-the-web-wrong/263523/)

> _matters_.
> _matters_.


重要なことは、この説明は、ウェブを見たいと思ったことを少しはっきりさせたところであり、私たちは[ツール](https://developers.google.com/web/tools/lighthouse/)を手に入れました私たちのサイトが「PWA」であるかどうかわかります。 Alexはさらに進んで、[PWA]をPWAにする技術的側面のいくつかを定義しました（https://infrequently.org/2016/09/what-exactly-makes-something-a-progressive-web-app/ ）。

このポストの誇大宣言が途方に暮れると、なぜ誰もがこれらのものをつくるのではないのですか？ [まあ、それは難しいかもしれません。非常に難しい](/ challenge-for-web-developers /)私たちは開発者や企業に多くのことを求めています。場合によっては、AppShellに焦点を当てることは、サイトの完全な再構築であり、他の場合には[AppShellは正しいアーキテクチャではありません](/ progressive-progressive-web-apps /)です。多くの場合、価値観や物語は必ずしも明確ではありません。

私は幸運にもビジネスや開発者に、ウェブ上での構築に対する懸念、特にビジネスや開発者がPWAについて語っていることを聞いた事柄について直接話すことができるようになりました：


> We've got our site... but we are also making a PWA.
> We've got our site... but we are also making a PWA.



> &mdash; Many B2B sites we spoke (actually, I saw this a lot in India)
> &mdash; Many B2B sites we spoke (actually, I saw this a lot in India)


面白い。彼らは違いますか？頻繁にはないが、PWAは彼らが知っている「もの」であり、それは打ち上げるための別の製品だ。 m。*サイトと同じように、モバイル版のデスクトップサイトでは、PWAは別のものにすることができます。


> I've got a PWA. It just does Push notifications.
> I've got a PWA. It just does Push notifications.



> &mdash; Too many people.
> &mdash; Too many people.


ワウ。それはPWAではなく、ネイティブアプリが持っていたテクノロジーを使用しているだけです。


> I'm only building a blog... it's not a PWA
> I'm only building a blog... it's not a PWA



> &mdash; Many bloggers we spoke to.
> &mdash; Many bloggers we spoke to.


うーん。コンテンツサイトがなぜ動くのが重要なのかを明確にすることはできませんでした。


> I don't care about making it installable.. I don't need a Service Worker.
> I don't care about making it installable.. I don't need a Service Worker.



> &mdash; Many publishers we spoke to.
> &mdash; Many publishers we spoke to.


ハァッ。人々はAppとインストールを関連づけ、サイトや経験がAppインストールのように行動しなければならないと考えて、一部の人々をコンセプト全体から外してしまいます。 2015年には、ニンジンに関する非常に興味深い議論がありました（https://trib.tv/2015/10/11/progressive-apps/）。


> I don't need an app on desktop. I just need users to click 'checkout'
> I don't need an app on desktop. I just need users to click 'checkout'



> &mdash; Many retailers we spoke to.
> &mdash; Many retailers we spoke to.


OK。それはかなり明確です。ユーザーまたはビジネスへの価値は存在せず、PWAの特性に優先順位を付けるビジネスを停止するだけで十分です。


> Progressive Web Apps are just better sites.
> Progressive Web Apps are just better sites.



> &mdash; Many developers we speak to.
> &mdash; Many developers we speak to.


実際、私は多くの偉大なWeb開発者からこのことをたくさん聞いています。

PWAで長年に渡って「PW」を押し続けていた[Jeremy Keith](https://adactio.com/)の記事をチェックすることをお勧めします。最近の講演では、


> There's a common misconception that making a Progressive Web App means
> There's a common misconception that making a Progressive Web App means

> creating a Single Page App with an app-shell architecture. But the truth is
> creating a Single Page App with an app-shell architecture. But the truth is

> that literally any website can benefit from the performance boost that results
> that literally any website can benefit from the performance boost that results

> from the combination of HTTPS + Service Worker + Web App Manifest.
> from the combination of HTTPS + Service Worker + Web App Manifest.



> &mdash; Jeremy Keith. "[Any Site can be a Progressive Web 
> &mdash; Jeremy Keith. "[Any Site can be a Progressive Web 

> App](https://noti.st/adactio/d1zSa7/any-site-can-be-a-progressive-web-app)" 
> App](https://noti.st/adactio/d1zSa7/any-site-can-be-a-progressive-web-app)" 


私の個人的な気持ちは、誰もPWAのAで本当にハングアップしているということです。これはコンセプトのブランド化の成功と失敗です。 「App」は名前の中にあり、「App」は多くのユーザーや企業を意識しているため、団体はかなり明確です。

私たちのチームの間では、自分自身や他の多くの人々が、PWAのコンテキストで、特にモバイルネイティブの経験と競合するという点で、「App」という言葉を強く押しました。 [Andrew Bettsの記事](https://trib.tv/2016/06/05/progressively-less-progressive/)は私たちのオリジナルのポジショニングに対して良い要約をしていましたが、間違っているとは思わないのですが、それほどモバイル中心ではなかったフォームファクタを中心に、より幅広い話を具体的に手助けする機会を逃しています。

私は、Chromeウェブストアについて話していたときにこれを視聴者に尋ねていました。 Gmailはアプリですか、サイトですか？簡単なアプリです。 Twitterはアプリですか、サイトですか？ App ..それは？私がちょうどコンテンツを読んでいるなら、それはまだウェブサイトのように感じます。 Wikipediaはアプリですか？サイト、絶対に;それはそれですか？エディタとしては、ツールのような感じです。

最終的には、サイトがアプリであるかアプリケーションがサイトである場合、実際にはあまり重要ではないと私は考えています。人々はWeb上で「アプリ」、ゲーム、VRボビン、小売店、伝統的な「サイト」のすべてを作成することができ、メディア、エンターテインメント、出版、ユーティリティ、コマースなどの特定のユースケースに対応できます。

「インストール性」（「白菜の袋」を参照）を除いて、PWAの元の定義を分かれば、私は開発者がアレックスのポイントのいずれかで自分のサイトを改善しても、ユーザーはより良いエクスペリエンスを得ることができ、ユーザーがより良い経験を得ると、Webを大切にしている人々はWebと有意義な関係を保ち、Webを使い続けることができます。どのようにすべてのビジネスと開発者が焦点を当てるべきかを知る方法でPWAの語りを適用するにはどうすればよいですか？

---

I've been thinking of a slight pivot based on the challenges we've seen in the
industry, and I've tried to prioritize the importance of where developers and
businesses can focus their efforts. (Note: I might channel
[BizKin](https://twitter.com/business_kinlan))

We want businesses and developers to succeed by leveraging the web’s unique
capabilities that allow them to: Reach the most users they can at the click of a
button; Retain their users by bringing their best experiences across devices
with a single set of code; and to meaningfully engage with their users by
building a direct and ownable relationship with them.

I've tried to articulate this as a set of principles that the user should feel
when using the web. Your experience should be:
DISCOVERABLE, SAFE, FAST, SMOOTH, RELIABLE, MEANINGFUL

Make it Discoverable
: Enable users to find your experience. The web is made of links and pages.
Ideally every page and state should have a deep-link so that anyone can be sent
to it from any site, be it an aggregator, a message, an email or a billboard.
Content should be served so that any renderer can read it.

Make it Safe
: Users and content owners can trust experiences built on the web, protecting
identity, confidentiality and data integrity.

Make it Fast
: Once the user has the link to your site, then the instant they tap it they are in
your experience and able to start using it irrespective of the network or device
that the user has.

Make it Smooth
: When users are on your site the experience is responsive and interactive to all
user gestures. Animations feel smooth and crisp, feedback is instant, scrolling
is silky, navigations are instant. Ideally if you think of the web performance
in terms of
[RAIL](https://developers.google.com/web/fundamentals/performance/rail), you are
focusing on the 'RAI'.

Make it Reliable
: Users of your site perceive as few interruptions as possible when faced with
unreliable network or devices. The experience should work and be responsive 
wherever the user is.

Make it Meaningful
: You must provide value and meet your user's needs through
high-quality experiences that provide value. This can seem quite fluffy, but
[Dion Almaer described it
well](https://medium.com/ben-and-dion/mission-improve-the-web-ecosystem-for-developers-3a8b55f46411).
The focus is really about your site solving a need for the user, be it
entertainment, smoothing out a purchase, advancement of knowledge or quick
completion of a task. It's all about the UX.

A modern experience that meets these principle goals of **fast, reliable, safe
and smooth**. It becomes progressively more **capable** using modern APIs and
highly **discoverable** by harnessing the reach of the open web and at the core
of it. A PWA should naturally meet each of these "principle goals" based on user
expectations and continues to build on the experience as more technologies and
capabilities come in. But so should any modern experience on the web today....

<span><span id='pw'>Progressive Web</span> <span id=name>Apps</span></span> &mdash; Progressive Web All-the-things.

This is where I want to push PWA over the next year. What do you think?

_Thanks to Harleen Batra._

{{<html>}}

<style>
dt {
  font-weight: 600;
  margin-bottom: 0.8em;
}
dd {
  margin-bottom: 1em;
}
#pw {
  font-weight: 700;
  font-size: 1em;
}
#name {
  font-size: 1em;
  font-weight: 100;
}
</style>
<script>
  const nameEl = document.getElementById('name');
  const names = ['Apps', 'Sites', 'Stores', 'Blogs', 'Forums', 'Magazines', 'Block-chain doo-dads', 'Experiences', 'Wikis', 'Utilities', 'Games'];
  let counter = 1;
  setInterval(()=> { 
    nameEl.textContent = names[counter];
    counter = (counter + 1) % names.length;
    nameEl.animate([{opacity: 0}, {opacity: 1}], {duration: 1000, easing: 'cubic-bezier(1,.01,1,.99)'})
  }, 2000)
</script>
{{</html>}}