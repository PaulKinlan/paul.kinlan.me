---
slug: custom-elements-ecosystem
date: 2016-11-05
title: "Custom Elements: an ecosystem still being worked out"
tags: ['web components', 'custom element']
---

I like Web Components. It has taken a long time to get here but things are
moving in the correct direction with Safari shipping Shadow DOM and now landing
support for Custom Elements.

I've been thinking a lot recently about Web Components, that is `custom
elements`, `template`, `Shadow DOM` and `CSS variables`, specifically I have
been focusing some of my thoughts on custom element space and how this can play
out on the web in the future because I believe there are lots of interesting
possibilities with how the usage of them will evolve over time.

In this post I specifically want to focus on Custom Elements and the impact that
they can have on the web and developers.

Custom Elements are interesting because they allow developers to take an
existing element and extend it. [For
example](https://developers.google.com/web/fundamentals/primers/customelements/)
a dedicated share-button (I have a thing about sharing):

```javascript
class ShareButton extends HTMLElement {}
window.customElements.define('share-button', ShareButton);
`<share-button></share-button>`
```

Custom Elements introduces the potential for a brand new ecosystem that I don't
think that we have yet fully worked out and I want to explore that a little
more.

The usage of the elements such as `<share-button></share-button>` in your page
is distinct and separate from the declaration and contract of what that element
does.

Will we see standard element names and specs being written for new element sets
that are platform/vendor/host specific?

### Element and walled gardens

I've been looking in to [AMP](https://ampproject.org/),
[Polymer](https://polymer-project.org/), [Mozilla
Brick](http://brick.mozilla.io/)(seemingly defunct) and other web toolkits, and
one thing hit me is that they are all prefixing their element catalogues with a
project namespace: AMP has `<amp-*>` elements; Polymer has `<polymer-*>`,
`<iron-*>`, `<app-*>` etc; [Mozilla](http://brick.mozilla.io/) have `<brick-*>`.

From the outside it looks like there is a massive platform play to get people
locked into the framework's element set and the name-spacing like we
are seeing puts developers in the position of buying into the stack and even if
it is unintentional they are creating a walled garden that could lock the
developers into one platform.

I do think it is a lot more nuanced than that though, the element authors have
added a namespace to their elements for good reasons, we are early in the
life-cycle for Web Components and owning the top-level name for an element will
look like an ecosystem land grab.

One of my concerns is that there is a lot of rich functionality getting created
that we can drop in and use on our page, but a lot of it is getting duplicated.
Look at
[`<amp-img>`](https://github.com/ampproject/amphtml/blob/master/builtins/amp-img.md)
and [`<iron-image>`](https://elements.polymer-project.org/elements/iron-image)
they are both roughly doing the same thing but they are also both specific
enough to each of the component platforms that they would not be used in each
others platform and I think that is a long-term problem.

I can quite easily see a long term `<M-n>` elements, where `M` is the platform
of choice and `n` is the element being used and I think this a bad thing for
the long-term health of the platform.

Custom Elements and Web Components have the power to give a huge amount of
control to the developer and I would like to see a world where we invert the
control of the framework creator and give it back to the platform and the web
developer.

As a web developer, you should be in control of the mark-up on your
page and have the element platforms bind to that mark-up instead of being in the
control of the specific vendors element set.

The good thing is that at a technical level, `<M-n>` elements is possible and is
working well today, but that shouldn't be the end goal.

I want to ensure that developers don't get massively locked into a framework or
platform just because today the element set is good and instead we have a shared
vocabulary for components such as `<aspect-image>` that allows us to choose the
implementation they prefer.

### Elements and open fields

It is not clear from the spec or the tutorials that the element definition is
distinct from the usage of the element in a page. A lot of examples that I see
follow something similar to the following:

```javascript
class ShareButton extends HTMLElement {...}
window.customElements.define('share-button', ShareButton);
`<share-button></share-button>`
```

The above code has two actors: The [Component Creator] and the [Component User]
and right now if you are building a framework the process looks like:

1. [Component Creator] Defines Contract `class XPolyampShareButton extends HTMLElement {...}`
2. [Component Creator] Instantiates Contract `window.customElements.define('xpolyamp-sharebutton', XPolyampShareButton);`
3. [Component User] Use Contract `<xpolyamp-sharebutton></xpolyamp-sharebutton>`

I argue that as an industry we as web developers should push to a model where
the element you import has no control of the element naming and instantiation
and instead we should move to a model like:

1. [Component Creator] Defines Contract `class ShareButton extends HTMLElement {...}`
2. [Component ~~Creator~~User] Agrees to use Contract `window.customElements.define('share-button', ShareButton);`
3. [Component User] Use Contract `<share-button></share-button>`

I'm glossing over a lot of complexity (as a dev you import the
contract you want to use already by virtue of the element set), but the thinking
opens up a lot of opportunity, as a user of the component you are opting in
to the implementation for the element but not how it should be used on the page.

It also has some problems, specifically that we are opening up to requiring a more
formal standardization process around elements and their names, interfaces and
expected function (no small task). The interesting thing though is that the
industry is already starting to do this for each of the vendors elements.
Polymer for example has API interfaces (see
[`<iron-image>`](https://elements.polymer-project.org/elements/iron-image)) and
so does AMP (see
[`<amp-social-share>`](https://github.com/ampproject/amphtml/blob/master/extensions/amp-social-share/amp-social-share.md))
.

A good developer could take those contracts and re-implement their own
element with the same element name and semantics.

It gets even more interesting when you see that the AMP Project has the [start
of a process for element governance and UI
contracts](https://github.com/ampproject/amphtml/blob/master/spec/amp-html-components.md#extended-components).

> Not attempt to access or manipulate objects outside of the component's immediate ownership - e.g.
> elements that are not specified by or children of the component.

We need to start to think about unifying the elements set.

### Component Creators

This is the hard part. Component vendors would have to agree to a contract for
how an element should work. The W3C and WhatWG have been doing this for a while,
but this could be a level abstracted away from the process of defining new
elements. The thing that I like about Custom Elements is that the spec can be
written and formalized in JavaScript as a base implementation.

1. [Component Creator] Declaration of Contract `class ShareButton extends HTMLElement {...}`

Facebook define a `class ShareButton extends HTMLElement { ... }`
Mozilla define a `class ShareButton extends HTMLElement { ... }`
Google define a `class ShareButton extends HTMLElement { ... }`
AMP defines a .... you get the picture

If everyone agrees to the same contract for elements, then as a developer you
get a lot more flexibility, it becomes a case of choosing the implementation
that you want.

If you take a quick peak at AMP's [social sharing widget](https://github.com/ampproject/amphtml/blob/master/extensions/amp-social-share/0.1/amp-social-share.js) it
is not a million miles away (the creator still owns step 2).

1. [Component Creator] [Define Contract](https://github.com/ampproject/amphtml/blob/master/extensions/amp-social-share/amp-social-share.md)  ``class AmpSocialShare extends AMP.BaseElement {`
2. [Component User] Agreeing to use Contract `<script src="https://cdn.ampproject.org/v0/amp-social-share-0.1.js"></script>`
3. [Component User] Use Contract `<amp-social-share type="twitter"></amp-social-share>`

