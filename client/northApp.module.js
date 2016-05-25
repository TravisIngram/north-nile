angular.module('northApp', ['ngRoute', 'leaflet-directive', 'ngMaterial', 'ngMessages', 'ngAnimate', 'md.data.table']);


angular.module('northApp').config(['$routeProvider', '$locationProvider', '$mdGestureProvider', function($routeProvider, $locationProvider, $mdGestureProvider){
  $routeProvider
  .when('/', {
    templateUrl: '/views/home.html',
    controller: 'HomeController',
    controllerAs: 'hc'
  })
  .when('/map', {
    templateUrl: '/views/map.html',
    controller: 'MapController',
    controllerAs: 'mc'
  })
  .when('/admin', {
    templateUrl: '/views/admin.html',
    controller: 'AdminController',
    controllerAs: 'ac'
  })
  .when('/user', {
    templateUrl: '/views/user.html',
    controller: 'UserController',
    controllerAs: 'uc'
  });

  $mdGestureProvider.skipClickHijack();
  $locationProvider.html5Mode(true);
}]);
