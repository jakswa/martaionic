var mod = angular.module('starter.controllers', [])

mod.controller('DashCtrl', function($scope, $state, Arrivals) {
  $scope.arrivals = Arrivals.latestByStation();
  Arrivals.subscribe('arrivalsChanged', $scope);
  $scope.$on('arrivalsChanged', function() {
    $scope.arrivals = Arrivals.latestByStation();
  });

  $scope.stationView = function(stationName) {
    $state.go("station", {stationName: stationName});
  };
  
  $scope.timeDisplay = function(arrival) {
    var text = arrival.waiting_time;
    if (text == 'arriving') {
      return "<i class='icon ion-android-subway'></i>";
    } else if (text == 'boarding') {
      return "<i class='icon ion-archive rot'></i>";
    }

    var seconds = parseInt(arrival.waiting_seconds);
    return ":" + parseInt(seconds / 60 + 1);
  };
});

mod.controller('StationCtrl', function($scope, $state, Arrivals) {
  var stationName = $scope.stationName = $state.params.stationName + " station";
  $scope.arrivals = Arrivals.by('station', stationName);
  Arrivals.subscribe('arrivalsChanged', $scope);
  $scope.$on('arrivalsChanged', function() {
    $scope.arrivals = Arrivals.by('station', stationName);
  });

  $scope.trainView = function(trainId) {
    $state.go("train", {trainId: trainId});
  };
  
});

mod.controller('TrainCtrl', function($scope, $state, Arrivals) {
  var trainId = $scope.trainId = $state.params.trainId;
  $scope.arrivals = Arrivals.by('train_id', trainId);
  Arrivals.subscribe('arrivalsChanged', $scope);
  $scope.$on('arrivalsChanged', function() {
    $scope.arrivals = Arrivals.by('train_id', trainId);
  });
});

