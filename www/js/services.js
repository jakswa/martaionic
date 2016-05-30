angular.module('starter.services', [])

.factory('Arrivals', function ArrivalService($http, stationLocations) {
  var events = ['arrivalsChanged', 'apiError'];
  var subscribers = {
    arrivalsChanged: [],
    apiError: []
  };
  var _arrivals = [];
  var _req = null;
  var timer;

  var loadArrivals = function() {
    clearInterval(timer);
    var req = $http.get("http://marta-api.herokuapp.com/arrivals?" + (new Date()).getTime());
    _req = req.then(function(resp) {
      _arrivals = resp.data;
      for (var i = 0; i < subscribers.arrivalsChanged.length; i++) {
        subscribers.arrivalsChanged[i].$emit('arrivalsChanged', _arrivals);
      }
    }, function(resp) {
      for (var i = 0; i < subscribers.arrivalsChanged.length; i++) {
        subscribers.apiError[i].$emit('apiError', resp);
      }
    }).finally(function() {
      timer = setTimeout(loadArrivals, 10.5 * 1000);
    });
    return req;
  };
  loadArrivals();

  return {
    refresh: loadArrivals,
    subscribe: function(eventName, scope) {
      if (events.indexOf(eventName) == -1) {
        throw "Arrivals: Woops. '" + eventName + "' is not a valid subscription event.";
      }

      subscribers[eventName].push(scope);
      scope.$on('$destroy', function() {
        var subs = subscribers[eventName];
        subs.splice(subs.indexOf(scope), 1);
      });
    },
    all: function() {
      return _arrivals;
    },
    by: function(attr, value) {
      var res = [];
      for(var i = 0; i < _arrivals.length; i++) {
        if (_arrivals[i][attr] == value) {
          res.push(_arrivals[i]);
        }
      }
      return res;
    },

    // for use on dashboard, showing next arrivals
    latestByStation: function() {
      var res = {};
      var sortedArrivals = _arrivals.slice().sort(function(a,b) {
        if (a.station == b.station) {
          return a.waiting_seconds < b.waiting_seconds ? -1 : 1;
        }
        return a.station < b.station ? -1 : 1;
      });

      for (var i = 0; i < sortedArrivals.length; i++) {
        // don't need station on the end of all these names
        var station = sortedArrivals[i].station.replace(/ station$/, '');
        var dir = sortedArrivals[i].direction;
        if (!res[station]) {
          res[station] = {};
        }
        if (!res[station][dir]) {
          res[station][dir] = sortedArrivals[i];
        }
      }
      return res;
    },

    closestTo: function(coords, arrivalsByStation) {
      if (!arrivalsByStation) return null;
      var closestThree = nearestStations(coords);
      var atLeastOne = null;
      var results = {};
      for(var i = 0; i < closestThree.length; i++) {
        var stationName = closestThree[i].replace(/ station$/, '');
        var result = arrivalsByStation[stationName];
        if (result) {
          atLeastOne = true;
          results[stationName] = result;
        }
      }
      // return null if the object is empty
      return atLeastOne && results;
    }
  };

  function nearestStations(coords, num) {
    if (!num) num = 3;
    var dists = [], closest = [];
    for(var station in stationLocations) {
      var curr = stationLocations[station];
      var lat = Math.pow(coords.latitude - curr.latitude, 2);
      var lng = Math.pow(coords.longitude - curr.longitude, 2);
      var dist = Math.sqrt(lat + lng);
      for (var i = 0; i < 3; i++) {
        if (!dists[i] || (dists[i] > dist)) {
          if (dists.length == 3) {
            closest.pop();
            dists.pop();
          }
          closest.splice(i, 0, station);
          dists.splice(i, 0, dist);
          break;
        }
      }
    }
    return closest;
  }
})

