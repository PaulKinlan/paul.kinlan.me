const dataStoreVersion = "1.2.3";
importScripts('/javascripts/router.js?14');


/*
  Escape hatch. ABORT ABORT. Any URL with a kill-sw=true at the end of the query string.
*/
router.get(/\?kill-sw=true/, function() {
  self.registration.unregister();

  caches.keys().then(cacheKeys => Promise.all(cacheKeys.map(key => caches.delete(key))));
}, {urlMatchProperty: "search"});

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

  console.log(r)
  e.respondWith(r);
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