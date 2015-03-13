angular.module('RecallJS', ['ngRoute'])

  .config(function($routeProvider, $httpProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'app/components/home/views/homeView.html',
        controller: 'HomeController',
        authenticate: false
      })
      .when('/signin', {
        templateUrl: 'app/components/home/views/signinView.html',
        controller: 'HomeController',
        authenticate: false
      })
      .when('/signup', {
        templateUrl: 'app/components/home/views/signupView.html',
        controller: 'HomeController',
        authenticate: false
      })
      .when('/dashboard', {
        templateUrl: 'app/components/dashboard/dashboardView.html',
        controller: 'DashboardController',
        authenticate: true
      })
    $httpProvider.interceptors.push('AttachTokens');
  })
  .factory('AttachTokens', function ($window) {
    var attach = {
      request: function (object) {
        var jwt = $window.localStorage.getItem('com.shortly');
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
