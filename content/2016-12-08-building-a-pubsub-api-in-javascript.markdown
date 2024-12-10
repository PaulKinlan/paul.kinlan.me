---
date: 2016-12-08 13:20:31+00:00
slug: building-a-pubsub-api-in-javascript
summary: In this post, I share a simple client-side JavaScript PubSub system I built.  Motivated
  by the Not-Invented-Here syndrome and the desire for independent UI components,
  I created a lightweight event manager called EventManager.  It allows components
  to communicate without direct dependencies by publishing and subscribing to named
  events.  While similar to tools like Redux, this approach avoids separate state
  management, leveraging the browser's existing state. The code is available on GitHub.
tags:
- javascript
- pubsub
- events
- eventemitter
- ui
- web development
- front-end
- client-side
title: Building a simple PubSub system in JavaScript

---

In a recent project building a [web push](/designing-a-webpush-service/)
service I wanted to have my UI respond to application level events (semantically
if you will) because there were a couple of components that require information
from the system but are not dependent with each other and I wanted them to be
able to manage themselves independently of the 'business logic'.

I looked around at lots of different tools to help me, but because I frequently
have a heavy case of NIH syndrome and the fact that I think people can implement
their own infrastructural elements pretty quickly, I decided to quickly knock-up
a simple client-side PubSub service &mdash; it worked pretty well for my
needs.

I debated whether I should use a custom DOM `Event` and use the existing
infrastructure that the DOM already provides to developers &mdash; the ability
to events and consuming events using `addEventListener` &mdash; but the only
problem was that you have to hang the event handler off a DOM Element or the
window because you can't have a model that inherits or mixes in `EventTarget`.

_**Thought:** having `EventTarget` as an object would help obviate the need for
creating custom PubSub systems._

With this constraint in mind, a will to code something up, and a propensity for
not minding bugs that I create myself, I sketched out a rough plan: 

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

All of this isn't new. Redux and many other systems already do this and in many
cases they also help you manage state. In my head, I don't really have state
that needs a model that is septate to the state already in the browser.

The implementation is pretty simple to implement and the abstraction is quite
useful for me at least.

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
Edit: Removed the use of promise.

And there we are. A simple pubsub system that is likely full of bugs, but I like
it. :) I've put it on [github](https://github.com/PaulKinlan/EventManager) if 
you are interested in it.