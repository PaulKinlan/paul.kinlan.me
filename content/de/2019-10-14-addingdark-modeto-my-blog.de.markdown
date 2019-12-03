---
slug: adding-dark-mode-to-my-blog
date: 2019-10-14T12:17:17.251Z
title: 'Adding "dark mode" to my blog'
link: ''
tags: [links]
---

Ich habe Jeremy Keith&#39;s [post about adding dark mode to his blog](https://adactio.com/journal/15941) und es schien einfach zu sein, also habe ich beschlossen, es auszuprobieren.

Hier ist das [diff of the work](https://github.com/PaulKinlan/paul.kinlan.me/compare/00862927187ef8b36433ee59679cb6367a21793a...main) für alle zu sehen. Es war überraschend einfach (abgesehen von albernen Fehlern meinerseits). Es gab einen kleinen Refaktor zur Unterstützung von CSS-Variablen und um sicherzustellen, dass ich einen Fallback habe, wenn es einen Browser gibt, der keine benutzerdefinierten CSS-Eigenschaften unterstützt. Ich habe so ziemlich dasselbe gemacht wie Jeremy.

In Chrome gab es keine DevTools-Unterstützung, mit der ich das [I hear it's coming](https://bugs.chromium.org/p/chromium/issues/detail?id=1004246) ( [I hear it's coming](https://bugs.chromium.org/p/chromium/issues/detail?id=1004246) ) emulieren konnte. [I hear it's coming](https://bugs.chromium.org/p/chromium/issues/detail?id=1004246) habe ich eine einfache CSS-Klasse erstellt, die ich meinem HTML-Element hinzufügen konnte, um es schnell zu testen (siehe unten).

```CSS
@media (prefers-color-scheme: dark) {
  html {
    --background-color: rgb(36, 36, 36);
    --text-color: #fefefe;
    --block-quote-before-color: #333;
    --link-color-visited: #7ad857;
    --post-shadow: #333;
  }

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

### Nicht ###

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-0.jpeg"></figure>

###

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-1.jpeg"></figure>

