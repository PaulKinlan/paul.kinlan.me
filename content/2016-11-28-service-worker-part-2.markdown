---
date: 2016-11-28 12:20:31+00:00
image_header: /images/caching-strategy.png
slug: my-blogs-service-worker-and-caching-strategy-part-2
summary: In this follow-up post, I've revised my blog's Service Worker and caching
  strategy to address previous issues, particularly the Firefox incompatibility due
  to the use of `waitUntil` and a misunderstanding of `cache.put`. The updated strategy
  now correctly fetches from the network, caches the result, and serves content from
  the cache, falling back to the network request if not found.  The code has also
  been improved for readability and reliability.
tags:
- service worker
- caching
- offline
- firefox
- javascript
- web development
- blog
- performance
title: My blog's Service Worker and Caching Strategy Part 2

---

About 5 months ago I documented my [Service Worker caching strategy](/my-blogs-service-worker-and-caching-strategy/) and it 
was noted that it wouldn't work in Firefox because of my use of `waitUntil`. It
was also noted that, well, my Service Worker didn't actually work. It worked for
me or so I thought, but every so often on a new page you could see it error
and then quickly re-fetch from the network.

I made a number of changes to make the code more readable, however I didn't
solve the actual issue and it turns out my understanding of `cache.put` was
incorrect and instead of returning a promise with the 'putted' value, it returns
a promise with `void` and as such my logic for returning that to the user.

So what does it look like? For each request I

1. Fetch from the network and push the result into the cache
2. Retrieve from the cache, or if the response is not in the cache then wait for
   the network request in 1 to complete and return the response.

```javascript
self.onfetch = function(e) 

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
  }).catch(error => {
    console.log("Fetch Error", error);
    throw error;
  });

  e.waitUntil(fetchPromise);

  const r = caches.open(dataStoreVersion).then(cache => {
    return cache.match(request.clone()).then(response => {
      // Return the cache or the fetch if not there.
      return response || fetchPromise;
    });
  }).catch(error => {
    console.log("Error in SW", error);
    throw error;
  });

  e.respondWith(r);
}
```
Now it all works.  It is on too much different from my previous effort.