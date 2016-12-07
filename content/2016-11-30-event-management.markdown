---
slug: event-management
date: 2016-11-30T13:20:31+01:00
title: "Event management"
draft: true
---

In a recent project building [web push](/designing-a-webpush-service)
service I wanted to have my UI respond to application level events (semantically
if you will) - there were a couple of components that require information
from the sytem but are not dependant with each other and I wanted them to be
able to manage themselves independently of the 'business logic'.

[img]

In my head, I don't really have state that needs a model that is sepeate to the
state already in the browser.

I have frequently have NIH syndrome so I quickly knocked up a simple PubSub
service and it worked ok.

```
EventManager.subscribe('useradded', function(user) {
  console.log(user)
});

form.onsubmit(function(e) {
  e.preventDefault();

  // do something with user fields

  EventManager.publish('useradded', user);
})
```

```
var EventManager = new (function() {
  var events = {};

  this.publish = function(name, data) {
    return new Promise(function(resolve, reject) {
      var handlers = events[name];
      if(!!handlers === false) return;
      handlers.forEach(function(handler) {
        handler.call(this, data);
      });
      resolve();
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
