---
slug: eyedropper-bookmarklet
date: '2023-05-02T13:23:56'
title: 'Bookmarklet: Eyedropper'
published: false
tags:
- bookmarklet
- eyedrop
- fugu
draft: false
---

I was reading Stefan Judis's awesome "[Web Weekly](https://webweekly.email/)" and in [this weeks post](https://www.stefanjudis.com/blog/web-weekly-100/) he mentioned the `[EyeDropper](https://wicg.github.io/eyedropper-api/#dom-eyedropper-open)` API in [Chromium Desktop browsers only](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper/open#browser_compatibility) - I totally missed this and because I frequently have to grab color information for slide design I need something quick to hand. Bookmarklets are quick to hand, so I built one for you.

```JavaScript  
const e = new EyeDropper();
e.open().then(d => {
  alert(d.sRGBHex);
}).catch(console.error)
```

<a href="javascript:(function()%7Bconst%20e%20%3D%20new%20EyeDropper()%3B%0Ae.open().then(d%20%3D%3E%20%7B%0A%20%20alert(d.sRGBHex)%3B%0A%7D).catch(console.error)%7D)()%3B">EyeDropper</a> &lt;&mdash; Just drag this to your bookmark bar.