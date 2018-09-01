---
slug: breaking-down-silos-with-share-target-api
date: 2018-01-20T13:20:31+01:00
title: "Breaking down silos by sharing more on the web"
tags: ["intents", "silo", "share"]
image_header: /images/share_mobile_handler.png
---
Cet article a plus d'un an de retard. Cela a longtemps été bloqué dans mes projets, mais je pense que l’idée doit être résolue en 2018. Il s’avère également que d’autres problèmes ont surgi au cours de l’année écoulée, ce qui la rend un peu plus pertinente.

J'étais en Indonésie plus tôt en 2016, bavardant avec les développeurs et il est apparu dans la conversation que le Web était vissé (c'étaient les mots littéraux). Le point essentiel du problème était que les utilisateurs d'aujourd'hui, et plus particulièrement les utilisateurs qui se connectent pour la première fois, créent du contenu dans des silos. Dans certains cas, ces silos [ressemblent au Web](/ rise-of-the-meta-Platform /), mais le contenu n'est disponible que sur ces plates-formes, mais il est perpétué par le fait que chaque application native a la capacité participer activement à toutes les interactions de l'utilisateur sur son ordinateur, mais ce n'est pas le cas sur le Web, ce qui est fatal. Il est impossible d'introduire du contenu dans les expériences Web, mais il est plus facile d'obtenir du contenu.

Plus concrètement, nous avons discuté d'un certain nombre de scénarios.

1. Vous prenez une photo sur l’application de votre appareil photo et vous souhaitez partager l’image. Vous appuyez sur Partager mais seules les applications natives apparaissent dans la liste. Le Web ne fait pas partie du choix des utilisateurs, de sorte que le Web ne peut jamais capturer cette valeur. 2. Vous souhaitez partager la page actuelle dans le navigateur. Vous appuyez sur Partager mais seules les applications natives apparaissent dans la liste. Le fait de partager des informations signifie que nous perdons un utilisateur du Web sur une expérience native. 3. Vous créez du contenu directement dans une page Web et vous souhaitez le partager. Votre seule option est d'inclure un widget qui le partage.

Au début de 2017, nous avons vu le lancement de [navigator.share](/ navigator.share /) qui a apporté le partage natif sur le Web (enfin, les utilisateurs de Chrome au moins). L'ironie est que l'API `navigator.share` perpétue le flux des utilisateurs utilisant des applications natives.

En 2018, j'aimerais que le Web soit plus efficace pour briser les silos qui se perpétuent sur les plates-formes natives. Le Web doit pouvoir participer à toutes les interactions majeures de l'utilisateur avec son appareil.

En fin d'année 2017, "Amélioration de l'ajout à l'écran d'accueil" a été lancé sous Chrome sur Android. Cela signifie que chaque fois qu'un utilisateur installe votre application Web progressive, un fichier APK est généré pour l'utilisateur. Un APK sur Android signifie que votre application Web est considérée comme une application native. Dans la première itération de "Ajouter à l'écran d'accueil", tout ce que cela signifie, c'est que chaque navigation dans une URL à l'intérieur du périmètre de votre PWA s'ouvrira directement dans le PWA.

L'avenir est cependant un peu plus brillant. Chrome travaille sur l’API [Share target](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md) qui vous permet de déclarer que votre site participera à la réception. des "parts". Cela signifie qu'à chaque fois qu'un utilisateur partage un lien, votre PWA pourra être répertorié.

Je suis très enthousiasmé par ce développement car cela signifie que de grands sites comme [Twitter Lite](https://lite.twitter.com) pourront désormais être partagés sans que l’utilisateur ait besoin de l’application Native, mais Cela signifie également que les petits sites de niche que seuls quelques utilisateurs peuvent utiliser peuvent également faire partie du même écosystème.

L'API ne peut pas gérer les images et les données binaires pour le moment, mais en regardant l'écosystème Android, l'intention ACTION_SEND est l'intention la plus utilisée et uniquement pour le partage de texte et de liens.

C'est un début. Le web décompose un silo à la fois.
