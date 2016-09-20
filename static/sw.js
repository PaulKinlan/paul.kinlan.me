const version = "1.2.3";
importScripts('/javascripts/router.js?13');

router.get(/http[s]*:\/\/www.google-analytics.com/, (e)=>{
  console.log('Analytics request', e);
}, {urlMatchProperty: "origin"});

router.get(/\/.*/, e => {
  const request = e.request;
  const url = new URL(e.request.url);
  
  if(url.origin !== location.origin) return;

  // Always do a fetch, in parrallel.
  var fetchPromise = fetch(request).then(networkResponse => {
    if(networkResponse.ok)
      return caches.open(version).then(cache => cache.put(request, networkResponse.clone()));
    return;
  }).catch(error => console.log(error));

  e.waitUntil(fetchPromise);
 
  e.respondWith(caches.open(version).then(cache => {
    return cache.match(request).then(response => {
      // Return the cache or the fetch if not there.
       return response || fetchPromise;
    });
  }));
}, {

});

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});