.factory('MioLocation', function($ionicPlatform, $q) {
  return {
    locate: function() {
      return readiedLocation().then(function(position) {
        var coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        var newJson = JSON.stringify(coords);
        var oldJson = localStorage.getItem('position2');
        if (newJson != oldJson) {
          localStorage.setItem('position2', newJson);
        }
        return coords;
      });
    }
  }

  function readiedLocation() {
    return $q(function(resolve, reject) {
      $ionicPlatform.ready(function() {
        window.navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    });
  }
})

.factory('MioFavs', function() {
  var key = 'martaio-favorites';
  return {
    all: function() {
      return favs();
    },
    toggle: function(station) {
      var saved = favs();
      var removeIndex = saved.indexOf(station);
      if (removeIndex == -1) {
        saved.push(station);
      } else {
        saved.splice(removeIndex, 1);
      }
      favsSave(saved);
      return saved;
    },
    intersection: function(arrivals) {
      var favs = this.all();
      var ret = {};
      var haveOne = false;
      for(var i = 0; i < favs.length; i++) {
        var fav = favs[i];
        if (arrivals[fav]) {
          haveOne = true;
          ret[fav] = arrivals[fav];
        }
      }
      if (haveOne) {
        return ret;
      } else {
        return null;
      }
    }
  }

  function favs() {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  function favsSave(favs) {
    return localStorage.setItem(key, JSON.stringify(favs));
  }
})

.constant('stationLocations', {
  'bankhead station':{
    latitude:33.772979,
    longitude:-84.428537
  },
  'midtown station':{
    latitude:33.780737,
    longitude:-84.386657
  },
  'indian creek station':{
    latitude:33.769212,
    longitude:-84.229255
  },
  'garnett station':{
    latitude:33.748938,
    longitude:-84.395513
  },
  'college park station':{
    latitude:33.6513813,
    longitude:-84.4470162
  },
  'ashby station':{
    latitude:33.756289,
    longitude:-84.41755599999999
  },
  'five points station':{
    latitude:33.754061,
    longitude:-84.391539
  },
  'airport station':{
    latitude:33.639975,
    longitude:-84.44403199999999
  },
  'sandy springs station':{
    latitude:33.9321044,
    longitude:-84.3513524
  },
  'lindbergh station':{
    latitude:33.823698,
    longitude:-84.369248
  },
  'lakewood station':{
    latitude:33.700649,
    longitude:-84.429541
  },
  'chamblee station':{
    latitude:33.8879695,
    longitude:-84.30468049999999
  },
  'king memorial station':{
    latitude:33.749468,
    longitude:-84.37601099999999
  },
  'east lake station':{
    latitude:33.765062,
    longitude:-84.31261099999999
  },
  'vine city station':{
    latitude:33.756612,
    longitude:-84.404348
  },
  'buckhead station':{
    latitude:33.847874,
    longitude:-84.367296
  },
  'lenox station':{
    latitude:33.845137,
    longitude:-84.357854
  },
  'civic center station':{
    latitude:33.766245,
    longitude:-84.38750399999999
  },
  'arts center station':{
    latitude:33.789283,
    longitude:-84.387125
  },
  'west end station':{
    latitude:33.73584,
    longitude:-84.412967
  },
  'dunwoody station':{
    latitude:33.9486029,
    longitude:-84.355848
  },
  'omni dome station':{
    latitude:33.7489954,
    longitude:-84.3879824
  },
  'oakland city station':{
    latitude:33.71726400000001,
    longitude:-84.42527899999999
  },
  'east point station':{
    latitude:33.676609,
    longitude:-84.440595
  },
  'doraville station':{
    latitude:33.9026881,
    longitude:-84.28025099999999
  },
  'brookhaven station':{
    latitude:33.859928,
    longitude:-84.33922
  },
  'decatur station':{
    latitude:33.774455,
    longitude:-84.297131
  },
  'medical center station':{
    latitude:33.9106263,
    longitude:-84.3513751
  },
  'georgia state station':{
    latitude:33.749732,
    longitude:-84.38569700000001
  },
  'avondale station':{
    latitude:33.77533,
    longitude:-84.280715
  },
  'inman park station':{
    latitude:33.757317,
    longitude:-84.35262
  },
  'kensington station':{
    latitude:33.772093,
    longitude:-84.252217
  },
  'edgewood candler park station':{
    latitude:33.761812,
    longitude:-84.340064
  },
  'peachtree center station':{
    latitude:33.759532,
    longitude:-84.387564
  },
  'north ave station':{
    latitude:33.771696,
    longitude:-84.387411
  }
});
