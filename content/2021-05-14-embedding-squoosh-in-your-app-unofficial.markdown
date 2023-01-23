---
slug: embedding-squoosh-in-to-your-app-unofficial
date: 2021-05-14T01:30:29.419Z
title: The unofficial way to embed Squoosh into your web app.
summary: I wanted the functionality of Squoosh, but in my web app. Here's how I did it.
tags: [wasm, web assembly, squoosh, ffmpeg]
---

Earlier this week [I wrote about a tool that I created](/images-are-still-too-hard/) to create an optimal HTML `<picture>` element with an associated set of optimized images. [The app](https://just-gimme-an-img.vercel.app/) is pretty cool (even if I do say so my self).

I think [Squoosh](https://squoosh.app) is an amazingly useful tool in our efforts to improve the optimization of images on the web and make it easier for developers to do the right thing without having to think too much. The Squoosh [team](https://github.com/GoogleChromeLabs/squoosh/graphs/contributors) have done amazing work recently to create a [CLI](https://www.npmjs.com/package/@squoosh/cli) that enables you to easily compress and resize images straight from the command line, this opens up the ability to integrate image optimzations in to your build process on any platform that has the ability to run Web Assembly.

This is all great, but the CLI is not my web app. I really needed an API version of Squoosh.

In the past, I've worked on getting [FFMPEG CLI](/running-ffmpeg-with-wasm-in-a-web-worker/) running inside web apps, so that gave me the idea that it might also be possible to get the Squoosh CLI running in a web page too. Squoosh's CLI had all the options I needed, so if I could get it work as an API I would be very happy.

Squoosh's code is well structured, so it wasn't too hard to find the [code](https://github.com/GoogleChromeLabs/squoosh/tree/dev/cli) that dealt with the CLI and a quick scan through it showeded that there were only a couple of places where it relied on `Node` and so I would have the choice of stripping it out, or polyfilling `Node` API's in the browser.

Thankfully, after a couple of hours hacking (and a sleep), I managed to get it [working](https://github.com/PaulKinlan/squoosh/commit/b8aaa9785ab31c3a850422b170a0b814866ea2d5#diff-14c2529eb4498c5d1ffd6915d05bf58a91bdda796af59f41d480d11c099d0479). I won't go into it too much detail of all the changes, but the summary is:

- The Web Worker code in Node had to be extracted to it's own file.
- WASM Bindings for Web had to be generated because they were for node.
- Replaced all of Node's File handling with Web API's.
- Expose the `run` method as the entry point to the API.

Once it was all built, all I had to do was copy the WASM and JS bindings into my repository and call it as follows:

```JavaScript
import { run } from './lib/squoosh';

// Resize the image to 800x600 and convert to avif
const result = wait run(
  { 
    files: [this._file], 
    { 
      "resize": { "width": 800, "height": 600 }, 
      "avif": "auto" 
    }
  });
```

This solution worked well for my demo app, but it's not official and is already lagging behind Squoosh's main-line branch. I think that a dedicated, browser-friendly API (rather than a `run` method) will open up a lot of opportunities, for example it would allow: any CMS to integrate image compression as soon as the client tries to upload an image; Tools such as Lighthouse and Page Speed insights could integrate it so the instant they say you are doing your images wrong, they also give you the optimal solution; and an ecosystem of image optimizers could be built directly into web apps.

If you want to integrate Squoosh in to your web app, then go and ping the team and let them know they need a Browser-side API. Tell them I sent you!
