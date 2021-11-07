---
slug: loading-web-components
date: 2017-01-26T13:20:31.000Z
title: "How should we load web components?"
image_header: /images/air-horner-element.png
tags: ['web components', 'javascript']
---

Within the last 6 months, it felt like a good time to get on board properly with
Web Components so I've been toying around with bits and pieces. I've been
thinking about the [ecosystem as a whole](/custom-elements-ecosystem/) and I've
also recently been creating a [few
elements](https://github.com/paulkinlan/air-horner).

One thing that is really unclear to me is that there is no defined best practice
for how to include styles and templates (HTML) with your custom element which
means as a consumer of Custom elements you are at the mercy of what the
component developer thinks is best.

Looking at early guidance, there are two ways:

1. Use `<link rel="import">` that is only supported by Chrome but allows you to
   bundle CSS, `<template>`s and other assets needed for element.
2. Go it alone and figure something out.

When I was making the `<air-horner>` element I did ship a `<link rel=import>`
file because it seemed like that was the only way to get it working with
[webcomponents.org](https://webcomponents.org/) but all it does is load the
single JS file that encapsulates everything. Instead, I chose to have a single
JS file (`<script src="air-horner.js"></script>`) that you include in your page
that defines and registers the custom element. The script file encapsulates the
element logic, definition and styling.

I chose this route because I made one decision early on: By including my
component the consumer of the custom element should not have un-controlled
blocking requests emanate from my element. If something will block the render,
then the consumer has decided to do it. This means I don't have any external
style sheets and I don't have any external JS either. I don't include a `<link
rel=stylesheet>` in the template and I also don't dynamically fetch a remote
file.

This constraint means that I have to think of a way to embed both the template
used in my shadowDOM and they styles too without polluting the global scope. I
chose to expose a `template()` function in my custom element that will create
and cache a dynamically created [`<template>`
element.](https://github.com/PaulKinlan/air-horner/blob/787cb29e967ee48e26e7e707b70c170258c0170b/air-horner.js#L16)
This template element contains a `<style>` element and a root `<div>` that the
contains the inline HTML of the element structure.

```javascript
get template() {
  if(this._template) return this._template;
  else {
    this._template = document.createElement('template');
    let styles = document.createElement('style');
    styles.innerHTML = `:host {}
    /* Lots of CSS*/`;
    let body = document.createElement('div');
    body.id = 'airhorn';
    body.innerHTML = `
      <div class='horn'>
        <div class='inner'>
          <div class='center'></div>
        </div>
      </div>`;
    this._template.content.appendChild(styles);
    this._template.content.appendChild(body);
    
    return this._template;
  }
}
```

When the [element is
instantiated](https://github.com/PaulKinlan/air-horner/blob/787cb29e967ee48e26e7e707b70c170258c0170b/air-horner.js#L187)
I stamp out the shadowDOM and then go to work on attaching functionality to the
element DOM.

```javascript
const root = this.attachShadow({mode:'open'});
root.appendChild(this.template.content.cloneNode(true));

// Now attach handlers...
``` 

This works well for the very first version of the element, but it is not
entirely extensible. To let the user style the element I have to figure out a
way to allow them to inject their own styles and maybe even their own custom
HTML, or I can expose extension points via CSS variables. The latter method is
quite easy but it pollutes CSS variable namespace and makes the "API" complex to
document and hard to discover for developers, the former method, I have no good
idea about how to do that in a consistent way.

I really don't want to see an ecosystem where we have to have complex bundling
and deployment scripts just so I can drop some fancy elements on my page but I 
would like to see some commonality about how we include elements in our sites 
and apps.

I don't have answers at the moment, I only have questions:

* What is a good solution for deploying Web Components? Should we push harder on
  getting support for `<link rel=import>`, or wait for better module loading via
  `<script type=module>` [link](https://blog.whatwg.org/js-modules)?
* Do we need to roughly agree on a model for encapsulating and loading templates and
  styles, or is it to early?
* Given that HTML imports seem dead, is inlining the template in the element a
  reasonable solution? are there better ways whilst not polluting the global
  scope?
* Is the constraint of not making requests from my component the correct goal?
  If so are there better solutions to hosting all the required assets?

I would love to get your thoughts.

Update: Ali Afshar asked why I am using a template element when it is not in the
DOM. It's a good question, I don't believe I needed to, but it was a nice way to
group multiple elements in something that wasn't a `div`.