---
slug: building-a-pubsub-api-in-javascript
date: 2016-12-08T13:20:31+01:00
title: "Building a simple PubSub system in JavaScript"
tags: ['pubsub', 'javascript']
---


En un proyecto reciente de creación de un servicio [web push](/ designing-a-webpush-service /), quería que mi UI respondiera a los eventos de nivel de aplicación (semánticamente si lo hace) porque había un par de componentes que requieren información de el sistema pero no son dependientes entre sí y quería que pudieran administrarse independientemente de la 'lógica de negocios'.

Miré a mi alrededor muchas herramientas diferentes para ayudarme, pero debido a que con frecuencia tengo un caso fuerte de síndrome NIH y el hecho de que creo que las personas pueden implementar sus propios elementos infraestructurales con bastante rapidez, decidí llamar rápidamente a un simple cliente- servicio PubSub lateral & mdash; funcionó bastante bien para mis necesidades.

Debatí si debería usar un DOM `Event personalizado y usar la infraestructura existente que el DOM ya proporciona a los desarrolladores & mdash; la capacidad de eventos y eventos consumidores usando `addEventListener` & mdash; pero el único problema es que debes colgar el controlador de eventos de un elemento DOM o la ventana porque no puedes tener un modelo que herede o mezcle en 'EventTarget'.

_ ** Pensamiento: ** tener `EventTarget` como objeto ayudaría a obviar la necesidad de crear sistemas personalizados de PubSub._

Con esta limitación en mente, una voluntad de codificar algo y una propensión a no tener en cuenta los errores que yo mismo creo, esbocé un plan aproximado:


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


Todo esto no es nuevo. Redux y muchos otros sistemas ya lo hacen y en muchos casos también lo ayudan a administrar el estado. En mi cabeza, realmente no tengo un estado que necesite un modelo que esté separado del estado que ya está en el navegador.

La implementación es bastante simple de implementar y la abstracción es bastante útil para mí al menos.


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
Editar: eliminó el uso de la promesa.

Y ahí estamos. Un sistema pubsub simple que probablemente está lleno de errores, pero me gusta. :) Lo he puesto [github](https://github.com/PaulKinlan/EventManager) si le interesa.