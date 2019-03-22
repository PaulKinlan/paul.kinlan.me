---
slug: pinch-zoom-element
date: 2019-01-13T17:21:19.288Z
title: 'pinch-zoom-element'
link: https://www.webcomponents.org/element/pinch-zoom-element
tags: [links, web components, custom element]
---
Jake et l&#39;équipe ont créé cet élément personnalisé plutôt impressionnant pour la gestion du zoom pincement sur tout jeu de code HTML en dehors de la dynamique de pincement-zoom du navigateur (pensez au zoom de la fenêtre d&#39;affichage mobile). L&#39;élément était l&#39;un des composants centraux dont nous avions besoin pour l&#39;application [squoosh](https://squoosh.app/) que nous avions conçue et publiée lors du Sommet des développeurs Chrome (... je dis &quot;publiée au Sommet des développeurs Chrome&quot; - Jake l&#39;a montré à tout le monde lors de la Journée des développeurs Google Google. même si le reste de l&#39;équipe était sous embargo;) ...)

> install: `npm install --save-dev pinch-zoom-element`
> 
> ```HTML
> <pinch-zoom>
>   <h1>Hello!</h1>
> </pinch-zoom>
> ```

[Read full post](https://www.webcomponents.org/element/pinch-zoom-element) .

Je viens de l&#39;ajouter à mon blog (cela ne m&#39;a pris que quelques minutes), vous pouvez le vérifier dans la section &quot; [life](https://paul.kinlan.me/life/img_20170711_063830/) &quot; où je partage les photos que j&#39;ai prises. Si vous utilisez un appareil tactile, vous pouvez rapidement effectuer un zoom-pincement sur l&#39;élément si vous utilisez un pavé tactile pouvant gérer plusieurs entrées au doigt qui fonctionnent également.

Cet élément est un excellent exemple de la raison pour laquelle j&#39;aime les composants Web en tant que modèle de création de composants d&#39;interface utilisateur. L’élément `pinch-zoom` représente un peu moins de 3 Ko sur le réseau (non compressé) et des dépendances minimales pour la construction. Il effectue un travail exceptionnellement bien, sans lier une logique personnalisée au niveau de l’application qui le rendrait difficile à utiliser (j’ai quelques réflexions sur la logique de l’interface utilisateur vs composants logiques App que je vais partager en fonction de mon apprentissage de l&#39;application Squoosh).

J&#39;adorerais voir des éléments comme ceux-ci avoir plus de notoriété et d&#39;utilisation, par exemple, je pourrais imaginer que cet élément pourrait remplacer ou normaliser la fonctionnalité de zoom d&#39;image que vous voyez sur de nombreux sites de commerce et dissiper à jamais la douleur des développeurs.
