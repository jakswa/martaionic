angular.module('starter.controllers', [])
.controller('DashCtrl', function($scope, $state, Arrivals, $ionicPlatform) {
  $scope.arrivals = Arrivals.latestByStation();
  Arrivals.subscribe('arrivalsChanged', $scope);
  $scope.$on('arrivalsChanged', function() {
    $scope.arrivals = Arrivals.latestByStation();
    if ($scope.savedPosition) {
      $scope.nearbyStations = Arrivals.closestTo($scope.savedPosition, $scope.arrivals);
    }
  });

  // geolocation
  var savedPositionString = sessionStorage.getItem('position2');
  if (savedPositionString) {
    $scope.savedPosition = JSON.parse(savedPositionString);
    $scope.nearbyStations = Arrivals.closestTo($scope.savedPosition);
  }
  $scope.geowait = true;
  $ionicPlatform.ready(function() {
    window.navigator.geolocation.getCurrentPosition(function(position) {
      $scope.savedPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      var newJson = JSON.stringify($scope.savedPosition);
      var oldJson = sessionStorage.getItem('position2');
      if (newJson != oldJson) {
        sessionStorage.setItem('position2', newJson);
      }
      $scope.$apply(function() {
        $scope.nearbyStations = Arrivals.closestTo($scope.savedPosition, $scope.arrivals);
        $scope.geowait = false;
      });
    });
  });

  $scope.stationView = function(stationName) {
    $state.go("station", {stationName: stationName});
  };

  var dirOrder = ['n', 's', 'w', 'e'];
  $scope.byDirection = function(obj) {
    var res = {};
    for (var i = 0; i < dirOrder.length; i++) {
      if (obj[dirOrder[i]]) {
        res[dirOrder[i]] = obj[dirOrder[i]];
      }
    }
    return res;
  };
  
  $scope.timeDisplay = function(arrival) {
    var text = arrival.waiting_time;
    if (['arriving', 'arrived'].indexOf(text) >= 0) {
      return "<i class='icon ion-android-subway'></i>";
    } else if (text == 'boarding') {
      return "<i class='icon ion-archive rot'></i>";
    }

    // waiting_time should start with a number, and parse to int
    return ":" + (parseInt(arrival.waiting_time) || 0);
  };
})

.controller('StationCtrl', function($scope, $state, Arrivals) {
  var stationName = $scope.stationName = $state.params.stationName + " station";
  $scope.arrivals = Arrivals.by('station', stationName);
  Arrivals.subscribe('arrivalsChanged', $scope);
  $scope.$on('arrivalsChanged', function() {
    $scope.arrivals = Arrivals.by('station', stationName);
  });

  $scope.trainView = function(trainId) {
    $state.go("train", {trainId: trainId});
  };
  
})

.controller('TrainCtrl', function($scope, $state, Arrivals) {
  var trainId = $scope.trainId = $state.params.trainId;
  $scope.arrivals = Arrivals.by('train_id', trainId);
  Arrivals.subscribe('arrivalsChanged', $scope);
  $scope.$on('arrivalsChanged', function() {
    $scope.arrivals = Arrivals.by('train_id', trainId);
  });
});
