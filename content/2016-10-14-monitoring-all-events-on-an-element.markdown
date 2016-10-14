---
slug: monitoring-all-events-on-an-element
date: 2016-10-13
title: "Monitor all Events on an Element"
---

I've recently started researching autofill and what hints that browsers give
to developers that they have automatically filled in a form field on the
users behalf.  Blink and WebKit browsers have a special CSS pseudo class that
you can look at (more in another post), but firefox doesn't.  There must be
some event!!!

Chrome Devtools has a handy helper function called `monitorEvents`, you call
it with an element as an argument and it will then log to the console all
the events that happen on that element.  Meggin Kearny on our team and
Flavio Cotes wrote about
[monitorEvents](https://developers.google.com/web/tools/chrome-devtools/console/events)
and all the other helper functions recently on our [WebFundamentals](https://developers.google.com/web)
 site.

Firefox DevTools don't have this utility function, so I wrote my own.

There are no guarentees for accuracy, but it worked for me ;)

```
function monitorEvents(element) {
  var log = function(e) { console.log(e);};
  var events = [];

  for(var i in element) {
    if(i.startsWith("on")) events.push(i.substr(2));
  }
  events.forEach(function(eventName) {
    element.addEventListener(eventName, log);
  });
}
```

If you are a person who likes gists, [then here you go](https://gist.github.com/PaulKinlan/45de2fb55c1390d871b3a67f72ae730c).