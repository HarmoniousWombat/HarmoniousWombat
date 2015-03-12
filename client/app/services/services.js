angular.module('RecallJS')
  .factory('Auth', function ($http, $location, $window) {

    var signin = function (user) {
      return $http({
        method: 'POST',
        url: '/users/signin',
        data: user
      })
      .then(function (resp) {
        return resp.data.token;
      });
    };

    var signup = function (user) {
      return $http({
        method: 'POST',
        url: '/users/signup',
        data: user
      })
      .then(function (resp) {
        return resp.data.token;
      });
    };

    var isAuth = function () {
      return !!$window.localStorage.getItem('com.recalljs');
    };

    var signout = function () {
      $window.localStorage.removeItem('com.recalljs');
      $location.path('/signin');
    };

    return {
      signin: signin,
      signup: signup,
      isAuth: isAuth,
      signout: signout
    };
  });

