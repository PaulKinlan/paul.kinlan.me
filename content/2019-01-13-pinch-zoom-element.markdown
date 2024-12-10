---
date: 2019-01-13 17:21:19.288000+00:00
link: https://www.webcomponents.org/element/pinch-zoom-element
slug: pinch-zoom-element
summary: I've just added the pinch-zoom-element web component to my photography blog.  It's
  a tiny (~3kb), dependency-free custom element that allows for easy pinch-zooming
  on any HTML element.  Check out the implementation on my blog (touch-enabled device/trackpad
  needed for testing) and see how simple it is to integrate!  This element was crucial
  for the Squoosh app and perfectly exemplifies the power of web components for clean,
  reusable UI. I hope to see wider adoption of elements like these, especially for
  common use-cases like image zooming on e-commerce sites.
tags:
- web components
- pinch-zoom
- custom element
- javascript
- ui
- ux
- squoosh
- photography
- blog
- open source
title: pinch-zoom-element

---
Jake and the team built this rather awesome custom element for managing pinch zooming on any set of HTML outside of the browser's own pinch-zoom dynamics (think mobile viewport zooming). The element was one of the central components that we needed for the [squoosh](https://squoosh.app/) app that we built and released at Chrome Dev Summit (... I say 'released at Chrome Dev Summit' - Jake was showing it to everyone at the China Google Developer Day even though the rest of the team were under embargo ;) ... )

> install: `npm install --save-dev pinch-zoom-element`
> 
> ```HTML
> <pinch-zoom>
>   <h1>Hello!</h1>
> </pinch-zoom>
> ```

[Read full post](https://www.webcomponents.org/element/pinch-zoom-element).

I just added it to my blog (took just a couple of minutes), you can check it out on my '[life](https://paul.kinlan.me/life/img_20170711_063830/)' section where I share photos that I have taken. If you are on a touch-enabled device you can quickly pinch-zoom on the element, if you are using a track-pad that can handle multiple finger inputs that works too.

This element is a great example of why I love web components as a model for creating user-interface components. The `pinch-zoom` element is just under 3kb on the wire (uncompressed) and minimal dependencies for building and it just does one job exceptionally well, without tying any custom application-level logic that would make it hard to use (I have some thoughts on UI logic vs App logic components that I will share based on my learning's from the Squoosh app).

I would love to see elements like these get more awareness and usage, for example I could imagine that this element could replace or standardise the image zoom functionality that you see on many commerce sites and forever take away that pain from developers.
