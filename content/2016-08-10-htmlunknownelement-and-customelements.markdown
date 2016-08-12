---
slug: htmlunknownelement-and-customelements
date: 2016-08-10
title: "The unintended consequences of custom elements"
draft: true
---


Originally I thought that custom elements, [HTMLUnknownElement](https://www.w3.org/TR/html5/dom.html#htmlunknownelement)

> The HTMLUnknownElement interface must be used for HTML elements that are not defined by this specification 
> (or other applicable specifications).

Any element on the page that is not one defined in the spec 

http://w3c.github.io/html/syntax.html#tree-construction

http://w3c.github.io/html/syntax.html#creating-and-inserting-nodes

> Create a node implementing the interface appropriate for the element type corresponding to the tag name of the 
> token in given namespace (as given in the specification that defines that element, e.g., for an a element in 
> the HTML namespace, this specification defines it to be the HTMLAnchorElement interface), with the tag name 
> being the name of that element, with the node being in the given namespace, and with the attributes on the node 
> being those given in the given token.
>
> The interface appropriate for an element in the HTML namespace that is not defined in this specification 
> (or other applicable specifications) is HTMLUnknownElement. Elements in other namespaces whose interface
> is not defined by that namespace’s specification must use the interface Element.
>
> The node document of the newly created element must be the node document of the intended parent.

https://www.w3.org/TR/2011/WD-html5-20110405/elements.html#global-attributes

```
interface HTMLUnknownElement : HTMLElement { };
```

An Unknown element is a `HTMLElement` with no additional attributes which implies at that level
it is equivalent to a `<span>` element (
http://w3c.github.io/html/textlevel-semantics.html#elementdef-span) 

```
interface HTMLSpanElement : HTMLElement { };
```

So in short, `<anyrandom>tag</anyrandom>` is equivalent to a `<span>` element. It turns out that this is a great
building block (at least from IE9 upwards).


* Tightly defined contracts for UI elements




