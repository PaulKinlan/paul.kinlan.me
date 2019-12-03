---
slug: adding-dark-mode-to-my-blog
date: 2019-10-14T12:17:17.251Z
title: 'Adding "dark mode" to my blog'
link: ''
tags: [links]
---

Saya melihat [post about adding dark mode to his blog](https://adactio.com/journal/15941) Jeremy Keith dan itu tampak sederhana, jadi saya memutuskan untuk berputar.

Ini adalah [diff of the work](https://github.com/PaulKinlan/paul.kinlan.me/compare/00862927187ef8b36433ee59679cb6367a21793a...main) untuk dilihat semua orang. Ternyata sangat mudah (di luar kesalahan konyol di pihak saya). Ada refactor kecil untuk mendukung variabel CSS dan memastikan saya memiliki mundur jika ada browser yang tidak mendukung properti kustom CSS, tapi itu saja. Saya melakukan hal yang hampir sama dengan yang dilakukan Jeremy.

Tidak ada dukungan DevTools di Chrome yang memungkinkan saya meniru mode gelap yang ditetapkan ( [I hear it's coming](https://bugs.chromium.org/p/chromium/issues/detail?id=1004246) ), jadi saya membuat kelas CSS sederhana yang dapat saya tambahkan ke elemen HTML saya untuk mengujinya dengan cepat (seperti terlihat di bawah).

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

### Bukan mode gelap

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-0.jpeg"></figure>

### mode gelap

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-1.jpeg"></figure>

