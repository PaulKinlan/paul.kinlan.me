---
slug: images-are-still-too-hard
date: 2021-05-10T01:30:29.419Z
title: Putting an image on the page is easy, until it's not
summary: It should be easier to put an image on the page.
draft: true
tags: [drafts]
---

I was reading Jake's analysis of [F1 web sites](https://jakearchibald.com/2021/f1-perf-part-8/) and it was amazing (but surprising to me) that same issues keep on repeating.

* Images are not optimized.
* JS is blocking, and not optimized (or used in many cases).
* Fonts are blocking.

Coincidentally around the same time, Ben Galbraith mentioned too me that he was looking for the canonical guidance on how to put an image on the page. Admittedly, I scoffed "It's just an img element innit?", but I bit and had a look.

I don't think I am out of touch with web development, but I certainly missed a trick to feel the pain of the ecosystem with images. On one hand Google is telling you to meet your Core Web Vitals, but on the other hand the tooling is an absolute massive pain.

[Squoosh](https://squoosh.app) helps you compress and validate that an image will look good; our guides on [web.dev](https://web.dev/tags/images/) give you some concrete advice, but where do you start?

The modern image has gone from a simple `<img>` element, to requiring the author to think about the size of the image (in bytes); the size of the image (in resolution) for the target density; The codec being used (remembering the days of JPEG unless you want transparency) because support isn't even across the web; should the image be lazy loaded and pre-fetched?

It's complex. Very complex. Which is why I think people keep it simple. It's not clear how all of the above work benefits the user.

I can see why one recommendation is to "just use a CDN". I don't think you should have to buy a book just to put an image on the page, I also don't want to complain without helping to fix the situation.

So, during some recent downtime I built a simple tool that can help you for a large number of your image use-cases.

https://just-gimme-an-img.vercel.app/

<picture>
  <source 
    type="image/avif"
    sizes="100vw"
    srcset="/images/blog/Screenshot%202021-05-10%20at%2011.34.04-3016w.avif 3016w, 
		/images/blog/Screenshot%202021-05-10%20at%2011.34.04-1508w.avif 1508w, 
		/images/blog/Screenshot%202021-05-10%20at%2011.34.04-1006w.avif 1006w, 
		/images/blog/Screenshot%202021-05-10%20at%2011.34.04-754w.avif 754w, 
		/images/blog/Screenshot%202021-05-10%20at%2011.34.04-604w.avif 604w, 
		/images/blog/Screenshot%202021-05-10%20at%2011.34.04-503w.avif 503w, 
		/images/blog/Screenshot%202021-05-10%20at%2011.34.04-431w.avif 431w, 
		/images/blog/Screenshot%202021-05-10%20at%2011.34.04-377w.avif 377w, 
		/images/blog/Screenshot%202021-05-10%20at%2011.34.04-336w.avif 336w, 
		/images/blog/Screenshot%202021-05-10%20at%2011.34.04-302w.avif 302w">
  <img 
    alt="A screen shot of the tool"
    src="/images/blog/Screenshot%202021-05-10%20at%2011.34.04.png" 
    srcset="/images/blog/Screenshot%202021-05-10%20at%2011.34.04-3016w.png 3016w, 
		/images/blog/Screenshot%202021-05-10%20at%2011.34.04-1508w.png 1508w, 
		/images/blog/Screenshot%202021-05-10%20at%2011.34.04-1006w.png 1006w, 
		/images/blog/Screenshot%202021-05-10%20at%2011.34.04-754w.png 754w, 
		/images/blog/Screenshot%202021-05-10%20at%2011.34.04-604w.png 604w, 
		/images/blog/Screenshot%202021-05-10%20at%2011.34.04-503w.png 503w, 
		/images/blog/Screenshot%202021-05-10%20at%2011.34.04-431w.png 431w, 
		/images/blog/Screenshot%202021-05-10%20at%2011.34.04-377w.png 377w, 
		/images/blog/Screenshot%202021-05-10%20at%2011.34.04-336w.png 336w, 
		/images/blog/Screenshot%202021-05-10%20at%2011.34.04-302w.png 302w"
    sizes="100vw"
    loading="lazy"
    decoding="async"
    height="2104"
    width="3016"
    style="content-visibility: auto; max-width: 100%; height: auto;"
  />
</picture>

The [tool](https://just-gimme-an-img.vercel.app/) is not too complex. You drop an image on the page and it will:

* Generate HTML for you to use
* It will optimize your source image in the current format
* It will create an AVIF version of the image.
* For the Input and AVIF versions it will create a number of various sized images that the browser will pick based on the resolution.
* and it will do it all client-side.

Why this strategy?

I wanted to keep it relatively simple. A lot of images that we have trouble optimizing are the hero images on a page, so assuming 100vw makes some sense.

AVIF seems amazing (the source image for this blog went from 800KB to 52 KB), yet it's not uniformly supported across the web. Chrome's support is good, so creating this as a preferred `<source>` and then falling back to your optimized input image (e.g, PNG or JPG).

Setting the `height` and `width` is required for lazy loading and to ensure that we can `lazyload` and to prevent [layout shifts](https://web.dev/cls/) if the.

How was it made?

There's nothing amazingly special, at one point I was going to release it without the client-side image compression, but I wanted to see if it was possible to do everything with web tech.

I'll do a bigger blog post at some point, but the TL;DR is that I managed to work out how to integrate [squoosh's CLI](https://www.npmjs.com/package/@squoosh/cli) into an [API of sorts](https://github.com/PaulKinlan/squoosh/tree/kinlan-api/api).

I'm actually very keen to see the Squoosh team work on an web-side embdeding API because
I think it would be amazing if CMS's such as Blogger or Wordpress just quickly let a person
not have to worry about optimizing the image at all.