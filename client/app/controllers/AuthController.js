angular.module('RecallJS')

.controller('AuthController', function ($scope, $window, $location, Auth) {
  $scope.user = {};
  $scope.err;
  $scope.cp;

  $scope.signin = function () {
    $scope.err = undefined;
    Auth.signin($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.recalljs', token);
        $location.path('/');
      })
      .catch(function (error) {
        $scope.err = error.data.error;
      });
  };

  $scope.signup = function () {
    $scope.err = undefined;
    if ($scope.cp === $scope.user.password){
      Auth.signup($scope.user)
        .then(function (token) {
          $window.localStorage.setItem('com.recalljs', token);
          $location.path('/');
        })
        .catch(function (error) {
          $scope.err = error.data.error;
          document.getElementById('signinForm').classList.add('has-error');
        });
    } else {
      $scope.err = "Passwords don't match!";
    }
  };
});
