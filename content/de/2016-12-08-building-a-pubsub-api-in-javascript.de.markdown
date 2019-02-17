---
slug: building-a-pubsub-api-in-javascript
date: 2016-12-08T13:20:31+01:00
title: "Building a simple PubSub system in JavaScript"
tags: ['pubsub', 'javascript']
---


In einem kürzlichen Projekt, das einen [web push](/ designing-a-webpush-service /) Dienst aufbaute, wollte ich, dass meine Benutzeroberfläche auf Ereignisse auf Anwendungsebene reagiert (semantisch, wenn Sie so wollen), weil es einige Komponenten gab, die Informationen benötigen Das System ist aber nicht voneinander abhängig und ich wollte, dass sie sich unabhängig von der "Geschäftslogik" selbst verwalten können.

Ich habe mir viele verschiedene Tools angeschaut, um mir zu helfen, aber weil ich oft einen schweren Fall des NIH-Syndroms habe und die Tatsache, dass ich denke, dass Leute ihre eigenen Infrastrukturelemente ziemlich schnell implementieren können, beschloss ich, schnell einen einfachen Client zu knacken- Seite PubSub Service & mdash; es funktionierte ziemlich gut für meine Bedürfnisse.

Ich diskutierte, ob ich ein benutzerdefiniertes DOM `Event` verwenden und die vorhandene Infrastruktur verwenden sollte, die das DOM bereits Entwicklern & mdash; die Fähigkeit zu Ereignissen und konsumierenden Ereignissen mit `addEventListener` & mdash; aber das einzige Problem war, dass Sie den Event-Handler von einem DOM-Element oder dem Fenster hängen müssen, weil Sie kein Modell haben können, das "EventTarget" erbt oder mischt.

_ ** Thought: ** Wenn `EventTarget` als Objekt verwendet wird, kann die Erstellung von benutzerdefinierten PubSub-Systemen entfallen._

Mit dieser Einschränkung, dem Willen, etwas zu programmieren, und der Neigung, Bugs, die ich selbst erschaffe, nicht zu beachten, habe ich einen groben Plan skizziert:


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


All das ist nicht neu. Redux und viele andere Systeme tun dies bereits und in vielen Fällen helfen sie Ihnen auch, den Zustand zu verwalten. In meinem Kopf habe ich eigentlich keinen Staat, der ein Modell braucht, das bereits im Browser septiert ist.

Die Implementierung ist ziemlich einfach zu implementieren und die Abstraktion ist zumindest für mich sehr nützlich.


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
Bearbeiten: Die Verwendung von Versprechen wurde entfernt.

Und da sind wir. Ein einfaches Pubsub-System, das wahrscheinlich voller Bugs ist, aber ich mag es. :) Ich habe es auf [GitHub](https://github.com/PaulKinlan/EventManager) gesetzt, wenn Sie daran interessiert sind.