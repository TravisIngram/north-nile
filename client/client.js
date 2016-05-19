var app = angular.module('northApp', ['ngRoute', 'leaflet-directive']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
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

  $locationProvider.html5Mode(true);
}]);

app.controller('MapController', ['$http', function($http){ // $http loaded just so the syntax is there
  var mc = this;

  angular.extend(mc, {
        defaults: {
            scrollWheelZoom: false,
            touchZoom: false,
            dragging: true
        },
        center: {
          lat: 44.996121,
          lng: -93.295845,
          zoom: 15
        },
        tiles: {
            url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
    });


  console.log('Map controller loaded.');
}]);

app.controller('HomeController', ['$http', function($http){ // $http loaded just so the syntax is there
  var hc = this;

  console.log('Home controller loaded.');
}]);
