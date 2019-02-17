---
slug: introduction-to-feature-policy
date: 2018-07-12T18:07:06.141Z
title: Introduction to Feature Policy
link: https://developers.google.com/web/updates/2018/06/feature-policy
tags: ['link', 'performance']
---
Eric Bidelman en las actualizaciones de la web del desarrollador de Google, escribe:

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


[Leer publicación completa](https://developers.google.com/web/updates/2018/06/feature-policy).

Estoy interesado en ver cómo aterriza. Me preocupa que a los desarrolladores no les importe esto, o que sean presionados. Como dije [en Twitter](https://twitter.com/Paul_Kinlan/status/1016445358401040386), me preocupan los incentivos y tenemos que combinar el hecho de que esta característica permitirá a los desarrolladores controlar una gran cantidad de funciones disponibles que ya sea que tome memoria, puede ralentizar la página o inadvertidamente se escape la privacidad del usuario a las incrustaciones de terceros, con cosas que los desarrolladores pueden vender a su negocio. Un ejemplo podría ser que ** si ** la Play Store publicara alguna vez PWA, entonces podrían venir con un conjunto de políticas aplicadas automáticamente cuando se lanza la aplicación, y usted como desarrollador estaría de acuerdo con esto en beneficio de estar en la tienda.

Estoy emocionado de ver qué sucede con esta API, y estoy ansioso por verla adoptada, incluso si solo la utilizan los desarrolladores para garantizar que sus equipos no sufran regresiones.
