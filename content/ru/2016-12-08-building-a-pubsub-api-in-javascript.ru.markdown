---
slug: building-a-pubsub-api-in-javascript
date: 2016-12-08T13:20:31.000Z
title: "Building a simple PubSub system in JavaScript"
tags: ['pubsub', 'javascript']
---


В недавнем проекте, построенном в сервисе [web push](/ design-a-webpush-service /), я хотел, чтобы мой пользовательский интерфейс отвечал на события уровня приложения (семантически, если хотите), потому что было несколько компонентов, которым требуется информация от системы, но не зависят друг от друга, и я хотел, чтобы они могли управлять собой независимо от «бизнес-логики».

Я осматривал множество различных инструментов, чтобы помочь мне, но поскольку у меня часто бывает тяжелый случай синдрома NIH и тот факт, что я думаю, что люди могут быстро реализовать свои собственные инфраструктурные элементы, я решил быстро сбить простой клиент- сторона службы PubSub & mdash; он работал очень хорошо для моих нужд.

Я обсуждал, следует ли использовать пользовательское DOM `Event` и использовать существующую инфраструктуру, которую DOM уже предоставляет разработчикам & mdash; возможность событий и событий потребления с использованием `addEventListener` & mdash; но единственная проблема заключалась в том, что вы должны повесить обработчик событий из элемента DOM или окна, потому что вы не можете иметь модель, которая наследует или смешивает в «EventTarget».

_ ** Мысль: ** наличие «EventTarget» в качестве объекта поможет устранить необходимость создания пользовательских систем PubSub.

Имея в виду это ограничение, желание кодировать что-то и склонность к нежеланию ошибок, которые я создаю, я набросал приблизительный план:


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


Все это не ново. Redux и многие другие системы уже делают это, и во многих случаях они также помогают вам управлять состоянием. В моей голове у меня действительно нет состояния, которое нуждается в модели, которая пересекается в состояние уже в браузере.

Реализация довольно проста в реализации, и абстракция для меня очень полезна.


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
Изменить: Удалено использование обещаний.

И вот мы. Простая система pubsub, которая, вероятно, полна ошибок, но мне она нравится. :) Я поместил его в [github](https://github.com/PaulKinlan/EventManager), если вас это интересует.