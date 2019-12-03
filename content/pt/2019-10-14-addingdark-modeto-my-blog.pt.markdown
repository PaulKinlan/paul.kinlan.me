---
slug: adding-dark-mode-to-my-blog
date: 2019-10-14T12:17:17.251Z
title: 'Adding "dark mode" to my blog'
link: ''
tags: [links]
---

Eu vi [post about adding dark mode to his blog](https://adactio.com/journal/15941) Jeremy Keith e parecia simples, então decidi dar uma volta.

Aqui está o [diff of the work](https://github.com/PaulKinlan/paul.kinlan.me/compare/00862927187ef8b36433ee59679cb6367a21793a...main) para todos verem. Foi surpreendentemente fácil (fora de erros bobos da minha parte). Havia um pequeno refator para suportar variáveis CSS e garantir que eu tivesse fallback se houver um navegador que não suporte propriedades personalizadas de CSS, mas é isso. Eu fiz praticamente a mesma coisa que Jeremy.

Não havia suporte ao DevTools no Chrome que permitisse imitar o modo escuro sendo definido ( [I hear it's coming](https://bugs.chromium.org/p/chromium/issues/detail?id=1004246) ); portanto, criei uma classe CSS simples que poderia ser adicionada ao meu elemento HTML para testá-lo rapidamente (como mostrado abaixo).

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

### Não no modo escuro

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-0.jpeg"></figure>

### modo escuro

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-1.jpeg"></figure>

