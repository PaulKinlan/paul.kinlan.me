---
slug: introduction-to-feature-policy
date: 2018-07-12T18:07:06.141Z
title: Introduction to Feature Policy
link: https://developers.google.com/web/updates/2018/06/feature-policy
tags: ['link', 'performance']
---
Эрик Бидельман на веб-сайтах разработчиков Google, пишет:

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


[Читать полный пост](https://developers.google.com/web/updates/2018/06/feature-policy).

Мне интересно посмотреть, как это происходит. Я волнуюсь, что разработчикам это не понравится, или им будет оказано давление. Как я сказал [в Twitter](https://twitter.com/Paul_Kinlan/status/1016445358401040386), я беспокоюсь о стимулах, и нам нужно объединить тот факт, что эта функция позволит разработчикам контролировать большое количество доступных функций, которые либо занимать память, либо замедлять работу страницы, либо непреднамеренно утечка конфиденциальной информации для сторонних сторон, а также то, что разработчики могут продавать своим бизнесом. Одним из примеров может быть то, что ** если ** в Play Store когда-либо появлялись списки PWA, тогда они могли бы иметь набор политик, автоматически применяемых при запуске приложения, и вы, как разработчик, соглашаетесь с этим в пользу того, чтобы быть в магазин.

Я рад видеть, что происходит с этим API, и я очень хочу, чтобы он был принят, даже если он используется разработчиками только для того, чтобы их команды не регрессировали.
