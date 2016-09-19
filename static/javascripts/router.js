const FetchRouter = function() {
  const _routes = {
    get: [],
    post: []   
  };
  
  this.parseRoute = function(path) {
    this.parseGroups = function(loc) {
      var nameRegexp = new RegExp(":([^/.\\\\]+)", "g"); 
      var newRegexp = "" + loc;
      var groups = {};
      var matches = null;
      var i = 0;

      // Find the places to edit.
      while(matches = nameRegexp.exec(loc)) {
        groups[matches[1]] = i++;
        newRegexp = newRegexp.replace(matches[0], "([^/.\\\\]+)"); 
      }

      newRegexp += "$"; // Only do a full string match

      return { "groups" : groups, "regexp": new RegExp(newRegexp)};
    };
      
    return this.parseGroups(path); 
  };

  var matchRoute = function(url, type) {
    var route = null;
    const filteredType = type.toLowerCase();
    
    if(filteredType in _routes === false) { 
      return ; // Reject
    }

    for(var i = 0; route = _routes[filteredType][i]; i ++) {
      var routeMatch = route.regex.regexp.exec(url);
      if(!!routeMatch == false) continue;
      
      var params = {};
      for(var g in route.regex.groups) {
        var group = route.regex.groups[g];
        params[g] = routeMatch[group + 1];
      }
      
      return route.callback;
    }

    return;
  };

  this.get = function(route, handler) {
    _routes["get"].push({regex: this.parseRoute(route), callback: handler });
  };

  this.post = function(route, handler) {
    _routes["push"].push({regex: this.parseRoute(route), callback: handler });
  };

  this.findRoute = function(url, type) {
    return matchRoute(url, type);
  };
};

const router = new FetchRouter();

self.addEventListener('fetch', function(event) {
  const request = event.request;
  const url = new URL(event.request.url);
  const method = event.request.method;

  const exectuor = router.findRoute(url, method);

  exectuor(event);
});

/*
  router.get('/').then(event => new Response());
*/