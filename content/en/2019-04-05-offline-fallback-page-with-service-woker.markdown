---
slug: offline-fallback-page-with-service-woker
date: 2019-04-05T18:17:22.207Z
title: 'Offline fallback page with service woker'
link: 'https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/index.html:6:9'
tags: [links, pwa, offline]
---
Years ago, I did some research into how native applications responded to a lack of network connectivity. Whilst I've lost the link to the analysis (I could swear it was on Google+), the overarching narrative was that many native applications are inextricably tied to the internet that they just straight up refuse to function. Sounds like a lot of web apps, the thing that set them apart from the web though is that the experience was still 'on-brand', Bart Simpson would tell you that you need to be online (for example), and yet for the vast majority of web experiences you get a 'Dino' (see chrome://dino).

We've been working on Service Worker for a long time now, and whilst we are seeing more and more sites have pages controlled by a Service Worker, the vast majority of sites don't even have a basic fallback experience when the network is not available.

I asked my good chum Jake if we have any guindance on how to build a generic fall-back page on the assumption that you don't want to create an entirely offline-first experience, and within 10 minutes he had created it. [Check it out](https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/sw.js:6:9).

For brevity, I have pasted the code in below because it is only about 20 lines long. It caches the offline assets, and then for every fetch that is a 'navigation' fetch it will see if it errors (because of the network) and then render the offline page in place of the original content.

```<br>addEventListener('install', (event) =&gt; {

  event.waitUntil(async function() {

    const cache = await caches.open('static-v1');

    await cache.addAll(['offline.html', 'styles.css']);

  }());

});

addEventListener('fetch', (event) =&gt; {

  const { request } = event;

  // Always bypass for range requests, due to browser bugs

  if (request.headers.has('range')) return;

  event.respondWith(async function() {

    // Try to get from the cache:

    const cachedResponse = await caches.match(request);

    if (cachedResponse) return cachedResponse;

    try {

      // Otherwise, get from the network

      return await fetch(request);

    } catch (err) {

      // If this was a navigation, show the offline page:

      if (request.mode === 'navigate') {

        return caches.match('offline.html');

      }

      // Otherwise throw

      throw err;

    }

  }());

});<br>```

That is all. When the user is online they will see the default experience.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-woker.jpeg"></figure>

And when the user is offline, they will get the fallback page.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-woker.jpeg"></figure>

I find this simple script incredibly powerful, and yes, whilst it can still be improved, I do believe that even just a simple change in the way that we speak to our users when there is an issue with the network has the ability to fundamentally improve the perception of the web for users all across the globe.


