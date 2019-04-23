---
slug: service-worker-routing
date: 2016-11-28T13:20:31+01:00
title: "Service Worker Routing"
---
Yesterday I posted about an update to my [Service Worker caching
strategy](/my-blogs-service-worker-and-caching-strategy-part-2/). If you look at
my [ServiceWorker](/sw.js) you will see that there is more to it than just 
the fix I had to make for storing data in the `Cache`.

I have also introduced a URL routing framework to simplify my logic in the
service worker when dealing with different kinds of requests. For example, I
don't want to cache requests to Google Analytics or Disquss, and rather than
make my `onfetch` handler a lot more complex, it was easier to be declarative
about the routes that I wanted to manage and then control the logic for those
independently from the other routes.

I based the code off of a client-side URL router I made 6 years ago called
[LeviRoutes](https://github.com/PaulKinlan/leviroutes)(inspired by the reggae
reggae sauce craze at the time). LeviRoutes followed an `express-js` style
format and for me it worked quite well allowing me to share logic between my
client and server (I still say
[IO-Reader](https://github.com/PaulKinlan/io-reader) was the first true
Progressive Web App six years ago watch below ;)

{{< fast-youtube vV85dNeGRhY >}}

I [morphed the LeviRoutes router only slightly](/javascripts/router.js) by
making sure that you as the developer can register routes using `router.get` and
`router.post` for either of those two HTTP request types (it is easy to add more
in) directly inside the Service Worker and I added in functionality to let you
specify what part of the URL you want to match against, for example you could
only have the regex look at the origin part of the URL, or the path, or the
search parameters (query string). I think it is quite flexible.

I will update the LeviRoutes project, but for posterity my current service worker
is below and you can see the different types of interceptions I can do.

```javascript
importScripts('/javascripts/router.js');

/*
  Escape hatch. ABORT ABORT. Any URL with a kill-sw=true at the end of the
  query string.
*/
router.get(/\?kill-sw=true/, function() {
  self.registration.unregister();

  caches.keys().then(cacheKeys => Promise.all(cacheKeys.map(key => caches.delete(key))));
}, {urlMatchProperty: "search"});

/*
  Handle requests to Google Analytics seperately
*/
router.get(/http[s]*:\/\/www.google-analytics.com/, (e)=>{
  console.log('Analytics request', e);
}, {urlMatchProperty: "origin"});

/*
  Manage all the request for this origin in a Stale-Whilst Revalidate way.
  + fetch from network, stuff in cache.
  + return data from cache, if not in cache fetch.
*/
router.get(`${self.location.origin}`, e => {
  const request = e.request;
  const url = new URL(e.request.url);

  // Always do a fetch, in parrallel.
  var fetchPromise = fetch(request.clone()).then(networkResponse => {
    const chain = Promise.resolve(networkResponse.clone());
    if(networkResponse.ok)
      return caches.open(dataStoreVersion)
              .then(cache => {
                cache.put(request, networkResponse);
                return chain;
              });
    return chain;
  });

  e.waitUntil(fetchPromise);

  const r = caches.open(dataStoreVersion).then(cache => {
    return cache.match(request.clone()).then(response => {
      // Return the cache or the fetch if not there.
      return response || fetchPromise;
    });
  });

  e.respondWith(r);
},{urlMatchProperty: "origin"});

/*
 This is a catch-all really just showing a catch-all in action
*/
router.get(/.*/, e => {
  // this just shows that the origin filter above works and all other requests are handled by this
  console.log("Foreign Request", e.request)
});
```
I encourage everyone to think about their Service Worker `onfetch` URL management
in terms of routing like I have done. It makes your life so much easier.

I also encourage you to check out [Service Worker
toolbox](https://github.com/GoogleChrome/sw-toolbox) as it stops you from having
to invent your own router. I chose to go down this route because at the time
[Service Worker toolbox](https://github.com/GoogleChrome/sw-toolbox) wasn't
modular enough for me &mdash; I just needed the router &mdash; and I like
to "NIH to the max" occasionally (if only to flex my brain a little).  

It is great to see that Jeff Posnick is working on making Service Worker Toolbox
more modular and that will allow me just to use the route or just the caching
utils.

Watch Jeff and his plans for sw-toolbox (I recommend it because you can see the
benefits of not going down the path that I chose :) 

{{< fast-youtube FZ9BkDiUQJs >}}