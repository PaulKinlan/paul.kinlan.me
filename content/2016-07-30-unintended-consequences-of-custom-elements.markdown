---
slug: custom-elements-ecosystems
date: 2016-07-30
title: "The unintended consequences of custom elements"
draft: true
---

I like Web Components. It has taken a long time to get here but things are moving in the correct direction
with Safari shipping Shadow DOM. 

I've been thinking a lot recently about Web Components, that is `custom elements`, `template`, 
`Shadow DOM` and `CSS variables`, specifically I have been focusing some of my thoughts on custom 
element space and how this can play out on the web in the future because I believe there are lots
of interesting possibilities with how the usage of them will evolve over time.

In this post, I specifically want to focus on Custom Elements and the impact that they can have 
on the web and developers.

Custom Elements are interesting because they allow developers to take an existing element
and extend it. [For example](https://developers.google.com/web/fundamentals/primers/customelements/):

```
class ShareButton extends HTMLElement {...}
window.customElements.define('share-button', ShareButton);
<share-button></share-button>
```

Custom Elements introduces the potential for a brand new ecosystem that I don't think that we have 
yet fully worked out and I want to explore that a little more. Specifically, the two questions I have
are: 

* Given that the usage of the `<share-button></share-button>` element in your page is distinct and separate from the 
declaration and contract of what that element does, will we see standard element names and specs being
written for new element sets that are platform/vendor/host specific?
* What will that ecosystem look like if it plays out?

### Element Catalogues and Walled Gardens

I've been looking a lot in to [AMP](https://ampproject.org/), [Polymer](https://polymer-project.org/)
[Mozilla Brick](http://brick.mozilla.io/) and other Web Toolkits, and one thing hit me is that they are 
all prefixing their element catalogues with a project namespace. AMP has `<amp-*>` elements; 
Polymer has `<polymer-*>`, `<iron-*>`, `<app-*>` etc; [Mozilla](http://brick.mozilla.io/) have `<brick-*>`.

From the outside it looks like there is a massive platform play at the heart of this because there are a 
number of things happening here. The element authors have added a namespace to their elements (for 
good reasons, we are early in the life-cycle for Web Components and owning the top-level name for an 
element might seem a little rich) but namespacing like this puts developers in the position of buying into
the stack and even if it is unintentional they are creating a walled garden that could lock the developers
into one platform.

If you look at [`<amp-img>`](https://github.com/ampproject/amphtml/blob/master/builtins/amp-img.md) 
and [`<iron-image>`](https://elements.polymer-project.org/elements/iron-image) they are both roughly doing the
same thing but they are also both specific enough to each of the component platforms that they would not
be used in each others platform and I think that is a long-term problem.

Custom Elements and Web Components have the power to give control back to the developer and to make their
lives simpler by inverting the control away from the framework creator and back to the platform and the web 
developer. As a web developer, you should be in control of the mark-up on your page 
and have the element platforms bind to that mark-up instead of being in the control of the platform.

I can quite easily see a long term `<M-n>` elements, where `M` is the platform of choice and `n` is the element
being used and I think this a bad thing.

The good thing is that at a technical level, `<M-n>` is possible and will work, and a more tightly defined
element binding system will work too and it is up to the developer to choose if they want to be controlled
by the frameworks they use, or have control over the elements they use. 

I want to ensure that developers don't get massively locked into a framework or platform just because 
today the element set is good and instead we have a shared vocabularly for components such as `<aspect-image>`
that allows us to choose the implementation they prefer.

### Elements and Open Fields

It is not clear from the spec or the tutorials that the element definition is distinct
from the usage of the element in a page. A lot of examples that I see follow something similar to
the following:

```
class ShareButton extends HTMLElement {...}
window.customElements.define('share-button', ShareButton);
`<share-button></share-button>`
```

The above code has two actors: The [Component Creator] and the [Component User], which roughly breaks 
down into the following usage:

1. [Component Creator] Declaration of Contract `class ShareButton extends HTMLElement {...}`
2. [Component User] Agrees to use Contract `window.customElements.define('share-button', ShareButton);`
3. [Component User] Use Contract `<share-button></share-button>`

To solve the `<M-n>` element problem [Component Creator]s need to unify over a set of element names,
interfaces and expected function.

Whilst element vendors are already defining these contracts for their own platforms; Polyer for example
has API interfaces (see [`<iron-image>`](https://elements.polymer-project.org/elements/iron-image)) and
so does AMP (see [`<amp-social-share>`](https://github.com/ampproject/amphtml/blob/master/extensions/amp-social-share/amp-social-share.md))
we need to start to think about unifying the elements set.

The AMP Project has the [start of a process for element governance and UI contracts](https://github.com/ampproject/amphtml/blob/master/spec/amp-html-components.md#extended-components).

> Not attempt to access or manipulate objects outside of the component's immediate ownership - e.g. 
> elements that are not specified by or children of the component.

### Component Creators

This is the hard part. Component vendors would have to agree to a contract for how an element should work. The 
W3C and WhatWG have been doing this for a while, but this could be a level abstracted away from the process of
defining new elements. The thing that I like about Custom Elements is that the spec can be written and formalised 
in JavaScript as a base implementation.

1. [Component Creator] Declaration of Contract `class ShareButton extends HTMLElement {...}`

Facebook define a `class ShareButton extends HTMLElement { ... }`
Mozilla define a `class ShareButton extends HTMLElement { ... }`
Google define a `class ShareButton extends HTMLElement { ... }`
AMP defines a .... you get the picture

If everyone agrees to the same contract for elements, then as a developer you get a lot more flexibility, it becomes
a case of choosing the implementation that you want.

If you take a quick peak at AMP's [social sharing widget](https://github.com/ampproject/amphtml/blob/master/extensions/amp-social-share/0.1/amp-social-share.js) it
is not a million miles away.

1. [Component Creator] [Declaration of Contract](https://github.com/ampproject/amphtml/blob/master/extensions/amp-social-share/amp-social-share.md)  ``class AmpSocialShare extends AMP.BaseElement {`
2. [Component User] Agreeing to implement Contract `<script src="https://cdn.ampproject.org/v0/amp-social-share-0.1.js"></script>`
3. [Component User] Use Contract `<amp-social-share type="twitter"></amp-social-share>`

It opens up the question as to who owns the creation and specifications of elements. There is an argument that
this could be the W3C, but I think Web Components opens up the creation of elements to new "vendors". Because
the component will be defined in HTML, CSS and pure Javascript we don't need to rely on browser vendors any more
to agree on implementing elements, now we have meta plaforms like Google, Twitter, Facebook, WeChat itterating
on the element catalogues.

### Component User

As a publisher or site developer, one thing that stays consistent for me is my HTML. I will keep my `<share-button></share-button>`
on the page and I won't need to change it. Web Components allows me to use my own tags, as long as I
agree to implement us the correct class, it even gives me the chance to use my own tag namespace.

`<script async src="https://somedomain.com/share-button.js"></script>`

2. [Component User] Agreeing to implement Contract `window.customElements.define('share-button', ShareButton);`

I would argue that the [Component Creator] shoud own the "Agrees to use Contract" becuase allowing
site owners to user their own tags can create a number of problems when a [headless renderer](/the-headless-web) 
doesn't implement the Web Components APIs will be able to understand that an element name is intended to be
follow the implementation defined between element authors.

Either way, my HTML declares the intent to use the button and that remains consistent.

3. [Component User] Use Contract `<share-button></share-button>`

Todo, talk about cleanliness.

### Contracts

The libraries that are creating custom elements at have 

Contracts for components
https://github.com/ampproject/amphtml/blob/master/spec/amp-html-components.md

More elements
https://github.com/ampproject/amphtml/tree/master/extensions


https://github.com/ampproject/amphtml/tree/master/builtins


### Platforms as the decider of the component suite

I have a lot of thoughts about [The headless web](/the-headless-web/) and how they can enable 
a web that TBD... different [meta platforms](/rise-of-the-meta-platforms/) that.

Semantics as elements.

There is an opportunity for the components that developers use are developed and managed outside of the
browser space we can get to a place where component suites, meta-platforms and other 

`<responsive-image>`

Because all of the AMP Components are pretty well defined and specced out a third party platform could take the
well defined AMP document and render it in their own web experience (like Google do with their 
rendering of AMP content in the carousel) but replace the `<amp-*>` implementation with their own 
implementation of the elements.

I think this is an interesting possibility because if you extend it further


* Components will only control it's self and the elements in it's scope. We need to ensure that there
  are no side effects.






