angular.module('starter.services', [])

.factory('Arrivals', function ArrivalService($http) {
  var events = ['arrivalsChanged'];
  var subscribers = {
    arrivalsChanged: []
  };
  var _arrivals = [];
  var _req = null;

  var loadArrivals = function() {
    var req = $http.get("http://marta-api.herokuapp.com/arrivals");
    _req = req.then(function(resp) {
      _arrivals = resp.data;
      for (var i = 0; i < subscribers.arrivalsChanged.length; i++) {
        subscribers.arrivalsChanged[i].$emit('arrivalsChanged');
      }
    });
  };
  loadArrivals();
  setInterval(loadArrivals, 11 * 1000);

  return {
    subscribe: function(eventName, scope) {
      if (events.indexOf(eventName) == -1) {
        throw "Arrivals: Woops. '" + eventName + "' is not a valid subscription event.";
      }

      subscribers[eventName].push(scope);
      scope.$on('$destroy', function() {
        subscribers.splice(subscribers.indexOf(scope), 1);
      });
    },
    all: function() {
      return _arrivals;
    },
    forStation: function(station) {
      var res = [];
      for(var i = 0; i <= _arrivals.length; i++) {
        if (_arrivals[i].station == station) {
          res.push(_arrivals[i]);
        }
      }
      return res;
    },

    // for use on dashboard, showing next arrivals
    latestByStation: function() {
      var res = {};
			var sortedArrivals = _arrivals.sort(function(a,b) {
        return a.station < b.station ? -1 : 1
      });
      for (var i = 0; i < sortedArrivals.length; i++) {
        // don't need station on the end of all these names
        var station = _arrivals[i].station.replace(" station", '');
        var dir = _arrivals[i].direction
        if (!res[station]) {
          res[station] = {};
        }
        if (!res[station][dir]) {
          res[station][dir] = _arrivals[i];
        }
      }
      return res;
    }
  };
});
