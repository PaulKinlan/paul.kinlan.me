const dataStoreVersion = "1.2.3";
importScripts('/javascripts/router.js?14');

/*
  Manage all the request for this origin in a Stale-Whilst Revalidate way.
  + fetch from network, stuff in cache.
  + return data from cache, if not in cache fetch.
*/

router.get(`${self.location.origin}`, e => {
  const request = e.request;
  const url = new URL(e.request.url);

  // Always do a fetch, in parrallel.
  var fetchPromise = fetch(request).then(networkResponse => {
    if(networkResponse.ok)
      return caches.open(dataStoreVersion).then(cache => cache.put(request, networkResponse.clone()));
    return;
  }).catch(error => console.log(error));

  e.waitUntil(fetchPromise);
 
  e.respondWith(caches.open(dataStoreVersion).then(cache => {
    return cache.match(request).then(response => {
      // Return the cache or the fetch if not there.
      return response || fetchPromise;
    });
  }));
},{urlMatchProperty: "origin"});

/*
  Handle requests to Google Analytics seperately
*/
router.get(/http[s]*:\/\/www.google-analytics.com/, (e)=>{
  console.log('Analytics request', e);
}, {urlMatchProperty: "origin"});

router.get(/.*/, e => {
  // this just shows that the origin filter above works and all other requests are handled by this
  console.log("Foreign Request", e.request)
});

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});