const version = "1.1";
const fetchAndCache = request => fetch(request).then(response => {
  return caches.open(version).then(cache => {
    const clone = response.clone();
    cache.put(request, response);
    return clone;
  })
});

// Promise.race is no good to us because it rejects if
// a promise rejects before fulfilling. Let's make a proper
// race function:
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    // make sure promises are all promises
    promises = promises.map(p => Promise.resolve(p));
    // resolve this promise as soon as one resolves
    promises.forEach(p => p.then(resolve));
    // reject if all promises reject
    promises.reduce((a, b) => a.catch(() => b))
      .catch(() => reject(Error("All failed")));
  });
};

self.addEventListener('fetch', function(event) {
  var request = event.request;
  
  if(request.url.indexOf("https://www.google-analytics.com/collect") === 0 ||
     request.url.indexOf("http://www.google-analytics.com/collect") === 0 ) return;
  
  event.respondWith(
    promiseAny([
      caches.match(request),
      fetchAndCache(request)
    ])
  );
});