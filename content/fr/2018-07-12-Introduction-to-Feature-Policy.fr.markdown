---
slug: introduction-to-feature-policy
date: 2018-07-12T18:07:06.141Z
title: Introduction to Feature Policy
link: https://developers.google.com/web/updates/2018/06/feature-policy
tags: ['link', 'performance']
---
Eric Bidelman sur les mises à jour Web du développeur Google écrit:

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


[Lire l'article complet](https://developers.google.com/web/updates/2018/06/feature-policy).

Je suis intéressé de voir comment cela se pose. Je crains que les développeurs ne se soucient pas de cela, ou qu'ils subissent des pressions. Comme je l'ai dit [sur Twitter](https://twitter.com/Paul_Kinlan/status/1016445358401040386), je m'inquiète des incitations et nous devons combiner le fait que cette fonctionnalité permettra aux développeurs de contrôler un grand nombre des fonctionnalités disponibles soit prendre de la mémoire, ralentir la page ou laisser par inadvertance la confidentialité des utilisateurs à des tiers, avec des choses que les développeurs peuvent vendre à leur entreprise. Un exemple pourrait être que ** si ** le Play Store devait lister des PWA alors il pourrait y avoir un ensemble de politiques automatiquement appliqué au lancement de l'application, et vous, en tant que développeur, seriez d'accord pour être dans le magasin.

Je suis ravi de voir ce qui se passe avec cette API, et je souhaite le voir adopté, même si les développeurs n’en ont besoin que pour s’assurer que leurs équipes ne régressent pas.
