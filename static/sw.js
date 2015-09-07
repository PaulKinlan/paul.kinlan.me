
self.addEventListener("fetch", function(event) {
  var requestURL = new URL(event.request.url);
  
  if (requestURL.origin == location.origin) {
    // append the MD header, set value to NetInfo's downlinkMax:
    // http://w3c.github.io/netinfo/#downlinkmax-attribute
    event.respondWith(
      fetch(event.request.url, {
        headers: { 
          'MD': navigator.connection.downlinkMax,
          'Network-Type': navigator.connection.type
        }
      })
    );
  }
});