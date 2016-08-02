const version = "1.2.3";

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  const request = event.request;
  const url = new URL(event.request.url);
  
  if(url.origin !== location.origin) return;

  // Always do a fetch, in parrallel.
  var fetchPromise = fetch(request).then(networkResponse => {
      return caches.open(version).then(cache => cache.put(request, networkResponse.clone()));
  });

  event.waitUntil(fetchPromise);
 
  event.respondWith(caches.open(version).then(cache => {
    return cache.match(request).then(response => {
      // Return the cache or the fetch if not there.
       return response || fetchPromise;
    });
  }));
});

self.addEventListener("push", e => {
   let options = { 
       body: e.data.json().message,
       icon: '/src/pauls-ace-pic.png',
       data: { primaryKey: 1, arrival: Date.now() },
       vibrate: [100, 50, 100],
       actions: [ 
         {action: 'explore', title: 'Explore this new world', icon: '/path/to/explore.png'},
         {action: 'getmeoutofhere', title: 'Eject Eject', icon: '/path/to/eject.png'},
       ]
   };
   
   e.waitUntil(self.registration.showNotification('Hello World', options));

});