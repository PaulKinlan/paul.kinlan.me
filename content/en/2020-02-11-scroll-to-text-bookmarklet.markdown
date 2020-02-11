---
slug: scroll-to-text-bookmarklet
date: 2020-02-11T09:51:48.911Z
title: Scroll to text bookmarklet
link: ''
tags: [links]
---

I forgot that [Scroll to Text fragment](https://wicg.github.io/ScrollToTextFragment/) was a thing that is [launching soon in Chrome (81 and not 80 as mentioned in Chrome Status)](<a href="https://chromestatus.com/feature/4733392803332096">https://chromestatus.com/feature/4733392803332096</a>), until I saw this [Tweet](https://twitter.com/stefanjudis/status/1225133056736088065?s=20).

I love this feature, it let's you link to more than just named elements. I wrote up this handy bookmarklet, that will create a link that will include selected text. It's not too complex, although it could be improved a bit.

```
const selectedText = getSelection().toString();
const newUrl = new URL(location);
newUrl.hash = `:~:text=${encodeURIComponent(selectedText)}`;
window.open(newUrl);
```

If you have Chrome 81 then you can drag this &lt;a href="javascript:(function()%7Bconst%20selectedText%20%3D%20getSelection().toString()%3Bconst%20newUrl%20%3D%20new%20URL(location)%3BnewUrl.hash%20%3D%20%60%3A~%3Atext%3D%24%7BencodeURIComponent(selectedText)%7D%60%3Bwindow.open(newUrl)%7D)()"&gt;Share find in page&lt;/a&gt; bookmarklet to your address bar and easily create links that link to content.

<figure><video src="/videos/2020-02-11-scroll-to-text-bookmarklet-0.mp4" alt="findbookmarklet1.mp4" controls></video></figure>

