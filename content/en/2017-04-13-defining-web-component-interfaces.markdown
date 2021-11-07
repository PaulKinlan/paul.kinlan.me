---
slug: defining-web-component-interfaces
date: 2017-04-13T13:20:31.000Z
title: "Defining web component interfaces"
description: "Custom Elements need clear and parsable API documentation."
tags: ['web components', 'custom element', 'share', 'IDL']
---
I've been [building a web component or
two](/creating-a-share-button-web-component/) recently and whilst I've been
learning the in's and out's of the ecosystem (mostly by perusing
webcomponents.org) I've found that it is quite hard to understand and quickly 
grok the interface for elements.

WebComponents.org solves some of this with a great feature. It encourages the
component author to document their element in the README and it makes it simple
to include inline demos of the element in action so that you can quickly see 
how the element functions and how to achieve that goal.

{{< figure src="/images/web-idl.png" title="webcomponents.org documentation" >}}

For me, a large issue is that a README is not a reference and it is not an
interface guide and none of which are mandatory, meaning that every element is
documented differently.

Polymer does go a step further. Polymer encourages [developers to document their 
element](https://www.polymer-project.org/1.0/docs/tools/documentation) using
[jsdoc syntax](http://usejsdoc.org/about-getting-started.html) and whilst it 
is embedding this in an `html import`, it is transportable to the single class
method I chose for building web components.

I believe that we should be documenting and defining the interface for their own
components consistently and in the same form that the platform uses to define
the DOM, notably Web IDL.

Web IDL enables tooling to be able to quickly parse my element's API and then
potentially provide auto-complete or other developer utilities not to mention
that it can be quickly parseable by people.

[I took a stab at defining the
IDL](https://github.com/PaulKinlan/share-button/blob/master/share-button.idl)
for my `<share-button>` and I think it looks pretty sensible and neatly defines
it's API surface.

```
[Constructor]
interface ShareButton : HTMLElement {
    attribute DOMString href;
    attribute DOMString text;

    static getter DocumentFragment template();
    static getter sequence<DOMString> observedAttributes();

    void updateUrl(DOMString url);
    void updateText(DOMString text);
    void copyUrl();
    void mailUrl();
    void hide();
    void show();
    void toggleOverlay();
}
```

There are a number of issues. IDL can be a bit of a pain in the bum to learn and
to work with. I am having trouble defining the events that my element exposes,
and there is no way that I know of that enables me to define the styling
interface that elements expose.

I think the benefits of a clear and consistent interface document outweigh some
of the current limitations with IDL and I believe we should start to gravitate
around a common form.

I would be interested to learn of any experiments or methods you have used to
provide guidance on your element's API. Is WebIDL too restrictive? Is JSDoc the
answer? I've seen some people use TypeScript definitions, how did that work out?