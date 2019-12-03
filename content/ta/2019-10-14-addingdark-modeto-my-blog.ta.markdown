---
slug: adding-dark-mode-to-my-blog
date: 2019-10-14T12:17:17.251Z
title: 'Adding "dark mode" to my blog'
link: ''
tags: [links]
---

நான் ஜெர்மி கீத்தின் [post about adding dark mode to his blog](https://adactio.com/journal/15941) பார்த்தேன், அது எளிமையானதாகத் தோன்றியது, எனவே நான் அதை ஒரு [post about adding dark mode to his blog](https://adactio.com/journal/15941) கொடுக்க முடிவு செய்தேன்.

அனைவருக்கும் பார்க்க இங்கே [diff of the work](https://github.com/PaulKinlan/paul.kinlan.me/compare/00862927187ef8b36433ee59679cb6367a21793a...main) உள்ளது. இது வியக்கத்தக்க எளிதானது (என் பங்கில் வேடிக்கையான பிழைகளுக்கு வெளியே). CSS மாறிகளை ஆதரிக்க ஒரு சிறிய மறுசீரமைப்பு இருந்தது மற்றும் CSS தனிப்பயன் பண்புகளை ஆதரிக்காத உலாவி இருந்தால் எனக்கு குறைவு இருப்பதை உறுதிசெய்கிறது, ஆனால் அது பற்றியது. ஜெர்மி செய்ததைப் போலவே நானும் செய்தேன்.

Chrome இல் DevTools ஆதரவு எதுவும் இல்லை, அது இருண்ட-பயன்முறையை அமைக்க ( [I hear it's coming](https://bugs.chromium.org/p/chromium/issues/detail?id=1004246) ) பின்பற்ற அனுமதிக்கிறது, எனவே நான் ஒரு எளிய CSS வகுப்பை உருவாக்கினேன், அது எனது HTML உறுப்புடன் விரைவாகச் செயல்படுவதைச் சோதிக்க (கீழே காணப்படுவது போல்) சேர்க்கலாம்.

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

### இருண்ட பயன்முறை அல்ல

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-0.jpeg"></figure>

### இருண்ட பயன்முறை

<figure><img src="/images/2019-10-14-addingdark-modeto-my-blog-1.jpeg"></figure>

