
self.addEventListener("fetch", function(event) {
  var requestURL = new URL(event.request.url);
  
  if (requestURL.origin == location.origin) {
    var dm = 0;
    var navType = "unknown";
    
    if(navigator.connection && navigator.connection.downlinkMax !== false) {
      dm = navigator.connection.downlinkMax;
    }
    
    if(navigator.connection && navigator.connection.type !== false) {
      navType = navigator.connection.type;
    }
    
    event.respondWith(
      fetch(event.request.url, {
        headers: { 
          'MD': dm,
          'Network-Type': navType
        }
      })
    );
  }
});