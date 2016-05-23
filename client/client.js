var app = angular.module('northApp', ['ngRoute', 'leaflet-directive', 'ngMaterial', 'ngMessages', 'ngAnimate']);


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

app.controller('MapController', ['$scope', function($scope){
  var mc = this;

  // eventually will be pulled from server/database
  mc.storedMarkers = {
      m1: {
          lat: 44.996121,
          lng: -93.295845,
          title: 'Mr. Books Bruschetta Machine',
          type: 'one',
          visible: false
      },
      m2:{
        lat: 44.998995,
        lng: -93.291068,
        title: 'Ms. Kitchens Oblique Reference Parlor',
        type: 'two',
        visible: false
      },
      m3: {
          lat: 44.999143,
          lng: -93.297133,
          title: 'Mr. Bones Bruschetta Machine',
          type: 'one',
          visible: false
      },
      m4:{
        lat: 45.002572,
        lng: -93.289515,
        title: 'Ms. Burbakers Oblique Reference Parlor',
        type: 'two',
        visible: false
      }
  };

  mc.markerSize = Object.keys(mc.storedMarkers).length;
  mc.count = mc.markerSize + 1;
  mc.visibleMarkers = {};

  mc.filterMarkers = function(type){
    mc.visibleMarkers = {};
    if(type === 'all'){
      //mc.visibleMarkers = mc.storedMarkers;
      for (marker in mc.storedMarkers){
        mc.storedMarkers[marker].visibility = true;
      }
    } else if (type === 'none'){
      //mc.visibleMarkers = {};
      for (marker in mc.storedMarkers){
        mc.storedMarkers[marker].visibility = false;
      }
    } else {
      //mc.visibleMarkers = {};
      for (marker in mc.storedMarkers){
        if(mc.storedMarkers[marker].type === type){
          mc.storedMarkers[marker].visibility = !mc.storedMarkers[marker].visibility; // toggle visibility
        }
      }
    }
    // loop through storedMarkers and add visible ones to visibleMarkers
    for (marker in mc.storedMarkers){
      if(mc.storedMarkers[marker].visibility){
        mc.visibleMarkers['m' + mc.count] = mc.storedMarkers[marker];
        mc.count++;
      }
    }

    angular.extend(mc, {
      markers: mc.visibleMarkers
    });
    console.log('visiibleMarkers:', mc.visibleMarkers);
  };

  angular.extend(mc, {
        defaults: {
            scrollWheelZoom: false,
            touchZoom: true,
            dragging: true
        },
        center: {
          lat: 44.996121,
          lng: -93.295845,
          zoom: 15
        },
        tiles: {
            url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        },
        markers: mc.visibleMarkers
    });

    $scope.$on('leafletDirectiveMarker.map.click', function(event, args){
      // console.log('clicked a marker:', args, '|event:', event);
      console.log('visibleMarkers on click:', mc.visibleMarkers);
      mc.showInfoDrawer = true;
      mc.markerTitle = args.model.title;
    });

  mc.filterMarkers('all');
  console.log('Map controller loaded.');
}]);

app.controller('HomeController', ['$http', '$mdDialog', function($http, $mdDialog){

  var hc = this;
  var alert;
  hc.loginInfo = {};
  hc.registerInfo = {};

  // :::: ng-show Functions ::::

  // loginShow():
  hc.loginShow = function() {
    hc.loginForm = true;
    hc.registerForm = false;
  };

// registerShow():
  hc.registerShow = function() {
    console.log('hit registerShow');
    hc.registerForm = true;
    hc.loginForm = false;
  };

// :::: Login User, redirect based on success/failure ::::

hc.loginUser = function() {
  $http.post('/login', hc.loginInfo).then(function(response){
    if (response.status == 200) {
      console.log('successful login', response.data.isAdmin);
    if (response.data.isAdmin == true) {
      console.log('admin is true');
      hc.loginInfo = {};
      hc.adminDashboard=true;
      hc.userDashboard=false;
      hc.registerForm = false;
      hc.loginForm = false;
    } else {
      console.log('admin is not true');
      hc.loginInfo = {};
      hc.userDashboard=true;
      hc.adminDashboard=false;
      hc.registerForm=false;
      hc.loginForm=false;
    }
   }
  }, function(response){
    console.log('unsuccessful login');
    // Alert user to incorrect username/password ::::
    function showAlert() {
      alert = $mdDialog.alert({
        title: 'Attention',
        textContent: 'Incorrect username and/or password. Please enter information again.',
        ok: 'Close'
      });
      $mdDialog
        .show( alert )
        .finally(function() {
          alert = undefined;
        });
    };
    showAlert();
    hc.loginInfo = {};

  });
};

// :::: Register User ::::

hc.registerUser = function() {
  $http.post('/register', hc.registerInfo).then(function(response){
    if (response.status == 200){
      console.log('successful registration');
      // Function below will prompt login. Would be nice to automatically login user?
      function showAlert() {
        alert = $mdDialog.alert({
          title: 'Congratulations!',
          textContent: 'Registration successful, please log in.',
          ok: 'Close'
        });
        $mdDialog
          .show( alert )
          .finally(function() {
            alert = undefined;
          });
      };
      showAlert();
      hc.registerInfo={};
      hc.registerForm=false;
      hc.loginForm=true;

    }
  }, function(response){
    console.log('unsuccessful registration');
    function showAlert() {
      alert = $mdDialog.alert({
        title: 'Attention',
        textContent: 'Username already exists, please choose another.',
        ok: 'Close'
      });
      $mdDialog
        .show( alert )
        .finally(function() {
          alert = undefined;
        });
    };
    showAlert();
    hc.registerInfo.username = undefined;
  });
};



  console.log('Home controller loaded.');
}]);
