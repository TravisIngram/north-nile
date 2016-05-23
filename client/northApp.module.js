angular.module('northApp', ['ngRoute', 'leaflet-directive', 'ngMaterial', 'ngMessages', 'ngAnimate']);


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
  });

  $mdGestureProvider.skipClickHijack();
  $locationProvider.html5Mode(true);
}]);
