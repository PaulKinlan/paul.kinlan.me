---
slug: adding-dark-mode-to-my-blog
date: 2019-10-14T12:17:17.251Z
title: 'Adding "dark mode" to my blog'
link: ''
tags: [links]
---

నేను జెరెమీ కీత్ యొక్క [post about adding dark mode to his blog](https://adactio.com/journal/15941) మరియు ఇది చాలా సరళంగా అనిపించింది, కాబట్టి నేను దానిని ఒక గిరగిరా ఇవ్వాలని నిర్ణయించుకున్నాను.

అందరూ చూడటానికి ఇక్కడ [diff of the work](https://github.com/PaulKinlan/paul.kinlan.me/compare/00862927187ef8b36433ee59679cb6367a21793a...main) . ఇది ఆశ్చర్యకరంగా సులభం (నా వైపు వెర్రి లోపాల వెలుపల). CSS వేరియబుల్స్కు మద్దతు ఇవ్వడానికి ఒక చిన్న రిఫ్యాక్టర్ ఉంది మరియు CSS అనుకూల లక్షణాలకు మద్దతు ఇవ్వని బ్రౌజర్ ఉంటే నాకు ఫాల్‌బ్యాక్ ఉందని నిర్ధారిస్తుంది, కానీ దాని గురించి. జెరెమీ చేసిన అదే పనిని నేను చాలా చక్కగా చేసాను.

డార్క్-మోడ్ సెట్ ( [I hear it's coming](https://bugs.chromium.org/p/chromium/issues/detail?id=1004246) ) ను అనుకరించటానికి Chrome లో DevTools మద్దతు లేదు, కాబట్టి నేను ఒక సాధారణ CSS క్లాస్‌ని సృష్టించాను, అది పని చేయడాన్ని త్వరగా పరీక్షించడానికి నా HTML మూలకానికి జోడించగలను (క్రింద చూసినట్లు).

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

### డార్క్ మోడ్ కాదు

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-0.jpeg"></figure>

### డార్క్ మోడ్

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-1.jpeg"></figure>

