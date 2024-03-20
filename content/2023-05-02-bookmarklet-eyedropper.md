---
slug: eyedropper-bookmarklet
date: "2023-05-02T13:23:56"
title: "Bookmarklet: Eyedropper"
tags:
  - bookmarklet
  - eyedrop
  - fugu
---

I was reading Stefan Judis's awesome "[Web Weekly](https://webweekly.email/)" and in [this weeks post](https://www.stefanjudis.com/blog/web-weekly-100/) he mentioned the `EyeDropper` API in [Chromium Desktop browsers only](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper/open#browser_compatibility) - I totally missed this and because I frequently have to grab color information for slide design I need something quick to hand. Bookmarklets are quick to hand, so I built one for you.

```JavaScript
const e = new EyeDropper();
e.open().then(d => {
  alert(d.sRGBHex);
}).catch(console.error)
```

EyeDropper <— Just drag this to your bookmark bar.

And if you are interested in a Chrome Extension, check [out this post](https://patrickbrosset.com/articles/2021-11-24-how-i-built-an-eye-dropper-browser-extension/) by [Patrick Brosset](https://patrickbrosset.com/resume/).
