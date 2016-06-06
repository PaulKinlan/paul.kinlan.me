const version = "1.2.3";

self.addEventListener('fetch', function(event) {
  var request = event.request;
  var url = new URL(event.request.url)
  
  if(url.origin !== location.origin) return;
 
  event.respondWith(
   caches.open(version).then(cache => {
      return cache.match(request).then(response => {
        var fetchPromise = fetch(request).then(networkResponse => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
        // We need to ensure that the event doesn't complete until we know we have fetched the data
        event.waitUntil(fetchPromise);
        
        return response || fetchPromise;
      })
    })
  );
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