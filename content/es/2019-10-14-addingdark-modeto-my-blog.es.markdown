---
slug: adding-dark-mode-to-my-blog
date: 2019-10-14T12:17:17.251Z
title: 'Adding "dark mode" to my blog'
link: ''
tags: [links]
---

Vi las [post about adding dark mode to his blog](https://adactio.com/journal/15941) Jeremy Keith y parecía simple, así que decidí darle una vuelta.

Aquí está el [diff of the work](https://github.com/PaulKinlan/paul.kinlan.me/compare/00862927187ef8b36433ee59679cb6367a21793a...main) para que todos lo vean. Fue sorprendentemente fácil (aparte de errores tontos de mi parte). Hubo un pequeño refactor para admitir variables CSS y garantizar que tenga respaldo si hay un navegador que no admite propiedades personalizadas CSS, pero eso es todo. Hice casi lo mismo que Jeremy hizo.

No había compatibilidad con DevTools en Chrome que me permitiera emular el modo oscuro establecido ( [I hear it's coming](https://bugs.chromium.org/p/chromium/issues/detail?id=1004246) ), por lo que creé una clase CSS simple que podría agregar a mi elemento HTML para probar rápidamente que funciona (como se ve a continuación).

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

### No en modo oscuro

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-0.jpeg"></figure>

### modo oscuro

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-1.jpeg"></figure>

