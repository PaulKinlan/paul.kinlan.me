---
slug: new-in-chrome-68webgoogle-developers
date: 2018-07-26T22:46:46.011Z
title: 'Add to homescreen changes in Chrome 68 - Pete LePage'
link: https://developers.google.com/web/updates/2018/07/nic68
tags: [links, pwa, a2hs]
---
Pete LePage écrit à propos des changements importants à ajouter à l'écran d'accueil dans Chrome

> ## Add to Home Screen changes
> If your site meets the add to home screen criteria, Chrome will no longer show the add to home screen banner. Instead, you&#x2019;re in control over when and how to prompt the user.
> 
> To prompt the user, listen for the `beforeinstallprompt` event, then, save the event and add a button or other UI element to your app to indicate it can be installed.


[Lire l'article complet](https://developers.google.com/web/updates/2018/07/nic68).

J'avais des sentiments mitigés à ce sujet à l'origine parce que beaucoup de gens ne gèrent pas l'événement `beforeinstallprompt`, cela signifie que soudainement, le nombre d'installations d'APK Web diminuerait considérablement, mais je pense que c'est la bonne chose à faire.

L’objectif est de réduire le nombre d’invites gênantes sur le Web, et la dernière chose dont nous avons besoin dans l’industrie, c’est qu’une invite relativement importante apparaisse lorsque nous pensons que l’utilisateur peut vouloir installer une PWA. pensez à où et quand ** vous voulez demander une installation et que vous devez le faire en réponse à un geste de l'utilisateur.

La chose intéressante est que nous (Chrome) introduisons davantage de moyens ambiants de faire savoir à l’utilisateur qu’une expérience peut être installée, en ce moment, c’est la petite barre inférieure qui apparaît sur le premier chargement, et nous espérons pouvoir explorer à l’avenir des moyens plus subtils de faire savoir à l'utilisateur qu'il peut agir.
