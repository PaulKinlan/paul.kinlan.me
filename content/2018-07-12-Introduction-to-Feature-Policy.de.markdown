---
slug: introduction-to-feature-policy
date: 2018-07-12T18:07:06.141Z
title: Introduction to Feature Policy
link: https://developers.google.com/web/updates/2018/06/feature-policy
tags: ['link', 'performance']
---
Eric Bidelman auf Google Web des Entwicklers aktualisiert, schreibt:

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


[Vollständigen Beitrag lesen](https://developers.google.com/web/updates/2018/06/feature-policy).

Ich bin interessiert zu sehen, wie das landet. Ich mache mir Sorgen, dass die Entwickler sich nicht darum kümmern oder dass sie unter Druck gesetzt werden. Wie ich schon sagte [auf Twitter](https://twitter.com/Paul_Kinlan/status/1016445358401040386), mache ich mir Sorgen über die Anreize und wir müssen die Tatsache kombinieren, dass diese Funktion es Entwicklern ermöglicht, eine große Anzahl der verfügbaren Funktionen zu kontrollieren entweder Speicherplatz beanspruchen, die Seite verlangsamen oder versehentlich Benutzerdaten an Dritte einbetten, mit Dingen, die Entwickler an ihr Geschäft verkaufen können. Ein Beispiel könnte sein, dass ** wenn ** der Play Store jemals PWAs auflisten würde, dann könnten sie mit einer Reihe von Richtlinien kommen, die beim Start der App automatisch angewendet werden, und Sie als Entwickler würden dem zustimmen, um darin zu sein das Geschäft.

Ich bin gespannt, was mit dieser API passiert, und ich bin sehr daran interessiert, dass sie angenommen wird, auch wenn sie nur von Entwicklern verwendet wird, um sicherzustellen, dass ihre Teams sich nicht zurückbilden.
