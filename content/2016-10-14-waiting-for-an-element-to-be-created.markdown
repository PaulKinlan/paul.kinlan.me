---
date: 2016-10-14
slug: waiting-for-an-element-to-be-created
summary: In my quest to understand how to detect when a field has been autofilled,
  I needed a way to monitor the events of an element that doesn't exist yet. I created
  a helper function, `waitForElement`, that uses `MutationObserver` to wait for an
  element with a specific ID to be added to the DOM.  Once the element is added, the
  promise resolves and returns the element. This, combined with my previously created
  `monitorEvents` function, allows me to start logging events on dynamically created
  elements, getting me closer to solving the autofill detection puzzle.
tags:
- javascript
- mutationobserver
- dom
- events
- autofill
- debugging
- asynchronous
- promises
title: Waiting for an element to be created

---

In my trials and tribulations to detect when a field has been autofilled,
I need to create a shim for [`monitorEvents`](/monitoring-all-events-on-an-element/)
so that I can see the event life-cycle of that element and ultimately try to
debug it.

One thing that I found is that `monitorEvents` requires an element but for what
I am doing I know that there will be an element with an id at some point but
I don't know when it will be created.

I quickly knocked out a small function called `waitForElement` that uses
the [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
to look for when an element with a given `id` is added to the DOM. When that
element has been detected it will resolve the promise and return the element.

The code is as follows:

```javascript
function waitForElement(selector) {
  return new Promise(function(resolve, reject) {
    var element = document.querySelector(selector);

    if(element) {
      resolve(element);
      return;
    }

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        var nodes = Array.from(mutation.addedNodes);
        for(var node of nodes) {
          if(node.matches && node.matches(selector)) {
            observer.disconnect();
            resolve(node);
            return;
          }
        };
      });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  });
}
```
[Here is the gist if that is your bag](https://gist.github.com/PaulKinlan/2d7cd4e78a63a97387137a0a9fb7ee6e).

It is pretty simple to use this simple API.

```javascript
waitForElement("#test").then(function(element) {
    console.log("Element Added", element);
});
```

Now combining in the [`monitorEvents`](/monitoring-all-events-on-an-element/)
function from my previous post, I can now set a breakpoint early in the
life-cycle of a page (because scripts in the head block) and set up a
`waitForElement` call that can now start logging all the events that are
firing on that element.

```javascript
waitForElement("#test").then(function(element) {
    monitorEvents(element);
});
```

Technically I still haven't solved the issue of "how can you tell when Firefox
has autocompleted fields" but I have the tools at my disposal.

Pretty chuffed.