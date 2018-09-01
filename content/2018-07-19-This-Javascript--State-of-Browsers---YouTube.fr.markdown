---
slug: this-javascript--state-of-browsers---youtube
date: 2018-07-19T15:06:53.251Z
title: 'This.Javascript: State of Browsers - YouTube'
link: https://www.youtube.com/watch?v=67etFbKTOFA
tags: [links, browsers, chrome, mozilla, edge, beaker, brave, pwa]
---
Tracy Lee de This Dot a organisé un live-stream plutôt soigné qui a amené de nombreux fournisseurs de navigateurs à donner un aperçu de leur travail:

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


[Lire l'article complet](https://www.youtube.com/watch?v=67etFbKTOFA).

J'ai vraiment apprécié le flux en direct et c'était génial d'entendre ce que tout le monde est prêt à faire. J'aime aussi la vision de Beaker Browser sur un web distribué, ils ont beaucoup travaillé depuis notre dernière rencontre.

Je vous encourage à regarder la vidéo liée, Edge a eu un grand nombre de mises à jour, y compris la prise en charge complète de Service Worker, des polices variables et également l'introduction de WebP. Mozilla se concentre énormément sur l'assemblage Web et les outils de développement, Beaker fait des choses incroyables avec dat: et l'informatique distribuée et Brave a beaucoup évolué sur BAT.

Je me suis concentré sur le travail de notre équipe en ce moment et il s’agit essentiellement de la découverte, de la rapidité et de la fiabilité, de la réactivité de l’interface utilisateur, de l’expérience utilisateur, de la sécurité et de la confidentialité. Un peu plus concrètement:

* Découverte - nous devons vraiment faciliter la tâche des développeurs pour créer des sites avec JS qui rendent des services sans tête tels que les indexeurs et les intégrateurs. Cela signifie que nous devons nous concentrer sur la formation des développeurs sur la manière dont les indexeurs fonctionnent et sur la manière de les tester, ainsi que sur la manière de créer de bonnes expériences SSR solides. * Vitesse et fiabilité - Tous les sites doivent avoir un TTI <5 ​​sur le réseau 3g sur le périphérique Median (un MotoG 4/5) et vous devez optimiser votre FID (premier délai d’entrée). Le FID est une nouvelle mesure, il est donc important de comprendre qu'il est censé représenter la façon dont vos utilisateurs expérimentent votre site dans la nature, où le TTI a été difficile à mesurer, le FID devrait être plus facile. Il y a un [polyfill ici que vous pouvez utiliser pour tester le FID](github.com/GoogleChromeLabs/first-input-delay) nous travaillons sur la création de & # x2018; FLIP & # x2019; plus facile à comprendre, en construisant Houdini afin de donner aux développeurs beaucoup plus de contrôle sur le rendu et en essayant de déplacer autant de travail que possible via des éléments comme img.decode et des outils comme comlink plus facile à utiliser. * UX - Faites bouger les choses - Nous voulons vraiment changer la façon dont nous parlons des nouvelles fonctionnalités qui arrivent sur la plateforme, en particulier nous aimerions montrer où la technologie doit être utilisée efficacement pour améliorer les expériences des utilisateurs pour les aider à accomplir leur travail rapidement avec le moins d'interruption possible. * Sécurité et confidentialité - Je pense que la prévention Intelligent Tracking d'Apple aura un impact à long terme sur le Web et que les développeurs doivent commencer à réfléchir davantage à la création de solutions de confidentialité prenant en charge les expériences Web. Si quelque chose GDPR fait du Web une expérience «intéressante» dans l'UE.

Enfin, ce fut humiliant et réconfortant d'entendre que tout le monde veut ramener [Web Intents](https://en.wikipedia.org/wiki/Web_Intents) :)
