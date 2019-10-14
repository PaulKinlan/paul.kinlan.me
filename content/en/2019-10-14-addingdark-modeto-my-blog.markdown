---
slug: addingdark-modeto-my-blog
date: 2019-10-14T12:17:17.251Z
title: 'Adding 'dark mode' to my blog'
link: ''
tags: [links]
---

I saw Jeremy Keith's [post about adding dark mode to his blog](https://adactio.com/journal/15941)&nbsp;and it seemed simple, so I decided to give it a whirl.

Here is the [diff of the work](https://github.com/PaulKinlan/paul.kinlan.me/compare/00862927187ef8b36433ee59679cb6367a21793a...main)&nbsp;for all to see.&nbsp;It was surprisingly easy (outside of silly errors on my part). There was a small refactor to support CSS variables and ensuring I have fallback if there's a browser that doesn't support CSS custom properties, but that is about it. I did pretty much the same thing that Jeremy did.

There was no DevTools support in Chrome that let me emulate dark-mode being set ([I hear it's coming](https://bugs.chromium.org/p/chromium/issues/detail?id=1004246)), so I created a simple CSS class that I could add to my HTML element to quickly test it working (as seen below).

```
@media (prefers-color-scheme: dark) {
  html {
    --background-color: rgb(36, 36, 36);
    --text-color: #fefefe;
    --block-quote-before-color: #333;
    --link-color-visited: #7ad857;
    --post-shadow: #333;
  }

  .post.moi img {
  .post.moi a[rel=me] img {
    filter: invert(0.8);
  }
}

html.dark {
  --background-color: rgb(36, 36, 36);
  --text-color: #fefefe;
  --block-quote-before-color: #333;
  --link-color: #1bcba2;
  --link-color-visited: #7ad857;
  --post-shadow: #333;
}

html.dark .post.moi a[rel=me] img {
  filter: invert(0.8);
}

```

### Not dark-mode

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-0.jpeg"></figure>

### dark-mode

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-1.jpeg"></figure>

