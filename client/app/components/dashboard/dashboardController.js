angular.module('RecallJS')
  .controller('DashboardController', function($scope, Auth){
    $scope.logout = Auth.signout;
  });