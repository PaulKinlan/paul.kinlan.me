---
slug: slice-the-web
date: 2015-08-03
title: "SLICE: The Web"
description: "What are the properties that make the web the web?  How can we keep differentiating from native to stay relevant in a mobile world?"
tags: ["headless", "slice", 'headless chrome', 'the headless web']
image_header: "/images/slice.jpg"
---


Il y a eu beaucoup de discussions sur toutes les questions du Web au cours des dernières semaines et elles se sont globalement regroupées dans les catégories suivantes:


* Performance
* [Lumpy](/the-lumpy-web/) navigateurs incohérents
* Paysage en expansion rapide.

Je veux les mettre de côté pendant quelques minutes pour parler rapidement de l'un des termes que nous avons utilisés dans Google pour décrire rapidement les aspects positifs du Web en tant que plate-forme pour les utilisateurs et les développeurs: ** SLICE **.

Je ne trouve pas de référence originale pour cela, mais les points sous-jacents que je vais aborder sont bien connus. ** SLICE ** a été mentionné lors du premier [Chrome Dev Summit](https://developer.chrome.com/devsummit) de Linus Upson lors du keynote 2013. Lorsque Linus a parlé des propriétés du web, ce n'était pas dans le bon ordre pour nommer mais je vous encourage à regarder cette vidéo. _Note_: Brett Cannon, un microfonctionneur (anciennement un Googler) l’a également mentionné récemment et c’est une [bonne lecture](http://nothingbutsnark.svbtle.com/going-allin-on-the-mobile-web) et a en gros des conclusions similaires à mon article sur [Living with Web Apps](https://paul.kinlan.me/living-with-web-apps/)

{{<youtube 20fGtfnxJuo>}}

<br> Je pense que cela couvre beaucoup de bons points:


* __S__ecure - Tous les domaines sont séparés les uns des autres et les sites sont séparés de la machine des utilisateurs. L'utilisateur peut aller sur n'importe quel site et savoir qu'ils sont en sécurité.
* __L__inkable - Vous pouvez pointer sur une page ou un élément de contenu simplement en partageant une URL
* __I__ndexable - Parce que vous pouvez créer un lien vers n'importe quoi, s'il est public, il peut être découvert par toute personne ou machine capable de l'indexer pour le rendre accessible à tous.
* __C__omposable - Iframes et JavaScript nous permettent de composer et d’intégrer rapidement de nouveaux sites, applications et services simplement en intégrant des JS et en les associant.
* __E__phemeral - Il n'y a rien à installer, vous allez sur la page et interagissez avec elle, quittez la page et lorsque vous le faites, elle ne prend plus de ressources.
**TRANCHE**.

Comme un ensemble de capacités que le Web encapsule les principes SLICE sont bien connus mais souvent oubliés lorsque l'on considère la concurrence des plates-formes natives.

En tant que terme, je trouve que ** SLICE ** est un excellent moyen de répondre rapidement aux avantages du Web aujourd'hui. Il manque quelques avantages majeurs du Web tels que la possibilité de déployer instantanément des mises à jour & mdash; ** SLUICE ** n'est pas un grand acronyme & mdash; mais ça va, ** SLICE ** comme acronyme fonctionne bien.

J'utilise le modèle ** SLICE ** comme base de référence pour l'avenir du web * et les défis auxquels nous devons faire face pour y parvenir.


* __S__ecure - Le Web doit rester en boîte de sable et doit être chiffré de bout en bout. Nous devons également déterminer quel est le modèle pour garantir que l’utilisateur est en contrôle et conscient de la manière dont les autorisations sont appliquées aux API avancées. Par exemple, nous avons récemment commencé à expédier une [API Bluetooth](https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web?hl=en). qu'il est sûr et sécurisé à utiliser.
* __L__inkable - J'ai commencé avec Web Intents et, bien que cela se soit terminé tôt, je pense que nous sommes prêts pour une nouvelle génération de contenu, de sites, d'applications et d'expériences natives. Une partie de cette technologie nécessite une nouvelle technologie, une partie nécessite une formation.
   * Connexion à Web Apps: Je vais plonger dans cette autre fois. TL; DR - les pages de destination des produits et les pages de connexion ne nous aident pas à établir des liens avec les applications Web.
   * Liens profonds dans les médias: les navigateurs ont longtemps été en mesure de créer des liens vers n'importe quelle partie du fichier, mais personne ne semble le faire.
   * Plus profond lien dans le texte: La première fois que j'ai vu cela était le blog de Dave Winer où vous pouvez créer un lien vers n'importe quel paragraphe, plus récemment, Medium donne à chaque paragraphe un lien profond.
   * Lier des objets du monde réel: [Le web physique](https://google.github.io/physical-web/) pour la découverte de "choses" autour de nous, et les nouvelles API pour parler de ces "choses" réduiront la friction dans notre vie quotidienne.
* __I__ndexable - Le Web sans tête, c’est-à-dire les analyseurs et indexeurs, est de plus en plus avancé, ce qui nous permet de mieux comprendre le contenu du Web, d’exécuter JS et de comprendre visuellement le rendu de la page.
   * Embedded Schema.org ne peut pas décrire sémantiquement correctement (d'où JSON + LD)
   * Les médias ne contiennent pas une grande quantité de métadonnées exposées dans un format public.
   * Apps: Web Intent a tenté de décrire ce que pouvait faire une application Web. Nous n'en avons plus et nous manquons d'une manière massive de décrire les capacités de ce qu'une application Web peut faire. Prenons mon application [airhorn](https://airhorner.com/) comme exemple, même si je ne m'attends pas à ce que les applications de la corne soient utiles, il n'y a pas d'autre moyen que de rechercher des métadonnées et c'est l'une des raisons pour lesquelles Nous avons des pages de destination de produits sur le Web.
   * Les appareils connectés à Internet ne sont pas indexés et ils ne décrivent pas ce qu'ils peuvent faire. C'est une pièce manquante pour moi dans l'histoire du Web physique, la découverte des capacités. Je pense que nous avons besoin d'une intention de Web pour IoT.
* __C__omposable - Il serait facile de mentionner seulement les composants Web, mais nous parlons vraiment de l’écosystème plus large d’outils, de bibliothèques et de frameworks réutilisables:
    * Les problèmes d’interopérabilité sont énormes à l’heure actuelle, les frameworks essayant de posséder la pile entière.
    * Nous avons besoin de résoudre les fonctionnalités déléguées côté client. Web Intents a essayé ceci, mais une grande partie est encore possible sur le Web aujourd'hui, mais nous ne le faisons pas. C’est-à-dire que j’ai créé une application Web QR Snapper, pourquoi devez-vous en créer une vous-même pour l’intégrer à votre propre application, utilisez simplement le mien ou tout autre service préexistant.
* __E__phemeral - Deux mots: Service Worker.
  * L'installation est l'antithèse de l'emphémère. Par définition, lorsque vous installez quelque chose, cela devient une partie intégrée et longue de l'appareil. Service Worker peut utiliser le meilleur des deux mondes: un moyen terme vous permettant de choisir comment et quand le site doit être intégré plus profondément dans l'appareil. Combinez cela avec le manifeste et l'utilisateur a maintenant le choix d'installer l'application Web ou de la conserver comme une interaction nécessaire.


** Alors qu'est-ce qui nous manque? ** Je vais laisser ça pour que tu me le dises, je soupçonne que je manque beaucoup. J'ai un ensemble de posts de suivi où je parlerai de la façon dont les plates-formes natives prennent un modèle de ** SLICE ** pour elles-mêmes comme moyen d'intégrer davantage les applications natives dans la vie quotidienne des utilisateurs et comment le Web peut différencier encore plus.

Crédit d'image: [Justus Hayes](https://commons.wikimedia.org/wiki/File:The_Big_Slice_-_Rome,_Italy.jpg)