---
slug: introduction-to-feature-policy
date: 2018-07-12T18:07:06.141Z
title: Introduction to Feature Policy
link: https://developers.google.com/web/updates/2018/06/feature-policy
tags: ['link', 'performance']
---
GoogleデベロッパーのWebアップデートでEric Bidelmanが書いた記事：

> Building for the web is a rocky adventure. It's hard enough to build a top-notch web app that nails performance and uses all the latest best practices. It's even harder to keep that experience great over time. As your project evolves, developers come on board, new features land, and the codebase grows. That Great Experience &#x2122; you once achieved may begin to deteriorate and UX starts to suffer! Feature Policy is designed to keep you on track.
> 
> With Feature Policy, you opt-in to a set of "policies" for the browser to enforce on specific features used throughout your site. These policies restrict what APIs the site can access or modify the browser's default behavior for certain features.
> 
> Here are examples of things you can do with Feature Policy:
> 
> * Change the default behavior of autoplay on mobile and third party videos.
> * Restrict a site from using sensitive APIs like camera or microphone.
> * Allow iframes to use the fullscreen API.
> * Block the use of outdated APIs like synchronous XHR and document.write().
> * Ensure images are sized properly (e.g. prevent layout thrashing) and are not too big for the viewport (e.g. waste user's bandwidth).
> 
> Policies are a contract between developer and browser. They inform the browser about what the developer's intent is and thus, help keep us honest when our app tries to go off the rails and do something bad. If the site or embedded third-party content attempts to violate any of the developer's preselected rules, the browser overrides the behavior with better UX or blocks the API altogether.


[全文を読む](https://developers.google.com/web/updates/2018/06/feature-policy)

私はこの土地がどのように見えるか興味があります。私は開発者がこれに気にしないこと、あるいは彼らに圧力がかかることを心配しています。私が[Twitterで]言ったように（https://twitter.com/Paul_Kinlan/status/1016445358401040386）、私はインセンティブについて心配し、この機能によって開発者が利用可能な多数の機能を制御できるようにする必要があります。メモリを占有したり、ページを遅くしたり、不注意に第三者の埋め込み者にユーザーのプライバシーを漏らしたりする可能性があります。たとえば、PlayストアでPWAのリストを登録していた場合、アプリの起動時に一連のポリシーが自動的に適用される可能性があります。開発者は、店舗。

私はこのAPIで何が起こるかを見てうれしく思っています。たとえそれが開発者によってチームが回帰しないことを保証するためにのみ使用されていたとしても、採用されたことを熱望しています。
