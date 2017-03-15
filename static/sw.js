const dataStoreVersion = "1.2.3";
importScripts('/javascripts/router.js?14');
importScripts('/javascripts/sw-runtime-caching.min.js');


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

let staleHandler = new goog.runtimeCaching.StaleWhileRevalidate();

router.get(`${self.location.origin}`, (e) => {
  e.respondWith(staleHandler.handle({event: e}));
},
{urlMatchProperty: "origin"});

/*
  Handle requests to Google Analytics seperately
*/
router.get(/http[s]{0,1}:\/\/www.google-analytics.com/, (e)=>{
  //console.log('Analytics request', e);
}, {urlMatchProperty: "origin"});



router.get(/.*/, e => {
  // this just shows that the origin filter above works and all other requests are handled by this
  //console.log("Foreign Request", e.request)
});

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});