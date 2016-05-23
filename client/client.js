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

app.controller('MapController', ['$scope', 'leafletData', function($scope, leafletData){ // $http loaded just so the syntax is there
  var mc = this;
  mc.storedMarkers = [
      m1= {
          lat: 44.996121,
          lng: -93.295845,
          title: 'Mr. Books Bruschetta Machine',
          type: 'one'
      },
      m2={
        lat: 44.998995,
        lng: -93.291068,
        title: 'Ms. Kitchens Oblique Reference Parlor',
        type: 'two'
      },
      m3= {
          lat: 44.999143,
          lng: -93.297133,
          title: 'Mr. Bones Bruschetta Machine',
          type: 'one'
      },
      m4={
        lat: 45.002572,
        lng: -93.289515,
        title: 'Ms. Burbakers Oblique Reference Parlor',
        type: 'two'
      }
  ];
  mc.visibleMarkers = [];

  mc.filterMarkers = function(type){
    console.log('filtering by:', leafletData);
    // leafletData.getDirectiveControls().then(function(controls){
    //
    //   console.log('visible control:', controls);
    //
    //   // controls.markers.create(mc.visibleMarkers);
    //
    //
    // });
    mc.visibleMarkers = mc.storedMarkers.filter(function(marker){
      if (marker.type === type){
        return true;
      }
    });
    angular.copy(mc.visibleMarkers); // didn't work -> should move away from array model to an object/dictionary
    leafletData.setMarkers(mc.visibleMarkers); // didn't work
    angular.extend(mc, {
      markers: mc.visibleMarkers
    });
    // mc.layers.overlays[type].visible = !mc.layers.overlays[type].visible;
    // console.log('filtered markers:', mc.layers.overlays);
  };

  // layers: {
  //   overlays: {
  //     one: {
  //       type:'group',
  //       name: 'one',
  //       visible: false
  //     },
  //     two: {
  //       type: 'group',
  //       name: 'two',
  //       visible: false
  //     }
  //   }
  // }

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

    $scope.$on('leafletDirectiveMarker.click', function(event, args){
      console.log('clicked a marker:', args, '|event:', event);

      mc.showInfoDrawer = true;
      mc.markerTitle = args.model.title;
    });

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
