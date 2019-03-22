---
slug: ricky-mondelloadoption-of-well-known-url-for-changing-passwords
date: 2019-01-31T22:02:32.092Z
title: 'Ricky Mondello: Adoption of Well-Known URL for Changing Passwords'
link: https://twitter.com/rmondello/status/1090702498220961793
tags: [links, safari, specs]
---
Ricky Mondello, de l’équipe Safari, vient de partager une note sur la façon dont Twitter utilise la spécification ./well-known/change-password.

> I just noticed that Twitter has adopted the Well-Known URL for Changing Passwords! Is anyone aware of other sites that have adopted it?
> 
> Twitter's implementation: https://twitter.com/.well-known/change-password;
> Github's: https://github.com/.well-known/change-password;
> Specification :https://github.com/WICG/change-password-url

[Read full post](https://twitter.com/rmondello/status/1090702498220961793) .

La fonctionnalité m’a complètement dépassée, mais c’est une idée géniale: à partir d’un fichier situé dans un emplacement bien connu, le navigateur peut-il offrir une interface utilisateur à l’utilisateur lui permettant de réinitialiser rapidement son mot de passe sans avoir à naviguer dans l’interface utilisateur complexe du site ..

La spécification est d&#39;une simplicité trompeuse: le fichier bien connu contient simplement l&#39;URL vers laquelle l&#39;utilisateur doit être dirigé lorsqu&#39;il souhaite exécuter l&#39;action. Cela me conduit à penser que nous pouvons offrir plus de ces fonctionnalités:

* Emplacement bien connu pour les modèles de consentement basés sur le GDPR (consentement des cookies) - les propriétaires de sites pourraient proposer un lien vers la page permettant à un utilisateur de gérer et éventuellement de révoquer tous les cookies et autres éléments de consentement des données.
* Un emplacement bien connu pour la gestion des autorisations du navigateur - les propriétaires de sites pourraient offrir un emplacement rapide pour permettre aux utilisateurs de révoquer les autorisations d&#39;accès à des éléments tels que la géolocalisation, les notifications et autres primitives.
* Un chemin bien connu pour la suppression et les modifications de compte
* Un chemin bien connu pour la gestion des abonnements aux listes de diffusion

La liste s&#39;allonge ... J&#39;aime beaucoup l&#39;idée de simples fichiers de redirection pour aider les utilisateurs à découvrir les actions courantes des utilisateurs et pour permettre au navigateur de les mettre en évidence.

* Mise à jour: * J&#39;ai ajouté un [issue to Chrome to see if we can get a similar implementation](https://bugs.chromium.org/p/chromium/issues/detail?id=927473) .