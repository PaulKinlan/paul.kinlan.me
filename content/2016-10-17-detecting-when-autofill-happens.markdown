---
slug: detecting-when-autofill-happens
date: 2016-10-17
title: "Measuring the impact of autofill on your forms"
---

Autofill has a chequered history filled with what I believe is a mild case of
FUD. Chrome for the longest time decided to ignore `autocomplete=off` on forms
and fields because we believed that autocomplete provides a huge amount of value
for users especially in the context of mobile.

One of the problems is that is incredibly hard to measure how impactful
autocomplete is to your site. There aren't really any events that happens
when "autocomplete" occurs, so how do you measure what you tell has happened?

I think there is a way, but it is not consitent across browsers.

### WebKit and Blink engines (Chrome, Samsung and Opera...)

For a long time, WebKit had a pseudo class call `-webkit-autofill` that will be
applied to input elements that. When the Chrome team forked WebKit and turned
it into the blink engine they also inherited this feature.

The `-webkit-autofill` pseudo class was designed to let you style and override
the default "yellow" highlight when the browser executes the autofill.  It is
possible to use this pseudo selector to find all elements that have it applied
using a simple `document.querySelectorAll` call as follows:

```
document.querySelectorAll('input:-webkit-autofill');
```

Likewise, you can listen to the input event on the input elements (or even
on the document) and check to see if the event target would match the selector,
as seen below:

```
document.addEventListener('input', function(e) {
  var element = e.target.matches(':-webkit-autofill');
  if(element) {
      // Field auto-completed - Send an analytics event (or whatnot)
  }
});
```

This works consistently across all WebKit and blink based browsers, however
[Mozilla haven't implemented it](https://bugzilla.mozilla.org/show_bug.cgi?id=740979). 
There are numerous StackOverflow answers that suggest `:-moz-autofill` works, 
it doesn't.

There was also a thread a while ago to standardize this, but no action has been
taken.

If you are searching for `autocomplete` you will also see an API called
`requestAutoComplete`, it even has a handy `onautocomplete` event that is called
when, well, the field is auto-filled. The problem is that his API is all but
deprecated. I would love to see `onautocomplete` as an event that is triggered
when the browser automatically fills the field. It is a very nice convenience
function.

But the question still remains, how do you do this in Firefox and browsers that
don't support `:-webkit-autofill`?

Great question!

After some research that involved me crafting some simple tools for Firefox
DevTools (I needed to be able to listen to all events happening on an element so
I had to create a [`monitorEvents`](/monitoring-all-events-on-an-element/) shim.
Likewise, I had to also work out a way to find when an Element was created so
I ended up making a [utility to resolve a promise when an element is added
to the DOM](/waiting-for-an-element-to-be-created/)), I think I have found
a way to detect autocomplete in Firefox (and consistently across all other
browsers).

What I found was that the `oninput` event will fire without any other events
be invoked, so there is no `onkeypress`, `onkeyup` etc. I think there can be
some false positives but the signals look good.

```
var registerOnAutoComplete = function(elementSelector) {
  return new Promise(function(resolve, reject) {
    var element = document.querySelector(elementSelector);
    var hasKeyInteraction = false;

    element.addEventListener("input", function(e) {
      if(hasKeyInteraction === false) {
        resolve(e.target);
      }
    });

    element.addEventListener("keydown", function(e) {
      // If there is a keyboard interaction then we believe it is not autocomplete
      hasKeyInteraction = true;
    });
  });
};
```

Usage is pretty simple for individual elements.

```
<script>
  registerOnAutoComplete("input[name=email]").then((element) => {
    // Send some analytics data.
  });
  registerOnAutoComplete("input[name=password]").then((element) => {
    // Send some analytics data.
  });
</script>
<form>
  <input type="email" name="email">
  <input type="password" name="password">
</form>
```

I think this is pretty interesting, you can get data on which fields have been
autofilled by the browser but you have to register for an event on them.  This
is why I really like the idea of a custom `onautocomplete` event that as a
developer I can listen for, or if necessary prevent.

I am going to do a couple more experiments, because I would also like to
register this once at the `<form>` level and I would like to get feedback on
if developers at large think this is as useful as I do.

My goal is to prove that autocomplete is a massive net-positive for users and
businesses, but to do that we need to be able to measure it.

#### What next?

I would really like this to be properly standardized, that is:

1. Standardize and implement`:autofill` - CSS pseudo class so I can style but
   also select.
2. Rip out `onautocomplete` from the requestAutoComplete spec and trigger it
   when the browser actually autocomplete
3. allow the developer to preventDefault on `onautocomplete` if they have a
   better idea about what the data should be.
