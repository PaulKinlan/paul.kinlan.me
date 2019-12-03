---
slug: adding-dark-mode-to-my-blog
date: 2019-10-14T12:17:17.251Z
title: 'Adding "dark mode" to my blog'
link: ''
tags: [links]
---

ਮੈਂ ਜੇਰੇਮੀ ਕੀਥ ਦਾ [post about adding dark mode to his blog](https://adactio.com/journal/15941) ਵੇਖਿਆ ਅਤੇ ਇਹ ਸਧਾਰਣ ਜਾਪਦਾ ਸੀ, ਇਸ ਲਈ ਮੈਂ ਇਸ ਨੂੰ ਇੱਕ ਚੱਕਰ ਦੇਣ ਦਾ ਫੈਸਲਾ ਕੀਤਾ.

ਸਾਰਿਆਂ ਨੂੰ ਦੇਖਣ ਲਈ ਇੱਥੇ [diff of the work](https://github.com/PaulKinlan/paul.kinlan.me/compare/00862927187ef8b36433ee59679cb6367a21793a...main) ਹੈ. ਇਹ ਹੈਰਾਨੀ ਦੀ ਗੱਲ ਹੈ ਅਸਾਨ (ਮੇਰੇ ਹਿੱਸੇ ਵਿੱਚ ਬੇਵਕੂਫ ਗਲਤੀਆਂ ਤੋਂ ਬਾਹਰ). ਸੀਐਸਐਸ ਵੇਰੀਏਬਲ ਦਾ ਸਮਰਥਨ ਕਰਨ ਲਈ ਇਕ ਛੋਟਾ ਰਿਫੈਕਟਰ ਸੀ ਅਤੇ ਇਹ ਸੁਨਿਸ਼ਚਿਤ ਕਰਨਾ ਮੇਰੇ ਕੋਲ ਫਾਲਬੈਕ ਹੈ ਜੇ ਕੋਈ ਬ੍ਰਾ browserਜ਼ਰ ਹੈ ਜੋ CSS ਕਸਟਮ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਦਾ ਸਮਰਥਨ ਨਹੀਂ ਕਰਦਾ ਹੈ, ਪਰ ਇਹ ਇਸ ਬਾਰੇ ਹੈ. ਮੈਂ ਉਹੀ ਕੰਮ ਕੀਤਾ ਜੋ ਜੈਰੇਮੀ ਨੇ ਕੀਤਾ ਸੀ.

ਕਰੋਮ ਵਿੱਚ ਕੋਈ ਡਿਵਟੂਲਸ ਸਮਰਥਨ ਨਹੀਂ ਸੀ ਜੋ ਮੈਨੂੰ ਡਾਰਕ-ਮੋਡ ਸੈਟ ਹੋਣ ( [I hear it's coming](https://bugs.chromium.org/p/chromium/issues/detail?id=1004246) 0) ਦੀ ਨਕਲ ਕਰਨ ਦਿੰਦਾ ਹੈ, ਇਸਲਈ ਮੈਂ ਇੱਕ ਸਧਾਰਣ CSS ਕਲਾਸ ਬਣਾਇਆ ਹੈ ਜੋ ਮੈਂ ਇਸਦਾ ਕੰਮ ਕਰਨ ਦੀ ਤੇਜ਼ੀ ਨਾਲ ਜਾਂਚ ਕਰਨ ਲਈ ਆਪਣੇ HTML ਐਲੀਮੈਂਟ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰ ਸਕਦਾ ਹਾਂ (ਜਿਵੇਂ ਕਿ ਹੇਠਾਂ ਦੱਸਿਆ ਗਿਆ ਹੈ).

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

### ਡਾਰਕ-ਮੋਡ ਨਹੀਂ ਹੈ

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-0.jpeg"></figure>

### ਡਾਰਕ-ਮੋਡ

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-1.jpeg"></figure>

