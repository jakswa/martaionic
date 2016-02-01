var mod = angular.module('starter.controllers', [])

mod.controller('DashCtrl', function($scope, Arrivals) {
  Arrivals.subscribe('arrivalsChanged', $scope);
  $scope.$on('arrivalsChanged', function() {
    $scope.arrivals = Arrivals.latestByStation();
  });
  
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
