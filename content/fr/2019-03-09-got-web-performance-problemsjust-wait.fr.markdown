---
slug: got-web-performance-problemsjust-wait
date: 2019-03-09T08:10:52.804Z
title: 'Got web performance problems? Just wait...'
link: 'https://twitter.com/kosamari/status/1104021989881270272'
tags: [links, performance, developing markets]
---
J&#39;ai vu un tweet d&#39;un bon [Mariko](https://twitter.com/kosamari) et de [Mariko](https://twitter.com/kosamari) collègue, [Mariko](https://twitter.com/kosamari) , parler de tests sur une gamme de périphériques bas de gamme vous permettant de rester à la terre.

Le contexte du tweet est que nous examinons à quoi ressemble le développement Web lors de la création pour les utilisateurs qui vivent quotidiennement sur ces classes d’appareils.

<figure>
  <img src="/images/2019-03-09-got-web-performance-problemsjust-wait.jpeg">
</figure>

L’équipe travaille actuellement beaucoup dans cet espace, mais j’ai passé une journée à construire un site et c’était incroyablement difficile de faire fonctionner quelque chose à un niveau de performances même légèrement raisonnable - voici certains des problèmes que j’ai rencontrés:

* Bizarreries dans la fenêtre et réintroduction mystérieuse de 300 ms de délai de clic (possibilité de contourner le problème).
* Reposes énormes de tout l&#39;écran, et c&#39;est lent.
* Le réseau est lent
* La mémoire est contrainte et les GC suivants verrouillent le thread principal pendant plusieurs secondes.
* Exécution JS incroyablement lente
* La manipulation du DOM est lente

Pour la plupart des pages que je construisais, même sur une connexion Wi-Fi rapide, le chargement des pages prenait plusieurs secondes et les interactions suivantes étaient tout simplement lentes. C’était difficile, cela impliquait d’essayer d’obtenir le plus possible le fil conducteur, mais c’était aussi incroyablement gratifiant, au niveau technique, de voir des changements dans les algorithmes et la logique que je n’aurais pas faits pour tout mon développement Web traditionnel. améliorations importantes des performances.

Je ne sais pas trop quoi faire à long terme, je soupçonne qu&#39;un grand nombre de développeurs avec lesquels nous travaillons sur des marchés plus développés vont réagir: «Je ne construis pas de sites pour les utilisateurs dans [insérer le pays x]». haut niveau, il est difficile de discuter de cette affirmation, mais je ne peux pas ignorer le fait que 10 millions de nouveaux utilisateurs arrivent chaque année en informatique, qu&#39;ils utiliseront ces appareils et que nous voulons que le Web soit * la * plate-forme de choix pour le contenu et les applications de peur que nous sommes heureux avec le [rise of the meta platform](https://paul.kinlan.me/rise-of-the-meta-platforms/) .

Nous allons devoir continuer à améliorer la performance pendant encore longtemps. Nous allons continuer à créer des outils et des conseils pour aider les développeurs à charger rapidement et à avoir des interfaces utilisateur fluides :)
