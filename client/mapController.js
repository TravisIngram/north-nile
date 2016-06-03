angular.module('northApp').controller('MapController', ['Upload','ngAudio','ResourceFactory', 'UserTrackFactory', '$scope', 'leafletData', 'leafletMarkerEvents', '$mdDialog', '$http', '$location', function(Upload, ngAudio, ResourceFactory, UserTrackFactory, $scope, leafletData, leafletMarkerEvents, $mdDialog, $http, $location){
  var mc = this;

  var promise = UserTrackFactory.getUserData();
  promise.then(function(response){
    mc.user = response.data;
  });

  mc.routeUser = function() {
    if (mc.user.is_admin == true) {
      $location.path('/admin');
    } else {
      $location.path('/user');
    }
  };

var communityGarden = {
                  iconUrl: 'assets/img/GardenGreenBorder.svg',
                  // shadowUrl: 'assets/img/nature-1.svg',
                  iconSize:     [38, 38], // size of the icon
                  shadowSize:   [50, 64], // size of the shadow
                  iconAnchor:   [19, 19], // point of the icon which will correspond to marker's location
                  shadowAnchor: [4, 62],  // the same for the shadow
                  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
              };
var culinaryArts = {
                  iconUrl: 'assets/img/CulinaryRedBorder.svg',
                  iconSize:     [38, 38], // size of the icon
                  shadowSize:   [50, 64], // size of the shadow
                  iconAnchor:   [19, 19], // point of the icon which will correspond to marker's location
                  shadowAnchor: [4, 62],  // the same for the shadow
                  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
              };
var foodHub = {
                  iconUrl: 'assets/img/StoreYellowBorder.svg',
                  iconSize:     [38, 38], // size of the icon
                  shadowSize:   [50, 64], // size of the shadow
                  iconAnchor:   [19, 19], // point of the icon which will correspond to marker's location
                  shadowAnchor: [4, 62],  // the same for the shadow
                  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
              };
var foodDistribution = {
                  iconUrl: 'assets/img/TruckBlueBorder.svg',
                  iconSize:     [38, 38], // size of the icon
                  shadowSize:   [50, 64], // size of the shadow
                  iconAnchor:   [19, 19], // point of the icon which will correspond to marker's location
                  shadowAnchor: [4, 62],  // the same for the shadow
                  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
              };

  mc.storedMarkers = ResourceFactory.mapResources;
  mc.newResource = {city_name:"Minneapolis", state:"MN"};

  // start count at a number higher than any keys present in the object - this ensures no duplicates
  mc.markerSize = Object.keys(mc.storedMarkers).length;
  mc.count = mc.markerSize + 1;
  mc.visibleMarkers = {};


  // filter visibility of markers
  mc.filterMarkers = function(type, ev){
    mc.visibleMarkers = {};

    var filter1 = angular.element(document.querySelector('#filter1'));
    var filter2 = angular.element(document.querySelector('#filter2'));
    var filter3 = angular.element(document.querySelector('#filter3'));
    var filter4 = angular.element(document.querySelector('#filter4'));

    switch(type){
      case 'Community Garden':
        filter1.toggleClass('disabledKeyButton');
        console.log('filter1:', filter1);
        break;
      case 'Culinary Arts':
        filter2.toggleClass('disabledKeyButton');
        break;
      case 'Food Hub':
        filter3.toggleClass('disabledKeyButton');
        break;
      case 'Food Distribution':
        filter4.toggleClass('disabledKeyButton');
        break;
    }

    if(type === 'all'){
      for (marker in mc.storedMarkers){
        mc.storedMarkers[marker].visibility = true;
        if(mc.storedMarkers[marker].resource_type == 'Community Garden'){
          mc.storedMarkers[marker].icon = communityGarden;
        }
        if(mc.storedMarkers[marker].resource_type == 'Culinary Arts'){
          mc.storedMarkers[marker].icon = culinaryArts;
        }
        if(mc.storedMarkers[marker].resource_type == 'Food Hub'){
          mc.storedMarkers[marker].icon = foodHub;
        }
        if(mc.storedMarkers[marker].resource_type == 'Food Distribution'){
          mc.storedMarkers[marker].icon = foodDistribution;
        }
        // mc.storedMarkers[marker].icon = customIcon;
      }
    } else if (type === 'none'){
      for (marker in mc.storedMarkers){
        mc.storedMarkers[marker].visibility = false;
      }
    } else {
      // loop through the list of markers from the database, and toggle visibility based on type
      for (marker in mc.storedMarkers){
        if(mc.storedMarkers[marker].resource_type === type){
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

    // write changes to map
    angular.extend(mc, {
      markers: mc.visibleMarkers

    });
  };

  mc.lastClicked = {};

  // open infoDrawer on marker Click
  mc.openInfoDrawer = function(event, args){
    mc.showInfoDrawer = true;
    mc.showNewResourceDrawer = false;
    console.log('mc.lastClicked', mc.lastClicked);

    // grab last marker clicked to recenter map later
    mc.lastClicked = args.model;

    // change color of background border
    if (mc.lastClicked.resource_type == 'Community Garden'){
      mc.colorBk = "resourceGreen";
    }
    if (mc.lastClicked.resource_type == 'Culinary Arts'){
      mc.colorBk = "resourceOrange";
    }
    if (mc.lastClicked.resource_type == 'Food Hub'){
      mc.colorBk = "resourceYellow";
    }
    if (mc.lastClicked.resource_type == 'Food Distribution'){
      mc.colorBk = "resourceBlue";
    }

    // open web and social media if present
    mc.webSocialShow = function(){
      if (mc.lastClicked.website ||
        mc.lastClicked.twitter ||
        mc.lastClicked.facebook ||
        mc.lastClicked.instagram ||
        mc.lastClicked.snapchat) {
        return true;
      }
    }

    // open contact info if present
    mc.contactShow = function(){
      if (mc.lastClicked.leadership ||
          mc.lastClicked.public_phone ||
          mc.lastClicked.public_email ||
          mc.lastClicked.hours) {
          return true;
      }
    }

    // load audio if present
    if(mc.lastClicked.audio_reference){
      mc.lastClicked.sound = ngAudio.load(mc.lastClicked.audio_reference);
    }

    // this centers the map on the marker clicked
    angular.extend(mc, {
      center:{
        lat: mc.lastClicked.lat,
        lng: mc.lastClicked.lng,
        zoom: 15
      }
    });
  };

  // close infoDrawer on map click
  mc.closeInfoDrawer = function(event, args){
    if(mc.showInfoDrawer){
      mc.showInfoDrawer = false;

      // this centers the map on the marker that initiated the click that this is 'undoing'
      angular.extend(mc, {
        center:{
          lat: mc.lastClicked.lat,
          lng: mc.lastClicked.lng,
          zoom: 15
        }
      });
    }
  };

  // image carousel
  mc.currentIndex = 0;
  mc.setCurrentSlideIndex = function (index) {
      mc.currentIndex = index;
  };
  mc.isCurrentSlideIndex = function (index) {
      return mc.currentIndex === index;
  };
  mc.prevSlide = function () {
     mc.currentIndex = (mc.currentIndex < mc.lastClicked.images.length - 1) ? ++mc.currentIndex : 0;
  };
  mc.nextSlide = function () {
     mc.currentIndex = (mc.currentIndex > 0) ? --mc.currentIndex : mc.lastClicked.images.length - 1;
  };

 // audio player
 mc.play = function(audio){
   console.log('audio play:', audio);
   if(audio.paused !== true){
     audio.pause();
    //  mc.playing = false;
   } else {
     audio.play();
    //  mc.playing = true;
   }
 };

 mc.stop = function(audio){
   console.log('audio stop:', audio);
   audio.setCurrentTime(0);
   audio.pause();
  //  mc.playing = false;
 };

 mc.mute = function(){
   if(mc.muted){
     ngAudio.unmute();
     mc.muted = false;
   } else {
     ngAudio.mute();
     mc.muted = true;
   }
 };

  mc.saveResourceCoords = function(event, args){
    console.log('saving args:', args);
    mc.newResource.latitude = args.leafletEvent.latlng.lat;
    mc.newResource.longitude = args.leafletEvent.latlng.lng;

    mc.newResource.lat = mc.newResource.latitude;
    mc.newResource.lng = mc.newResource.longitude;

    // reverse geocode
    var geocodeKey = 'd757d21efc7d5efeb1195e398d031a5e'
    $http.get('https://api.opencagedata.com/geocode/v1/json?q=' + mc.newResource.lat + ',' + mc.newResource.lng + '&pretty=1&key=' + geocodeKey).then(function(response){
      // console.log('Reverse geocode:', response);
      var mostConfident = {confidence:0};
      if(response.data.results.length > 1){
        response.data.results.map(function(result){
          if(result.confidence >= mostConfident.confidence){
            mostConfident = result;
          }
        });
        var results = mostConfident;
      } else {
        var results = response.data.results[0];
      }

      console.log('Reverse geocode:', results);
      if(results.components.house_number){
        mc.newResource.address_line1 = results.components.house_number + ' ' + results.components.road;
      }
      if(results.components.city){
        mc.newResource.city_name = results.components.city;
      }
      if(results.components.state){
        mc.newResource.state = results.components.state;
      }
      if(results.components.postcode){
        mc.newResource.zip_code = results.components.postcode;
      }
    });

    mc.visibleMarkers.temp = mc.newResource;
    // write changes to map
    angular.extend(mc, {
      markers: mc.visibleMarkers
    });
  };

  // open drawer for new resource form
  mc.addNewResource = function(){
    mc.showInfoDrawer = false;
    if(!mc.showNewResourceDrawer){
      mc.showNewResourceDrawer = true;
      if(mc.user){
        // if logged in
        mc.showNewResourceForm = true;
        mc.showNewResourceLogin = false;
        mc.showNewResourceRegister = false;
      } else {
        // if not logged in
        mc.showNewResourceLogin = true;
        mc.showNewResourceRegister = false;
        mc.showNewResourceForm = false;
      }
    } else {
      mc.newResource.account_id = mc.user.id;
      //ResourceFactory.saveNewResource(mc.newResource);
      mc.showNewResourceDrawer = false;
    }
  };

  // get markers from database
  ResourceFactory.getSavedResources(mc.filterMarkers);

  // bind event handlers
  $scope.$on('leafletDirectiveMarker.map.click', mc.openInfoDrawer);
  $scope.$on('leafletDirectiveMap.map.click', mc.closeInfoDrawer);
  $scope.$on('leafletDirectiveMap.map.contextmenu', mc.saveResourceCoords);


  // set all markers to visible on page load
  //mc.filterMarkers('all');

  // configure map defaults
  angular.extend(mc, {
        defaults: {
            scrollWheelZoom: false,
            touchZoom: true,
            dragging: true,
            tap: true,
            tapTolerance: 100 // may not be necessary after angular material skipClickHijack() fix
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


  // map login
  mc.loginUser = function() {
    $http.post('/login', mc.loginInfo).then(function(response){
      if (response.status == 200) {
        mc.user = response.data;
        console.log('successful login', response.data.is_admin);
        if (response.data.is_admin === true) {
          console.log('admin is true');
          mc.loginInfo = {};

          // $location.url('/map');
          // hide login form and show new resource form
          mc.showNewResourceLogin = false;
          mc.showNewResourceForm = true;
        } else {
          console.log('admin is not true');
          mc.loginInfo = {};

          // $location.url('/map');
          // hide login form and show new resource form
          mc.showNewResourceLogin = false;
          mc.showNewResourceForm = true;
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
      }
      showAlert();
      mc.loginInfo = {};

    });
  };

  mc.registerShow = function(){
    mc.showNewResourceLogin = false;
    mc.showNewResourceRegister = true;
  };

  // registration form password confirmation checking
  mc.registerInfo = {};
  mc.passwordMismatch = function(){
    if(mc.registerInfo.password !== mc.registerInfo.confirm_password){
      return true;
    }
  };

  mc.passwordMismatchError = function(){
    if (mc.passwordMismatch() && mc.registerFormInputs.confirm_password.$dirty){
      return true;
    }
  };

  // :::: Register User ::::

  mc.registerUser = function() {
    $http.post('/register', mc.registerInfo).then(function(response){
      if (response.status == 200) {
        console.log('successful registration');
        mc.loginInfo = {username: mc.registerInfo.username};
        mc.registerInfo = {};
        mc.showNewResourceRegister = false;
        mc.showNewResourceLogin = true;
      }
    }, function(response){
      console.log('unsuccessful registration');
      function showAlert() {
        if(mc.registerInfo.username === undefined){
          mc.alertMessage = 'Username field cannot be blank';
        } else {
          mc.alertMessage = 'Username already exists, please choose another.';
        }

        alert = $mdDialog.alert({
          title: 'Attention',
          textContent: mc.alertMessage,
          ok: 'Close'
        });
        $mdDialog
          .show( alert )
          .finally(function() {
            alert = undefined;
          });
      }
      showAlert();
      mc.registerInfo.username = undefined;
    });
  };

  // upload images and audio
  mc.uploadAudio = function(audio, resource){
    console.log('uploading audio');
    Upload.upload({
      url: '/upload/audio',
      data: {file: audio.file}
    }).then(function(response){
      console.log('Successfully uploaded audio:', response);
      resource.audio_id = response.data.audio_id;
      mc.uploadAudioSuccess = true;
    }, function(response){
      console.log('Failed at uploading audio:', response);
    }, function(evt){
      // console.log('evt', evt)
    });
  };

  mc.uploadImage = function(image, resource){
    Upload.upload({
      url: '/upload/image',
      arrayKey: '',
      data: {file: image.file}
    }).then(function(response){
      console.log('Success response?', response);
      // save rest of resource
      resource.image_id = response.data.image_id;
      mc.uploadImageSuccess = true;

    }, function(response){
      console.log('Error response?', response);
    }, function(evt){
      // use for progress bar
      console.log('Event response?', evt);
    });
    // end image upload
  };

  // save resource from map
  mc.saveNewResource = function(resource){
    mc.showNewResourceForm
    console.log('Saving new resource from user:', mc.user);
    resource.account_id = mc.user.id;
    resource.is_pending = !resource.is_active;
    resource.date_created = new Date();
    ResourceFactory.saveNewResource(resource, mc.user);
    mc.showNewResourceDrawer = false;
    mc.newResource = {};

    mc.visibleMarkers.temp = mc.newResource;
    // write changes to map
    angular.extend(mc, {
      markers: mc.visibleMarkers
    });
  };

  mc.cancelNewResource = function(){
    mc.showNewResourceDrawer = false;
    mc.newResource = {};

    mc.visibleMarkers.temp = mc.newResource;
    // write changes to map
    angular.extend(mc, {
      markers: mc.visibleMarkers
    });
  };

  console.log('Map controller loaded.');
}]);
