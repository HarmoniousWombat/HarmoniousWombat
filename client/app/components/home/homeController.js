angular.module('RecallJS')
  .controller('HomeController', function ($scope, $window, $location, Auth) {
  $scope.user = {};
  $scope.error = undefined;

  $scope.signin = function () {
    $scope.error = undefined;
    Auth.signin($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.recalljs', token);
        $location.path('/dashboard');
      })
      .catch(function (error) {
        $scope.error = error.data.error;
      });
  };

  $scope.signup = function () {
    $scope.error = undefined;
    Auth.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.recalljs', token);
        $location.path('/dashboard');
      })
      .catch(function (error) {
        $scope.error = error.data.error;
      });
  };
});
