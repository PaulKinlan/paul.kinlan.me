---
date: 2017-04-15 13:20:31+00:00
description: Possibly the world's best airhorn now as a custom element
slug: airhorner-custom-element
summary: I created the `<air-horner>` custom element as a learning experiment to explore
  the web component ecosystem and its scalability challenges.  While not intended
  for widespread use, this project helped inform my team's approach to web components.
  Key takeaways include the complexities of deployment at scale, the need for efficient
  templating solutions (potentially `lit-html`) in the absence of HTML imports, the
  ambiguity around attributes vs. properties, difficulties managing multiple assets
  (like audio files), persistent theming challenges, and the potential of slots and
  reprojection.  Check out the embedded `<air-horner>` element below!
tags:
- web components
- custom elements
- HTML imports
- lit-html
- templating
- attributes
- properties
- assets
- theming
- slots
- reprojection
- javascript
title: Airhorner Custom Element

---

I made the [`<air-horner>`](https://github.com/paulkinlan/air-horner/) custom
element to learn more about the web component ecosystem and how to deploy them
at scale. I don't expect this to be used by anyone, but it helped me set a
direction for my team in how we try and support and plan for a web component
future.

I learn't a couple of significant things:

* We don't know how to deploy these at scale yet.
* With HTML Imports going away, at the time of writing we don't have a good
  way of including templates that are anything but strings in JavaScript. It
  looks like `lit-html` might be a good path.
* There wasn't a lot of guidance on the web about `attributes` vs `properties`.
* Deploying multiple assets with one element is hard - where do my audio files go?
* Theming is still a pain.
* I really like slots. I love the idea of reprojection.

If you are really interested, you can see it below.

{{<html>}}
<script src="/javascripts/air-horner.js"></script>
<style>
  air-horner {
    display: block;
    height: 300px;
    width: 300px;
  }
</style>

<air-horner></air-horner>
{{</html>}}

```html
<script src="/javascripts/air-horner.js"></script>
<style>
air-horner {
    display: block;
    height: 300px;
}
</style>

<air-horner></air-horner>
```