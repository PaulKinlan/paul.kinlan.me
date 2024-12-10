---
date: 2016-06-15 13:20:32+00:00
image_header: /images/caching-strategy.png
slug: my-blogs-service-worker-and-caching-strategy
summary: This blog post discusses the implementation of a Service Worker for my blog,
  with a focus on the caching strategy.  I've chosen a \"Stale While Revalidate\"
  approach, which prioritizes speed and resilience.  The Service Worker intercepts
  network requests and serves cached content if available, while simultaneously fetching
  updated content in the background. This ensures the latest version is available
  after one refresh.  The post also details the requirements considered when choosing
  this strategy, including development simplicity and compatibility with the existing
  hosting setup (Hugo and NGINX).  The provided JavaScript code snippet demonstrates
  the Service Worker implementation.
tags:
- Service Workers
- Caching Strategies
- Offline
- Stale While Revalidate
- Performance
- Resilience
- Blog
- Hugo
- NGINX
- JavaScript
title: My blog's Service Worker and Caching Strategy

---

Service Worker gives you control. Service Worker offers me as a developer
great power and flexibility when creating sites and managing how I can
make them fast and resilient to network issues.

Because of the flexibility that the Service Worker API offers in terms of
control over the network there are a lot of choices that you have to make
when managing and this could be daunting the first time that you start to play
with the API.

If you want to get an overview of the many caching strategies that you can take
then I encourage you to check out the [Offline cookbook](https://jakearchibald.com/2014/offline-cookbook/)
by my friend and colleague Jake Archibald.

The question is, what strategy should you take for creating a fast loading
and resilient static content site like this Blog?  Well that is for you to decide. A 
strategy that works well for me is _Stale While re-validate_.

I chose this strategy by first setting out some requirements for how I would
like it to work.

1. The development cycle should be simple and not annoy me, at most two refreshes of a 
   page before I could see the content
2. It should **not** require a re-architecure of my build or hosting system
   * I am quite happy using Hugo and a simple NGINX static host.
3. I should not need any in-page JavaScript to have readers read the content
4. I currently don't care about proactively caching content for people to read so I don't
   need any tooling for that... yet.

The "__Stale While re-validate__" strategy works for me because it will always serve the 
content that is cached, but at the same time will proactively fetch fresh content from the
network and update the cache with that.  The side effect of this is that updates are always
one refresh away from being the latest, but I am happy with this trade-off.

The Service Worker below gives me that control and meets the requirements I need.

I have no install step because I am not actively caching or installing an 
"App Shell" and all of my pages rely on all the same core structural assets.  That means
if one page is requested and goes through the service worker then I have all I need - __Note: I might 
change this in the future to cache the content on first page load__

When the Service Worker intercepts the network request it will check the data from the cache,
if in the cache it will respond with that to the browser but also start a fetch to the network.  If it
is not in the cache then it will just fetch the contents from the network.

It works well for me and ensures that I have a fast and resilient site.

```javascript
const version = "1.2.3";

self.addEventListener('fetch', function(event) {
  const request = event.request;
  const url = new URL(event.request.url)
  
  // Don't cache anything that is not on this origin.
  if(url.origin !== location.origin) return;
 
  event.respondWith(
   caches.open(version).then(cache => {
      return cache.match(request).then(response => {
        var fetchPromise = fetch(request).then(networkResponse => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
        // We need to ensure that the event doesn't complete until we 
        // know we have fetched the data
        event.waitUntil(fetchPromise);
        
        // Return the response from cache or wait for network.
        return response || fetchPromise;
      })
    })
  );
});
```