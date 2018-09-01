---
slug: a-simple-DOM-template-language
date: 2018-01-27T13:20:31+01:00
title: "A simple clientside templating langauge"
tags: ["templating", 'javascript']
description: "Templating libraries needn't be so hard"
---


Dans un [projet récent](https://webgdedeck.com/), je voulais un moyen simple de lier des données JSON à un élément DOM sans importer de bibliothèque et je pense avoir trouvé une solution très intéressante (à mes yeux ) qui correspond à tous mes besoins pour le projet.

La solution encode les instructions de template dans les attributs de données DOM nommés `data-bind- *`, qui sont accessibles sur l'élément DOM de la propriété dataset et il arrive juste que les attributs soient automatiquement sélectionnés (c'est-à-dire que aurait un attribut `data-bind_inner-text` - notez le trait d'union).

Voici un exemple de modèle du projet:


```html
<template id="itemTemplate">
  <div class="item new" data-bind_id="guid" id="">
    <h3><span data-bind_inner-text="title"></span></h3>
    <p class="description" data-bind_inner-text="content:encoded|description"></p>
    <div>
      <a data-bind_href="link" data-bind_inner-text="pubDate" data-bind_title="title" href="" title=""></a>
      <svg class="share" url="" title="" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
        <path fill="none" d="M0 0h24v24H0z"></path><path d="M18 16c-.8 0-1.4.4-2 .8l-7-4v-1.5l7-4c.5.4 1.2.7 2 .7 1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3v.7l-7 4C7.5 9.4 6.8 9 6 9c-1.7 0-3 1.3-3 3s1.3 3 3 3c.8 0 1.5-.3 2-.8l7.2 4.2v.6c0 1.6 1.2 3 2.8 3 1.6 0 3-1.4 3-3s-1.4-3-3-3z"></path>
      </svg>
    </div>
  </div>
</template>
```


Comme vous pouvez le voir, nous utilisons le ` <template> `element pour s&#39;assurer que nous pouvons garder notre HTML dans le DOM et le garder inerte (cela améliore vraiment l&#39;expérience de création). Notez qu&#39;il ne doit pas nécessairement s&#39;agir d&#39;un élément template, il peut prendre tout ce qui se trouve dans le DOM.

Pour mapper le DOM ci-dessus dans un élément réel avec toutes les données réelles qui lui sont appliquées, j'utilise l'algorithme de base suivant:

1. Clonez l'élément sur lequel vous souhaitez associer des données. 2. Parcourez les éléments et pour chaque élément: 1. Vérifiez s'il a un attribut de la forme `data-bind_` 2. Récupérez les clés à rechercher sur les` données` séparées par un «| 3. Mappez la valeur de la première clé trouvée de l'entrée `data` directement dans l'attribut du nœud défini par` data-bind_` 3. Renvoyez le nouveau nœud.

Le code pour cela est assez simple, si un peu trop laconique.


```javascript
const applyTemplate = (templateElement, data) => {
  const element = templateElement.content.cloneNode(true);    
  const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, () => NodeFilter.FILTER_ACCEPT);

  while(treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    for(let bindAttr in node.dataset) {
      let isBindableAttr = (bindAttr.indexOf('bind_') == 0) ? true : false;
      if(isBindableAttr) {
        let dataKeyString = node.dataset[bindAttr];
        let dataKeys = dataKeyString.split("|");
        let bindKey = bindAttr.substr(5);
        for(let dataKey of dataKeys) {
          if(dataKey in data && data[dataKey] !== "") {
            node[bindKey] = data[dataKey];
            break;
          }
        }
      }
    }
  }

  return element;
}
```


Je ne m'attends pas à ce que quelqu'un l'utilise, mais je voulais montrer comment vous pouvez créer un outil de liaison de données pour des tâches simples sans avoir à recourir à une bibliothèque ou à un framework complet.