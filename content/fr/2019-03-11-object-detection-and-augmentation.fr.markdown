---
slug: object-detection-and-augmentation
date: 2019-03-11T20:32:18.307Z
title: 'Object Detection and Augmentation'
link: 'https://github.com/jeeliz/jeelizFaceFilter/blob/master/README.md#features'
tags: [links, qrcode, shapedetection]
---
J&#39;ai beaucoup joué avec [Shape Detection API](https://paul.kinlan.me/face-detection/ https://paul.kinlan.me/barcode-detection/ https://paul.kinlan.me/detecting-text-in-an-image/) dans Chrome et j&#39;aime beaucoup son potentiel. Par exemple, un [QRCode detector](https://qrsnapper.com) très simple [QRCode detector](https://qrsnapper.com) j&#39;ai écrit il y a longtemps possède un polyfill JS, mais utilise l&#39;API `new BarcodeDetector()` si elle est disponible.

Vous pouvez voir certaines des autres démos que j&#39;ai construites ici en utilisant les autres fonctionnalités de l&#39;API de détection de forme: [Face Detection](https://paul.kinlan.me/face-detection/) , [Barcode Detection](https://paul.kinlan.me/barcode-detection/) et [Text Detection](https://paul.kinlan.me/detecting-text-in-an-image/) .

J&#39;ai été agréablement surpris lorsque je suis tombé sur [Jeeliz](https://jeeliz.com) le week-end et j&#39;ai été extrêmement impressionné par les performances de leur boîte à outils - sachant que j&#39;utilisais un Pixel3 XL, mais la détection des visages semblait nettement plus rapide que ce qui est possible avec l&#39;API `FaceDetector` .

[Checkout some of their demos](https://jeeliz.com/sunglasses) .

<figure>
  <img src="/images/2019-03-11-object-detection-and-augmentation.jpeg">
</figure>

Cela m&#39;a beaucoup fait réfléchir. Cette boîte à outils pour la détection d&#39;objets (et d&#39;autres outils similaires) utilise des API largement disponibles sur le Web, notamment l&#39;accès aux caméras, WebGL et WASM, contrairement à l&#39;API de détection des formes de Chrome (disponible uniquement dans Chrome et non cohérente sur toutes les plateformes sur lesquelles Chrome est installé). ) peuvent être utilisés pour créer facilement des expériences riches et atteindre des milliards d&#39;utilisateurs avec une expérience cohérente sur toutes les plateformes.

L&#39;augmentation est l&#39;endroit où cela devient intéressant (et vraiment ce que je voulais montrer dans cet article) et où vous avez besoin de bibliothèques de middlewares qui arrivent maintenant sur la plate-forme, nous pouvons créer des applications amusantes de filtrage des visages de Snapchat sans que les utilisateurs installent des applications MASSIVE. qui recueille une énorme quantité de données sur le périphérique de l&#39;utilisateur (car il n&#39;y a pas d&#39;accès sous-jacent au système).

En dehors des démonstrations amusantes, il est possible de résoudre des cas d&#39;utilisation très avancés rapidement et simplement pour l&#39;utilisateur, tels que:

* Sélection de texte directement à partir de l&#39;appareil photo ou photo de l&#39;utilisateur
* Traduction en direct des langues de la caméra
* Détection de QRCode en ligne pour que les gens n&#39;aient pas à ouvrir WeChat tout le temps :)
* Extraire automatiquement les URL du site Web ou l&#39;adresse d&#39;une image
* Détection de carte de crédit et extraction de numéro (permet aux utilisateurs de s&#39;inscrire rapidement sur votre site)
* Recherche de produit visuelle dans l&#39;application Web de votre magasin.
* Recherche de code à barres pour plus de détails sur les produits dans l&#39;application Web de votre magasin.
* Recadrage rapide des photos de profil sur les visages des personnes.
* Fonctions A11Y simples permettant à l’utilisateur d’entendre le texte contenu dans les images.

Je viens de passer 5 minutes à réfléchir à ces cas d&#39;utilisation - je sais qu&#39;il y en a beaucoup plus - mais je me suis rendu compte que nous ne voyons pas beaucoup de sites ou d&#39;applications Web utiliser la caméra, mais que beaucoup de sites demandent à leur les utilisateurs à télécharger une application, et je ne pense pas que nous devions le faire plus.

** Mise à jour ** Thomas Steiner de notre équipe a mentionné dans notre équipe Chat qu&#39;il `ShapeDetection` que je `ShapeDetection` API `ShapeDetection` actuelle. J&#39;aime le fait que cette API nous donne accès aux implémentations d&#39;expédition natives de chacun des systèmes respectifs. Cependant, comme je l&#39;ai écrit dans [The Lumpy Web](/the-lumpy-web/) , les développeurs Web recherchent la cohérence dans la plate-forme et de nombreux problèmes liés à l&#39;API de détection de forme peuvent se résumer comme suit:

1. L&#39;API est uniquement dans Chrome
2. L&#39;API dans Chrome est très différente sur chaque plate-forme, car ses implémentations sous-jacentes sont différentes. Android n&#39;a que des points pour des repères tels que la bouche et les yeux, où macOS a des contours. Sur Android, `TextDetector` renvoie le texte détecté, tandis que sur macOS, il renvoie un indicateur de «présence de texte» ... Sans parler de tous les bogues trouvés par Surma.

Le Web, en tant que plate-forme de distribution, a tellement de sens pour des expériences de ce type que je pense que ce serait une négligence de notre part de ne pas le faire, mais les deux groupes de problèmes ci-dessus me poussent à remettre en question le besoin à long terme de mettre en œuvre toutes les fonctionnalités de la plate-forme Web en mode natif, lorsque nous pouvions implémenter de bonnes solutions dans un package livré avec les fonctionnalités de la plate-forme telles que WebGL, WASM et, à l&#39;avenir, le processeur graphique Web.

Quoi qu&#39;il en soit, j&#39;aime le fait que nous puissions le faire sur le Web et je suis impatient de voir les sites expédiés avec eux.