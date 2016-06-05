angular.module('northApp', ['ngRoute', 'leaflet-directive', 'ngMaterial', 'ngMessages', 'ngAnimate', 'md.data.table', 'ngFileUpload', 'ngAudio']);


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

angular.module('northApp').filter("urlFilter", function () {
  return function (link) {
      var result;
      var startingUrl = "http://";
      var httpsStartingUrl = "https://";
      if(link){
        if(link.startWith(startingUrl)||link.startWith(httpsStartingUrl)){
            result = link;
        }
        else {
        result = startingUrl + link;
        }
        return result;
      }
  }
});
  String.prototype.startWith = function (str) {
  return this.indexOf(str) == 0;
};

angular.module('northApp').filter('orderObjectBy', function() {
  return function (items, field, reverse) {
    var filtered = [];

    angular.forEach(items, function (item, key) {
      item.__originalKey = key;
      filtered.push(item);
    });

    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });

    if(reverse) filtered.reverse();
    return filtered;
  };
});
