---
slug: adding-dark-mode-to-my-blog
date: 2019-10-14T12:17:17.251Z
title: 'Adding "dark mode" to my blog'
link: ''
tags: [links]
---

मैंने जेरेमी कीथ के [post about adding dark mode to his blog](https://adactio.com/journal/15941) देखा और यह सरल लग रहा था, इसलिए मैंने इसे एक चक्कर देने का फैसला किया।

यहाँ है [diff of the work](https://github.com/PaulKinlan/paul.kinlan.me/compare/00862927187ef8b36433ee59679cb6367a21793a...main) सभी को देखने के लिए। यह आश्चर्यजनक रूप से आसान था (मेरी ओर से मूर्खतापूर्ण त्रुटियों के बाहर)। सीएसएस चर का समर्थन करने के लिए एक छोटा सा रिफ्लेक्टर था और यह सुनिश्चित करना कि अगर कोई ब्राउज़र है जो सीएसएस कस्टम गुणों का समर्थन नहीं करता है, लेकिन यह इसके बारे में है। मैंने वही काम किया जो जेरेमी ने किया था।

Chrome में कोई DevTools समर्थन नहीं था जो मुझे डार्क-मोड ( [I hear it's coming](https://bugs.chromium.org/p/chromium/issues/detail?id=1004246) ) का अनुकरण करने देता है, इसलिए मैंने एक साधारण सीएसएस क्लास बनाई जिसे मैं अपने HTML एलिमेंट में जोड़कर इसे जल्दी काम करने के लिए जोड़ सकता हूं (जैसा कि नीचे देखा गया है)।

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

### नहीं अंधेरे मोड

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-0.jpeg"></figure>

### अंधेरे मोड

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-1.jpeg"></figure>

