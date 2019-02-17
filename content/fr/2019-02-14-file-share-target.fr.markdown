---
slug: file-web-share-target
date: 2019-02-15T15:52:03.183Z
title: 'File Web Share Target'
tags: [share, intents]
---

J&#39;ai souvent dit que pour que les applications Web soient concurrentielles dans le monde des applications, elles doivent être intégrées à tous les endroits que les utilisateurs attendent des applications. La communication inter-applications est l&#39;un des principaux éléments manquants de la plate-forme Web, et l&#39;une des dernières fonctionnalités manquantes est le partage au niveau natif: les applications Web doivent pouvoir accéder à [data out of their silo](/unintended-silos/) et à d&#39;autres sites Web et applications; ils doivent également pouvoir recevoir les données d&#39;autres applications et sites natifs.

L&#39;API cible de partage de fichiers est le changeur de jeu d&#39;une API qui se trouve maintenant dans Chrome Canary. L&#39;API étend [Web Share Target API](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md) permettre aux applications et aux sites de partager des liens simples et du texte avec des sites Web en les intégrant à la fonctionnalité de partage de systèmes.

Ce blog de fichiers très statique utilise l&#39;API cible de partage Web afin que je puisse rapidement [share links](/web-share-target-api/) qui me [share links](/web-share-target-api/) intéressant, depuis n&#39;importe quelle application Android et depuis la semaine dernière, [I enabled the File Share Target API so that I can upload images to my blog directly from the Camera app on Android](/testing-file-share-target-from-camera/) . Cet article traite de la façon dont je l’ai fait (et j’ai volé du code à Jake Archibald - il a corrigé beaucoup de bugs pour une intégration qu’ils font dans [squoosh.app](https://squoosh.app/) .)

[File Share Target API](https://wicg.github.io/web-share-target/level-2/#example-3-manifest-webmanifest) est une API très nouvelle en ce sens qu’elle est totalement progressive. Si votre application peut gérer les demandes de formulaire `POST` , vous pouvez facilement l&#39;intégrer à cette API. Le flux de base est le suivant: lorsque l&#39;utilisateur choisit votre application dans le sélecteur natif, Chrome envoie une demande de formulaire `POST` à votre serveur. Il vous `POST` de ce que vous en ferez (traitement dans un agent de maintenance ou sur le serveur).

Pour prendre en charge le partage de fichiers dans votre application Web, vous devez effectuer deux tâches:

1. Déclarez la prise en charge du partage de fichiers via le fichier de manifeste, 2. `POST` demande de formulaire `POST` dans votre service worker.

Le manifeste indique au système hôte comment le partage doit être mappé de l&#39;application hôte vers l&#39;application Web. Dans le manifeste ci-dessous, il est essentiellement indiqué &quot;Lorsqu&#39;un utilisateur partage un fichier de type&quot; image / * &quot;, créez une demande de formulaire POST pour&quot; / share / image / &quot;et nommez le&quot; fichier de données &quot;&quot;.

* manifest.json *
```JSON
{
  "name": "Blog: Share Image",
  "short_name": "Blog: Share Image",
  "start_url": "/share/image/",
  "theme_color": "#000000",
  "background_color": "#000000",
  "icons": [ {
      "sizes": "192x192",
      "src": "/images/me.png",
      "type": "image/png"
  }],
  "share_target": {
    "action": "/share/image/",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "files": [
        {
          "name": "file",
          "accept": ["image/*"]
        }
      ]
    }
  },
  "display": "standalone",
  "scope": "/share/"
}
```

Une fois que l&#39;utilisateur a partagé votre application Web, Chrome envoie la demande Web à votre site avec les données du fichier comme charge utile.

Il est recommandé de gérer la demande POST dans votre centre de services afin que 1) la demande soit rapide, 2) résiliente face à la non disponibilité du réseau. Vous pouvez le faire comme suit:

* serviceworker.js * - [demo](/share/image/sw.js)

```Javascript
onfetch = async (event) => {
  if (event.request.method !== 'POST') return;
  if (event.request.url.startsWith('https://paul.kinlan.me/share/image/') === false) return;

  /* This is to fix the issue Jake found */
  event.respondWith(Response.redirect('/share/image/'));
  
  event.waitUntil(async function () {
    const data = await event.request.formData();
    const client = await self.clients.get(event.resultingClientId || event.clientId);
    // Get the data from the named element 'file'
    const file = data.get('file');

    console.log('file', file);
    client.postMessage({ file, action: 'load-image' });
  }());
};
```

Deux choses intéressantes se passent ci-dessus, qui peuvent rapidement être résumées comme suit:

* Rendez l&#39;interface utilisateur à la suite de la demande `POST` en effectuant une redirection.
* Lire les données qui sont soumises via le formulaire via `event.request.formData()`
* Envoyer les données à la fenêtre ouverte (ce sera l&#39;interface utilisateur vers laquelle nous avons redirigé l&#39;utilisateur dans le premier point).

C’est entièrement à vous de décider de ce que vous faites des données qui ont été envoyées à votre technicien, mais dans le cas de mon application, je devais les afficher directement dans l’interface utilisateur, de sorte que je devais trouver la fenêtre que l&#39;utilisateur utilisait et `postMessage` les données là-bas.

* index.html * - [demo](/share/image/index.html)

```Javascript
navigator.serviceWorker.onmessage = (event) => {
  console.log(event);
  imageBlob = event.data.file;
  // Update the UI with the data that has been shared to it.
  imageShare.src = URL.createObjectURL(imageBlob);
};
```

Et c&#39;est à peu près tout. Si vous disposez déjà d&#39;un point de terminaison API pour vos formulaires Web, il s&#39;agit d&#39;un ajout simple, mais puissant, que vous pouvez apporter à votre site.

La primitive de plate-forme incroyablement puissante de l&#39;API Web Share Target supprime un autre obstacle que les applications Web rencontraient sur leurs plates-formes hôtes.