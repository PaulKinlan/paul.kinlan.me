---
slug: building-a-pubsub-api-in-javascript
date: 2016-12-08T13:20:31.000Z
title: "Building a simple PubSub system in JavaScript"
tags: ['pubsub', 'javascript']
---


Dans un projet récent de création d'un service [Web Push](/Design-A-Webpush-Service /), je souhaitais que mon interface utilisateur réponde aux événements au niveau des applications (sémantiquement si vous voulez) car quelques composants nécessitaient des informations. le système mais ne sont pas dépendants les uns des autres et je voulais qu'ils puissent se gérer indépendamment de la «logique métier».

J'ai cherché beaucoup d'outils différents pour m'aider, mais comme je souffre souvent du syndrome des NIH et que je pense que les gens peuvent rapidement mettre en place leurs propres éléments d'infrastructure, j'ai décidé de créer rapidement un simple client. côté service PubSub & mdash; cela a très bien fonctionné pour mes besoins.

Je me suis demandé si je devais utiliser un «événement» DOM personnalisé et utiliser l’infrastructure existante que le DOM fournit déjà aux développeurs. la possibilité d'évènements et de consommer des événements en utilisant `addEventListener` & mdash; mais le seul problème était que vous devez suspendre le gestionnaire d'événement à un élément DOM ou à la fenêtre car vous ne pouvez pas avoir un modèle qui hérite ou se mélange dans EventTarget.

_ ** Pensée: ** Avoir «EventTarget» comme objet aiderait à éviter de créer des systèmes PubSub personnalisés.

Avec cette contrainte en tête, une volonté de coder quelque chose et une propension à ne pas me soucier des bugs que je crée moi-même, j'ai esquissé un plan approximatif:


```javascript
/* When a user is added, do something useful (like update UI) */
EventManager.subscribe('useradded', function(user) {
  console.log(user)
});

/* The UI submits the data, lets publish the event. */
form.onsubmit(function(e) {
  e.preventDefault();

  // do something with user fields

  EventManager.publish('useradded', user);
})
```


Tout cela n'est pas nouveau. Redux et de nombreux autres systèmes le font déjà et, dans de nombreux cas, ils vous aident également à gérer votre état. Dans ma tête, je n'ai pas vraiment d'état qui nécessite un modèle septat à l'état déjà dans le navigateur.

L'implémentation est assez simple à implémenter et l'abstraction est tout à fait utile pour moi au moins.


```javascript
var EventManager = new (function() {
  var events = {};

  this.publish = function(name, data) {
    var handlers = events[name];
    if(!!handlers === false) return;
    handlers.forEach(function(handler) {
      handler.call(this, data);
    });
  };

  this.subscribe = function(name, handler) {
    var handlers = events[name];
    if(!!handlers === false) {
      handlers = events[name] = [];
    }
    handlers.push(handler);
  };

  this.unsubscribe = function(name, handler) {
    var handlers = events[name];
    if(!!handlers === false) return;

    var handlerIdx = handlers.indexOf(handler);
    handlers.splice(handlerIdx);
  };
});
```
Edit: Supprimé l'utilisation de la promesse.

Et nous y sommes. Un système simple de pubsub qui est probablement plein de bugs, mais je l'aime bien. :) Je l'ai mis sur [github](https://github.com/PaulKinlan/EventManager) si cela vous intéresse.