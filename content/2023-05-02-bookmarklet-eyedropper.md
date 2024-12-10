---
date: '2023-05-02T13:23:56'
slug: eyedropper-bookmarklet
summary: This blog post introduces a bookmarklet utilizing the EyeDropper API for
  quickly grabbing color information in Chromium-based desktop browsers.  The bookmarklet
  simplifies color selection by opening the eyedropper tool and returning the chosen
  color's sRGBHex value in an alert box.  A link to a related blog post about creating
  a similar Chrome extension is also included.
tags:
- bookmarklet
- eyedropper
- color picker
- EyeDropper API
- color
- javascript
- chromium
- browser
- web development
title: 'Bookmarklet: Eyedropper'

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
