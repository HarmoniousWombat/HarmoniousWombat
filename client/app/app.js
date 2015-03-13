angular.module('RecallJS', ['ngRoute'])

  .config(function($routeProvider, $httpProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'app/components/landing/views/splashView.html',
        controller: 'HomeController',
        authenticate: false
      })
      .when('/signin', {
        templateUrl: 'app/components/landing/views/signinView.html',
        controller: 'AuthController',
        authenticate: false
      })
      .when('/signup', {
        templateUrl: 'app/components/landing/views/signupView.html',
        controller: 'AuthController',
        authenticate: false
      })
    $httpProvider.interceptors.push('AttachTokens');
  })

  .factory('AttachTokens', function ($window) {
    var attach = {
      request: function (object) {
        var jwt = $window.localStorage.getItem('com.recalljs');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  })

  .run(function ($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function (evt, next, current) {
      if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
        $location.path('/signin');
      }
    });
  });
