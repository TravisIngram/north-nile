angular.module("northApp",["ngRoute","leaflet-directive","ngMaterial","ngMessages","ngAnimate"]),angular.module("northApp").config(["$routeProvider","$locationProvider","$mdGestureProvider",function(a,b,c){a.when("/",{templateUrl:"/views/home.html",controller:"HomeController",controllerAs:"hc"}).when("/map",{templateUrl:"/views/map.html",controller:"MapController",controllerAs:"mc"}),c.skipClickHijack(),b.html5Mode(!0)}]);