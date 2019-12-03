---
slug: adding-dark-mode-to-my-blog
date: 2019-10-14T12:17:17.251Z
title: 'Adding "dark mode" to my blog'
link: ''
tags: [links]
---

Я видел « [post about adding dark mode to his blog](https://adactio.com/journal/15941) Джереми Кейта, и это казалось простым, поэтому я решил [post about adding dark mode to his blog](https://adactio.com/journal/15941) его.

Вот [diff of the work](https://github.com/PaulKinlan/paul.kinlan.me/compare/00862927187ef8b36433ee59679cb6367a21793a...main) для [diff of the work](https://github.com/PaulKinlan/paul.kinlan.me/compare/00862927187ef8b36433ee59679cb6367a21793a...main) . Это было удивительно легко (за исключением глупых ошибок с моей стороны). Был небольшой рефакторинг для поддержки CSS-переменных и обеспечения того, чтобы у меня был запасной вариант, если есть браузер, который не поддерживает пользовательские свойства CSS, но это все. Я сделал почти то же самое, что сделал Джереми.

В Chrome не было поддержки DevTools, которая позволяла мне эмулировать заданный темный режим ( [I hear it's coming](https://bugs.chromium.org/p/chromium/issues/detail?id=1004246) ), поэтому я создал простой класс CSS, который я мог бы добавить в свой HTML-элемент, чтобы быстро проверить его работу (как показано ниже).

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

### Не темный режим

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-0.jpeg"></figure>

### темный режим

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-1.jpeg"></figure>