It opens up the question as to who owns the creation and specifications of
elements. There is an argument that this could be the W3C, but I think Web
Components opens up the creation of elements to new "vendors".

The component will be defined in HTML, CSS and pure JavaScript we don't need to
rely on browser vendors any more to agree on implementing elements, now we can
have meta platforms like Google, Twitter, Facebook, WeChat iterating on the
element unified catalogues (for example).

### Component User

As a publisher or site developer, one thing that stays consistent for me is my
HTML. I will keep my `<share-button></share-button>` on the page and I won't
need to change it. Web Components allows me to use my own tags, as long as I
agree to instantiate us the correct class.

`<script async src="https://somedomain.com/share-button.js"></script>`

2. [Component User] Agreeing to implement Contract `window.customElements.define('share-button', ShareButton);`

It can be argued that the [Component Creator] should own the "Agrees to use
Contract" because allowing site owners to user their own tags can create a
number of problems when a [headless renderer](/the-headless-web/) doesn't
implement the Web Components APIs will be able to understand that an element
name is intended to be follow the implementation defined between element
authors.

Either way, my HTML declares the intent to use the button and that remains
consistent and stable and I can swap out the implementation easily as I see fit
and I think this is the most important thing.

3. [Component User] Use Contract `<share-button></share-button>`

It feels a lot cleaner and there is a shared vocabulary across the entire
web of element sets and their intentions.

### Platforms as the decider of the component suite

I have a lot of thoughts about [The headless web](/the-headless-web/) and how
they can enable a web the web is morphing away from being hosted inside a
traditional browser and into new [meta platforms](/rise-of-the-meta-platforms/)
like Facebook and WeChat and this presents a very interesting question.

What if the developer wasn't in control of step 2 "Agrees to use Contract", but
instead the host platform was?

1. [Component Creator] Defines Contract `class ShareButton extends HTMLElement {...}`
2. [Component Platform~~Creator~~~~User~~] Agrees to use Contract `window.customElements.define('share-button', ShareButton);`
3. [Component User] Use Contract `<share-button></share-button>`

Hypothetically, Facebook (sorry, it's not an ad hominem, but it's an example of
a powerful player) in their WebView intercept every `customElements.define` call
and when they know you are using an element that they can host natively in their
platform they replace what is the JS element you wanted with their own. As long
as they agree to the element's contract your site will still work, the user will
still get value, it has just been stream-lined to operate and be deeply
integrated in the host platform.

I'll just leave it here and we can mull on this.

### Final thoughts

I like my model of thinking, but there are lots of other ways that we can think
of the owners and users of the components and we are so early on in this new industry
that we as an industry need to iterate on how we build for web components and
how we talk about it.

Web Components will change the world. We need to put developers in control and
not go down into a world where you are locked into a platform just because you
want a nice element in your page.

`<sorry-element>Didn't mean to pick on AMP or Polymer, its just that they
have an existing and very compelling element set already</sorry-element>`
