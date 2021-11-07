---
slug: web-share-target-api
date: 2018-04-15T13:20:31.000Z
title: "Web Share Target API"
tags: ['pwa', 'intents', 'web intents']
description: "Share Target API is now in Chrome breaking down one of the last silos of native platforms"
---


Je crains constamment que sur la plate-forme Web nous créons des [silos inattendus](/unintended-silos) en rendant plus difficile l'accès aux données des sites Web et des applications, mais surtout que les données ne circulent que dans un sens: à partir du Web aux applications, car les applications peuvent se trouver à tous les endroits où les utilisateurs s'attendent à ce qu'elles soient sur leurs appareils.

J'ai été ravi que Chrome ait commencé à fonctionner [sur l'API Web Share Target](/breaking-down-silos-with-share-target-api) pour compléter le travail sur [navigator.share](/navigator.share). Où `navigator.share` vous permet de partager des informations de votre site Web avec n'importe quelle application sur le périphérique utilisateur pouvant recevoir des« partages »(` Intent.ACTION_SEND` en langage Android), la cible de partage Web permet à votre site Web (ou PWA) ) dire "je veux aussi jouer à ce jeu".

Je suis plutôt content de dire que ce travail est maintenant disponible dans Chrome Canary sur Android.

L'API cible de partage Web est une petite API que vous définissez dans votre manifeste d'application Web. Si vous avez déjà utilisé `registerProtocolHandler`, vous verrez que ce n'est pas un million de miles de distance & mdash; Vous définissez un modèle d'URL comportant un certain nombre de variables qui seront substituées lorsque l'utilisateur invoquera l'action.

D'abord, vous créez une propriété 'object' appelée share_target` qui contient une propriété appelée `url_template` qui a le chemin qui doit être ouvert lorsque l'utilisateur choisit notre service. Sur Android, vous pouvez utiliser les trois noms de substitution appelés: * `{title}` - équivalent à `.title` sur l’API navigator.share ou` Intent.EXTRA_SUBJECT` à partir d’une intention Android. * `{text}` - équivalent à `.text` sur l'API navigator.share, ou` Intent.EXTRA_TEXT` à partir d'une intention Android. * `{url}` - Equivelent à `.url` sur l'API navigator.share, ou aux données brutes d'une intention Android.

Vous pouvez l'essayer aujourd'hui en installant [PWA sur Twitter](https://mobile.twitter.com/). [Le manifeste de Twitter est ci-dessous](https://mobile.twitter.com/manifest.json):


```javascript
{
    ...
    "name": "Twitter Lite",
    "share_target": {
        "url_template": "compose/tweet?title={title}&text={text}&url={url}"
    },
    ...
}
```


En ce moment, il y a des limitations:

* Vous ne pouvez en avoir qu'un par manifeste, ce qui signifie que dans le cas de Twitter, il ne peut pas y avoir de partage sur DM. * Certaines extensions sont proposées, telles qu'un événement de service worker appelé `navigator.actions` qui sera déclenché sans avoir à ouvrir une interface utilisateur, mais elles ne sont pas encore implémentées. * Vous ne pouvez partager que du «texte», ce qui signifie que si vous souhaitez partager un bloc de données, vous devez l'enregistrer avec une URL qui serait ensuite partagée. * Cela ne fonctionne que sur Android. * Vous devez avoir installé le PWA, vous ne pouvez donc pas faire un lecteur en enregistrant une cible de partage. Lorsque Chrome génère un fichier 'APK Web', il examine maintenant le fichier `share_target` pour voir s'il doit enregistrer le fichier <intent-filter> natif. * Il n'est pas encore standardisé dans le cadre de la spécification du manifeste. : / oh - et aussi [pourrait changer](https://github.com/w3ctag/design-reviews/issues/221#issuecomment-376717885).

Limites de côté, il s'agit d'un ajout plutôt étonnant à la plate-forme Web, qui marque le début de la levée des énormes obstacles que le Web rencontre en matière d'intégration sur les plates-formes hôtes.

Si vous souhaitez suivre les mises à jour de cette API, consultez [État de Chrome](https://www.chromestatus.com/feature/5662315307335680).
