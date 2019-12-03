---
slug: adding-dark-mode-to-my-blog
date: 2019-10-14T12:17:17.251Z
title: 'Adding "dark mode" to my blog'
link: ''
tags: [links]
---

J&#39;ai vu les [post about adding dark mode to his blog](https://adactio.com/journal/15941) Jeremy Keith et cela semblait simple, alors j&#39;ai décidé de le faire tourner.

Voici le [diff of the work](https://github.com/PaulKinlan/paul.kinlan.me/compare/00862927187ef8b36433ee59679cb6367a21793a...main) la [diff of the work](https://github.com/PaulKinlan/paul.kinlan.me/compare/00862927187ef8b36433ee59679cb6367a21793a...main) de tous. C&#39;était étonnamment facile (en dehors des erreurs stupides de ma part). Il y avait un petit refactor pour prendre en charge les variables CSS et assurer ma solution de repli s&#39;il y avait un navigateur qui ne prend pas en charge les propriétés personnalisées CSS, mais c&#39;est à peu près tout. J&#39;ai fait à peu près la même chose que Jeremy.

Chrome ne prenant pas en charge les outils DevTools qui me permettaient d&#39;émuler le mode sombre ( [I hear it's coming](https://bugs.chromium.org/p/chromium/issues/detail?id=1004246) ), j&#39;ai donc créé une classe CSS simple que je pouvais ajouter à mon élément HTML pour le tester rapidement (voir ci-dessous).

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

### pas sombre

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-0.jpeg"></figure>

### mode sombre

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-1.jpeg"></figure>

