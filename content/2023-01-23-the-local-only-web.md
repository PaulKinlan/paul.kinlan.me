---
slug: the-local-only-web
date: '2023-01-26T11:23:59'
title: The local-only web
tags:
- file-system
---

I was very happy to do a keynote session for the Tokyo and New York Google Developer Groups. I love doing talks that are centred around "The web in 202x" and these where no different.

The New York keynote was a little different to the event in Tokyo because I had an extra 15 minutes to talk, and I like talking. One area that I got to spend more time on was using talking about areas that I am personally excited in 2023 and beyond.

I think we are at an interesting time with a number of new primitives arriving (soon) across browsers - WebGPU & WASM open up a lot of opportunities for new experiences that we never thought possible, from on-device inference to shipping Photoshop. One feature that isn't as visible is the [File System API.](https://developer.chrome.com/articles/file-system-access/)

For me, the File System API is another game changing primitive. At the simplest level it gives developers file-system semantics in their web apps, and thus quite a lot easier to reason with than, say IndexedDB. But look a little closer, it allows us to request access to a file or folder that is outside of the browser's traditional sandbox.

It's dead powerful.

I am an avid user of [Logseq](https://logseq.com/), a tool that helps me organize my day and thoughts. It aligns well with my work style and brain. The [journal](/journal/) section of my site has notes that I collect (when I get the time). When Logseq was launched one of the team's stated goals was to ensure that your data is kept private and that meant storing it locally on device - very useful in a corporate context. Not only is it on-device, when using Chrome the data is stored outside of the browser's sandbox using the File System API!

![Screenshot 2023-01-18 at 15.07.05.png](/images/Screenshot%202023-01-18%20at%2015.07.05.png)

While there are echos of [TiddlyWiki](https://tiddlywiki.com/) ringing in my ears, by using the File System API for out-of-sandbox storage logseq has pioneered a fundamentally new model and I think it potentially changes the way we think about controlling data inside web apps.

This is awesome, but is it possible to build a site that is truly 'local-only'? You would need to provide some guarantees that data couldn't be exfiltrated out of the browser. Right?

CSP can help somewhat here, you could prevent scripts from sending data back to 3rd parties with `connect-src self;` which limits requests to your current origin, and an even stricter policy of `connect-src 'none'` would mean that _all_ requests via `fetch`, `XMLHttpRequest` either using `GET`, `PUT`, `POST` etc would be prevented. Combine this with a `form-action 'none'` and in theory it should be hard to share data outside of the browser...

Realistically, I'm not sure this is feasible for many sites or applications right now. Many sites need to incrementally load their JS, or images etc, and each time it could would be possible to beacon back some data via a query string, while a strict `script-src` policy helps, as a developer you are going to have a hard time delivering and updating your site.

Additionally, the File System API is only available in Chrome *and* it has some limitations: you have to regrant access to the folder on refresh (thanks for the reminder Jed).

Finally, browsers do not offer any affordances to show that your data inside your site or app is truly local. There is no "https certificate" equivalent for a local-only site, so a person would be left to trust that the developer isn't beaconing any data back to their site.

There's a long way to go before this is a practical reality, but it's interesting none the less and is an area of the platform that I think could do with a lot more exploration.
