angular.module('RecallJS')
  .factory('Auth', Auth);

function Auth($http, $location, $window){

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };

  function signin(user) {
    return $http({
      method: 'POST',
      url: '/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  }

  function signup(user) {
    return $http({
      method: 'POST',
      url: '/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  }

  function isAuth() {
    return !!$window.localStorage.getItem('com.recalljs');
  }

  function signout() {
    $window.localStorage.removeItem('com.recalljs');
    $location.path('/signin');
  }
}

